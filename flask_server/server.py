from flask import Flask,send_file,render_template,request,jsonify
from .routes import create_app
# from flask_mysqldb import MySQL
from flask_cors import CORS
import yaml
import os
import sys
import site
from flask_socketio import SocketIO


# CORS(app)
# # app.config['SQLALCHEMY_DATABASE_URI']='mysql://muskan:muskan123@localhost/analytics'

# # Load database configuration from YAML file
# with open('db.yaml', 'r') as yaml_file:
#     db = yaml.load(yaml_file, Loader=yaml.SafeLoader)

# app.config['MYSQL_HOST']=db['mysql_host']
# app.config['MYSQL_USER']=db['mysql_user']
# app.config['MYSQL_PASSWORD']=db['mysql_password']
# app.config['MYSQL_DB']=db['mysql_db']


# mysql = MySQL(app)

# @app.route("/ab")
# def hello():
#     cur =mysql.connection.cursor()
#     cur.execute("SELECT * FROM tag_manager;")
  
#     data=cur.fetchall()
#     li=[]
#     for i in data:
#         li.append([i[0],i[1]])
#     # print(li)
#     return render_template('event.html',data=li)

# @app.route("/push-data",methods=['POST','GET'])
# def push():
#     if (request.method == "GET"):
#         cur =mysql.connection.cursor()
#         cur.execute("SELECT * FROM tag_manager;")
#         data=cur.fetchall()
#         li=[]
#         for i in data:
#             li.append([i[0],i[1]])
#         return li

#     print(request.json,"------------------------------------")
#     data = request.json
#     cur =mysql.connection.cursor()
#     cur.execute("INSERT INTO tag_manager(event,value) VALUES(%s,%s)",(data['event'],data['value']))
#     mysql.connection.commit()
#     cur.close()
#     return "success"

# @app.route("/tracker.js")
# def analytics():
#     js_file_path = 'tracker.js'
#     return send_file(js_file_path)


# def fetch_rows(query):
#     rows = []
#     cursor =mysql.connection.cursor()
#     cursor.execute(query)
#     for (row) in cursor:
#         rows.append(row)
#     cursor.close()
#     return rows
# def generate_tracker_js(config):
#     tag_scripts = ""

#     for tag in config["tags"]:
#         tag_scripts += generate_tag_script(tag)

#     tracker_script = """
#     (function (window, document) {
#         function pushData(postData){
#              fetch('http://127.0.0.1:5000/push-data',{
#             method: 'POST',
#             headers: {
#                 'Content-Type': 'application/json'
#             },
#             body:JSON.stringify(postData)
#         }).then(response => response.json())
#         .then(data => console.log(data))
#         .catch(error => console.error('Error:', error));
#         }
#         function detect(condition){
#             console.log("das",condition);
#             var element = condition.element;
#             var conditionValue = condition.condition;
#             var expectedValue = condition.value;

#             if (element === 'pageURL') {
#                 var pathArray = window.location.pathname.split('/');
#                 var element = "/"+pathArray[pathArray.length - 1 ]; // assuming 'part' is the second-to-last segment
#                 if (element === expectedValue) {
#                 return true;
#                 } else {
#                     return false;
#                 }
#             }
#             return false;
#         }
#         %s
#         // Paste your dataLayer and helper functions here
       
#     })(window, document);
#     """ % tag_scripts

#     with open('tracker.js', 'w') as tracker_file:
#         tracker_file.write(tracker_script)

# def generate_tag_script(tag):
#     conditions_script = ""
#     for condition in tag["conditions"]: 
#         if(tag['trigger_type']=="pageLoad"):
#             conditions_script += f"""
#              window.addEventListener('load', function () {{
#                 postData={{
#                 event:'pageLoad',
#                 value:'/'
#              }}
             
#              detect({condition}) ? pushData(postData) : {{}};
#              }}); 
             
#              """
#         elif(tag['trigger_type']=="elementClick"):
#              conditions_script += f"""
#              window.addEventListener('click', function () {{
#                 postData={{
#                 event:'elementClick',
#                 value:'any'
#              }}
#              pushData(postData);
#              }}); 
             
#              """
#         elif(tag['trigger_type']=="DOMready"):
#              conditions_script += f"""
#                 window.addEventListener('DOMContentLoaded', function() {{
#                 postData={{
#                 event:'DOMready',
#                 value:'any'
#              }}
#              pushData(postData);
#              }}); 
             
#              """
#         elif(tag['trigger_type']=="Timer"):
#              conditions_script += f"""
#              setInterval(function() {{
#                 postData={{
#                 event:'Timer',
#                 value:'any'
#                 }}
#                 pushData(postData);

#                 }}, 5000);
               
             
#              """
#         elif(tag['trigger_type']=="pageScroll"):
#              conditions_script += f"""
#                 window.addEventListener('scroll', function() {{
#                 postData={{
#                 event:'pageScroll',
#                 value:'any'
#              }}
#              pushData(postData);
             
#              }},{{capture:true}}); 
             
