
var storyStep = 0;
var storyStepInProgress = false;

function story(){
    if (storyStepInProgress){
        return;
    }
    switch(storyStep++){
        case 0: 
            storyStepInProgress = true;
            map.flyTo([51.095108, 4.133528], 18, {
                duration: 3
            });
            storyStepInProgress = false;
            break;
        case 1:
            storyStepInProgress = true;
            heatMap.setOptions({lineWidth: 5, globalAlpha: 0.095})
            storyFilter1();
            storyStepInProgress = false;
            break;
        case 2:
            storyStepInProgress = true;
            storyFilter2();
            storyStepInProgress = false;
            break;
        case 3:
            storyStepInProgress = true;
            Filter.noFilter();
            CartoDB_Positron.removeFrom(map);
            OpenStreetMap_BlackAndWhite.addTo(map);
            storyStepInProgress = false;
        default:
            return;
    }
}


function storyFilter1(){
    // Everything but the early routes
    Filter.filterAccepted((d)=>{
            return (d.properties.STARTTIMEDATE.getHours() >= 7 && d.properties.STARTTIMEDATE.getHours() <= 9); 
    });
}

function storyFilter2(){
    // Only the early routes
    Filter.filterAccepted((d)=>{
            return !(d.properties.STARTTIMEDATE.getHours() >= 7 && d.properties.STARTTIMEDATE.getHours() <= 9); 
    });
}

function storyFilter3(){
    var home = [51.095238002418185, 4.133621995989944];
    Filter.startNear(home, 200);
}

function storyFilter4(){
    var home = [51.095238002418185, 4.133621995989944];
    Filter.stopNear(home, 200);
}