from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import requests
import json
import datetime
import jwt

app = Flask(__name__)
CORS(app)

cp4d_url = os.getenv('cp4d_url')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/get_token', methods=['POST'])
def get_token():
    try:
        username = os.getenv('username')
        password = os.getenv('password')

        data = {
            'username': username,
            'password': password
        }

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(f'{cp4d_url}/icp4d-api/v1/authorize', headers=headers, json=data)

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/grant_access', methods=['POST'])
def grant_access():
    try:
        data = request.get_json()
    

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        table_name = data.get('table_name')
        table_schema = 'DANENDRA.ATHALLARIQ@IBM.COM'
        authid = 'adi.wijaya@ibm.com'

        if not table_name or not table_schema or not authid:
            return jsonify({'error': 'Missing required parameters'}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/icp4data-databases/dv/cpd/dvapiserver/v2/privileges/users'

        headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        payload = {
            "table_name": table_name,
            "table_schema": table_schema,
            "authid": authid
        }
        print(payload)

        response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False)
        
        if response.status_code == 200:
            # print(response.message)
            return jsonify({'message': 'ok'}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/revoke_access/<authid>', methods=['DELETE'])
def revoke_access(authid):
    try:
        # Retrieve query parameters
        table_name = request.args.get('table_name')
        table_schema = request.args.get('table_schema')

        # Check if required query parameters are provided
        if not table_name or not table_schema:
            return jsonify({"error": "Missing required query parameters"}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/icp4data-databases/dv/cpd/dvapiserver/v2/privileges/users/{authid}?table_schema={table_schema}&table_name={table_name}'

        headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.delete(url, headers=headers, verify=False)

        if response.status_code == 200:
            return jsonify({'message': 'ok'}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_all_tables', methods=['GET'])
def get_all_tables():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/icp4data-databases/dv/cpd/dvapiserver/v2/'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/create_user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Missing required parameters'}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v1/user'

        headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        payload = {
            "username": username,
            "password": password
        }

        response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False)

        if response.status_code == 200:
            return jsonify({'message': 'ok'}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_users', methods=['GET'])
def get_users():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v1/usermgmt/users'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/edit_user/<username>', methods=['PUT'])
def edit_user(username):
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v1/usermgmt/users/{username}'

        headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.put(url, headers=headers, data=json.dumps(data), verify=False)

        if response.status_code == 200:
            return jsonify({'message': 'ok'}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_user_groups', methods=['GET'])
def get_user_groups():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v2/groups'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_group_members/<group_id>', methods=['GET'])
def get_group_members(group_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v2/groups/{group_id}/members'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_roles', methods=['GET'])
def get_roles_and_permissions():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v1/roles'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            responseJson = response.json()
            resultList = []
            for role in responseJson["rows"]:
                for i, permission in enumerate(role["doc"]["permissions"]):
                    role["doc"]["permissions"][i] = permission.replace('_', ' ').title()
                
                resultObject = {
                    "role_name": role["doc"]["role_name"],
                    "role_description": role["doc"]["description"],
                    "updated_at": datetime.fromtimestamp(role["doc"]["updated_at"]/1000).strftime('%Y-%m-%d'),
                    "permissions": role["doc"]["permissions"]
                }
                resultList.append(resultObject)

            return jsonify({"status": "Success", "data": resultList}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# login

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Missing required parameters'}), 400

        headers = {
            'content-type': 'application/json'
        }

        payload = {
            "username": username,
            "password": password
        }

        # Get CP4D token
        auth_response = requests.post(f'{cp4d_url}/icp4d-api/v1/authorize', headers=headers, json=payload)

        if auth_response.status_code != 200:
            return jsonify({'error': 'Authentication failed', 'details': auth_response.text}), auth_response.status_code

        cp4d_token = auth_response.json().get('token')

        if not cp4d_token:
            return jsonify({'error': 'Failed to retrieve CP4D token'}), 400

        # Use CP4D token to get user info
        user_info_headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {cp4d_token}'
        }

        user_info_response = requests.get(f'{cp4d_url}/usermgmt/v1/user/currentUserInfo', headers=user_info_headers)

        if user_info_response.status_code != 200:
            return jsonify({'error': 'Failed to retrieve user info', 'details': user_info_response.text}), user_info_response.status_code

        user_info = user_info_response.json()

        # Assuming user_info contains username, email, and business unit group
        user_id = user_info.get('uid')
        username = user_info.get('user_name')
        user_email = user_info.get('email')
        groups = user_info.get('groups', [])

        # Find the first business unit name in groups
        business_unit_name = None
        business_unit_id = None

        for group in groups:
            name = group.get('name')
            if name and 'business' in name.lower():  # Check if 'business' is in the name
                business_unit_name = name
                business_unit_id = group.get('group_id')
                break  # Stop after finding the first match

        if not username:
            return jsonify({'error': 'User info is incomplete'}), 400

        # Create JWT token
        jwt_payload = {
            'uid': user_id,
            'username': username,
            'user_email': user_email,
            'business_unit_name': business_unit_name,
            'business_unit_id': business_unit_id,
            'cp4d_token': cp4d_token,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expiration time
        }

        secret = os.getenv('secret') if os.getenv('secret') else secret_key
        jwt_token = jwt.encode(jwt_payload, secret, algorithm='HS256')

        return jsonify({'jwt_token': jwt_token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_groups', methods=['GET'])
def get_groups():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v2/groups'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            responseJson = response.json()
            resultList = []
            for group in responseJson["results"]:
                resultObject = {
                    "group_name": group["name"],
                    "group_description": group["description"],
                    "role": group["roles"],
                    "active_member": group["members_count"]
                }

                resultList.append(resultObject)

            return jsonify({"status": "Success", "data": resultList}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get Business Unit Groups
@app.route('/get_business_units', methods=['GET'])
def get_business_units_groups():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v2/groups'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            responseJson = response.json()
            resultList = []
            for group in responseJson["results"]:
                if (group["name"].lower().startswith("business")):
                    resultObject = {
                        "group_name": group["name"],
                        "group_description": group["description"],
                        "role": group["roles"],
                        "active_member": group["members_count"]
                    }

                    resultList.append(resultObject)

            return jsonify({"status": "Success", "data": resultList}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_catalogs', methods=['GET'])
def get_catalogs():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/v2/catalogs'

        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(url, headers=headers, verify=False)

        if response.status_code == 200:
            responseJson = response.json()
            resultList = []
            for catalog in responseJson["catalogs"]:
                resultObject = {
                    "catalog_id": catalog["metadata"]["guid"],
                    "catalog_name": catalog["entity"]["name"].replace('_', ' '),
                    "catalog_description": catalog["entity"]["description"],
                }

                resultList.append(resultObject)

            return jsonify({"status": "Success", "data": resultList}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


current_directory = os.path.dirname(os.path.abspath(__file__))
file_name = 'ApprovalData.json'
file_path = os.path.join(current_directory, file_name)

def load_data():
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = []
    return data

def save_data(data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)


@app.route('/get_approval_data', methods=['GET'])
def get_approval_data():
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Data file not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/update_approval_status/<id>', methods=['PUT'])
def update_approval_status(id):
    try:
        new_status = request.json.get('status')
        current_time = datetime.now()

        data = load_data()
        updated = False
        for entry in data:
            if entry['id'] == id:
                entry['status'] = new_status
                entry['approvedTimestamp'] = current_time.strftime("%Y-%m-%d %H:%M:%S")
                
                if new_status == 'Rejected':
                    expire_date = current_time.strftime("%Y-%m-%d") 
                else:
                    duration_minutes = int(entry['duration'])
                    expire_date = (current_time + timedelta(minutes=duration_minutes)).strftime("%Y-%m-%d %H:%M:%S")
                entry['expireDate'] = expire_date
                updated = True
                break

        if updated:
            save_data(data)
            return jsonify({'message': f'Status updated for ID {id}'}), 200
        else:
            return jsonify({'error': f'ID {id} not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug= True)
