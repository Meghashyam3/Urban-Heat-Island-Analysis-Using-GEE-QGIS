// Project 2: Urban Heat Island Mapping
// Step 5: NDBI Analysis using Sentinel-2

// Load Pune District
var districts = ee.FeatureCollection("FAO/GAUL/2015/level2");

var pune = districts
  .filter(ee.Filter.eq("ADM2_NAME", "Pune"))
  .filter(ee.Filter.eq("ADM0_NAME", "India"));

// Load Sentinel-2 Surface Reflectance
var s2 = ee
  .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(pune)
  .filterDate("2024-03-01", "2024-05-31")
  .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 10));

// Create Composite
var image = s2.median().clip(pune);

// Calculate NDBI
var ndbi = image.normalizedDifference(["B11", "B8"]).rename("NDBI");

// Center Map
Map.centerObject(pune, 9);

// NDBI Visualization
var ndbiVis = {
  min: -0.5,
  max: 0.5,
  palette: ["green", "yellow", "red"],
};

// Add Layer
Map.addLayer(ndbi, ndbiVis, "NDBI");

// Print Information
print("NDBI Layer:", ndbi);

Export.image.toDrive({
  image: ndbi,
  description: "Pune_NDBI",
  folder: "ISA_Project2",
  fileNamePrefix: "Pune_NDBI",
  region: pune.geometry(),
  scale: 30,
  maxPixels: 1e13,
});
