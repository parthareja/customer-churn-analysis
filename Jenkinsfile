pipeline {
    agent {
        docker {
            image 'node:lts-buster' 
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
            sh 'apt update'
            sh 'apt install python3-pip -Y'
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
