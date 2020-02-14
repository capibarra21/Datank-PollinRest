import os
from flask import Flask,render_template,request,redirect
from models import db, Polls, Topics, Options
from flask_migrate import Migrate

from api.api import api

import config
from celery import Celery


def make_celery(datank):
    celery = Celery(
        datank.import_name, backend=datank.config['CELERY_RESULT_BACKEND'],
        broker=datank.config['CELERY_BROKER']
    )
    celery.conf.update(datank.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with datank.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask

    return celery

datank = Flask(__name__)
datank.register_blueprint(api)

datank.config.from_object('config')

db.init_app(datank)
db.create_all(app=datank)
migrate = Migrate(datank, db, render_as_batch=True)
celery = make_celery(datank)

@datank.route('/')


def home():
    return render_template('index.html')

@datank.route('/Polls', methods=['GET'])
def polls():
    return render_template('Polls.html')


@datank.route('/polls/<poll_name>')
def poll(poll_name):

    return render_template('index.html')


