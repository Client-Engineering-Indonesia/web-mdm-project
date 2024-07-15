from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import requests
import json
import uuid
import jwt
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from matplotlib.offsetbox import OffsetImage, AnnotationBbox

app = Flask(__name__)
CORS(app)
secret = os.getenv('secret') 
cp4d_url = os.getenv('cp4d_url')

def current_timestamp():
    current_timestamp = datetime.now()
    formatted_timestamp = current_timestamp.strftime("%Y-%m-%d %H:%M:%S")
    return formatted_timestamp

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
            users = response.json()
            filtered_users = []
            for user in users:
                groups = user.get('groups', [])
                business_unit_name = None
                business_unit_id = None

                for group in groups:
                    name = group.get('name')
                    if name and 'business' in name.lower():  # Check if 'business' is in the name
                        business_unit_name = name
                        business_unit_id = group.get('group_id')
                        break  # Stop after finding the first match

                filtered_user = {
                    'username': user.get('username'),
                    'email': user.get('email'),
                    'business_unit_group': business_unit_name,
                    'business_unit_group_id': business_unit_id,
                    'user_roles': user.get('user_roles'),
                    'created_timestamp': user.get('created_timestamp'),
                    'current_account_status': user.get('current_account_status')
                }
                filtered_users.append(filtered_user)

            return jsonify(filtered_users), 200
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

