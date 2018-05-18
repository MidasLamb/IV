class IndividualRouteController {
    constructor(baseFilter){
        this.baseFilter = baseFilter;
        this.enabled = false;
    }

    enable() {
        this.enabled =true;
        this.showIndividualRoutes();
    }

    disable() {
        this.enabled = false;
        this.hideAllIndividualRoutes();
    }

    showIndividualRoutes(){
        if (!this.enabled){
            return;
        }
        this.baseFilter.eachStartData((d) => {
            var path = d.properties.leafletPath._path;
            path.classList.add("hide");
        });

        this.baseFilter.each((d) => {
            var path = d.properties.leafletPath._path;
            path.classList.remove("hide");
        });
    }

    hideAllIndividualRoutes(){
        this.baseFilter.eachStartData((d) => {
            var path = d.properties.leafletPath._path;
            path.classList.add("hide");
        });
    }



    
}