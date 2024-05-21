from flask import Flask, request, jsonify
from flask_cors import CORS
from kubernetes import client, config

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})
config.load_kube_config()
v1 = client.CoreV1Api()

@app.route('/')
def home():
    return "hello"

@app.route('/create-pod', methods=['POST'])
def create_pod():
    data = request.get_json()
    name = data['name']
    image = data['image']

    print("created pod for ", name, image)

    pod_manifest = client.V1Pod(
        api_version='v1',
        kind='Pod',
        metadata=client.V1ObjectMeta(name=name),
        spec=client.V1PodSpec(containers=[
            client.V1Container(name=name, image=image)
        ])
    )

    try:
        response = v1.create_namespaced_pod(namespace='default', body=pod_manifest)
        return jsonify(response.to_dict()), 201
    except client.exceptions.ApiException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/list-pods', methods=['GET'])
def list_pods():
    api_instance = client.CoreV1Api()
    pods = api_instance.list_namespaced_pod(namespace='default')
    pod_list = [{"name": pod.metadata.name, "status": pod.status.phase} for pod in pods.items]
    return jsonify(pod_list)

if __name__ == '__main__':
    app.run(port=3000)
