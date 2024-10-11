pipeline {
    agent any
    
    environment {
        // Nome da imagem Docker
        IMAGE_NAME = 'kawansilva/meusite'
        BUILD_ID = 'latest'
        // As credenciais do Docker Hub configuradas no Jenkins
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        // Chave SSH configurada no Jenkins para deploy
        SSH_CREDENTIALS_ID = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC6WEeSqk0gGjPGGJnPak2nabtSMvdPyWrsDhJDvfohZ9HVELmK3PrcoPNiPxYyiEMYZN9MlfTk1pF6/DQ0wVXMvpMLmMtSifEpcK0WmdyLrduSUvJIv7EFjgjlAZYrKCZESjox229o5dvNSu/JCLgAgZjccrqoqIuYJWWkK0xo/O8qbDt5Q1hotye7sbXNZqElFAwEqBF3FsyrEEP2T2MDz2nVlRJVxlltoyq0/yU/KYdYAg+2nteaP3+gTnyCvTvfyjQm6ZT6tCI9N58ubL4dtKQCedVJuZWrAtKQ6wsZ0BBx2HdWvB31b3bBIcrzkavr7SaaJ3pQUc79MiVttGCUzXgkAoyLE5ayvw7XnqG6ZV4q1jfEFZ4VcTx87E1iRHXSvpSyppUPfA3UJlVF1BYoXZolu+3V0j5f9P586EnD62vVRTQD1+y+FGqxeR9jO0Bf4JxJUR51xjw6ncVzYhdxOtznx96FZdiu0KukUOGYTt4fTB1Zjw+z8kmBvfxVaMs= ubuntu@minekube-teste'
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
                    sh 'docker build -t meusite:latest .'
                    sh 'docker tag meusite:$BUILD_ID meusite:latest'
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
                        """ ssh $REMOTE_USER@$REMOTE_HOST '
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
