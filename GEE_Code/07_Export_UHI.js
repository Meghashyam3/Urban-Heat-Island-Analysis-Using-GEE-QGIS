// Project 2: Urban Heat Island Mapping
// Step 7: Export UHI Map

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

// Create UHI Classes
var uhi = lst
  .expression(
    "(b('LST') < 35) ? 1" +
      ": (b('LST') < 40) ? 2" +
      ": (b('LST') < 45) ? 3" +
      ": (b('LST') < 50) ? 4" +
      ": 5",
  )
  .rename("UHI")
  .clip(pune)
  .selfMask();

// Display
Map.centerObject(pune, 9);

Map.addLayer(
  uhi,
  {
    min: 1,
    max: 5,
    palette: ["blue", "green", "yellow", "orange", "red"],
  },
  "UHI Zones",
);

// EXPORT TO GOOGLE DRIVE
Export.image.toDrive({
  image: uhi,
  description: "Pune_UHI_2024",
  folder: "EarthEngine",
  fileNamePrefix: "Pune_UHI_2024",
  region: pune.geometry(),
  scale: 30,
  maxPixels: 1e13,
});

print("Export Ready");
