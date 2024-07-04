from . import db
from sqlalchemy.dialects.mysql import JSON

class Trigger(db.Model):
    __tablename__  = 'triggers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    type = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.now())
    tenant_name =  db.Column(db.String(80))
    data = db.Column(JSON)



class TriggerCondition(db.Model):
    __tablename__  = 'trigger_conditions'
    id = db.Column(db.Integer, primary_key=True)
    trigger_id = db.Column(db.Integer, db.ForeignKey('triggers.id'))
    value =  db.Column(db.String(255))
    element = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.now())
    conditions = db.Column(db.String(20))
