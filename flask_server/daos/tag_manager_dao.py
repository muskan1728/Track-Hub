from flask_server.models.Events import TagManager
from .user_dao import UserDao
from sqlalchemy.orm import sessionmaker

class TagManagerDao:
    def __init__(self,db):
        self.db = db
    def get_all_events(self,user):
        return self.db.session.query(TagManager).where(TagManager.user_id == user).all()
    def add_events(self,event,value,user_id):
        # user_dao = UserDao(self.db)
        # user_dao.add_user(token)
        tagmanager = TagManager(event=event, value=value,user_id=user_id)
        self.db.session.add(tagmanager)
        self.db.session.commit()
        return tagmanager
    