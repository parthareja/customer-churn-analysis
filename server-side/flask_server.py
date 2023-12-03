from IPython.display import display
from flask import Flask, jsonify, request as req
import pickle
import sklearn
import os
from pathlib import Path
from dotenv import dotenv_values
import flask_cors
from werkzeug.utils import secure_filename
from time import sleep
import sys


import pandas as pd

sys.path.insert(1, "./ml/src/main/python/pipelining")

from model import ModelTraining
from inference import Inference

config = dotenv_values(".env")
# print("config", config)
# model_file_path = os.getcwd() + "\\rf_model_financial_fraud_detection.pkl"


app = Flask(__name__)
flask_cors.CORS(
    app,
    origins=["http://localhost:8080", "http://localhost:3000"],
    supports_credentials=True,
)

# flask_cors.cross_origin()

# model_file = open(
#     config["MODEL_FILE_PATH"],
#     "rb",
# )
# model = pickle.load(model_file)

# print("prediction", prediction)


@app.route("/flask", methods=["GET"])
# @cross_origin()
def index():
    return "Flask server"


# 22	133722.05	0.0	1295094.74	-133722.05	0.00	True	False


@app.route("/upload_testing", methods=["POST"])
def uploadTesting():
    file = req.files["excel_file"]
    file.save(os.path.join("./ml/src/data/testing_data", secure_filename(file.filename)))
    model = Inference()
    sleep(0.5)
    dataset, report = model.inference_pipeline()
    print(report)
    return jsonify({"result": "saved file on disk"})

@app.route("/upload_incremental", methods=["POST"])
def uploadIncremental():
    file = req.files["excel_file"]
    file.save(os.path.join("./ml/src/data/incremental_data", secure_filename(file.filename)))
    sleep(0.5)
    model = ModelTraining()
    best_model, report = model.training()
    print(report)
    return jsonify({"result": "saved file on disk"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
