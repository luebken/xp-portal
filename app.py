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
    v1 = client.CoreV1Api()
    pods = v1.list_pod_for_all_namespaces(watch=False)
    pod_list = []

    for pod in pods.items:
        pod_info = {
            'name': pod.metadata.name,
            'namespace': pod.metadata.namespace,
            'ready': f"{sum(1 for c in pod.status.container_statuses if c.ready)}/{len(pod.status.container_statuses)}",
            'status': pod.status.phase,
            'restarts': sum(c.restart_count for c in pod.status.container_statuses),
            'age': pod.metadata.creation_timestamp
        }
        pod_list.append(pod_info)
    
    return jsonify(pod_list)

@app.route('/pod-details/<namespace>/<name>', methods=['GET'])
def pod_details(namespace, name):
    v1 = client.CoreV1Api()
    try:
        pod = v1.read_namespaced_pod(name=name, namespace=namespace)
        details = v1.read_namespaced_pod_status(name=name, namespace=namespace).to_dict()
        return jsonify(details)
    except client.rest.ApiException as e:
        return jsonify({'error': e.reason}), e.status

if __name__ == '__main__':
    app.run(port=3000)
