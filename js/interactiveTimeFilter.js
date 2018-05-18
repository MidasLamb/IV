
class InteractiveTimeFilter {

    constructor(baseFilter, filter, callWhenFiltered, whenDone) {
        this.baseFilter = baseFilter === undefined ? new Filter() : baseFilter;
        this.filter = filter === undefined ? Filter.filterStartsInPeriod: filter;
        this.callWhenFiltered = callWhenFiltered === undefined? Filter.updateRoutesAndGraphs() : callWhenFiltered;

        timeSlider.noUiSlider.on('end', (values, handle, unencoded) => {
            this.baseFilter.addFilter(this.filter(unencoded[0], unencoded[1]), 'time').applyFilters().call(this.callWhenFiltered);
        });
    }

    // @param getFilter  a function that given startMin and stopMin returns a filter function
    setFilter(getFilter) {
        this.baseFilter.removeFilterByName('time');
        this.filter = getFilter;
    }

    removeTimeFilter() {
        this.baseFilter.removeFilterByName('time').applyFilters().call(this.callWhenFiltered);
    }

}