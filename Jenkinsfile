pipeline {
    agent {
        docker {
            image 'node:20.9.0-alpine3.18' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
		sh 'cd client-side'
                sh 'npm install'
		sh 'cd ../server-side'
		sh 'npm install'
            }
        }
    }
}
