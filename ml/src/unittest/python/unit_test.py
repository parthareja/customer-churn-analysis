import unittest
# from //ml//src//main//python//pipelining//preprocessing.py import Preprocessing
import pandas as pd
import sys
import os
sys.path.append("./ml/src/main/python/pipelining")
from preprocessing import DropColumnTransformerTrain
from preprocessing import DropColumnTransformerInference
from preprocessing import Preprocessing
from preprocessing import DtypeTransformer
from preprocessing import RemoveNullTransformer
from preprocessing import DataTransformerTrain
from preprocessing import DataTransformerInference
from preprocessing import OneHotEncoder
from preprocessing import TrainValSplitter
from dotenv import load_dotenv
import os
import numpy as np

load_dotenv(".env")



class Preprocessingtest(unittest.TestCase):
    df= pd.read_excel(os.getenv("BASE_DATASET_PATH"))
    drop_columns_obj_train=DropColumnTransformerTrain()
    drop_columns_obj_infer=DropColumnTransformerInference()
    d_type_obj=DtypeTransformer()
    remove_null_obj=RemoveNullTransformer()
    data_transform_train=DataTransformerTrain()
    data_transform_infer=DataTransformerInference()
    data_one_hot_encode=OneHotEncoder()
    train_val_split=TrainValSplitter()
    
    def test_drop_columns_train(self):
        train_df_test=self.df.iloc[[0]]
        self.assertListEqual(list(train_df_test.drop(columns=[
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

        ]).columns),
        list((self.drop_columns_obj_train.fit_transform(train_df_test)).columns))


    def test_drop_columns_inference(self):
        test_df_test=self.df.iloc[[0]]
        test_df_test.drop(columns=["Churn Value", "Churn Label", "Churn Reason"],inplace=True)
        self.assertListEqual(list(test_df_test.drop(columns=[
            "Latitude",
            "Longitude",
            "Lat Long",
            "Country",
            "State",
            "Count",
            "City",
            "CustomerID",
        ]).columns),
        list((self.drop_columns_obj_infer.transform(test_df_test)).columns))
    
    def test_dtypes(self):
        for i in range (0,5):
            self.assertEqual(np.float64,type(self.d_type_obj.fit_transform(self.df.iloc[i])["Total Charges"]))
    

    def test_remove_null(self):
        null_df = self.df.iloc[[0]]
        null_df = null_df.replace(108.15, np.NaN)
        self.assertEqual(0,(self.remove_null_obj.fit_transform(null_df))["Total Charges"].isnull().sum())

    
    def test_data_transform_train(self):
        test_df1=self.df[(self.df["Multiple Lines"]=="No phone service") | (self.df["Online Security"]=="No internet service") ]
        
        self.assertEqual(0,len(test_df1[self.data_transform_train.fit_transform(test_df1)["Multiple Lines"]=="No phone service"]))
        self.assertEqual(0,len(test_df1[self.data_transform_train.fit_transform(test_df1)["Online Security"]=="No internet service"]))
        self.assertEqual(0,len(test_df1[self.data_transform_train.fit_transform(test_df1)["Churn Label"]=="Yes"]))

    def test_data_transform_inference(self):
        test_df1=self.df[(self.df["Multiple Lines"]=="No phone service") | (self.df["Online Security"]=="No internet service")]
        print(test_df1[self.data_transform_infer.fit_transform(test_df1)["Multiple Lines"]=="No phone service"])
        self.assertEqual(0,len(test_df1[self.data_transform_infer.fit_transform(test_df1)["Multiple Lines"]=="No phone service"]))
    
    def test_data_one_hot_encoder(self):
        self.assertLess(len(self.df.columns),len((self.data_one_hot_encode.fit_transform(self.df)).columns))


    def test_train_val_splitter(self):
        train_df, validation_df = self.train_val_split.fit_transform(self.df)
        self.assertLessEqual(self.df.shape[0]*(float(os.getenv("VALIDATION_SPLIT_SIZE"))),validation_df.shape[0])







        
    
         
# p=Preprocessingtest()
# print(p.dtypes())
unittest.main()