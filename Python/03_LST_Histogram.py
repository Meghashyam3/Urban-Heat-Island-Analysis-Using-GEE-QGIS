import rasterio
import numpy as np
import matplotlib.pyplot as plt

# Open LST raster
with rasterio.open("../Raster_Data/Pune_LST.tif") as src:
    lst = src.read(1)

# Remove invalid values
lst = lst[lst > 0]

# Plot histogram
plt.figure(figsize=(8,5))

plt.hist(lst, bins=30)

plt.title("Land Surface Temperature Distribution")
plt.xlabel("Temperature (°C)")
plt.ylabel("Pixel Count")

plt.tight_layout()

plt.savefig("LST_Histogram.png", dpi=300)
plt.show()