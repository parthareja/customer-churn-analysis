import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import chisquare, chi2_contingency
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn import preprocessing

## in config file
DATASET_PATH = "ml\src\data\Telco_customer_churn.xlsx"
VALIDATION_SPLIT_SIZE = 0.3
SEED = 42
SIGNIFICANCE_LEVEL = 0.05
TARGET_COLUMN = "Churn Value"


class Preprocessing:
    def __init__(self) -> None:
        # self.dataset = pd.read_excel(DATASET_PATH)
        return

    @staticmethod
    def dtypes_transformation(dataset):
        dataset["Total Charges"] = pd.to_numeric(
            dataset["Total Charges"], errors="coerce"
        )
        return dataset

    @staticmethod
    def remove_null(dataset):
        dataset.dropna(subset=["Total Charges"], inplace=True)
        return dataset

    @staticmethod
    def data_transformation(dataset):
        dataset["Churn Label"].replace({"Yes": 1, "No": 0}, inplace=True)
        dataset.drop(index=dataset[dataset["Total Charges"] == " "].index, inplace=True)
        for column in dataset.columns:
            if "No phone service" in dataset[column].unique():
                dataset[column].replace(["No phone service"], ["No"], inplace=True)
            elif "No internet service" in dataset[column].unique():
                dataset[column].replace(["No internet service"], ["No"], inplace=True)
        return dataset

    @staticmethod
    def feature_selection(dataset):
        remove_cols = []
        for col in dataset.columns:
            if dataset[col].dtype == "object":
                table = pd.crosstab(dataset["Churn Label"], dataset[col])
                stat, pvalue, dof, expec = chi2_contingency(table)
                conf = SIGNIFICANCE_LEVEL
                if pvalue <= conf:
                    # print(col,"is significantly affecting target, P-value=",pvalue)
                    pass
                else:
                    remove_cols.append(col)
                    # print(col, "is useless, P-value=",pvalue)
        dataset.drop(columns=remove_cols, inplace=True)
        return dataset

    @staticmethod
    def train_val_split(dataset):
        if "Churn Label" in dataset.columns:
            train_df, validation_df = train_test_split(
                dataset,
                test_size=VALIDATION_SPLIT_SIZE,
                random_state=SEED,
                stratify=dataset["Churn Value"],
            )
            return train_df, validation_df
        else:
            return dataset

    @staticmethod
    def one_hot_encoder(dataset):
        dataset = pd.get_dummies(dataset, drop_first=True, dtype=int)
        return dataset

    def preprocessing_pipeline(self):
        dtypes_transformer = preprocessing.FunctionTransformer(
            Preprocessing.dtypes_transformation
        )
        remove_null_tranformer = preprocessing.FunctionTransformer(
            Preprocessing.remove_null
        )
        data_transformer = preprocessing.FunctionTransformer(
            Preprocessing.data_transformation
        )
        feature_selector = preprocessing.FunctionTransformer(
            Preprocessing.feature_selection
        )
        train_val_splitter = preprocessing.FunctionTransformer(
            Preprocessing.train_val_split
        )
        one_hot_encode_tranformer = preprocessing.FunctionTransformer(
            Preprocessing.one_hot_encoder
        )
        preprocessing_pipeline = Pipeline(
            [
                ("null_remover", remove_null_tranformer),
                ("data_type_transformation", dtypes_transformer),
                ("data_transformation", data_transformer),
                ("feature_selector", feature_selector),
                ("one_hot_encoder", one_hot_encode_tranformer),
                ("train_val_splitter", train_val_splitter),
            ]
        )

        return preprocessing_pipeline


# p = Preprocessing()
# pipel = p.preprocessing_pipeline()
# # (pipel.fit(df))
# print(pipel.transform(df))
