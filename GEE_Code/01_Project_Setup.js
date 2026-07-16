// Project 2: Urban Heat Island Mapping
// Study Area: Pune District

// Load district boundaries
var districts = ee.FeatureCollection("FAO/GAUL/2015/level2");

// Select Pune district
var pune = districts
  .filter(ee.Filter.eq("ADM2_NAME", "Pune"))
  .filter(ee.Filter.eq("ADM0_NAME", "India"));

// Center map on Pune
Map.centerObject(pune, 9);

// Display Pune boundary
Map.addLayer(pune, { color: "red" }, "Pune District");

// Print AOI information
print("Pune District AOI:", pune);
