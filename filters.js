class Filter {

    /**
     * Resets the filter so all routes are back on the map.
     */
    static noFilter(){
        Filter.filterAccepted(() => { return true; });
    }

    /**
     * Function to filter routes, with an action to take place on each of them individually. 
     * @param {(d:any)=>boolean} filter Function that receives a single feature, and returns true if it should be allowed through, or false if not. 
     * @param {(d:any)=>void} filteredaction Function to take action on each filtered data-object. 
     */
    static filterRoutesIndividually(filter, filteredaction){
        svg.selectAll('path').filter(filter).each(filteredaction);
    }

    /**
     * Function to filter routes, with an action to take place on all filtered objects at once. 
     * @param {(*)=>boolean} filter Function that receives a single feature, and returns true if it should be allowed through, or false if not. 
     * @param {(d:[*])=>void} filteredaction Function to take action on all filtered data-objects at once.
     */
    static filterRoutesBatch(filter, filterdaction){
        svg.selectAll('path').filter(filter).call(filterdaction);
    }

    static filterAccepted(filter){
        heatMap.setRoutes([]);
        Filter.filterRoutesBatch(filter, (d) => {
            var routes = [];
            d.each((e) => {
                routes.push(e.geometry.coordinates);
            })
            heatMap.setRoutes(routes);
        });
    }

    /**
     * Only shows the routes which start within radius from start. 
     * @param {[number, number]} start The start coordinate in [lat, lng]  
     * @param {number} radius The radius 
     */
    static startNear(start, radius){
        heatMap.setRoutes([]);
        Filter.filterAccepted((d)=>{
                var firstC = d.geometry.coordinates[0];
                var distance = latLngDistance(start, firstC);
                return distance < radius; 
            });
    }


    /**
     * Only shows the routes which stop within radius from stop. 
     * @param {[number, number]} stop The start coordinate in [lat, lng]  
     * @param {number} radius The radius 
     */
    static stopNear(stop, radius){
        heatMap.setRoutes([]);
        Filter.filterAccepted((d)=>{
                var lastC = d.geometry.coordinates[d.geometry.coordinates.length - 1];
                var distance = latLngDistance(stop, lastC);
                return distance < radius; 
            });
    }

    /**
     * Only shows the routes which start or stop within radius from point. 
     * @param {[number, number]} point The coordinate in [lat, lng]  
     * @param {number} radius The radius 
     */
    static startOrStopNear(point, radius){
        heatMap.setRoutes([]);
        Filter.filterAccepted((d)=>{
                var firstC = d.geometry.coordinates[d.geometry.coordinates.length - 1];
                var lastC = d.geometry.coordinates[0];
                var distance1 = latLngDistance(point, firstC);
                var distance2 = latLngDistance(point, lastC);
                return (distance1 < radius) || (distance2 < radius); 
            });
    }

    static filterSingleRoute(tripID){
        this.filterAccepted((d) => {
            return d.properties.TripID == tripID;
        });
    }
}