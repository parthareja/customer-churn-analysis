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
			sh 'yarn install'
		}

		dir("server-side"){
			sh 'pwd'	
			sh 'yarn install'
		}
            }
        }
	stage('Test') {
                 steps {
                     dir("customer-churn-analysis"){
                         sh 'pwd'
                         sh './scripts/test.sh'		
                     }
                 }
	}
    }
}
