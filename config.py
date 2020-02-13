import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'datank-pullin.db')
SECRET_KEY = 'development key'
SQLALCHEMY_DATABASE_URI = 'sqlite:///{}'.format(DB_PATH)
CELERY_BROKER = 'amqp://guest@localhost//'
CELERY_RESULT_BACKEND = 'amqp://'
SQLALCHEMY_TRACK_MODIFICATIONS = False
DEBUG = True