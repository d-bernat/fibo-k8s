docker build -t dbernat/fibo-client:latest -t dbernat/fibo-client:$SHA -f ./client/Dockerfile ./client
docker build -t dbernat/fibo-server:latest -t dbernat/fibo-server:$SHA -f ./server/Dockerfile ./server
docker build -t dbernat/fibo-worker:latest -t dbernat/fibo-worker:$SHA -f ./worker/Dockerfile ./worker

docker push  dbernat/fibo-client:latest
docker push  dbernat/fibo-server:latest
docker push  dbernat/fibo-worker:latest
docker push  dbernat/fibo-client:$SHA
docker push  dbernat/fibo-server:$SHA
docker push  dbernat/fibo-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/fibo-client-deployment  fibo-client=dbernat/fibo-client:$SHA
kubectl set image deployments/fibo-server-deployment  fibo-server=dbernat/fibo-server:$SHA
kubectl set image deployments/fibo-worker-deployment  fibo-worker=dbernat/fibo-worker:$SHA