#!bin/bash

docker pull docker pull docker-registry:5000/edu-vr-cms-api:latest
docker stop edu-vr-cms-api
docker system prune -f
docker run -d --name=edu-vr-cms-api docker-registry:5000/edu-vr-cms-api:latest