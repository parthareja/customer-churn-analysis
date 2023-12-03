FROM ubuntu:latest

WORKDIR /ml

COPY . .

EXPOSE 3000

RUN apt update

RUN apt install -y python3

RUN apt install -y python3-pip

RUN apt install -y python3.10-venv

RUN python3 -m venv .venv

RUN ["/bin/bash", "-c", "source ./.venv/bin/activate"]

RUN pip install --default-timeout=100 -r requirements.txt

EXPOSE 5000

CMD [ "python3", "./src/main/python/flask_server/flask_server.py" ]
