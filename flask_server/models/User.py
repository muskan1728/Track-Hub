from . import db
from sqlalchemy.dialects.mysql import JSON


class User(db.Model):
    __tablename__  = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password =  db.Column(db.String(120),nullable=False)
    email = db.Column(db.String(120),unique=True)
    tenant_name = db.Column(db.String(80))
    tag_events = db.Column(JSON)
    # visit_url =  db.Column(db.Text())
    # vistor_start_time =  db.Column(db.DateTime(), default=db.func.now())
    # session_duration = db.Column(db.Interval)