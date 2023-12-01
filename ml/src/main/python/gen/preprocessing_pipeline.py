import pandas as pd
from sklearn.preprocessing import StandardScaler
import numpy as np
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv('')

x = df.drop('label')
y = df['label'] # 1, 0


###### ASSUMING we have columns as: int, float, categorical/object (yet to figure out last bit)

data = []

# SEGREGATE COLS

num_cols = []
for i in data.columns[(data.dtypes == 'int64') | (data.dtypes == 'float64')]:
    num_cols.append(i)

cat_cols = []
for i in data.columns[(data.dtypes == 'object') | (data.dtypes == 'category')]:
    cat_cols.append(i)


threshold_cardinality = 25
# HANDLE CATEGORICAL COLUMNS

for i in cat_cols:
    data[i] = data[i].astype('category')

one_hot = []
for i in cat_cols:
    if data[i].nunique > threshold_cardinality:
        ... #################################################################################################################################################
    else:
        one_hot.append(i)


# ONE HOT ENCODE

data = pd.get_dummies(data, drop_first = True, dtype = int)
    

# SCALE NUMERIC

for i in num_cols:
    scaler = StandardScaler()
    scaler.fit_transform(data[i]) # scaler.transform(test data)


data_train, y_train = [], []
threshold_dimensionality = 200
# HANDLE HIGH DIMENSIONALITY

if len(data.columns) > threshold_dimensionality:
    feature_names = [f"Feature_{i}" for i in range(data.shape[1])] 

    rf = RandomForestClassifier()
    rf.fit(data_train, y_train)
    feature_importances = rf.feature_importances_
    mean_importance = np.mean(feature_importances)
    selected_features_indices = np.where(feature_importances > mean_importance)[0]
    selected_feature_names = [feature_names[i] for i in selected_features_indices]

final_data = data[selected_feature_names]


# MODEL MAKING

...