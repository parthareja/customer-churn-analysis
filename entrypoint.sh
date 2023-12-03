#!/bin/bash


cd ./client-side
yarn start

cd ..
python3 ./server-side/flask_server.py
cd ./server-side
yarn start