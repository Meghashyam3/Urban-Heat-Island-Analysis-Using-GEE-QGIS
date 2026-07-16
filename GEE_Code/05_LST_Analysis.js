// Project 2: Urban Heat Island Mapping
// Step 6: Land Surface Temperature (LST)

// Load Pune District
var districts = ee.FeatureCollection("FAO/GAUL/2015/level2");

var pune = districts
  .filter(ee.Filter.eq("ADM2_NAME", "Pune"))
  .filter(ee.Filter.eq("ADM0_NAME", "India"));

// Load Landsat 8 Collection 2 Level 2
var landsat = ee
  .ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(pune)
  .filterDate("2024-03-01", "2024-05-31")
  .filter(ee.Filter.lt("CLOUD_COVER", 10));

// Create Composite
var image = landsat.median().clip(pune);

// Surface Temperature Band
var lst = image
  .select("ST_B10")
  .multiply(0.00341802)
  .add(149.0)
  .subtract(273.15)
  .rename("LST");

// Center Map
Map.centerObject(pune, 9);

// LST Visualization
var lstVis = {
  min: 25,
  max: 70,
  palette: ["blue", "cyan", "yellow", "orange", "red"],
};

// Display LST
Map.addLayer(lst, lstVis, "Land Surface Temperature");

// Print Information
print("LST Layer:", lst);

// Temperature Statistics
var stats = lst.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: pune,
  scale: 30,
  maxPixels: 1e13,
});

var meanStats = lst.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: pune,
  scale: 30,
  maxPixels: 1e13,
});

print("Mean LST:", meanStats);

print("LST Statistics:", stats);

Export.image.toDrive({
  image: lst,
  description: "Pune_LST",
  folder: "ISA_Project2",
  fileNamePrefix: "Pune_LST",
  region: pune.geometry(),
  scale: 30,
  maxPixels: 1e13,
});
