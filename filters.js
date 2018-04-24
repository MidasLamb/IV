class Filter {

    constructor(beginData){
        this.beginData = beginData === undefined ? svg.selectAll('path') : beginData;
        this.currentData = this.beginData;
        this.filters = [];
    }

    addFilter(filter) {
        this.filters.push(filter);
        return this; // For chaining
    }

    applyFilters() {
        this.currentData = this.currentData.filter((d) => {
            var pass = true;
            this.filters.some((f) => {
                if (!f(d)){
                    pass = false;
                    return true; //return true for early abort.
                }
            });
            return pass;
        });
        return this; //For chaining
    }

    reset() {
        this.filters = [];
        this.currentData = this.beginData;
        return this; //For chaining
    }

    each(a){
        this.currentData.each(a);
    }

    call(a){
        this.currentData.call(a);
    }

    /*
    *   Usefull actions
    */

    static showRoutes(){
        return (d) => {
            var routes = [];
            d.each((e) => {
                routes.push(e.geometry.coordinates);
            });
            heatMap.setRoutes(routes);
        }
    }

    /*
    *   Usefull filters
    */

    static filterStartNear(start, radius){
        return (d)=>{
                var firstC = d.geometry.coordinates[0];
                var distance = latLngDistance(start, firstC);
                return distance < radius; 
            };
    }


    static filterStopNear(stop, radius){
        return (d)=>{
                var lastC = d.geometry.coordinates[d.geometry.coordinates.length - 1];
                var distance = latLngDistance(stop, lastC);
                return distance < radius; 
            };
    }

    static filterStartOrStopNear(point, radius){
        return (d)=>{
                var firstC = d.geometry.coordinates[d.geometry.coordinates.length - 1];
                var lastC = d.geometry.coordinates[0];
                var distance1 = latLngDistance(point, firstC);
                var distance2 = latLngDistance(point, lastC);
                return (distance1 < radius) || (distance2 < radius); 
            };
    }

    static filterSingleRoute(tripID){
        return (d) => {
            return d.properties.TripID == tripID;
        };
    }
}

/*
* Usefull filter functions
*/

function resetHeatmap(){
    new Filter().call(Filter.showRoutes());
}