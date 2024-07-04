from flask_server.models.User import User
import jwt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.inspection import inspect
import bcrypt

class UserDao:
    def __init__(self,db):
        self.db = db
    def add_user(self,username,password,email,tenant_name,tag_events):
        password = self.__generate_password_hash(password)
        user = User(username=username,password=password,email=email,tenant_name=tenant_name,tag_events=tag_events)
        self.db.session.add(user)
        self.db.session.commit()
        return user
        # self.__create_user_table(tenant,User)

        # self.db.session.add(tagmanager)
        # self.db.session.commit()
        # print(decoded_token['azp'])
        pass
    
    def get_user_id(self,username):
        user = User.query.filter_by(username=username).first()
        return user
    def get_user_by_username_and_password(self, username, password):
        user = User.query.filter_by(username=username).first()
        if user and self.__check_password_hash(password, user.password):
            return user
        
    # def __create_user_table(self,tenant_name, User):
    #     table_name = f'{tenant_name}_user'
    #     engine = self.db.engine
    #     inspector = inspect(engine)
    #     print(table_name)
    #     if table_name not in inspector.get_table_names():
    #         print(engine)
    #         User.__tablename__ = table_name
    #         User.__table__.create(engine)


    def __generate_password_hash(self,password):
        """Generate a hash of the given password using bcrypt."""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    def __check_password_hash(self,password, hashed_password):
        """Check if the given password matches the hashed password."""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    