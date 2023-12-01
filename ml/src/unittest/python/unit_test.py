import unittest
# from //ml//src//main//python//pipelining//preprocessing.py import Preprocessing
import pandas as pd
import sys
sys.path.append("ml\\src\\main\\python\\pipelining")
from preprocessing import Preprocessing
import numpy as np





class Preprocessingtest(unittest.TestCase):
    df= pd.read_excel("ml\\src\\data\\Telco_customer_churn.xlsx")
    preproc=Preprocessing()
    
    def test_dtypes(self):
        for i in range (0,5):
            self.assertEqual(float,type(self.preproc.dtypes_transformation(self.df.iloc[i])["Total Charges"]))
    

    def test_remove_null(self):
        null_df = self.df.iloc[[0]]

        null_df = null_df.replace(108.15, np.NaN)
        
        self.assertEqual(0,(self.preproc.remove_null(null_df))["Total Charges"].isnull().sum())

    
    def test_data_transform(self):
        test_df1=self.df[self.df["Multiple Lines"]=="No phone service"]
        test_df2=self.df[self.df["Online Security"]=="No internet service"]
        
        self.assertEqual(0,len(test_df1[self.preproc.data_transformation(test_df1)["Multiple Lines"]=="No phone service"]))
        self.assertEqual(0,len(test_df2[self.preproc.data_transformation(test_df2)["Online Security"]=="No internet service"]))
        self.assertEqual(0,len(test_df2[self.preproc.data_transformation(test_df2)["Churn Label"]=="Yes"]))




        
    
         
# p=Preprocessingtest()
# print(p.dtypes())
unittest.main()