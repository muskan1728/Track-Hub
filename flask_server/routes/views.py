import json
from flask import Blueprint,send_file,request
from flask_server.daos.user_dao import UserDao
from flask_server.models import db

user_dao = UserDao(db)
views_blueprint = Blueprint('views',__name__)

@views_blueprint.route('/')
def home():
    return "<h1>test</h1>"
@views_blueprint.route("/tracker.js")
def analytics():
    js_file_path = '../tracker.js'
    return send_file(js_file_path)

@views_blueprint.route("/user",methods=['POST', 'GET'])
def user():
    if(request.method == "POST"):
        
       username = request.form['username']
       password = request.form['password']
       email = request.form['email']
       tenant_name = request.form['tenant_name']
       tag_events = json.loads(request.form['tag_events'])
       print(username,"use")
       user_dao.add_user(username,password,email,tenant_name,tag_events)
       
       
       
@views_blueprint.route("/sign-in",methods=['POST', 'GET'])
def signin():
    data = request.get_json()
    user = user_dao.get_user_by_username_and_password(data['username'], data['password'])
    if(user):
        username=user.username
        tenant_name = user.tenant_name
        result = {
            'username':user.username,
            'tenant_name':user.tenant_name
        }
        print(user.tenant_name,"user")
        print(result,tenant_name,"ddd")
    
    return result if user else None