pipeline {
    agent {
        docker {
            image 'node:20.9.0-alpine3.18' 
            args '-p 3000:3000' 
        }
    }

    environment{
        DOCKER_USERNAME = 'aman bharega'
        DOCKER_PASSWORD = 'aman bharega'
        DOCKER_IMAGE_NAME = 'aman bharega'
        DOCKER_CONTAINER_NAME = 'aman bahrega'
        PATH = "/usr/local/bin:$PATH"
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
                    {
                        script {
                            try {
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
}
