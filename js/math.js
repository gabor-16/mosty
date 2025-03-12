const π = Math.PI


// in the game, 1px = 1cm

// //////////////////////////////////////////////////////////////////////
// NUMBER MANIPULATION
// //////////////////////////////////////////////////////////////////////

// rounds a float n to the nearest n/ROUNDACCURACY float value
const ROUNDACCURACY = 100000
function round(number, accuracy = ROUNDACCURACY) {
    return Math.round((number + Number.EPSILON) * accuracy) / accuracy
}



// //////////////////////////////////////////////////////////////////////
// ARRAYS
// //////////////////////////////////////////////////////////////////////



function averageVector(vArray) {
    let vectorSum = [0, 0]
    let l = vArray.length
    if (l === 0) {
        return [0, 0]
    }

    for (let i = 0; i < vArray.length; i++) {
        let v = vArray[i];

        vectorSum[0] += v[0]
        vectorSum[1] += v[1]
    }

    return vectorDiv(vectorSum, l)
}


// //////////////////////////////////////////////////////////////////////
// 2D GEOMETRY
// //////////////////////////////////////////////////////////////////////

// funcions assume points as tuples (2-arrays) of coordinates
// i.e., [0, 0] is represented simply as [0, 0]

function pointDistance(p0, p1) {
    return Math.sqrt((p0[0] - p1[0])**2 + (p0[1] - p1[1])**2)
}

function vectorNeg(v) {
    return [-v[0], -v[1]]
}

function vectorAdd(v0, v1) {
    return [v0[0] + v1[0], v0[1] + v1[1]]
}

// made for car gravity since you have to flip it and y is reversed
function vectorAddReverse(v0, v1){
    return [v0[0] + v1[0], v0[1] - v1[1]]
}

function vectorSub(v0, v1) {
    return vectorAdd(v0, vectorNeg(v1))
}

function vectorMul(scalar = 2, v) {
    return [scalar * v[0], scalar * v[1]]
}

function vectorDiv(v, scalar = 2) {
    return [v[0] / scalar, v[1] / scalar]
}

function vectorLength(v) {
    return Math.sqrt(v[0]**2 + v[1]**2)
}

function vectorNormalize(v) {
    let vL = vectorLength(v)
    if (vL === 0) {
        return [0, 0]
    }

    return [v[0] / vL, v[1] / vL]
}

