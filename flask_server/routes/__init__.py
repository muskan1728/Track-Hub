from flask import Blueprint
from flask import Flask,send_file,render_template,request,jsonify
import flask_server.models as models
from flask_server.models import User,Events
from flask_server.daos.tag_dao import TagDao
import yaml
from .tagmanager import tag_manager_blueprint
from .views import views_blueprint
from os import path
from flask_cors import CORS
from flask_socketio import SocketIO
from sqlalchemy import MetaData, Table

db = models.db
from flask_server.models import Tag
DB_NAME = 'analytics.db'
tag_dao = TagDao(db)

def create_app():
    app = Flask(__name__)
    CORS(app,resources={r"*": {"origins": "*"}})
    with open(path.join(path.dirname(__file__), 'db.yaml'), 'r') as yaml_file:
         db_ = yaml.load(yaml_file, Loader=yaml.SafeLoader)
    # app.config['MYSQL_HOST']=db['mysql_host']
    # app.config['MYSQL_USER']=db['mysql_user']
    # app.config['MYSQL_PASSWORD']=db['mysql_password']
    # app.config['MYSQL_DB']=db['mysql_db']
    # mysql = MySQL(app)
    # # initialize MySQL connector
    # mysql.init_app(app)
    app.config['DEBUG'] = True

    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{db_["mysql_user"]}:{db_["mysql_password"]}@{db_["mysql_host"]}/{db_["mysql_db"]}'
    db.init_app(app)
    socketio = SocketIO(app,cors_allowed_origins="*")
    app.config['SOCKETIO'] = socketio


    # register blueprints
    
    app.register_blueprint(tag_manager_blueprint,url_prefix='/',socketio=socketio)
    app.register_blueprint(views_blueprint,url_prefix='/admin')

    create_database(app)

    return [socketio,app]

def create_database(app):
     print(path,"-------------")
     if not path.exists('flask-server' +DB_NAME):
          with app.app_context():
                db.create_all()
                print("created database")