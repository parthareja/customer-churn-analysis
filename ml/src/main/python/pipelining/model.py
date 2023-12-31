import os
import numpy as np
import pandas
from preprocessing import Preprocessing
from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report
from dotenv import load_dotenv
from pathlib import Path
import pandas as pd
import time
import pickle

load_dotenv(".env")


# In config file
xgb_hyperparams = {
    "max_depth": range(3, 10, 1),
    "n_estimators": range(50, 400, 50),
    "learning_rate": [0.1, 0.01],
}


class ModelTraining(Preprocessing):
    def __init__(
        self,
    ) -> None:
        print(Path(os.getenv("MODELS_DIR_PATH")))
        for root, dirs, files in os.walk(Path(os.getenv("MODELS_DIR_PATH"))):
            if len(files) > 1:
                self.model_exists = True
            else:
                self.model_exists = False

        for root, dirs, files in os.walk(Path(os.getenv("INCREMENTAL_DATA_PATH"))):
            if len(files) > 1:
                self.incremental_data_exists = True
                self.increment_data_file_path = (
                    Path(os.getenv("INCREMENTAL_DATA_PATH")) / sorted(files)[-1]
                )
            else:
                self.incremental_data_exists = False

        self.dataset = pd.read_excel(Path(os.getenv("BASE_DATASET_PATH")))

        if self.incremental_data_exists:
            print(self.increment_data_file_path)
            self.incremental_dataset = pd.read_excel(self.increment_data_file_path)
            self.dataset = pd.concat([self.dataset, self.incremental_dataset])
            os.remove(Path(os.getenv("BASE_DATASET_PATH")))
            self.dataset.to_excel(Path(os.getenv("BASE_DATASET_PATH")))
            os.remove(self.increment_data_file_path)

    def training(self):
        if self.model_exists and self.incremental_data_exists == False:
            return

        elif self.model_exists == False or (
            self.model_exists and self.incremental_data_exists
        ):
            prepocess_pipeline = super().preprocessing_pipeline_training()
            train_df, validation_df = prepocess_pipeline.fit_transform(self.dataset)
            x_train = train_df.drop(columns=[os.getenv("TARGET_COLUMN")])
            y_train = train_df[os.getenv("TARGET_COLUMN")]
            x_validation = validation_df.drop(columns=[os.getenv("TARGET_COLUMN")])
            y_validation = validation_df[os.getenv("TARGET_COLUMN")]

            xgb = XGBClassifier()

            xgb_hyperparams = {
                "max_depth": range(4, 10, 2),
                "n_estimators": range(100, 400, 100),
                "learning_rate": [0.01],
            }
            xgb_grid_search = GridSearchCV(
                estimator=xgb,
                param_grid=xgb_hyperparams,
                scoring="roc_auc",
                n_jobs=10,
                cv=10,
                verbose=True,
            )
            start_time = time.time()

            xgb_grid_search.fit(x_train, y_train)

            xgb_best = xgb_grid_search.best_estimator_
            xgb_best.fit(x_train, y_train)

            preds = xgb_best.predict(x_validation)
            cls_report = classification_report(preds, y_validation, output_dict=True)

            pickle_dump = {
                "model": xgb_best,
                "cls_report": cls_report,
                "model_train_timestamp": time.time(),
            }
            pickle.dump(
                pickle_dump,
                open(
                    Path(os.getenv("MODELS_DIR_PATH")) / f"model_{time.time()}.pickle",
                    "wb",
                ),
            )

            end_time = time.time()
            total_training_time = end_time - start_time
            print("Total model training time in minutes: ", total_training_time / 60)

            return xgb_best, cls_report, total_training_time


# model = ModelTraining()
# model.training()
