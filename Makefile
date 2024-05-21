.PHONY: backend frontend

# python3 -m venv venv
# source venv/bin/activate
# pip3 install flask flask_cors kubernetes

kind:
	kind create cluster

backend:
	source venv/bin/activate && python3 app.py

frontend:
	cd frontend && PORT=3001 npm start