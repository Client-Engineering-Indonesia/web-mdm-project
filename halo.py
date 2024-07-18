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

# Get Roles
@app.route('/get_assignment_roles', methods=['GET'])
def get_assignment_roles():
    try:
        user_info = decodeJwtToken(request.json.get('webtoken'))
        url = f'{cp4d_url}/usermgmt/v1/roles'
        headers = {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Authorization': f'Bearer {user_info["cp4d_token"]}'
        }
        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            responseJson = response.json()
            resultList = []
            for role in responseJson["rows"]:
                if ('wkc' not in role["id"].lower() and 'zen' not in role["id"].lower() and 'holding' not in role['doc']['role_name'].lower()):
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

dummy_users = {
    'webuser_A': {
        'user_id': '1',
        'username': 'webuser_A',
        'user_email': 'webusera@mail.com',
        'business_unit_name': 'Business Unit A',
        'business_unit_id': '10001',
        'role': 'Business Unit User',
        'cp4d_token': 'dummy_token_A'
    },
    'webuser_B': {
        'user_id': '2',
        'username': 'webuser_B',
        'user_email': 'webuserb@mail.com',
        'business_unit_name': 'Business Unit B',
        'business_unit_id': '10002',
        'role': 'Business Unit User',
        'cp4d_token': 'dummy_token_B'
    }
}

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

        # Check if the user is a dummy user
        if username in dummy_users:
            user_info = dummy_users[username]

            jwt_payload = {
                'uid': user_info['user_id'],
                'username': user_info['username'],
                'user_email': user_info['user_email'],
                'role': user_info['role'],
                'business_unit_name': user_info['business_unit_name'],
                'business_unit_id': user_info['business_unit_id'],
                'cp4d_token': user_info['cp4d_token'],
                'exp': datetime.utcnow() + timedelta(hours=5)  # Token expiration time
            }

            jwt_token = jwt.encode(jwt_payload, secret, algorithm='HS256')

            return jsonify({'jwt_token': jwt_token}), 200

        # If not a dummy user, proceed with CP4D authentication
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
            'exp': datetime.utcnow() + timedelta(hours=5)  # Token expiration time
        }

        jwt_token = jwt.encode(jwt_payload, secret, algorithm='HS256')

        return jsonify({'jwt_token': jwt_token}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

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
        user_roles = data.get('user_roles')
        webToken = data.get('webtoken')
        if not username or not user_roles or not webToken: 
            return jsonify({'error': 'Missing required parameters'}), 400
        user_info = decodeJwtToken(data.get('webtoken'))

        token = user_info["cp4d_token"]
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
            return jsonify({'message': response.json()}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
# Get User Info
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

@app.route('/get_assets', methods=['GET'])
def get_assets_data():
    try: 
        # print('halo')
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        webtoken = auth_header.split(" ")[1]
        # print(webtoken)
        logged_in_user = decodeJwtToken(webtoken)

        table_assets_path = 'src/data/table-assets.json'
        dv_list = []

        # Check if the user is a dummy user
        if logged_in_user['username'] in dummy_users:
            # print("halo")
            with open(table_assets_path, 'r') as file:
                dv_list = json.load(file)["objects"]

        else:
            cpadmin_username = os.getenv('username')
            cpadmin_password = os.getenv('password')
            data = {
                'username': cpadmin_username,
                'password': cpadmin_password
            }
            headers = {
                'Content-Type': 'application/json'
            }
            cpadmin_auth_response = requests.post(f'{cp4d_url}/icp4d-api/v1/authorize', headers=headers, json=data)
            cpadmin_cp4d_token = cpadmin_auth_response.json().get('token')

            ## Get DV table
            cpadmin_cp4d_headers = {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    'Authorization': f'Bearer {cpadmin_cp4d_token}'
                }
            dv_api_response = requests.post(f'{cp4d_url}/icp4data-databases/dv/cpd/dvapiserver/v2/privileges/tables?rolename=DV_ADMIN', headers=cpadmin_cp4d_headers)
            dv_list = dv_api_response.json().get('objects')
        
        # Open file path data
        with open(file_path, 'r') as file:
                approval_data = json.load(file)
                resultList = []
                for asset in dv_list:
                    current_data = {
                                "table_name": asset["table_name"],
                                "table_schema": asset["table_schema"]
                            }
                    found = False
                    for data in approval_data:
                        if asset["table_name"] == data["table_name"] and data["requestor_username"] == logged_in_user['username']:
                            found = True
                            current_data["is_approved"] = data["is_approved"]
                            current_data["is_requested"] = True
                    if not found:
                        current_data["is_approved"] = False
                        current_data["is_requested"] = False
                    
                    resultList.append(current_data)

        return jsonify({"status": "Success", "data": resultList}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        user_request = request.get_json()
        print(user_request)
        new_status = user_request.get('status')
        current_time = datetime.now()
        user_info = decodeJwtToken(user_request.get('webtoken'))
        
        # if 'role' in user_info and 'admin' not in user_info["role"].lower():
        #     return jsonify({'error': 'You do not have permission to approve this request'}), 400
    
        # else: 
        data = load_data()
        updated = False
        for entry in data:
            if entry['id'] == id:
                entry['is_approved'] = new_status
                entry['approved_timestamp'] = current_time.strftime("%Y-%m-%d %H:%M:%S")
                updated = True
                break
        
        request_id = user_request.get("id")
        table_name = user_request.get('table_name')
        authid = user_request.get('username')
        table_schema = user_request.get('table_schema')

        token = user_info.get('cp4d_token')
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
        access_response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False)

        if access_response.status_code == 200:
            with open(file_path, 'r') as file:
                data = json.load(file)

            found = False
            for item in data:
                if item["id"] == request_id:
                    item["is_approved"] = True
                    item["approved_timestamp"] = current_timestamp()
                    found = True
                    
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

        duration = int(data.get('duration'))
        expire_timestamp = datetime.now() + timedelta(days=duration)
        formatted_expire_timestamp = expire_timestamp.strftime("%Y-%m-%d %H:%M:%S")

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
            "table_schema": data.get('table_schema'),
            "request_timestamp": timestamp,
            "approved_timestamp": None,
            "expire_date": formatted_expire_timestamp
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

@app.route('/get_endpoint_data', methods=['POST'])
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
        print(e)
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

#Data Constant
DV_DATA_EXCHANGE_DF = pd.read_csv('src/data/dv_log_processed.csv')
DV_DATA_EXCHANGE_DF['eventTime'] = pd.to_datetime(DV_DATA_EXCHANGE_DF['eventTime']).dt.date
VIEW_DF = pd.read_csv('src/data/table_access_log.csv')
TABLE_ACCESS_COUNT = VIEW_DF['table_accessed'].value_counts()
VIRTUALIZED_DATA = DV_DATA_EXCHANGE_DF["dv_table_name"].unique()
#Graph Creation
def graph_main(start_date, end_date):
    def filter_df(start_date, end_date, df):
        """
        Input in this format
            start_date : {day}-{month}-{year} I.E 15-07-2024
            end_date : {day}-{month}-{year} I.E 15-07-2024
        """
        start_date = "-".join(start_date.split('-')[::-1])
        start_date = pd.to_datetime(start_date).date()
        end_date = "-".join(end_date.split('-')[::-1])
        end_date = pd.to_datetime(end_date).date()
        df = df[
            (df['eventTime']>=start_date) &
            (df['eventTime']<=end_date)
        ]
        return df
    def create_graph(dv_data_exchange_df, table_access_count):
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
    def post_process_graph(G):
        # get position
        nodes_positions = nx.circular_layout(G)
        node_data_array = []
        link_data_array = []
        #get node data array
        for node in G.nodes():
            x, y = nodes_positions[node]
            node_data = {"key":node}
            if node in VIRTUALIZED_DATA:
                node_data['text'] = f"{node}\nAccess Count: {G.nodes[node]['access_count']}"
                node_data['type'] = "database"
            else:
                node_data["type"] = "user"
                node_data['text'] = node
            
            if node == 'CPADMIN':
                node_data['loc'] = '-100 300'
            elif node == 'BU_A_CUSTOMER':
                node_data['loc'] = '50 300'
            elif node == 'HIZKIA.FEBIANTO@IBM.COM':
                node_data['loc'] = '50 0'
            elif node == 'ADI.WIJAYA@IBM.COM':
                node_data['loc'] = "50 460"
            elif node == 'ACHMAD.FAUZAN@IBM.COM':
                node_data['loc'] = "250 300"
            elif node == 'DANENDRA.ATHALLARIQ@IBM.COM':
                node_data['loc'] = "780 300"
            elif node == 'BU_A_B_Joined':
                node_data['loc'] = "780 0"
            elif node == 'BU_B_CUSTOMER':
                node_data['loc'] = "500 460"
            elif node == 'EMPLOYEE':
                node_data['loc'] = "480 100"
            elif node == 'HIZKIA_FEB':
                node_data['loc'] = "280 150"
            elif node == 'EMPLOYEE_RECORDS':
                node_data['loc'] = "480 300"


            node_data_array.append(node_data)
        # Get node edge array
        for i, edge in enumerate(G.edges()):
            src, dest = edge
            edge_data = {"key":i, "from":src, "to":dest}
            link_data_array.append(edge_data)
        return node_data_array, link_data_array
    df = filter_df(start_date, end_date, DV_DATA_EXCHANGE_DF)
    G = create_graph(df, TABLE_ACCESS_COUNT)
    return post_process_graph(G)

@app.route('/create_graph', methods=['POST'])
def create_graph():
    try:
        data = request.get_json()
        start_date, end_date = data['start_date'], data['end_date']
        node_data_array, link_data_array = graph_main(start_date, end_date)
        return jsonify({
            'nodeDataArray': node_data_array,
            'linkDataArray': link_data_array
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug= True)
