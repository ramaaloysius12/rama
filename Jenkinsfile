pipeline {
    agent any

    environment {
        // Ganti dengan username Docker Hub Anda
        DOCKER_USER = 'username_dockerhub_anda'
        IMAGE_NAME = "${DOCKER_USER}/islam-kaffah-app"
        // Menggunakan nomor build Jenkins agar setiap rilis punya tag unik
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Mengambil kode terbaru dari GitHub...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Mulai merakit Docker Image...'
                // Merakit dengan dua tag: 'latest' dan versi build spesifik
                sh 'docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${IMAGE_TAG} .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Mengirim Image ke Docker Hub...'
                // 'dockerhub-creds' adalah ID Credentials yang harus Anda buat di Jenkins
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push ${IMAGE_NAME}:latest'
                    sh 'docker push ${IMAGE_NAME}:${IMAGE_TAG}'
                }
            }
        }

        stage('Deploy (Update Container)') {
            steps {
                echo 'Memperbarui container menggunakan Docker Compose...'
                // Memastikan menggunakan image terbaru dari Docker Hub
                sh 'sed -i "s|image: islam-kaffah-app|image: ${IMAGE_NAME}:latest|g" docker-compose.yml'
                sh 'docker compose pull'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '🚀 CI/CD Pipeline Selesai! Website sudah diperbarui.'
        }
        failure {
            echo '❌ Pipeline Gagal. Silakan periksa log Jenkins (Console Output).'
        }
    }
}
