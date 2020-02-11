import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'datank-pullin.db')
SECRET_KEY = 'development'
SQLALCHEMY_DATABASE_URI = 'sqlite:///{}'.format(DB_PATH)
SQLALCHEMY_TRACK_MODIFICATIONS = False
DEBUG = True