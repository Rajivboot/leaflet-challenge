  // Adding the tile layer
var map1 =  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
 
var map2 = 
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL'
  });


// Creating the map object
var myMap = L.map("map", {
    center: [40.7, -94.95],
    zoom: 3,
    layers: [map1,map2]
  });
map1.addTo(myMap)  
// creating ctrl to choose the map
var mapfolder ={
    'Grey Map': map2,
    'Color Map' : map1
}

L.control.layers(mapfolder). addTo(myMap) 

  // Load the GeoJSON data.
var geoDatajson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Get the data with d3.
d3.json(geoDatajson).then(function(data) {
    function colormarker(feature){
        var depth=feature.geometry.coordinates[2]
        if (depth > 90 ) return "red";
else if (depth > 70) return "#B8860B";
else if (depth > 50) return "#DAA520";
else if (depth > 30) return "#F4A460";
else if (depth > 10) return "#BC8F8F";
else return "#D2B48C";
        }   

//Use leaflet to create markers
L.geoJson(data,{ 
    style: function(feature) {
        return {
            radius: feature.properties.mag*3,
            stroke: 0, 
            fillOpacity: 0.8,   
            fillColor: colormarker (feature)
        }
    },
    //instead of having generic marker you get circle marker
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    //adds textbox when u click on the marker
    onEachFeature: function(feature, layer) {
        return layer.bindPopup(feature.properties.place)
    }
}).addTo(myMap)
    //console.log(data)

//creating legend
var legend = L.control( {position:"bottomright"} )
legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'); 
    var dev = ['-10-10', '10-30','30-50','50-70', '70-90', '90+'] 
    var colors = ['#D2B48C','#BC8F8F','#F4A460', '#DAA520', '#B8860B', 'red']
    for (var i = 0; i < dev.length; i++) {
            div.innerHTML += 
                '<p><i style="background:' + colors[i] + '"></i> ' + dev [i] +'</p>';}
    return div
    }
legend.addTo(myMap)
})