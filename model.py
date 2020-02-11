from flask_sqlalchemy import SQLAlchemy

# creamos el objeto sqlAlchemy
db = SQLAlchemy()

class Base(db.Model):
	__abstract__ = True

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dateCreated = db.Column(db.DateTime, default=db.func.current_timestamp())
    dateModified = db.Column(db.DateTime, default=db.func.current_timestamp(),
            onupdate=db.func.current_timestamp())

class Themes(Base):
    title = db.Column(db.String(500))

class Options(Base):
    name = db.Column(db.String(200))


class Polls(Base):

   
    theme_id = db.Column(db.Integer, db.ForeignKey('Themes.id'))
    option_id = db.Column(db.Integer, db.ForeignKey('options.id'))
    vote_count = db.Column(db.Integer)
    status = db.Column(db.Boolean) 
    
    theme = db.relationship('Themes', foreign_keys=[theme_id],
            backref=db.backref('options', lazy='dynamic'))
    option = db.relationship('Options',foreign_keys=[option_id])

    def __repr__(self):
        return self.option.name