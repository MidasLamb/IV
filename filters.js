class Filter {

    static filterAccepted(filter){
        heatMap.setRoutes([]);
        filterRoutesBatch(filter, (d) => {
            var routes = [];
            d.each((e) => {
                routes.push(e.geometry.coordinates);
            })
            heatMap.setRoutes(routes);
        });
    }

    static startNear(start, radius){
        heatMap.setRoutes([]);
        Filter.filterAccepted((d)=>{
                var firstC = d.geometry.coordinates[0];
                var distance = latLngDistance(start, firstC);
                return distance < radius; 
            });
    }
    static stopNear(stop, radius){
        heatMap.setRoutes([]);
        Filter.filterAccepted((d)=>{
                var lastC = d.geometry.coordinates[d.geometry.coordinates.length - 1];
                var distance = latLngDistance(stop, lastC);
                return distance < radius; 
            });
    }
    static startOrStopNear(point, radius){
        heatMap.setRoutes([]);
        Filter.filterAccepted((d)=>{
                var firstC = d.geometry.coordinates[d.geometry.coordinates.length - 1];
                var lastC = d.geometry.coordinates[0];
                var distance1 = latLngDistance(point, firstC);
                var distance1 = latLngDistance(point, lastC);
                return (distance1 < radius) || (distance2 < radius); 
            });
    }
}