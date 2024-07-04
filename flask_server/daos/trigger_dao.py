from flask_server.models.Trigger import Trigger , TriggerCondition
from sqlalchemy.orm import sessionmaker

class TriggerDao:
    def __init__(self,db):
        self.db = db
    def get_all_trigger(self,tenant_name=None):
        if(tenant_name):
            return  self.db.session.query(Trigger).where(Trigger.tenant_name==tenant_name)
        return self.db.session.query(Trigger).all()
    def getTriggerByID(self,id):
        return  self.db.session.query(Trigger).filter_by(id=id).first()
    def add_trigger(self,name,type,tenant,data):
        trigger = Trigger(name=name, type=type,tenant_name=tenant,data=data)
        self.db.session.add(trigger)
        self.db.session.commit()
        return trigger
    def add_trigger_condition(self,trigger_id, element,conditions,value):
        trigger_condition = TriggerCondition(trigger_id =trigger_id, element = element,conditions = conditions,value = value)
        self.db.session.add(trigger_condition)
        self.db.session.commit()
        return trigger_condition
    def get_trigger_condition(self):
        query = (
            self.db.session
            .query(TriggerCondition, Trigger)
            .join(Trigger, TriggerCondition.trigger_id == Trigger.id)
        )
        return query.all()