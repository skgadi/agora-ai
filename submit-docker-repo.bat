docker build -t sigrama-agora-ai .
docker login
docker tag sigrama-agora-ai:latest skgadi/sigrama-agora-ai:latest
docker push skgadi/sigrama-agora-ai:latest