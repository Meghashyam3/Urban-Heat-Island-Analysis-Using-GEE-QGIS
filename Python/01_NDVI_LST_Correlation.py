import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load CSV
df = pd.read_csv("Pune_NDVI_LST_Samples.csv")

# Keep only valid values
df = df[['NDVI', 'LST']].dropna()

# Calculate correlation
corr = df['NDVI'].corr(df['LST'])

print("\nCorrelation Coefficient:")
print(corr)

# Scatter Plot
plt.figure(figsize=(8,6))
plt.scatter(df['NDVI'], df['LST'], alpha=0.5)

plt.xlabel("NDVI")
plt.ylabel("Land Surface Temperature (°C)")
plt.title("NDVI vs LST Correlation - Pune District")

# Trend line
z = pd.Series(df['LST']).astype(float)
x = pd.Series(df['NDVI']).astype(float)

m, b = np.polyfit(x, z, 1)

plt.plot(x, m*x + b)

plt.grid(True)

plt.savefig("NDVI_LST_ScatterPlot.png", dpi=300)

plt.show()