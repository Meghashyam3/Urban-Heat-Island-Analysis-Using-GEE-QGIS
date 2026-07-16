// Project 2: Urban Heat Island Mapping
// Step 1: Load Pune AOI

var districts = ee.FeatureCollection("FAO/GAUL/2015/level2");

var pune = districts
  .filter(ee.Filter.eq("ADM2_NAME", "Pune"))
  .filter(ee.Filter.eq("ADM0_NAME", "India"));

// Step 2: Load Landsat 8 Collection

var landsat = ee
  .ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(pune)
  .filterDate("2024-03-01", "2024-05-31")
  .filter(ee.Filter.lt("CLOUD_COVER", 10));

// Step 3: Create Median Composite

var image = landsat.median().clip(pune);

// Step 4: Display Pune Boundary

Map.centerObject(pune, 9);

Map.addLayer(
  pune.style({
    color: "red",
    fillColor: "00000000",
    width: 2,
  }),
  {},
  "Pune Boundary",
);

// Step 5: Display True Color Composite

Map.addLayer(
  image,
  {
    bands: ["SR_B4", "SR_B3", "SR_B2"],
    min: 7000,
    max: 18000,
  },
  "True Color",
);

// Step 6: Print Information

print("Number of Images:", landsat.size());
print("Landsat Collection:", landsat);