#              """
#     return conditions_script
#     # return f"""
#     # function fire{tag['name']}Tag() {{
#     #     // Code to fire {tag['name']} Tag
#     #     console.log("{tag['name']} Tag fired!");
#     # }}

#     # function {tag['name']}Logic() {{
#     #     {conditions_script}
#     # }}
    
#     # """

# @app.route("/tags",methods=['POST','GET'])
# def pushTags():
#     if(request.method=='POST'):
#         tag_name = request.form['tagName']
#         tag_type = request.form['tagType']
#         trigger_id = request.form['triggerID']
#         cursor =mysql.connection.cursor()
#         cursor.execute("INSERT INTO tags (name, type,trigger_id) VALUES (%s, %s,%s)", (tag_name, tag_type,trigger_id))
#         tag_id = cursor.lastrowid
#         # cursor.execute("INSERT INTO tag_conditions (tag_id, event, element) VALUES (%s, %s, %s)", (tag_id, event, element))
#         mysql.connection.commit()
#         cursor.close()
#         print(tag_name,tag_type)
#         return 'Data inserted successfully'
#     else:
#         queryTags = "SELECT * FROM tags"
#         queryTriggers = "SELECT * FROM triggers"
#         queryTagConditions = "SELECT  * FROM trigger_conditions JOIN tags ON trigger_conditions.trigger_id = tags.trigger_id"
#         queryTriggerConditions = "SELECT triggers.name AS trigger_name, trigger_conditions.* FROM trigger_conditions JOIN triggers ON trigger_conditions.trigger_id = triggers.id"
#         queryTagsbasedTriggerCond="SELECT  triggers.type FROM triggers JOIN tags ON triggers.id = tags.trigger_id"
#         tags = fetch_rows(queryTags)
#         triggers = fetch_rows(queryTriggers)
#         tag_conditions = fetch_rows(queryTagConditions)
#         trigger_conditions = fetch_rows(queryTriggerConditions)
#         tag_based_conditions=fetch_rows(queryTagsbasedTriggerCond)
#         print("   ",tag_conditions)
#         # print("   ",tag_conditions)

        
#         config = {
#             "tags": [{"id": tag[0], "name": tag[1], "type": tag[2] ,"created_at": tag[3].strftime('%Y-%m-%d %H:%M:%S'), "conditions": []} for tag in tags],
#             "triggers": [{"id": trigger[0], "name": trigger[1], "type": trigger[2], "created_at": trigger[3].strftime('%Y-%m-%d %H:%M:%S'), "conditions": []} for trigger in triggers]
#         }
#         # i=0
#         for index,cond in enumerate(tag_conditions):
#             config['tags'][index]['conditions'].append({
#                 'element': cond[3],
#                 'condition': cond[5],
#                 'value': cond[2],
#             })
#         i=0
#         for index,cond in enumerate(trigger_conditions):
#             config['triggers'][index]['conditions'].append({
#                 'element': cond[4],
#                 'condition': cond[6],
#                 'value': cond[3],
#             })
#             i+=1
        
#         for index, trigger_type in enumerate(tag_based_conditions):
#             print(trigger_type)
#             config['tags'][index]['trigger_type']=trigger_type[0]


#         # print(config)
#         generate_tracker_js(config)
#         return jsonify(config)


# @app.route("/triggers",methods=['POST','GET'])
# def pushTriggers():
#     if(request.method=='POST'):
#         cursor =mysql.connection.cursor()
#         trigger_name = request.form['triggerName']
#         trigger_type = request.form['triggerType']
#         element = request.form['element']
#         condition = request.form['condition']
#         value = request.form['value']

#         cursor.execute("INSERT INTO triggers (name, type) VALUES (%s, %s)", (trigger_name, trigger_type))
#         trigger_id = cursor.lastrowid
#         cursor.execute("INSERT INTO trigger_conditions (trigger_id, element,condtion,value) VALUES (%s, %s, %s,%s)", (trigger_id, element,condition,value))
#         mysql.connection.commit()
#         cursor.close()
#         return 'Data inserted successfully'

#     else:
#         queryTriggers = "SELECT * FROM triggers"
#         queryTriggerConditions = "SELECT triggers.name AS trigger_name, trigger_conditions.* FROM trigger_conditions JOIN triggers ON trigger_conditions.trigger_id = triggers.id"
#         triggers = fetch_rows(queryTriggers)
#         trigger_conditions = fetch_rows(queryTriggerConditions)
#         print(trigger_conditions)
#         config = {
#             "triggers": [{"id": trigger[0], "name": trigger[1], "type": trigger[2], "created_at": trigger[3].strftime('%Y-%m-%d %H:%M:%S'), "conditions": []} for trigger in triggers]
#         }
        
#         for index,cond in enumerate(trigger_conditions):
#             config['triggers'][index]['conditions'].append({
               
#                 'element': cond[4],
#                 'condition': cond[6],
#                 'value': cond[3],
#             })
#         return jsonify(config)

socketio,app = create_app()


@socketio.on('connect')
def handle_connect():
    print('Client connected')

if __name__ == "__main__":
    app.debug=True
    socketio.run(app)