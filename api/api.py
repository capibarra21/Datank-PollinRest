from os import getenv

from models import db, Polls, Topics, Options
from flask import Blueprint, request, jsonify, session, json
from datetime import datetime
from config import SQLALCHEMY_DATABASE_URI
from datetime import date
if getenv('APP_MODE') == 'PRODUCTION':
    from production_settings import SQLALCHEMY_DATABASE_URI


api = Blueprint('api', 'api', url_prefix='/api')


@api.route('/polls', methods=['GET', 'POST'])

def api_polls():
    if request.method == 'POST':
      
        poll = request.get_json()

        #
        for key, value in poll.items():
            if not value:
                return jsonify({'message': 'value for {} is empty'.format(key)})

        title = poll['title']
        options_query = lambda option: Options.query.filter(Options.name.like(option))
        
        options = [Polls(option=Options(name=option))
                   if options_query(option).count() == 0
                   else Polls(option=options_query(option).first()) for option in poll['txtOptions']
                   ]
        
       
        new_topic = Topics(title=title, options=options)

        db.session.add(new_topic)
        db.session.commit()

   
        from tasks import close_poll

        close_poll(new_topic.id, SQLALCHEMY_DATABASE_URI)

        return jsonify({'message': 'Encuesta creada correctamente'})

    else:
       
        polls = Topics.query.join(Polls).all()
        all_polls = {'Polls':  [poll.to_json() for poll in polls]}

        return jsonify(all_polls)

@api.route('/polls/options')
def api_polls_options():

    all_options = [option.to_json() for option in Options.query.all()]

    return jsonify(all_options)


@api.route('/poll/vote', methods=['PATCH'])
def api_poll_vote():
    poll = request.get_json()

    poll_title, option = (poll['poll_title'], poll['option'])
    join_tables = Polls.query.join(Topics).join(Options)

    topic = Topics.query.filter_by(title=poll_title).first()

    option = join_tables.filter(Topics.title.like(poll_title)).filter(Options.name.like(option)).first()
    if option:
        # increment vote_count by 1 if the option was found
        option.vote_count += 1
        db.session.commit()

        return jsonify({'message': 'Thank you for voting'})

    return jsonify({'message': 'option or poll was not found please try again'})


@api.route('/poll/<poll_name>')
def api_poll(poll_name):

    poll = Topics.query.filter(Topics.title.like(poll_name)).first()

    return jsonify({'Polls': [poll.to_json()]}) if poll else jsonify({'message': 'poll not found'})
