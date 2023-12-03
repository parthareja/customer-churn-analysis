import os
from pathlib import Path
import pandas as pd
from preprocessing import Preprocessing
from dotenv import load_dotenv
import pickle

load_dotenv(".env")


class Inference(Preprocessing):
    def __init__(self) -> None:
        for root, dirs, files in os.walk(Path(os.getenv("TEST_DATA_PATH"))):
            if len(files) > 1:
                self.test_data_exists = True
                self.dataset = pd.read_excel(
                    Path(os.getenv("TEST_DATA_PATH")) / sorted(files)[-1]
                )
            else:
                self.test_data_exists = False
        for root, dirs, files in os.walk(Path(os.getenv("INFERENCE_DATA_PATH"))):
            if len(files) > 1:
                os.remove(
                    Path(os.getenv("INFERENCE_DATA_PATH")) / "inference_dataset.csv"
                )

    def inference_pipeline(self):
        if self.test_data_exists:
            test_dataset = self.dataset.copy()
            prepocess_pipeline = super().preprocessing_pipeline_inference()
            training_dataset = pd.read_excel(Path(os.getenv("BASE_DATASET_PATH")))

            prepocess_pipeline.fit(X=training_dataset)
            self.dataset = prepocess_pipeline.transform(X=self.dataset)
            for root, dirs, files in os.walk(Path(os.getenv("MODELS_DIR_PATH"))):
                model_file_name = sorted(files)[-1]
            model_file = open(
                Path(os.getenv("MODELS_DIR_PATH")) / model_file_name, "rb"
            )
            model_pickle = pickle.load(model_file)

            xgb_model = model_pickle["model"]
            cls_report = model_pickle["cls_report"]

            preds = xgb_model.predict(self.dataset)

            result_df = pd.DataFrame()
            result_df['Customer ID'] = test_dataset["CustomerID"]
            result_df['Churn Prediction'] = preds


            result_df.to_csv(
                Path(os.getenv("INFERENCE_DATA_PATH")) / "inference_dataset.csv"
            )

            model_file.close()

            for root, dirs, files in os.walk(Path(os.getenv("TEST_DATA_PATH"))):
                os.remove(Path(os.getenv("TEST_DATA_PATH")) / files[-1])

            return self.dataset, cls_report


# inf = Inference()
# df, cls_report = inf.inference_pipeline()
# print(df.head())
# print(df.columns)
