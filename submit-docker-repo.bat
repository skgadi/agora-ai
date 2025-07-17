docker build -t sigrama-panelist-ai .
docker login
docker tag sigrama-panelist-ai:latest skgadi/sigrama-panelist-ai:latest
docker push skgadi/sigrama-panelist-ai:latest