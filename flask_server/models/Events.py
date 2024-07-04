from . import db

class Event(db.Model):
    __tablename__  = 'events'
    id = db.Column(db.Integer, primary_key=True)
    event_type  = db.Column(db.String(20), nullable=False) # 'login
    event_value = db.Column(db.String(50))

class TagManager(db.Model):
    __tablename__  = 'tag_manager'
    id = db.Column(db.Integer, primary_key=True)
    event  = db.Column(db.String(30), nullable=False) # 'login
    value = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    
