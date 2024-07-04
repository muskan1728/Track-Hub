import json

def generate_tag_scripts(tags):
    tag_scripts = ""
    for tag in tags:
        tag_scripts += generate_tag_script(tag)
    return tag_scripts

def generate_tag_script(tag):
    return f"""
function fire{tag['name']}Tag() {{
    // Code to fire {tag['name']} Tag
    console.log("{tag['name']} Tag fired!");
}}

function {tag['name']}Logic() {{
    {generate_conditions_script(tag['conditions'])}
}}
"""

def generate_conditions_script(conditions):
    conditions_script = ""
    for condition in conditions:
        if condition.get("event") and condition.get("value"):
            conditions_script += f"    if event === '{condition['event']}' && element === '{condition['value']}': {{ fire{condition['tag']}Tag(); }}\n"
    return conditions_script

config_path = 'tag.json'
with open(config_path, 'r') as config_file:
    config = json.load(config_file)

tag_scripts = generate_tag_scripts(config['tags'])
tracker_script = f"""
(function (window, document) {{
    // Paste your dataLayer and helper functions here
    {tag_scripts}
}})(window, document);
"""

with open('tracker.json', 'w') as tracker_file:
    tracker_file.write(tracker_script)