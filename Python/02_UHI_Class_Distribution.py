import rasterio
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Open UHI raster
with rasterio.open("../Raster_Data/Pune_UHI_2024.tif") as src:
    uhi = src.read(1)

# Remove NoData values
valid = uhi[uhi > 0]

# Count pixels in each class
classes = [1, 2, 3, 4, 5]
counts = []

for c in classes:
    counts.append(np.sum(valid == c))

# Convert to percentage
total = np.sum(counts)
percentages = [(c / total) * 100 for c in counts]

# Create dataframe
df = pd.DataFrame({
    "Class": [
        "Very Low",
        "Low",
        "Moderate",
        "High",
        "Very High"
    ],
    "Percentage": percentages
})

print(df)

# Plot chart
plt.figure(figsize=(8,5))
plt.bar(df["Class"], df["Percentage"])

plt.title("UHI Class Distribution")
plt.xlabel("UHI Classes")
plt.ylabel("Area Percentage (%)")

plt.tight_layout()

plt.savefig("UHI_Class_Distribution.png", dpi=300)
plt.show()