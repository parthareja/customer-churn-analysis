import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import chisquare, chi2_contingency
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn import preprocessing
from sklearn.base import BaseEstimator, TransformerMixin
from dotenv import load_dotenv
import os

load_dotenv(".env")


class DropColumnTransformerInference(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        self.columns = []

    def fit(self, X, y=None):
        self.columns = [
            "Latitude",
            "Longitude",
            "Lat Long",
            "Country",
            "State",
            "Churn Value",
            "Count",
            "City",
            "CustomerID",
            "Churn Reason",
        ]
        X = X.drop(columns=self.columns)
        return self

    def transform(self, X):
        self.columns = [
            "Latitude",
            "Longitude",
            "Lat Long",
            "Country",
            "State",
            "Count",
            "City",
            "CustomerID",
        ]
        X = X.drop(columns=self.columns)
        return X


class DropColumnTransformerTrain(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        self.columns = []

    def fit(self, X, y=None):
        self.columns = [
            "Latitude",
            "Longitude",
            "Lat Long",
            "Country",
            "State",
            "Churn Value",
            "Count",
            "City",
            "CustomerID",
            "Churn Reason",
        ]
        return self

    def transform(self, X):
        X = X.drop(columns=self.columns)
        return X


class DtypeTransformer(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        self.column = "Total Charges"

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X[self.column] = pd.to_numeric(X[self.column], errors="coerce")
        return X


class RemoveNullTransformer(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        self.column = "Total Charges"

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.dropna(subset=[self.column])
        return X


class DataTransformerTrain(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        self.replace_column = []

    def fit(self, X, y=None):
        if os.getenv("TARGET_COLUMN") in X.columns:
            self.replace_column = os.getenv("TARGET_COLUMN")
        return self

    def transform(self, X):
        if len(self.replace_column) != 0:
            X[self.replace_column].replace({"Yes": 1, "No": 0}, inplace=True)
        # X.drop(index=X[X["Total Charges"] == " "].index, inplace=True)
        for column in X.columns:
            if "No phone service" in X[column].unique():
                X[column].replace(["No phone service"], ["No"], inplace=True)
            elif "No internet service" in X[column].unique():
                X[column].replace(["No internet service"], ["No"], inplace=True)

        return X


class DataTransformerInference(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        self.replace_column = []

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        # X = X.drop(index=X[X["Total Charges"] == " "].index)
        for column in X.columns:
            if "No phone service" in X[column].unique():
                X[column].replace(["No phone service"], ["No"], inplace=True)
            elif "No internet service" in X[column].unique():
                X[column].replace(["No internet service"], ["No"], inplace=True)

        return X


# class FeatureSelector(BaseEstimator, TransformerMixin):
#     def __init__(
#         self,
#         remove_columns=None,
#         significance_level=float(os.getenv("SIGNIFICANCE_LEVEL")),
#     ) -> None:
#         self.significance_level = significance_level
#         self.columns = remove_columns

#     def fit(self, X, y=None):
#         if os.getenv("TARGET_COLUMN") in X.columns:
#             remove_cols_arr = []
#             for col in X.columns:
#                 if X[col].dtype == "object":
#                     table = pd.crosstab(X[os.getenv("TARGET_COLUMN")], X[col])
#                     stat, pvalue, dof, expec = chi2_contingency(table)
#                     conf = self.significance_level
#                     if pvalue > conf:
#                         remove_cols_arr.append(col)

#             self.columns = remove_cols_arr

#             return self
#         return self

#     def transform(self, X):
#         X.drop(columns=self.columns, inplace=True)
#         return X


class OneHotEncoder(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        super().__init__()

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        dataset = pd.get_dummies(X, drop_first=True, dtype=int)
        return dataset


class TrainValSplitter(BaseEstimator, TransformerMixin):
    def __init__(self) -> None:
        super().__init__()

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if os.getenv("TARGET_COLUMN") in X.columns:
            train_df, validation_df = train_test_split(
                X,
                test_size=float(os.getenv("VALIDATION_SPLIT_SIZE")),
                random_state=int(os.getenv("SEED")),
                stratify=X[os.getenv("TARGET_COLUMN")],
            )
            return train_df, validation_df
        else:
            return X


class Preprocessing:
    def __init__(self) -> None:
        # self.dataset = pd.read_excel(DATASET_PATH)
        self.remove_cols = []
        return

    def preprocessing_pipeline_training(self):
        drop_columns_transformer = DropColumnTransformerTrain()
        remove_null_tranformer = RemoveNullTransformer()
        dtypes_transformer = DtypeTransformer()
        data_transformer = DataTransformerTrain()
        feature_selector = FeatureSelector()
        one_hot_encode_tranformer = OneHotEncoder()
        train_val_splitter = TrainValSplitter()

        preprocessing_pipeline_trainnig = Pipeline(
            [
                ("dropping_columns", drop_columns_transformer),
                ("null_remover", remove_null_tranformer),
                ("data_type_transformation", dtypes_transformer),
                ("data_transformation", data_transformer),
                # ("feature_selector", feature_selector),
                ("one_hot_encoder", one_hot_encode_tranformer),
                ("train_val_splitter", train_val_splitter),
            ]
        )

        return preprocessing_pipeline_trainnig

    def preprocessing_pipeline_inference(self):
        drop_columns_transformer = DropColumnTransformerInference()
        remove_null_tranformer = RemoveNullTransformer()
        dtypes_transformer = DtypeTransformer()
        data_transformer = DataTransformerInference()
        feature_selector = FeatureSelector()
        one_hot_encode_tranformer = OneHotEncoder()
        train_val_splitter = TrainValSplitter()

        preprocessing_pipeline_inference = Pipeline(
            [
                ("dropping_columns", drop_columns_transformer),
                ("null_remover", remove_null_tranformer),
                ("data_type_transformation", dtypes_transformer),
                ("data_transformation", data_transformer),
                # ("feature_selector", feature_selector),
                ("one_hot_encoder", one_hot_encode_tranformer),
            ]
        )

        return preprocessing_pipeline_inference


# df = pd.read_excel(
#     r"D:\NIIT_UNIV\sem7\capstone\churn_analysis\customer-churn-analysis\ml\src\data\Telco_customer_churn.xlsx"
# )
# p = Preprocessing()
# pipel = p.preprocessing_pipeline()
# df1, df2 = pipel.fit_transform(df)
# print(df1.shape, df2.shape)
# print(df1.dtypes)
# # print(df.head())
