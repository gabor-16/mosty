//        Maθ.π
const π = Math.PI




// //////////////////////////////////////////////////////////////////////
// NUMBER MANIPULATION
// //////////////////////////////////////////////////////////////////////

// rounds a float n to the nearest n/ROUNDACCURACY float value
const ROUNDACCURACY = 100000
function round(number, accuracy = ROUNDACCURACY) {
    return Math.round((number + Number.EPSILON) * accuracy) / accuracy
}



// //////////////////////////////////////////////////////////////////////
// 2D GEOMETRY
// //////////////////////////////////////////////////////////////////////

// funcions assume points as tuples (2-arrays) of coordinates

function pointDistance(p0, p1) {
    return Math.sqrt((p0[0] - p1[0])**2 + (p0[1] - p1[1])**2)
}
