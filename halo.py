from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import json

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
            'api_key': password
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
        authid = 'achmad.fauzan@ibm.com'

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

        response = requests.post(url, headers=headers, data=json.dumps(payload), verify=False)

        if response.status_code == 200:
            return jsonify({'message': 'ok'}), 200
        else:
            return jsonify({'error': 'failed', 'details': response.text}), response.status_code

    except Exception as e:
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug= True)
