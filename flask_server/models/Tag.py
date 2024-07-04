from . import db
from sqlalchemy.dialects.mysql import JSON

class Tag(db.Model):
    __tablename__  = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    type = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.now())
    trigger_id = db.Column(JSON)
    tenant_name =  db.Column(db.String(80))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
 

class TagCondition(db.Model):
    __tablename__  = 'tag_conditions'
    id = db.Column(db.Integer, primary_key=True)
    tag_id = db.Column(db.Integer)
    event = db.Column(db.String(255), nullable=False) # TODO: Make this a
    element = db.Column(db.String(255), nullable=False) # TODO: Make this a
    created_at = db.Column(db.DateTime, default=db.func.now())
