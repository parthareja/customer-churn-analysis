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
		dir("client-side"){
			sh 'pwd'	
			sh 'npm install'
		}

		dir("server-side"){
			sh 'pwd'
			sh 'npm install'
		}
            }
        }
    }
}
