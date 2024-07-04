def generate_tracker_js(config):
    tag_scripts = ""

    for tag in config["tags"]:
        tag_scripts += generate_tag_script(tag)

    tracker_script = """
    (function (window, document) {
        function pushData(postData){
             fetch('http://127.0.0.1:5000/events',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(postData)
        }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
        }
        function detect(condition){
            console.log("das",condition);
            var element = condition.element;
            var conditionValue = condition.condition;
            var expectedValue = condition.value;

            if (element === 'pageURL') {
                var pathArray = window.location.pathname.split('/');
                var element = "/"+pathArray[pathArray.length - 1 ]; // assuming 'part' is the second-to-last segment
                if (element === expectedValue) {
                return true;
                } else {
                    return false;
                }
            }
            return false;
        }
        %s
        
       
    })(window, document);
    """ % tag_scripts

    with open('flask_server/trackerabs.js', 'w') as tracker_file:
        print("opened ")
        tracker_file.write(tracker_script)

def generate_tag_script(tag):
    conditions_script = ""
    for condition in tag["conditions"]: 
        if(tag['trigger_type']=="pageLoad"):
            conditions_script += f"""
             window.addEventListener('load', function () {{
                postData={{
                event:'pageLoad',
                value:'/'
             }}
             
             detect({condition}) ? pushData(postData) : {{}};
             }}); 
             
             """
        elif(tag['trigger_type']=="elementClick"):
             conditions_script += f"""
             window.addEventListener('click', function () {{
                postData={{
                event:'elementClick',
                value:'any'
             }}
             pushData(postData);
             }}); 
             
             """
        elif(tag['trigger_type']=="DOMready"):
             conditions_script += f"""
                window.addEventListener('DOMContentLoaded', function() {{
                postData={{
                event:'DOMready',
                value:'any'
             }}
             pushData(postData);
             }}); 
             
             """
        elif(tag['trigger_type']=="Timer"):
             conditions_script += f"""
             setInterval(function() {{
                postData={{
                event:'Timer',
                value:'any'
                }}
                pushData(postData);

                }}, 5000);
               
             
             """
        elif(tag['trigger_type']=="pageScroll"):
             conditions_script += f"""
                window.addEventListener('scroll', function() {{
                postData={{
                event:'pageScroll',
                value:'any'
             }}
             pushData(postData);
             
             }},{{capture:true}}); 
             
             """
    return conditions_script
    # return f"""
    # function fire{tag['name']}Tag() {{
    #     // Code to fire {tag['name']} Tag
    #     console.log("{tag['name']} Tag fired!");
    # }}

    # function {tag['name']}Logic() {{
    #     {conditions_script}
    # }}
    
    # """
