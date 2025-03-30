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

function arrayOfVectorsRotate(array, radians) {
    let returnArray = []
    for (let i = 0; i < array.length; i++) {
        returnArray.push(vectorRotate(array[i], radians))
    }
    return returnArray
}




// //////////////////////////////////////////////////////////////////////
// 2D GEOMETRY
// //////////////////////////////////////////////////////////////////////

// funcions assume points as tuples (2-arrays) of coordinates
// i.e., the vector [0, 0] is represented simply as [0, 0]

function pointsCenter(p0, p1) {
    return [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]
}

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
    return [v0[0] - v1[0], v0[1] - v1[1]]
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

function vectorRotate90deg(v) {
    return [-v[1], v[0]]
}

function dotProduct(v0, v1) {
    return (v0[0] * v1[0]) + (v0[1] * v1[1])
}

// rotate by π/2 radians, and normalize
function vectorNormal(v) {
    return vectorNormalize([-v[1], v[0]])
}

function vectorPositive(v) {
    if (v[0] < 0) {
        return vectorNeg(v)
    }
    return v
}

function vectorNormalPositive(v) {
    if (v[0] <= 0) {
        vectorNormalize([v[1], -v[0]])
    }

    return vectorNormalize([-v[1], v[0]])
}



function pointSegmentDistance(p, a, b) {
    let ab = vectorSub(b, a)
    let ap = vectorSub(p, a)

    let proj = dotProduct(ab, ap)
    let abLength = vectorLength(ab)
    let d = proj / abLength

    // position of the closest point
    let closestPoint = [0, 0]
    if (d <= 0) {
        closestPoint = a
    } else if (d >= 1) {
        closestPoint = b
    } else {
        closestPoint = vectorAdd(a, vectorMul(d, ab))
    }

    return closestPoint
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



    let depth = Infinity // depth to resolve the collision
    let normal = [0, 0]

    let allNormals = normals0.concat(normals1)
    // let allNormals = addArraysOfArrays(normals0, normals1) // optimization, maybe?

    let whichEdge = Infinity
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
            return [[0, 0], 0, Infinity]
        }

        // set minimal vectors to separate shapes
        let axisDepth = Math.min(extremes0[1] - extremes1[0], extremes1[1] - extremes0[0])
        if (axisDepth < depth) {
            depth = axisDepth
            normal = allNormals[i]

            whichEdge = i
        }
    }

    depth /= vectorLength(normal)
    normal = vectorNormalize(normal)

    return [normal, depth, whichEdge]
}


// //////////////////////////////////////////////////////////////////////
// COLORS
// //////////////////////////////////////////////////////////////////////

// p in <0, 1>, how far on the line between c0 and c1 the resulting color should be
function mixColors(p, c0, c1) { // colors as Arrays
    let cDiff = [c1[0] - c0[0], c1[1] - c0[1], c1[2] - c0[2]]
    return [clampColorValue(c0[0] + p * cDiff[0]),
            clampColorValue(c0[1] + p * cDiff[1]),
            clampColorValue(c0[2] + p * cDiff[2])]
}

function mixColorsHex(p, hex0, hex1) {
    return mixColors(p, hexToIntArray(hex0), hexToIntArray(hex1))
}

function clampColorValue(x) {
    return Math.min(255, Math.max(0, Math.round(x))) || 0
}

function hexToIntArray(hexString) {
    if (hexString[0] === "#") {
        hexString = hexString.substring(1)
    }

    return [parseInt(hexString.slice(0, 2), 16),
            parseInt(hexString.slice(2, 4), 16),
            parseInt(hexString.slice(4, 6), 16)]
}

function intArrayToHex(intArray) {
    return "#" + intArray[0].toString(16).padStart(2, "0")
               + intArray[1].toString(16).padStart(2, "0")
               + intArray[2].toString(16).padStart(2, "0")
}