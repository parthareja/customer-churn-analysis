pipeline {
    agent {
        docker {
            image 'ubuntu:jammy' 
            args '-p 3000:3000 -u root:root'
        }
    }
    // agent any

    stages {
        stage('Build') { 
            steps {
                // dir("client-side"){
                //     sh 'pwd'	
                //     sh 'yarn install'
                // }

                // dir("server-side"){
                //     sh 'pwd'	
                //     sh 'yarn install'
                // }

                dir ("ml"){
                    sh 'pwd'
                    // sh 'apk add --no-cache su-exec'
                    sh "apt update"
                    // sh 'sudo apt update'
                    // sh "apt install sudo"
                    sh 'apt install -y python3-pip'
                    sh 'pip3 install -r requirements.txt'
                }
            }
        }
	    // stage('Test') {
        //     steps {
        //         script {
        //             try {
        //                 sh 'pwd'
        //                 sh 'python unit_test.py'
        //             } catch (Exception testException) {
        //                 currentBuild.result = 'FAILURE'
        //                 throw testException
        //             }
        //         }
        //     }
        // }

        stage('Deploy') {
            // agent {
            //     docker {
            //         image 'docker:dind' 
            //         args '-p 2376:2376 -u root:root'
            //     }
            // }
            agent any
            steps {
                script {
                    try {
                        echo 'Deploying the application'

                        // Log into Docker
                        // sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"

                        // Build Docker image
                        // sh "docker build -t ${DOCKER_IMAGE_NAME} ."
                        // sh ""
                        // Run Docker container with port exposure
                        // sh "docker run -d -p 8000:5000 --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE_NAME}"
                        sh "pwd"
                        sh "docker compose up ."
                        // Wait for the web app to start
                        sleep time: 30, unit: 'SECONDS'
                        // Print Docker container logs for debugging
                        sh "docker compose logs"
                    } catch (Exception deployException) {
                        currentBuild.result = 'FAILURE'
                        throw deployException
                    }
                }
            }
        }
    }
}
