import os
from flask import Flask,render_template,request,redirect
from models import db, Polls, Topics, Options
from flask_migrate import Migrate

from api.api import api

import config
from celery import Celery




datank = Flask(__name__)
datank.register_blueprint(api)

datank.config.from_object('config')

db.init_app(datank)
db.create_all(app=datank)
migrate = Migrate(datank, db, render_as_batch=True)


@datank.route('/')


def home():
    return render_template('index.html')

@datank.route('/Polls', methods=['GET'])
def polls():
    return render_template('Polls.html')


@datank.route('/polls/<poll_name>')
def poll(poll_name):

    return render_template('index.html')


