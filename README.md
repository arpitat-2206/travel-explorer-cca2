# Travel Explorer — CCA 2 CI/CD Project

A responsive, frontend-only travel inspiration website made with HTML, CSS and JavaScript. It has destination cards, an interactive save-to-list button, and a small trip-idea form. It has no backend and does not store or send user data.

## Project files

- `index.html`, `style.css`, `script.js`: website
- `Dockerfile`: packages the static website in Nginx
- `Jenkinsfile`: declarative CI/CD pipeline
- `k8s/deployment.yaml`: Kubernetes Deployment
- `k8s/service.yaml`: Kubernetes NodePort Service

## Run locally without Docker

Open `index.html` in a browser.

## Run with Docker

```bash
docker build -t travel-explorer .
docker run --rm -p 8080:80 travel-explorer
```

Open `http://localhost:8080`.

## Before pushing to GitHub

1. Create a GitHub repository, for example `travel-explorer-cca2`.
2. Replace `YOUR_DOCKERHUB_USERNAME` in `Jenkinsfile` and `k8s/deployment.yaml` with your Docker Hub username.
3. Add the project to GitHub and push it.
4. In Jenkins, create a credential with ID `dockerhub-credentials`, type **Username with password**, using your Docker Hub username and a Docker Hub access token as the password.
5. Configure a Pipeline job to use **Pipeline script from SCM**, Git, your repository URL, and the branch (usually `*/main`).

## Important environment assumptions

This starter pipeline assumes Jenkins runs on a Linux machine/agent where `docker`, `kubectl`, and a working Minikube cluster are already installed and usable by the Jenkins agent. The Jenkins agent must have access to the Minikube cluster. On a typical AWS EC2 server, Minikube can run with a compatible driver such as Docker, but cluster setup and Jenkins permissions must be completed separately. Do not assume Minikube is ready merely because Jenkins is installed.

## Pipeline stages

1. **Checkout** — pulls the latest code from GitHub.
2. **Build and Test** — checks required files and confirms the page title exists.
3. **Docker Build** — creates an image tagged with the Jenkins build number and `latest`.
4. **Push Image** — authenticates with Docker Hub using Jenkins credentials and pushes both tags.
5. **Deploy to Minikube** — applies Kubernetes manifests, updates the Deployment to the new build image, and waits for rollout.
6. **Verify** — displays Pods, Deployment and Service.

## Kubernetes access

The pipeline uses `kubectl` against the cluster configured for the Jenkins agent. Once deployed, access it using one of these methods from a machine that can reach the cluster:

```bash
kubectl port-forward service/travel-explorer 8081:80
```

Then open `http://localhost:8081` on the machine running the port-forward command.

If Minikube's NodePort is reachable from your machine, you may also use:

```bash
minikube service travel-explorer --url
```

## Required second-run demonstration

After the first successful pipeline:

1. Change a visible line in `index.html`, such as the hero subtitle.
2. Commit and push the change to GitHub.
3. Run the Jenkins pipeline again.
4. Show the new build number, Docker Hub image tag, successful rollout, and changed website.

## Screenshots to capture for submission

- Website open in browser
- GitHub repository files
- Jenkins pipeline successful stages
- Docker Hub repository with pushed tags
- `kubectl get pods`
- `kubectl get deployment`
- `kubectl get service`
- Website open after the second source-code change

## CCA 2 checklist

- [ ] GitHub repository URL recorded
- [ ] Jenkinsfile committed
- [ ] Dockerfile committed
- [ ] Kubernetes Deployment and Service committed
- [ ] Docker Hub image pushed by Jenkins
- [ ] App deployed and verified on Minikube
- [ ] Second source-code change deployed
- [ ] Screenshots and short report collected

## Limitations

This is a sample project to satisfy the project-source and pipeline structure in the CCA 2 guide. The Jenkins-to-Minikube deployment works only after the AWS/Jenkins host is configured with a reachable Minikube cluster and the required tools/permissions. This is a static frontend and has no database or backend connection.