# Get Roles
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
                    "role_id": role["id"],
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

        role_headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {cp4d_token}'
        }
        get_all_roles_url = f'{cp4d_url}/usermgmt/v1/roles'
        roles_response = requests.get(get_all_roles_url, headers=role_headers, verify=False)

        if roles_response.status_code != 200:
            return jsonify({'error': 'Failed to retrieve roles info', 'details': roles_response.text}), roles_response.status_code
        elif roles_response.status_code == 200:
            roles_response_json = roles_response.json()

            # Assume a user only has one group role
            for role in roles_response_json["rows"]:
                if role["id"] == user_info["user_roles"][0]:
                    user_role = role["doc"]["role_name"]

        # Create JWT token
        jwt_payload = {
            'uid': user_id,
            'username': username,
            'user_email': user_email,
            'role': user_role,
            'business_unit_name': business_unit_name,
            'business_unit_id': business_unit_id,
            'cp4d_token': cp4d_token,
            'exp': datetime.now() + timedelta(hours=5)  # Token expiration time
        }

        jwt_token = jwt.encode(jwt_payload, secret, algorithm='HS256')

        return jsonify({'jwt_token': jwt_token}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

<<<<<<< HEAD
@app.route('/add_new_role', methods=['POST'])
def add_new_role():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        role_name = data.get('role_name')
        description = data.get('description')
        permission = data.get('permission')

        # if not username or not user_roles:
        #     return jsonify({'error': 'Missing required parameters'}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v1/user/{username}'

        headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        payload = {
            'role_name': role_name,
            'description': description,
            'permission': permission
        }

        response = requests.put(url, headers=headers, json=payload, verify=False)

        if response.status_code == 200:
            return jsonify({'message': 'ok'}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/assign_role/<username>', methods=['PUT'])
def assign_role(username):
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        username = data.get('username')
        user_roles = data.get('user_roles')

        if not username or not user_roles:
            return jsonify({'error': 'Missing required parameters'}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        url = f'{cp4d_url}/usermgmt/v1/user/{username}'

        headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

        payload = {
            'username': username,
            'user_roles': user_roles
        }

        response = requests.put(url, headers=headers, json=payload, verify=False)

        if response.status_code == 200:
            return jsonify({'message': 'ok'}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500



=======
# Get User Info
>>>>>>> 010e55fa093595d61f4df33f4685ad9b1ced16d7
@app.route('/user_info', methods=['POST'])
def get_user_info_from_jwt():
    data = request.get_json()
    token = data.get('token')
    if not token:
        return jsonify({'error': 'Token is missing'}), 400
    
    decoded_token = decodeJwtToken(token)
    if 'error' in decoded_token:
        return jsonify(decoded_token), status_code

    return jsonify({'user_info': decoded_token}), 200

# Decode jwt token
def decodeJwtToken(token):
    try:
        decoded_token = jwt.decode(token, secret, algorithms=['HS256'])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Expired token'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

# Get Groups
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

# Get Catalogs
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

# Approval 
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
        user_info = decodeJwtToken(request.json.get('webtoken'))
        
        if 'role' in user_info and 'admin' not in user_info["role"].lower():
            return jsonify({'error': 'You do not have permission to approve this request'}), 400
    
        else: 
            data = load_data()
            updated = False
            for entry in data:
                if entry['id'] == id:
                    entry['is_approved'] = new_status
                    entry['approved_timestamp'] = current_time.strftime("%Y-%m-%d %H:%M:%S")
                    updated = True
                    break

            if updated:
                save_data(data)
                return jsonify({'message': f'Status updated for ID {id}'}), 200
            else:
                return jsonify({'error': f'ID {id} not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/create_request', methods=['POST'])
def create_request():
    try: 
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        user_info = decodeJwtToken(data.get('webtoken'))

        timestamp = current_timestamp()
        unique_id = str(uuid.uuid4())[:8]

        new_request = {
            "id": unique_id,
            "is_approved": True if 'admin' in user_info["role"].lower() else False,
            "requestor_business_unit": user_info["business_unit_name"],
            "requestor_username":  data.get('requestor_username'),
            "requestor_role": data.get('requestor_role'),
            "table_name": data.get('table_name'),
            "owner_email": data.get('owner_email'),
            "owner_name": data.get('owner_name'),
            "owner_phone": data.get('owner_phone'),
            "description": data.get('description'),
            "request_timestamp": timestamp,
            "approved_timestamp": None,
            "expire_date": data.get('duration')
        }

        json_path = file_path

        with open(json_path, 'r') as file:
            data = json.load(file)

        data.append(new_request)

        # Write the updated data back to the JSON file
        with open(json_path, 'w') as file:
            json.dump(data, file, indent=4)
        
        return jsonify({"status": "Success", "data": data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint 
endpoint_file_path = 'src/data/endpoint-data.json'

@app.route('/get_endpoint_data', methods=['GET'])
def get_endpoint_data():
    try: 
        req_body = request.get_json()

        user_info = decodeJwtToken(req_body.get('webtoken'))
        internal_result = []
        external_result = []

        with open(endpoint_file_path, 'r') as file:
            endpoints = json.load(file)
            for endpoint in endpoints:
                if endpoint["owner_business_unit_id"] == user_info["business_unit_id"]:
                    internal_result.append(endpoint)
                elif user_info["uid"] in endpoint["viewers"] and endpoint["owner_business_unit_id"] != user_info["business_unit_id"]:
                    external_result.append(endpoint)
        
        result = {
            "internal": internal_result,
            "external": external_result
        }

        return jsonify({
            "result": result
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/create_new_endpoint', methods=['POST'])
def create_new_endpoint():
    try: 
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        user_info = decodeJwtToken(data.get('token'))
        unique_id = str(uuid.uuid4())[:8]

        new_endpoint = {
            "id": unique_id,
            "username":  user_info['username'],
            "owner_business_unit_id": user_info['business_unit_id'],
            "viewers": [user_info["uid"]],
            "created_at": current_timestamp(),
            "endpoint_name": data.get("endpoint_name"),
            "status": data.get('status'),
            "engine": data.get('engine'),
            "hostname": data.get('hostname'),
            "schema": data.get('schema'),
            "subscribed": data.get("subscribed")
        }

        with open(endpoint_file_path, 'r') as file:
            data = json.load(file)

        data.append(new_endpoint)

        # Write the updated data back to the JSON file
        with open(endpoint_file_path, 'w') as file:
            json.dump(data, file, indent=4)
        
        return jsonify({"status": "Success", "data": data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Graph Visualization
dv_data_exchange_df = pd.read_csv('src/data/dv_log_processed.csv')
view_df = pd.read_csv('src/data/table_access_log.csv')
table_access_count = view_df['table_accessed'].value_counts()
VIRTUALIZED_DATA = dv_data_exchange_df["dv_table_name"].unique()

def create_graph(dv_data_exchange_df, view_df):
    # Create a directed graph
    G = nx.DiGraph()

    # Process the DataFrame to add or remove edges based on actions
    for index, row in dv_data_exchange_df.iterrows():
        table = row['dv_table_name']
        target = row['dv_user_target']
        owner = row['initiator_id']
        if row['action'] == 'data-virtualization..implicit_grant.configure':
            G.add_edge(owner, table)
        if row['action'] == 'data-virtualization.grant.configure':
            G.add_edge(owner, table)
            G.add_edge(table, target)
        elif row['action'] == 'data-virtualization.revoke.configure':
            if G.has_edge(table, target):
                G.remove_edge(table, target)
    # Add custom metrics to nodes
    for node in G.nodes():
        if node in VIRTUALIZED_DATA:
            G.nodes[node]['access_count'] = table_access_count[node]
    return G

def visualize_graph(G, filename):
    # Define node colors based on node type (table or user)
    node_colors = []
    db_image = mpimg.imread('src/data/person1.png')
    person_image = mpimg.imread('src/data/database2.png')

    # Draw the graph
    plt.figure(figsize=(20, 20))
    pos = nx.circular_layout(G)
    fig, ax = plt.subplots(figsize=(35, 12))
    plt.title('Access Graph')

    for node in G.nodes():
        x, y = pos[node]
        if any(node == row['dv_table_name'] for _, row in dv_data_exchange_df.iterrows()):
            img = person_image
        else:
            img = db_image
        imagebox = OffsetImage(img, zoom=0.5)
        ab = AnnotationBbox(imagebox, (x, y + 0.1), frameon=False)
        ax.add_artist(ab)

    # Get node labels for visualization
    node_labels = {}
    for node in G.nodes():
        if node not in VIRTUALIZED_DATA:
            node_labels[node] = node
        else:
            node_labels[node] = f"{node}\nAccess Count: {G.nodes[node]['access_count']}"
    
    nx.draw_circular(G, with_labels=True, node_color=node_colors, labels=node_labels, edge_color='gray', node_size=3000, font_size=8, font_weight='200', arrows=True)
    
    plt.savefig(filename)
    plt.close()

@app.route('/get_graph')
def get_graph_image():
    try: 
        filename = 'src/data/graph.png'
        # G = create_graph(dv_data_exchange_df, view_df)
        # visualize_graph(G, filename)

        return jsonify({"status": "Success", "file_path": filename}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug= True)
