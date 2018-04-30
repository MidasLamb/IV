
var participantdata = [];
svg = d3.select("body").append("svg").attr("display", "none");

d3.csv("/data/deelnemers_gegevens.csv", function(data){
    data.forEach((e) => {
        participantdata[e.TripID] = e;
    });
    parseFietsRoutes();
});

function onEachFeature(feature, layer) {
    layer.bindPopup("Start time:" + feature.properties.STARTTIMEDATE + "<br>" + 
                    "Stop time:" + feature.properties.STOPTIMEDATE + "<br>" +
                    "Start coord(lat, lng): [" + feature.geometry.coordinates[0][1] + "," + feature.geometry.coordinates[0][0] + "]" + "<br>" +
                    "<button onclick='Filter.filterSingleRoute(&quot;"+feature.properties.TripID+"&quot;)'>Show only this route</button>");
}

function parseFietsRoutes() {
    d3.json("/data/fiets_routes_CC.geojson", function(data){
            var mystyle = {
                "className": "fiets-route"
            }

            data.features.forEach(element => {
                element.extradata = participantdata[element.properties.TripID]
                element.properties.STARTTIMEDATE = new Date(element.properties.STARTTIME);
                element.properties.STOPTIMEDATE = new Date(element.properties.STOPTIME);
                element.properties.leafletPath = L.geoJson(element, { style: mystyle, onEachFeature: onEachFeature}); // geoJson works with lng lat, instead of other war around.
                element.geometry.coordinates.map((c) => { //Mutating map because we want lat, lng; not lng, lat
                    var or = c[0];
                    c[0] =  c[1]; 
                    c[1] = or;
                });
                heatMap.addRoute(element.geometry.coordinates);
            });

            participantdata = []; //Free up memory

            heatMap.addTo(map);

            // console.log(data);
            var features = data.features;
            svg.selectAll('path')
                .data(features)
                .enter()
                    .append("path")
                    .each((f) => {
                        f.properties.leafletPath.addTo(map);
                    });
            afterData();
    });
}