import rasterio
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import linregress

# Read NDBI
with rasterio.open("../Raster_Data/Pune_NDBI.tif") as src:
    ndbi = src.read(1)

# Read LST
with rasterio.open("../Raster_Data/Pune_LST.tif") as src:
    lst = src.read(1)

# Flatten arrays
ndbi = ndbi.flatten()
lst = lst.flatten()

# Remove invalid pixels
mask = (~np.isnan(ndbi)) & (~np.isnan(lst))

ndbi = ndbi[mask]
lst = lst[mask]

# Sample points for faster plotting
sample = np.random.choice(
    len(ndbi),
    size=min(5000, len(ndbi)),
    replace=False
)

ndbi_sample = ndbi[sample]
lst_sample = lst[sample]

# Regression
slope, intercept, r, p, std = linregress(ndbi_sample, lst_sample)

# Plot
plt.figure(figsize=(8,6))

plt.scatter(ndbi_sample, lst_sample, alpha=0.4)

x = np.linspace(ndbi_sample.min(), ndbi_sample.max(), 100)
y = slope * x + intercept

plt.plot(x, y)

plt.title("NDBI vs LST")
plt.xlabel("NDBI")
plt.ylabel("LST")

plt.text(
    0.05,
    0.95,
    f"R² = {r**2:.2f}",
    transform=plt.gca().transAxes
)

plt.tight_layout()

plt.savefig("NDBI_LST_ScatterPlot.png", dpi=300)
plt.show()