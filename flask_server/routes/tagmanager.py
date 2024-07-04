from flask import request, jsonify,current_app
from flask import Blueprint
from collections import defaultdict

from flask_server.models import User
# from flask_login import login_user, logout_user, current_user, login_required
from flask_server.daos.tag_dao import TagDao
from flask_server.daos.trigger_dao import TriggerDao
from flask_server.daos.tag_manager_dao import TagManagerDao
from flask_server.daos.user_dao import UserDao

from flask_server.helper_function.generate_trackingcode import generate_tracker_js
from flask_server.models import db
import jwt
tag_dao = TagDao(db)
trigger_dao = TriggerDao(db)
tag_manager_dao = TagManagerDao(db)
user_dao = UserDao(db)

tag_manager_blueprint = Blueprint('tagmanager', __name__)


@tag_manager_blueprint.route("/tags/", methods=['POST', 'GET'])
def pushTags():
    """
    Endpoint for managing tags.

    POST method:
    - Accepts form data with the following fields:
        - tagName: Name of the tag.
        - tagType: Type of the tag.
        - triggerID: List of IDs corresponding to triggers associated with the tag.
        - tenant: Name of the tenant.
        - user: Username.
    - Adds a new tag with the provided details.
    - Returns a success message upon successful insertion.

    GET method:
    - Accepts query parameter 'tenant' for filtering tags and triggers based on the tenant.
    - Retrieves all tags and triggers associated with the specified tenant.
    - Returns a JSON response containing the list of tags and triggers.

    Returns:
        - For POST method: Success message (string).
        - For GET method: JSON response containing tags and triggers data.
    """

    if (request.method == 'POST'):
        print("in post",request.form)
        tag_name = request.form['tagName']
        tag_type = request.form['tagType']
        trigger_ids = request.form.getlist('triggerID')
        tenant_name = request.form['tenant']
        username = request.form['user']
        user_details =user_dao.get_user_id(username)
        # trigger = trigger_dao.getTriggerByID(trigger_id)
        result = tag_dao.add_tag(
            tag_name, tag_type, trigger_ids,tenant_name,user_details.id)
        return "Data Inserted successfully"
    else:
        tenant_name = (request.args).get('tenant')
        triggers = trigger_dao.get_all_trigger(tenant_name)
        tags = tag_dao.get_all_tag(tenant_name)
        tag_condition = tag_dao.get_tag_condition(tenant_name)
        config = {
            "tags": [{"id": tag.id, "name": tag.name, "type": tag.type, "created_at": tag.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                      "conditions": []} for tag in tags],
            "triggers": [{"id": trigger.id, "name": trigger.name, "type": trigger.type, "created_at": trigger.created_at.strftime('%Y-%m-%d %H:%M:%S'), "conditions": []} for trigger in triggers]
        }

       
        # generate_tracker_js(config)
        return jsonify(config)


@tag_manager_blueprint.route("/triggers", methods=['POST', 'GET'])
def pushTriggers():
    """
    Endpoint to push or retrieve triggers.

    POST Method:
    Parameters:
        triggerName (str): The name of the trigger.
        triggerType (str): The type of the trigger.
        tenant (str): The name of the tenant.
        element (str): The element associated with the trigger.
        condition (str): The condition associated with the trigger.
        value (str): The value associated with the trigger condition.

    Returns:
        str: Response message indicating the success of the operation.

    GET Method:
    Parameters:
        tenant (str): The name of the tenant.

    Returns:
        json: JSON object containing configuration data for triggers."""
    if (request.method == 'POST'):
        trigger_name = request.form['triggerName']
        trigger_type = request.form['triggerType']
        tenant_name = request.form['tenant']
        element = request.form['element']
        condition = request.form['condition']
        value = request.form['value']
        data = generate_data(request,trigger_type)
        trigger = trigger_dao.add_trigger(
            trigger_name, trigger_type, tenant_name,data)
        if (value):
            trigger_condition = trigger_dao.add_trigger_condition(
                trigger.id, element, condition, value)
        print("successfully added triggers")
        return 'Data inserted successfully'
    else:
        tenant_name = (request.args).get('tenant')

        triggers = trigger_dao.get_all_trigger(tenant_name)
        trigger_condition = trigger_dao.get_trigger_condition()
        config = {
            "triggers": [{"id": trigger.id, "name": trigger.name, "type": trigger.type, "created_at": trigger.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                          "conditions": []} for trigger in triggers]
        }

        # for index,(trigger_condition,trigger) in enumerate(trigger_condition):
        #     print(trigger_condition,trigger)
        #     config['triggers'][index]['conditions'].append({

        #         'element': trigger_condition.element,
        #         'condition': trigger_condition.conditions,
        #         'value': trigger_condition.value,
        #     })
        return jsonify(config)


