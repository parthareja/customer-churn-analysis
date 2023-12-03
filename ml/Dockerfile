FROM ubuntu:latest

WORKDIR /ml

COPY . .

EXPOSE 3000

RUN apt update

RUN apt install -y python3

RUN apt install -y python3-pip

RUN pip3 install python3-venv

RUN python3 -m venv .venv && source ./.venv/bin/activate

RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "python3", "/src/main/python/flask_server/flask_server.py" ]
