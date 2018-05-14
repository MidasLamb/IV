
class InteractiveMapFilter {
    constructor(baseFilter, filter, callWhenFiltered, whenDone) {
        this.disabled = true;
        this.previewRectangle = L.rectangle([[0,0], [0,0]], {color: "red", weight: 2, className: "imf-preview"});

        this.baseFilter = baseFilter === undefined ? new Filter() : baseFilter;
        this.filter = filter === undefined ? Filter.filterStartWithin: filter;
        this.callWhenFiltered = callWhenFiltered === undefined? Filter.updateRoutesAndGraphs() : callWhenFiltered;

        var dragging = false;
        var mousedownlatlng;

        map.on('mousedown', (e)=>{
            if (this.disabled){
                return;
            }
            dragging = true;
            mousedownlatlng = e.latlng;
            this.previewRectangle.setBounds([mousedownlatlng, mousedownlatlng]);
            this.previewRectangle.addTo(map);
        });

        map.on('mousemove', (e) => {
            if ((!dragging) || this.disabled){
                return;
            }
            this.previewRectangle.setBounds([mousedownlatlng, e.latlng]);
        })

        var onMouseUp = (e) => {
            if (this.disabled){
                return;
            }
            this.previewRectangle.setBounds([mousedownlatlng, e.latlng]);
            var x1 = mousedownlatlng.lat;
            var x2 = e.latlng.lat;
            var y1 = mousedownlatlng.lng;
            var y2 = e.latlng.lng;
            dragging = false;
            this.disable();
            this.baseFilter.addFilter(this.filter(x1, y1, x2, y2), "imf").applyFilters().call(this.callWhenFiltered);
        };

        this.previewRectangle.on('mouseup', onMouseUp ); 
        map.on('mouseup', onMouseUp ); 
    }
    
    setWhenDone(whenDone){
        this.whenDone = whenDone;
    }

    // @param filter  a function that returns a filter function given the arguments x1, y1, x2, y2
    setFilter(filter){
        this.baseFilter.removeFilterByName("imf");
        this.filter = filter;
    }

    enable() {
        this.disabled = false;
        map.dragging.disable();
    }

    disable() {
        this.disabled = true;
        map.dragging.enable();
        this.whenDone();
    }

    removeMapFilter(){
        this.baseFilter.removeFilterByName("imf").applyFilters().call(this.callWhenFiltered);
        this.disable();
        this.removePreviewRectangle();
    }

    removePreviewRectangle(){
        this.previewRectangle.removeFrom(map);
    }
}