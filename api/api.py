from os import getenv

from models import db, Polls, Topics, Options
from flask import Blueprint, request, jsonify, session, json
from datetime import datetime
from config import SQLALCHEMY_DATABASE_URI
from datetime import date
from sqlalchemy import exc
if getenv('APP_MODE') == 'PRODUCTION':
    from production_settings import SQLALCHEMY_DATABASE_URI


api = Blueprint('api', 'api', url_prefix='/api')


@api.route('/polls', methods=['GET', 'POST'])

def api_polls():
    if request.method == 'POST':
      
        poll = request.get_json()

        
        for key, value in poll.items():
            if not value:
                return jsonify({'message': 'vacia'.format(key)})

        title = poll['title']
        options_query = lambda option: Options.query.filter(Options.name.like(option))

        options = [Polls(option=Options(name=option))
                   if options_query(option).count() == 0
                   else Polls(option=options_query(option).first()) for option in poll['txtOptions']
                   ]
        
       
        
        try:
            new_topic = Topics(title=title, options=options)
            db.session.add(new_topic)
            db.session.commit()
        except exc.SQLAlchemyError:
            db.session.rollback()
            raise
        finally:
            return jsonify({'message': 'Existe un problema con nuestra base de datos, favor de intentarlo mas tarde'})
        

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
        # incrementar el voto en 1 si encuentra la encuesta
        try:
            option.vote_count += 1
            db.session.commit()
        except exc.SQLAlchemyError:
            db.session.rollback()
            raise
        finally:
            return jsonify({'message': 'Existe un problema con nuestra base de datos, favor de intentarlo mas tarde'})
        return jsonify({'message': 'Gracias por votar'})

    return jsonify({'message': 'La encuesta no fue encontrada'})


@api.route('/poll/<poll_name>')
def api_poll(poll_name):

    poll = Topics.query.filter(Topics.title.like(poll_name)).first()

    return jsonify({'Polls': [poll.to_json()]}) if poll else jsonify({'message': 'encuesta no encontrada'})
