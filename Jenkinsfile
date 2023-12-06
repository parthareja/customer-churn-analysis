pipeline {
    
    agent none

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'python:3.9-bookworm' 
                    args '-p 3000:3000 -u root:root'
                }
            }
            steps {

                dir ("ml"){
                    sh 'pwd'
                    // sh 'apk add --no-cache su-exec'
                    // // sh 'sudo apt update'
                    // // sh "apt install sudo"
                    // sh "apt update"
                    // sh 'apt install -y python3-pip'
                    // sh 'pip3 install -r requirements.txt'
                    
                }
            }
        }
	    stage('Test') {
            agent {
                docker {
                    image 'python:3.9-bookworm' 
                    args '-p 3000:3000 -u root:root'
                }
            }
            steps {
                dir ("ml"){
                    sh 'pwd'
                    // sh 'apk add --no-cache su-exec'
                    // // sh 'sudo apt update'
                    // // sh "apt install sudo"
                    sh "apt update"
                    sh 'apt install -y python3-pip'
                    sh 'pip3 install -r requirements.txt'
                    
                }
                script {
                    try {
                        sh 'pwd'
                        sh 'python ml/src/unittest/python/unit_test.py'
                    } catch (Exception testException) {
                        currentBuild.result = 'FAILURE'
                        throw testException
                    }
                }
            }
        }

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
                        // sh "ls"
                        sh "docker compose up -d"
                        // Wait for the web app to start
                        // sleep time: 30, unit: 'SECONDS'
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
    post {
        failure {
            node('master'){
                script {
                    echo 'Before email notification'
    
                    // Stop and remove the Docker container
                    sh 'docker stop ${DOCKER_CONTAINER_NAME} || true'
                    sh 'docker rm ${DOCKER_CONTAINER_NAME} || true'
    
                    // Send email notification with web app URL and failure details
                    emailext subject: "Web App Build and Test Results - ${currentBuild.result}",
                        body: """
                        See Jenkins console output for details.
    
                        Web App URL: http://your-jenkins-server:8080
    
                        Failure Details:
                        - Build: ${currentBuild.result == 'FAILURE' ? 'Failed' : 'Successful'}
                        - Unit Test: ${currentBuild.result == 'FAILURE' ? 'Failed' : 'Successful'}
                        - Deployment: ${currentBuild.result == 'FAILURE' ? 'Failed' : 'Successful'}
                        """,
                        recipientProviders: [
                            [$class: 'CulpritsRecipientProvider'],
                            [$class: 'DevelopersRecipientProvider'],
                            [$class: 'RequesterRecipientProvider']
                        ],
                        replyTo: '$DEFAULT_REPLYTO',
                        to: '$DEFAULT_RECIPIENTS'
    
                    echo 'After email notification'
                }
            }
        }
    }
}

