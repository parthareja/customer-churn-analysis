import pandas as pd
from sklearn.preprocessing import StandardScaler
import numpy as np
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv('')

x = df.drop('label')
y = df['label'] # 1, 0


###### ASSUMING we have columns as: int, float, categorical/object (yet to figure out last bit)
class Preprocessing:
    def __init__(self, data, set_type, threshold_cardinality, threshold_dimensionality):
        self.data = data
        self.y = y
        self.set_type = set_type # 'train' or 'test'
        self.threshold_cardinality = threshold_cardinality
        self.threshold_dimensionality = threshold_dimensionality
    

    def segregate_cols(self): # TRAIN
        num_cols = []
        for i in self.data.columns[(self.data.dtypes == 'int64') | (self.data.dtypes == 'float64')]:
            num_cols.append(i)

        cat_cols = []
        for i in self.data.columns[(self.data.dtypes == 'object') | (self.data.dtypes == 'category')]:
            cat_cols.append(i)
            
        return num_cols, cat_cols

    
    def handle_cat_cols(self, cat_cols): # TRAIN
        for i in cat_cols:
            self.data[i] = self.data[i].astype('category')

        high_card = []
        one_hot = []
        for i in cat_cols:
            if self.data[i].nunique > self.threshold_cardinality:
                high_card.append(i) 
            else:
                one_hot.append(i)

        return high_card, one_hot


    # def handle_high_card_cols(self, high_card);
        # ...
        # return data


    def one_hot_encode(self, one_hot):
        one_hot_encoded_cols = pd.get_dummies(self.data[one_hot], drop_first = True, dtype = int)
        
        data_encoded = pd.concat([self.data, one_hot_encoded_cols], axis=1)
        data_encoded.drop(columns = one_hot, inplace = True)

        return data_encoded


    def scale_num_cols(self, data, num_cols, scaler):
        for i in num_cols:
            scaler = StandardScaler()
            scaler.fit_transform(data[i]) # scaler.transform(test data)

        if self.set_type == 'train':
            scaler = StandardScaler()
            scaler.fit_transform(data[num_cols])

            return data, scaler
        
        elif self.set_type == 'test':
            scaler.transform(data[num_cols])

            return data


    def rf_feature_selection(self, data):
        # chi sq
        # anova

        #then, this:
        if len(data.columns) > self.threshold_dimensionality:
            feature_names = data.columns

            rf = RandomForestClassifier()
            rf.fit(data, self.y)

            feature_importances = rf.feature_importances_
            mean_importance = np.mean(feature_importances)
            selected_features_indices = np.where(feature_importances > mean_importance)[0]
            selected_feature_names = [feature_names[i] for i in selected_features_indices]

            final_data = data[selected_feature_names]

            return final_data, selected_feature_names


    def preprocessing_pipeline(self):
        if self.set_type == 'train':
            num_cols, cat_cols = self.segregate_cols()
            high_card, one_hot = self.handle_cat_cols(cat_cols = cat_cols)
            # data = self.handle_high_card_cols(high_card = high_card)
            data = self.one_hot_encode(one_hot = one_hot)
            data, scaler = self.scale_num_cols(data = data, num_cols = num_cols, scaler = None)
            data, selected_feature_names = self.rf_feature_selection(data = data)

            return data, scaler, selected_feature_names
    
        elif self.set_type == 'test':
            ...






# from sklearn.pipeline import Pipeline


# pipeline = Pipeline([
#     ('segregateCols', SegregateCols()),
#     ('handleCatCols', HanldeCatCols()),
#     ('handleHighCardCols', HandleHighCardCols()),
#     ('oneHotEncode', OneHotEncode()),
#     ('standardScaler', StandardScaler()),
#     ('featureSelection', FeatureSelection()),
#     (),
# ])





# pipeline = Pipeline([
#     ('scaler', StandardScaler()),  # StandardScaler step
#     ('feature_processing', FeatureUnion([
#         ('feature_selector', SelectKBest(score_func=f_classif, k=5)),  # Feature selection step
#         ('drop_lowest_anova', DropLowestAnova(k=2))  # Drop columns with lowest ANOVA scores
#     ]))
# ])







# from sklearn.preprocessing import StandardScaler
# from sklearn.feature_selection import SelectKBest, f_classif
# from sklearn.base import BaseEstimator, TransformerMixin
# from sklearn.model_selection import train_test_split
# import numpy as np

# # Example data (replace this with your dataset)
# X = np.random.rand(100, 10)  # Features
# y = np.random.randint(0, 2, 100)  # Target

# # Splitting the data into train and test sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Custom transformer to drop columns with least ANOVA scores
# class DropLowestAnova(BaseEstimator, TransformerMixin):
#     def __init__(self, k):
#         self.k = k

#     def fit(self, X, y):
#         anova_selector = SelectKBest(score_func=f_classif, k=X.shape[1])
#         anova_selector.fit(X, y)
#         self.feature_indices_ = np.argsort(anova_selector.scores_)[:self.k]
#         return self

#     def transform(self, X):
#         return X[:, self.feature_indices_]

# # Create a pipeline
# pipeline = Pipeline([
#     ('scaler', StandardScaler()),  # StandardScaler step
#     ('feature_processing', FeatureUnion([
#         ('feature_selector', SelectKBest(score_func=f_classif, k=5)),  # Feature selection step
#         ('drop_lowest_anova', DropLowestAnova(k=2))  # Drop columns with lowest ANOVA scores
#     ]))
# ])

# # Fit and transform the pipeline on the training data
# X_train_selected = pipeline.fit_transform(X_train, y_train)

# # Transform the test data
# X_test_selected = pipeline.transform(X_test)