@tag_manager_blueprint.route("/events", methods=['POST', 'GET'])
def push():

    if (request.method == "GET"):
        args = request.args.to_dict()
        print( args)
        user= user_dao.get_user_id(args['user'])

        result = tag_manager_dao.get_all_events(user.id)
        events_list = []
        for event in result:
            events_list.append([event.event, event.value])
        return events_list
    else:
        # Extract Authorization header
        token = request.headers.get(
            'Authorization')
        data = request.json
        username=generate_username(token)
        user_details= user_dao.get_user_id(username)
        print("---------data", data)
        socketio = current_app.config['SOCKETIO']
        print(f'Emitting new_event: {data}')
        socketio.emit('new_event', [data['event'], data['value']])

        tag_manager_dao.add_events(data['event'], data['value'],user_details.id)

        return "success"


@tag_manager_blueprint.route("/tag-events/", methods=['POST', 'GET'])
def get_tag_events():
    if (request.method == 'GET'):
        token = request.headers.get(
            'Authorization')
        username=generate_username(token)
        user_details= user_dao.get_user_id(username)
        # print("--",username,token)
        if(user_details is None):
            return {}
        tag_details = tag_dao.get_tag_details(user_details.id)
        print("--",tag_details)
        grouped_tags = defaultdict(list)
        for trigger, tag, triggercondtion in tag_details:
         grouped_tags[trigger.type].append({
             "id": tag.id,
             "name": tag.name, 
             "type": tag.type,
             "created_at": tag.created_at.strftime('%Y-%m-%d %H:%M:%S'),
             "conditions": {
                 "condition": triggercondtion.conditions if triggercondtion else None,
                 "value": triggercondtion.value if triggercondtion else None, 
                 "element": triggercondtion.element if triggercondtion else None},
             "data":trigger.data
         })
        config = {
            "tags": [{"id": tag.id, "name": tag.name, "type": tag.type, "created_at": tag.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                      "conditions": {"condition": triggercondtion.conditions if triggercondtion else None, "value": triggercondtion.value if triggercondtion else None, "element": triggercondtion.element if triggercondtion else None}, "trigger_type": trigger.type} for trigger, tag, triggercondtion in tag_details],
        }
        print("------config", grouped_tags)
        return grouped_tags



def generate_username(token):
    token = token.split(" ")
    print("token",token[1])
    decoded_token = jwt.decode(token[1],  options={
            "verify_signature": False}, algorithms='HS256', verify=False)
        
    tenant = decoded_token['azp']
    username = decoded_token['preferred_username']
    return f'{username}_{tenant}'

def generate_data(request,trigger_type):
    data={}
    if(trigger_type=='elementVisible'):
        
        selector = request.form['css_selector']
        data['selector']=selector
    elif(trigger_type=='timer'):
        interval = int(request.form['interval'])
        data['interval']=interval
    elif(trigger_type=='pageScroll'):
        interval = int(request.form['threshold'])
        data['threshold']=interval
    return data