pipeline {
    agent any
    
    environment {
        // Nome da imagem Docker
        IMAGE_NAME = 'kawansilva/meusite'
        BUILD_ID = 'latest'
        // As credenciais do Docker Hub configuradas no Jenkins
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        // Chave SSH configurada no Jenkins para deploy
        SSH_CREDENTIALS_ID = 'ssh-key-id'
        // Usuário SSH
        REMOTE_USER = 'ubuntu'
        // IP ou hostname do servidor onde o container será rodado
        REMOTE_HOST = '144.22.168.42'
    }

    stages {
        stage('Checkout') {
            steps {
                // Clona o repositório do GitHub com o código do site
                git url: 'https://github.com/ksilva-kwn/website-pipeline.git', branch: 'main'
            }
        }
      
        stage('Build Docker Image') {
            steps {
                script {
                    // Constrói a imagem Docker do site
                    sh 'docker build -t $IMAGE_NAME:$BUILD_ID .'
                    sh 'docker tag $IMAGE_NAME:$BUILD_ID $IMAGE_NAME:latest'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Faz login no Docker Hub e envia a imagem
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                        sh "docker push $IMAGE_NAME:latest"
                    }
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                script {
                    // Conecta via SSH e faz deploy no servidor remoto
                    sshagent([SSH_CREDENTIALS_ID]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST '
                            docker stop meu_site || true &&
                            docker rm meu_site || true &&
                            docker pull $IMAGE_NAME:latest &&
                            docker run -dit --name meu_site -p 80:80 --restart always $IMAGE_NAME:latest
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Limpa o workspace após a execução do pipeline
            cleanWs()
        }
    }
}
