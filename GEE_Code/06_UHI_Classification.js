// Project 2: Urban Heat Island Mapping
// Step 6: UHI Classification

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

// Calculate LST
var lst = image
  .select("ST_B10")
  .multiply(0.00341802)
  .add(149.0)
  .subtract(273.15)
  .rename("LST");

// UHI Classification
// UHI Classification
var uhi = lst
  .expression(
    "(b('LST') < 35) ? 1" +
      ": (b('LST') < 40) ? 2" +
      ": (b('LST') < 45) ? 3" +
      ": (b('LST') < 50) ? 4" +
      ": 5",
  )
  .rename("UHI")
  .clip(pune);

// Visualization
var uhiVis = {
  min: 1,
  max: 5,
  palette: ["blue", "green", "yellow", "orange", "red"],
};

// Display
Map.centerObject(pune, 9);
Map.addLayer(uhi, uhiVis, "Urban Heat Island Zones");

// Print
print("UHI Classification:", uhi);

Export.image.toDrive({
  image: uhi,
  description: "Pune_UHI_Classes",
  folder: "ISA_Project2",
  fileNamePrefix: "Pune_UHI_Classes",
  region: pune.geometry(),
  scale: 30,
  maxPixels: 1e13,
});
