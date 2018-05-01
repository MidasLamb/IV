class Filter {

    constructor(beginData){
        this.beginData = beginData === undefined ? svg.selectAll('path') : beginData;
        this.currentData = this.beginData;
        this.filters = [];
        this.namedFilters = [];
    }

    addFilter(filter, name) {
        if (name === undefined){
            this.filters.push(filter);
        } else {
            this.namedFilters[name] = filter;
        }
        return this; // For chaining
    }

    removeFilter(filter) {
        var index = this.filters.indexOf(filter);
        if (index > -1) {
            this.filters.splice(index, 1);
        }
        this.currentData = this.beginData;
        return this;
    }

    removeFilterByName(name) {
        delete this.namedFilters[name];
        return this;
    }

    applyFilters() {
        this.currentData = this.beginData.filter((d) => {
            var pass = true;
            this.filters.some((f) => {
                if (!f(d)){
                    pass = false;
                    return true; //return true for early abort.
                }
            });
            for (var key in this.namedFilters){
                if (!this.namedFilters[key](d)){
                    pass = false;
                    break;
                }
            }

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

    static filterStartWithin(lat1, lng1, lat2, lng2){
        var x1 = lat1 < lat2 ? lat1: lat2;
        var x2 = lat1 < lat2 ? lat2: lat1;
        var y1 = lng1 < lng2 ? lng1: lng2;
        var y2 = lng1 < lng2 ? lng2: lng1;

        return (d) => {
            var x = d.geometry.coordinates[0][0];
            var y = d.geometry.coordinates[0][1];
            return x >= x1 && x <= x2 && y >= y1 && y <= y2;
        }

    }

    static filterStopsWithin(lat1, lng1, lat2, lng2){
        var x1 = lat1 < lat2 ? lat1: lat2;
        var x2 = lat1 < lat2 ? lat2: lat1;
        var y1 = lng1 < lng2 ? lng1: lng2;
        var y2 = lng1 < lng2 ? lng2: lng1;

        return (d) => {
            var x = d.geometry.coordinates[d.geometry.coordinates.length - 1][0];
            var y = d.geometry.coordinates[d.geometry.coordinates.length - 1][1];
            return x >= x1 && x <= x2 && y >= y1 && y <= y2;
        }

    }

    static getMinutes(date) { return date.getHours() * 60 + date.getMinutes() }
    
    // time expressed in minutes of the day
    static filterStartsInPeriod(minutesStart, minutesStop) {
        return (d) => Filter.getMinutes(d.properties.STARTTIMEDATE) > minutesStart && 
                           Filter.getMinutes(d.properties.STARTTIMEDATE) < minutesStop;
    }

    static filterStopsInPeriod(minutesStart, minutesStop) {
        return (d) => Filter.getMinutes(d.properties.STOPTIMEDATE) > minutesStart && 
                           Filter.getMinutes(d.properties.STOPTIMEDATE) < minutesStop;
    }

    
}

/*
* Usefull filter functions
*/

function resetHeatmap(){
    new Filter().call(Filter.showRoutes());
}