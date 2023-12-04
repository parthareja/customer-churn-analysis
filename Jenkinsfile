pipeline {
    agent {
        docker {
            image 'node:20.9.0-alpine3.18' 
            args '-p 3000:3000 -u root:root'
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

        dir ("ml"){
            sh 'pwd'
            // sh 'apk add --no-cache su-exec'
            sh 'apk update'
            sh 'apk add py3-pip'
            sh 'pip install -r requirements.txt'
        }
            }
        }
	    stage('Test') {
            steps {
                script {
                    try {
                        sh 'pwd'
                        sh 'python unit_test.py'
                    } catch (Exception testException) {
                        currentBuild.result = 'FAILURE'
                        throw testException
                    }
                }
            }
        }
    }
}
