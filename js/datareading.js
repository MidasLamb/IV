
var participantdata = [];
var carroutedata = [];
svg = d3.select("body").append("svg").attr("display", "none");

d3.csv("data/deelnemers_gegevens.csv", function(data){
    data.forEach((e) => {
        participantdata[e.TripID] = e;
    });
    parseCarroutes();
});

function parseCarroutes(){
    d3.json("data/carroutes.json", function(data) {
        var routes = data.routes;
        routes.forEach((route) => {
            route.latlng = route.shape.map((e) => {
                var sp = e.split(",");
                return [Number(sp[0]), Number(sp[1])];
            });
            carroutedata[route.tripID] = route; 
        });
        parseFietsRoutes();
    });
}

function featureFilterFunction(tripID){
    baseFilter.beginData.each((d) => {
        d.properties.leafletPath.removeFrom(map);
        d.carroute.leafletPath.removeFrom(map);
    })

    baseFilter.addFilter(Filter.filterTripID(tripID)).applyFilters().each((d) => {
        d.properties.leafletPath.addTo(map);
        d.carroute.leafletPath.addTo(map);
    })
}

function onEachFeature(feature, layer) {
    layer.bindPopup("Start time:" + feature.properties.STARTTIME+ "<br>" + 
                    "Stop time:" + feature.properties.STOPTIME+ "<br>" +
                    "Start coord(lat, lng): [" + feature.geometry.coordinates[0][1] + "," + feature.geometry.coordinates[0][0] + "]" + "<br>" +
                    "<button onclick='featureFilterFunction(&quot;"+feature.properties.TripID+"&quot;)'>Show only this route</button>");
}

function mouseover(f, e){
    f.properties.leafletPath.bringToFront();
    if (f.properties.fasterThanCar){
        f.properties.leafletPath.setStyle({weight: 7, color:"#4286f4"});
    } else {
        f.properties.leafletPath.setStyle({weight: 7, color:"red"});
    }
    f.carroute.leafletPath.addTo(map);
}

function mouseout(f, e) {
    f.carroute.leafletPath.removeFrom(map);
    f.properties.leafletPath.setStyle({weight: 3, color:"orange"});
}


function parseFietsRoutes() {
    d3.json("data/fiets_routes_CC.geojson", function(data){
            var car = {
                className: "car-route",
                interactive: false,
                weight: 3
            }
            var carslower = {
                className: "fiets-route hide",
                color: "orange"
            }
            var carfaster = {
                className: "fiets-route hide",
                color: "orange"
            }

            data.features.forEach(element => {
                element.extradata = participantdata[element.properties.TripID];
                element.carroute = carroutedata[element.properties.TripID];

                element.carroute.leafletPath = L.polyline(element.carroute.latlng, car);
                var style = null;
                if (element.properties.DIFF_TIME*60 <= element.carroute.duration) {
                    element.properties.fasterThanCar = true;
                    style = carslower; 
                } else {
                    element.properties.fasterThanCar = false;
                    style = carfaster;
                }
                element.properties.STARTTIMEDATE = new Date(element.properties.STARTTIME);
                element.properties.STOPTIMEDATE = new Date(element.properties.STOPTIME);
                element.geometry.coordinates.map((c) => { //Mutating map because we want lat, lng; not lng, lat
                    var or = c[0];
                    c[0] =  c[1]; 
                    c[1] = or;
                });
                element.properties.leafletPath = L.polyline(element.geometry.coordinates, style);
                element.properties.leafletPath.on('mouseover', (e) => mouseover(element, e));
                element.properties.leafletPath.on('mouseout', (e) => mouseout(element, e));
                console.log(element);
                element.properties.leafletPath.bindPopup( "Start time: " + element.properties.STARTTIME+ "<br>" + 
                    "Stop time: " + element.properties.STOPTIME+ "<br>" +
                    "Faster than Car: " + (element.properties.fasterThanCar ? "Yes" : "No") + "<br>" +
                    "Sex: " + element.extradata.Sex + "<br>" +
                    "Birth Year: " + element.extradata.Year + "<br>" +
                    "Profession: " + element.extradata.Profession + "<br>" + 
                    "Start coord(lat, lng): [" + element.geometry.coordinates[0][0] + "," + element.geometry.coordinates[0][1] + "]" + "<br>" +
                    "End coord(lat, lng): [" + element.geometry.coordinates[element.geometry.coordinates.length - 1][0] + "," + element.geometry.coordinates[element.geometry.coordinates.length - 1][1] + "]" + "<br>"
                    );
                heatMap.addRoute(element.geometry.coordinates);
            });

            participantdata = undefined; //Free up memory
            carroutedata = undefined;

            heatMap.addTo(map);

            var features = data.features;
            svg.selectAll('path')
                .data(features)
                .enter()
                    .append("path")
                    .each((f) => {
                        f.properties.leafletPath.addTo(map);
                        //f.carroute.leafletPath.addTo(map);
                    });
            afterData();
    });
}