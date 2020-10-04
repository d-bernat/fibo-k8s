SHA=$(git rev-parse HEAD)

kubectl apply -f k8s
kubectl set image deployments/fibo-client-deployment  fibo-client=dbernat/fibo-client:$SHA
kubectl set image deployments/fibo-server-deployment  fibo-server=dbernat/fibo-server:$SHA
kubectl set image deployments/fibo-worker-deployment  fibo-worker=dbernat/fibo-worker:$SHA