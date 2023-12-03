from IPython.display import display
from flask import Flask, jsonify, request as req, send_file, make_response
import pickle
import sklearn
import os
from pathlib import Path
from dotenv import dotenv_values
import flask_cors
from werkzeug.utils import secure_filename
from time import sleep
import sys
from dotenv import load_dotenv
import json

import pandas as pd

sys.path.insert(1, "./src/main/python/pipelining")

from model import ModelTraining
from inference import Inference

load_dotenv(".env")
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
    file.save(os.path.join("./src/data/testing_data", secure_filename(file.filename)))
    model = Inference()
    send_dict=dict()
    sleep(0.5)
    dataset, report = model.inference_pipeline()
    print(report)
    # send_dict["csv_file"]= send_file("../../../data/inference_data/inference_dataset.csv",as_attachment=True)
    # send_dict["report"] = report

    # return jsonify({"report": report, "dataset": dataset})
    response = make_response(send_file("../../../data/inference_data/inference_dataset.csv",as_attachment=True))
    response.headers['content-type'] = report
    return response


@app.route("/upload_incremental", methods=["POST"])
def uploadIncremental():
    file = req.files["excel_file"]
    file.save(
        os.path.join("./src/data/incremental_data", secure_filename(file.filename))
    )
    sleep(0.5)
    model = ModelTraining()
    best_model, report, training_time = model.training()
    print(report)
    return jsonify({"report": report, "training_time": training_time})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
