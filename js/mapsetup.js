map = L.map('map').setView([51.260197, 4.402771], 10);

// L.tileLayer(
//         "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         {
//             maxZoom: 19
//         }
// ).addTo(map);

// var Wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
//     attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
//     minZoom: 1,
//     maxZoom: 18
// });

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
});

var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

CartoDB_Positron.addTo(map);

L.tileLayer(
        "http://tiles.arcgis.com/tiles/1KSVSmnHT2Lw9ea6/arcgis/rest/services/basemap_stadsplan_v6/MapServer/tile/{z}/{y}/{x}",
        {
            maxZoom: 19,
            bounds: [
                //= the size of Antwerp
                [51.150,4.225],
                [51.400,4.500]
            ]
        }
).addTo(map);


// var data = omnivore.kml('http://datasets.antwerpen.be/v4/public/gis/zone30.kml')
//     .on('ready', function() {
//         map.fitBounds(data.getBounds(), {padding: [20, 20]});

//         data.eachLayer(function(layer) {
//             var popup = "<strong>" + layer.feature.properties.name + "</strong>\n";
//             var description = layer.feature.properties.description;

//             if (description) {
//                 popup += description;
//             }

//             layer.bindPopup(popup);
//         });
//     })
//     .addTo(map);

// var data = omnivore.kml('http://datasets.antwerpen.be/v4/public/gis/cyclingchallenge.kml')
//     .on('ready', function() {
//         map.fitBounds(data.getBounds(), {padding: [20, 20]});

//         data.eachLayer(function(layer) {
//             var popup = "<strong>" + layer.feature.properties.name + "</strong>\n";
//             var description = layer.feature.properties.description;

//             if (description) {
//                 popup += description;
//             }

//             layer.bindPopup(popup);
//         });
//     })
//     .addTo(map);
heatMap = L.heatLayer();


