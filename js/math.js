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

function random(min, max) { // returns an intiger in 〈min, max〉
    return Math.ceil(Math.random() * (max - min)) + min - 1
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

function minAndMax(array) {
    return [Math.min(...array), Math.max(...array)]
}

function checkIfArraysEqual(arr0, arr1) {
    if (arr0.length === arr1.length) {
        return arr0.every((e, i) => {return e === arr1[i]})
    } else {
        return false
    }
}

// /doc/checkIfArrayExistsInArray.png for visual documentation
function checkIfArrayExistsInArray(arrToCheck, arrayElement) {
    return arrToCheck.some((e) => checkIfArraysEqual(e, arrayElement))
}

function addArraysOfArrays(arr0, arr1) {
    let returnArray = [].concat(arr0)

    for (let i = 0; i < arr1.length; i++) {
        if (!checkIfArrayExistsInArray(arr0, arr1[i])) {
            returnArray.push(arr1[i])
        }
    }

    return returnArray
}

function arrayOfVectorsAddVector(array, vector) {
    let returnArray = []
    for (let i = 0; i < array.length; i++) {
        returnArray.push(vectorAdd(array[i], vector))
    }
    return returnArray
}




// //////////////////////////////////////////////////////////////////////
// 2D GEOMETRY
// //////////////////////////////////////////////////////////////////////

// funcions assume points as tuples (2-arrays) of coordinates
// i.e., the vector [0, 0] is represented simply as [0, 0]

// vector from point (x0, y0) to point (x1, y1)
function vectorFromPoints(p0, p1) {
    return [p1[0] - p0[0], p1[1] - p0[1]]
}

function pointDistance(p0, p1) {
    return Math.sqrt((p0[0] - p1[0])**2 + (p0[1] - p1[1])**2)
}

function vectorNeg(v) {
    return [-v[0], -v[1]]
}

function vectorAdd(v0, v1) {
    return [v0[0] + v1[0], v0[1] + v1[1]]
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

function vectorRotate(v, rad) {
    let s = Math.sin(rad)
    let c = Math.cos(rad)

    return [v[0] * c - v[1] * s,
            v[0] * s + v[1] * c]
}

function dotProduct(v0, v1) {
    return (v0[0] * v1[0]) + (v0[1] * v1[1])
}

// rotate by π/2 radians, and normalize
function vectorNormal(v) {
    return vectorNormalize([-v[1], v[0]])
}

function vectorNormalPositive(v) {
    if (v[0] <= 0) {
        vectorNormalize([v[1], -v[0]])
    }

    return vectorNormalize([-v[1], v[0]])
}





// //////////////////////////////////////////////////////////////////////
// Separating Axis Theorem
// //////////////////////////////////////////////////////////////////////
// If you can find an axis separating two objects, then they do not collide

// based on https://www.youtube.com/watch?v=dn0hUgsok9M
// given two lists of points a[[x, y]] and b[[x, y]] (polygons), return whether they collide or not
function doPolygonsCollide(poly0, poly1) {

    // generate normals for both shapes
    let normals0 = []
    for (let i = 0; i < poly0.length - 1; i++) {
        let p0 = poly0[i]
        let p1 = poly0[i + 1]
        normals0.push(vectorNormalPositive(vectorFromPoints(p0, p1)))
    }
    normals0.push(vectorNormalPositive(vectorFromPoints(poly0[poly0.length - 1], poly0[0]))) // push last normal (between first and last point)

    let normals1 = []
    for (let i = 0; i < poly1.length - 1; i++) {
        let p0 = poly1[i]
        let p1 = poly1[i + 1]
        normals1.push(vectorNormalPositive(vectorFromPoints(p0, p1)))
    }
    normals1.push(vectorNormalPositive(vectorFromPoints(poly1[poly1.length - 1], poly1[0]))) // push last normal (between first and last point)



    let allNormals = normals0.concat(normals1)
    // let allNormals = addArraysOfArrays(normals0, normals1) // optimization, maybe?

    // see if the normal is perpendicular to the axis of separation
    for (let i = 0; i < allNormals.length; i++) {
        
        // project all shape's points onto the current normal, and set the extremes (min and max)
        let projected0 = []
        for (let j = 0; j < poly0.length; j++) {
            projected0.push(dotProduct(allNormals[i], poly0[j]))
        }
        let extremes0 = minAndMax(projected0)

        let projected1 = []
        for (let j = 0; j < poly1.length; j++) {
            projected1.push(dotProduct(allNormals[i], poly1[j]))
        }
        let extremes1 = minAndMax(projected1)

        // check if polygons collide on this normal
        if (extremes0[1] < extremes1[0] || extremes1[1] < extremes0[0]) {
            // they do not collide on this axis => they don't collide at all
            return false

            // return penetration depth?

        }
    }

    l("The shapes are colliding!") // TODO: resolve collisions
    return true
}



