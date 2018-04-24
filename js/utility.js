
function latLngDistance(c1, c2){ 	
    var R = 6371e3; // metres
    var t1 = toRadians(c1[0]);
    var t2 = toRadians(c2[0]);
    var dt = toRadians((c2[0]-c1[0]));
    var dl = toRadians((c2[1]-c1[1]));

    var a = Math.sin(dt/2) * Math.sin(dt/2) +
            Math.cos(t1) * Math.cos(t2) *
            Math.sin(dl/2) * Math.sin(dl/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}