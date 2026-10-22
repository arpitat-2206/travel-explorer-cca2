
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'adityakarmalkar/travel-explorer'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                sh '''
                    test -s index.html
                    test -s style.css
                    test -s script.js
                    grep -q "<title>Travel Explorer</title>" index.html
                    echo "Frontend checks passed"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER -t $IMAGE_NAME:latest .'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
                    sh '''
                        echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $IMAGE_NAME:$BUILD_NUMBER
                        docker push $IMAGE_NAME:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl set image deployment/travel-explorer travel-explorer=$IMAGE_NAME:$BUILD_NUMBER
                    kubectl rollout status deployment/travel-explorer --timeout=180s
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    kubectl get pods
                    kubectl get deployment travel-explorer
                    kubectl get service travel-explorer
                '''
            }
        }
    }
}
