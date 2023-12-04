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

        dir ("ml"){
            sh 'pwd'
            sh 'apt install python3-pip'
            sh 'pip install requirements.txt'
        }
            }
        }
	    // stage('Test') {
        //         steps {
        //             {
        //                 script {
        //                     try {
        //                         sh 'python unit_test.py'
        //                     } catch (Exception testException) {
        //                         currentBuild.result = 'FAILURE'
        //                         throw testException
        //                     }
        //                 }
        //             }
        //         }
	    // }
    }
}
