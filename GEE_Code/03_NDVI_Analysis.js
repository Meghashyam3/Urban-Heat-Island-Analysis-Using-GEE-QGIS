// Project 2: Urban Heat Island Mapping
// Step 4: NDVI Analysis

// Load Pune District
var districts = ee.FeatureCollection("FAO/GAUL/2015/level2");

var pune = districts
  .filter(ee.Filter.eq("ADM2_NAME", "Pune"))
  .filter(ee.Filter.eq("ADM0_NAME", "India"));

// Load Landsat 8
var landsat = ee
  .ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(pune)
  .filterDate("2024-03-01", "2024-05-31")
  .filter(ee.Filter.lt("CLOUD_COVER", 10));

// Create Composite
var image = landsat.median().clip(pune);

// Calculate NDVI
var ndvi = image.normalizedDifference(["SR_B5", "SR_B4"]).rename("NDVI");

// Center Map
Map.centerObject(pune, 9);

// NDVI Visualization
var ndviVis = {
  min: 0,
  max: 0.6,
  palette: ["red", "yellow", "green"],
};

// Add NDVI Layer
Map.addLayer(ndvi, ndviVis, "NDVI");

// Print NDVI Information
print("NDVI Layer:", ndvi);
print(
  "NDVI Min/Max",
  ndvi.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: pune,
    scale: 30,
    maxPixels: 1e13,
  }),
);

Export.image.toDrive({
  image: ndvi,
  description: "Pune_NDVI",
  folder: "ISA_Project2",
  fileNamePrefix: "Pune_NDVI",
  region: pune.geometry(),
  scale: 30,
  maxPixels: 1e13,
});
