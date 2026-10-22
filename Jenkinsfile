pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
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
                    echo "Frontend file and title checks passed"
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
                sh '''
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin
                    docker push $IMAGE_NAME:$BUILD_NUMBER
                    docker push $IMAGE_NAME:latest
                    docker logout
                '''
            }
        }

        stage('Deploy to Minikube') {
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

    post {
        always {
            sh 'docker logout || true'
        }
    }
}
