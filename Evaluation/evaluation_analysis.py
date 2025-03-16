import numpy as np
import pandas as pd
import scipy.stats as stats
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression

# Load data from CSV
df = pd.read_csv("evaluation_data.csv").drop(columns=["Participant"])

# 1. Descriptive Statistics
desc_stats = df.describe()
print("Descriptive Statistics:\n", desc_stats)

# 2. Correlation Analysis
correlation_matrix = df.corr()
print("\nCorrelation Matrix:\n", correlation_matrix)

# 3. Outlier Detection using Z-score
z_scores = np.abs(stats.zscore(df.select_dtypes(include=[np.number])))
outliers = (z_scores > 2.5).sum(axis=0)  # Count of outliers per column
print("\nOutlier Counts Per Column:\n", outliers)

# 4. Clustering Analysis (K-means with 2 clusters)
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
df["Cluster"] = kmeans.fit_predict(df.select_dtypes(include=[np.number]))
print("\nCluster Assignments:\n", df[["Cluster"]])

# 5. Regression Analysis (Predicting Total Time in App)
X = df.drop(columns=["Total Time in App", "Cluster"], errors='ignore')
y = df["Total Time in App"]
regressor = LinearRegression()
regressor.fit(X, y)
r_squared = regressor.score(X, y)
coefficients = dict(zip(X.columns, regressor.coef_))

print("\nRegression Analysis:")
print("R-squared:", r_squared)
print("Feature Coefficients:", coefficients)
