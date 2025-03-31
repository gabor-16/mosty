
// //////////////////////////////////////////////////////////////////////
// PHYSICS SIMULATION
// //////////////////////////////////////////////////////////////////////

let isSimulating = false
let isSimulationPaused = false
let simulationTick = 0
function startSimulating() {
    addClass("topMenuStartSimulationContainer", "blank")
    removeClass("topMenuStopSimulationContainer", "blank")

    addClass("topMenuSimulationStopped", "blank")
    removeClass("topMenuSimulationStarted", "blank")

    // saving current bridge
    saveBridge(false)

    isSimulating = true
    isSimulationPaused = true
    toggleSimulationPause()

    simulationTick = 0
}

function stopSimulating() {
    removeClass("topMenuStartSimulationContainer", "blank")
    addClass("topMenuStopSimulationContainer", "blank")

    removeClass("topMenuSimulationStopped", "blank")
    addClass("topMenuSimulationStarted", "blank")

    // loading current saved bridge
    loadBridge(false)

    isSimulating = false
    isSimulationPaused = true
    toggleSimulationPause()

    minExtent = 1
    maxExtent = 1
}

function killCar(reason) {
    stopSimulating()

    sendMessage(true, "car" + reason)
}

function toggleSimulating() {
    if (isSimulating) {
        stopSimulating()
    } else {
        startSimulating()
    }
}

function toggleSimulationPause() {
    if (isSimulationPaused) {
        isSimulationPaused = false
        document.getElementById("topMenuSimulationStartedPause").innerText = "⏸"
        document.getElementById("simulationState").innerText = "Running"
    } else {
        isSimulationPaused = true
        document.getElementById("topMenuSimulationStartedPause").innerText = "▶"
        document.getElementById("simulationState").innerText = "Paused"
    }
}

function simulateTick() {
    for (let i = 0; i < currentSpeed; i++) {
        simulateBridge()

        simulatePhysicals()
    }
}



function gravityEarth(x, y) {
    return [0, -9.807]
}

function gravityCentered(x, y) {
    let d = Math.sqrt(x**2 + y**2)
    let m2 = 1
    let G = 1000
    let Gm2d = G * m2 / d**2
    return [-x * Gm2d, -y * Gm2d]
}

function setGravity(fv) {
    gravityValue = fv
}

let gravityValue = () => {} // m/s²
let constraintResolveSubStepAmount = 4
let collisions = []

// each tick of the game is 1/10 of a second
const tickTime = 0.1
let deltaTime = tickTime / constraintResolveSubStepAmount

let previousPositions = []
let deltaPositions = []
function simulateBridge() {
    // everything physics is happening here every tick
    for (let i = 0; i < constraintResolveSubStepAmount; i++) {
        for (let i = 0; i < bridgeVertices.length; i++) {
            let v = bridgeVertices[i];
            let vertex = vertexProperties[v[2]]

            if (!vertex.isSolid) {
                let vertexMass = vertex.mass // maybe mass equal to 0.5 * (mass of all connected edges) ?
                v[3] = vectorAdd(v[3], vectorMul(deltaTime, vectorMul(vertexMass, gravityValue(v[0], v[1]))))
            }

            previousPositions[i] = [v[0], v[1]]

            let updatedPosition = vectorAdd([v[0], v[1]], vectorMul(deltaTime, v[3]))
            v[0] = updatedPosition[0]
            v[1] = updatedPosition[1]
        }



        // SOLVE CONSTRAINTS
        for (let i = 0; i < bridgeEdges.length; i++) {
            let e = bridgeEdges[i]

            // solving constraints using Position Based Dynamics, based on https://www.youtube.com/watch?v=jrociOAYqxA
            let extent = solveDistanceConstraint(e[0], e[1], e[3], e[2])
            // l(extent)
        }



        for (let i = 0; i < bridgeVertices.length; i++) {
            let v = bridgeVertices[i];

            // set the position to the average of deltas from deltaPositions
            let averageDelta = [0, 0]
            if (deltaPositions[i]) {
                averageDelta = averageVector(deltaPositions[i])
            }

            v[0] = v[0] + averageDelta[0] * deltaTime
            v[1] = v[1] + averageDelta[1] * deltaTime

            v[3] = vectorDiv(vectorSub([v[0], v[1]], previousPositions[i]), deltaTime)
        }

        deltaPositions = []
    }



    simulationTick += 1
    document.getElementById("simulationTick").innerText = simulationTick

    bridgeHasChanged = true
}

let minExtent = 1
let maxExtent = 1
// l0 is the rest distance - basically the distance that we want the points to be at.
function solveDistanceConstraint(i0, i1, l0, type) {
    let x0 = [bridgeVertices[i0][0], bridgeVertices[i0][1]]
    let x1 = [bridgeVertices[i1][0], bridgeVertices[i1][1]]

    let lc = pointDistance(x0, x1) // current distance between points
    let extent = lc / l0

    if (deleteEdgesOnTension && extent >= edgeProperties[type].maxLengthDelta /*adjust?, then change in html*/) {
        deleteEdgeBetweenPoints(i0, i1)
        sendMessage(true, "edgeDestroyed")

        return extent
    }

    if (drawExtent) {
        setCanvasStrokeColor(intArrayToHex(mixColorsHex(Math.atan(16 * extent - 16) / π + 0.5, "#ff0000", "#00ff00")))
        drawLine(x0[0], x0[1], x1[0], x1[1])
    }

    if (extent < minExtent) {
        minExtent = extent
    }
    if (extent > maxExtent) {
        maxExtent = extent
    }

    let m0 = vertexProperties[bridgeVertices[i0][2]].mass
    let m1 = vertexProperties[bridgeVertices[i1][2]].mass

    let w0 = 1 / m0
    let w1 = 1 / m1

    let weightCoefficient = w0 + w1
    let lengthError = lc - l0
    let normalizedPointToPointVector = vectorNormalize(vectorSub(x1, x0))

    let alpha = edgeProperties[type].stiffness

    let dx0 = [0, 0]
    let dx1 = [0, 0]
    if (weightCoefficient !== 0) {
        dx0 = vectorMul( w0 * lengthError / (weightCoefficient + (alpha / deltaTime**2)), normalizedPointToPointVector)
        dx1 = vectorMul(-w1 * lengthError / (weightCoefficient + (alpha / deltaTime**2)), normalizedPointToPointVector)
    }

    x0 = vectorAdd(x0, vectorMul(0.5 * deltaTime, dx0))
    x1 = vectorAdd(x1, vectorMul(0.5 * deltaTime, dx1))

    if (deltaPositions[i0] === undefined) {
        deltaPositions[i0] = []
    }
    deltaPositions[i0].push(dx0)

    if (deltaPositions[i1] === undefined) {
        deltaPositions[i1] = []
    }
    deltaPositions[i1].push(dx1)

    bridgeVertices[i0][0] = x0[0]
    bridgeVertices[i0][1] = x0[1]

    bridgeVertices[i1][0] = x1[0]
    bridgeVertices[i1][1] = x1[1]

    return extent
}

function changeSimulationSpeed() {
    let newSpeed = Number(document.getElementById("topMenuSimulationStartedSpeedChange").value)

    currentSpeed = newSpeed
    document.getElementById("simulationSpeed").innerText = currentSpeed
}

function resetSimulationSpeed() {
    document.getElementById("topMenuSimulationStartedSpeedChange").value = "4"

    changeSimulationSpeed()
}





// //////////////////////////////////////////////////////////////////////
// PHYSICAL OBJECTS OTHER THAN THE BRIDGE
// //////////////////////////////////////////////////////////////////////

function addPhysical(x, y, type, objectName) {
    switch (type) {
        case "auto": {
            let objectSize = autosList[objectName].size
            let objectPoints = autosList[objectName].points

            bridgePhysicals.push([x, y + (objectSize[1] / 2), type, objectName, [0, 0], 0, objectPoints, 0])
            break
        }

        case "flag": {
            let objectSize = flag.size
            let objectPoints = flag.points

            bridgePhysicals.push([x, y + (objectSize[1] / 2), type, objectName, [0, 0], 0, objectPoints, 0])
            break
        }

        default: {break}
    }
}

function drawPhysical(physicalObject) {
    switch (physicalObject[2]) {
        case "auto": {
            let car = autosList[physicalObject[3]]

            switch (car.name) {
                case "Bicycle": {
                    setCanvasStrokeWidth(0)
                    setCanvasFillColor("black")
                    drawPolygon(arrayOfVectorsAddVector(arrayOfVectorsRotate(car.points, physicalObject[5]), [physicalObject[0], physicalObject[1]]))
                    ctx.fill()

                    setCanvasFillColor("white")
                    drawText(physicalObject[0], physicalObject[1], car.name, "center")
                    break;
                }

                default: {break}
            }

            break
        }

        case "shape": {
            switch (physicalObject[3]) {
                case "polygon": {
                    if (drawDebug) {
                        setCanvasStrokeWidth(2)
                        setCanvasStrokeColor(physicalObject[1])
                        drawPolygon(physicalObject[6])
                        ctx.stroke()
                    }

                    break
                }

                case "flag": { // winning thing
                    setCanvasStrokeWidth(2)
                    setCanvasStrokeColor(physicalObject[1])
                    drawPolygon(physicalObject[6])
                    ctx.stroke()

                    break
                }

                default: {break}
            }

            break
        }

        default: {break}
    }
}

let maxCarDistanceFromCenter = 100 ** 2 // max distance (in meters from origin) (squared)
function simulatePhysicals() {
    for (let i = 0; i < bridgePhysicals.length; i++) {
        let p = bridgePhysicals[i]
        let physicalType = p[2]

        movePhysicals(p)

        // SIMULATE PHYSICAL'S PHYSICS
        // check for collisions, and then make them not colliding

        let poly0
        let center0
        let isAuto = false
        switch (physicalType) {
            case "auto": {
                poly0 = arrayOfVectorsAddVector(arrayOfVectorsRotate(p[6], p[5]), [p[0], p[1]])
                center0 = [p[0], p[1]]
                isAuto = true
                break
            }

            default: {break}
        }

        if (poly0 !== undefined) { // if the polygon is set
            let gravitySize = vectorLength(gravityValue(center0[0], center0[1]))

            // collisions with other physicals
            for (let j = 0; j < bridgePhysicals.length; j++) {
                bp = bridgePhysicals[j]

                if (j != i) {
                    let collider = doPolygonsCollide(poly0, bp[6], center0, bp[0])
                    let moveVector = vectorMul(collider[1], collider[0])
                    if (moveVector[0] !== 0 || moveVector[1] !== 0) {
                        if (bp[3] === "flag") {
                            win()
                            return true
                        }

                        bp[0] = vectorAdd(bp[0], moveVector)

                        let newAcc = vectorAdd(p[4], vectorMul(-deltaTime * gravitySize, moveVector))
                        p[4] = newAcc // set acceleration

                        let newPos = vectorAdd([p[0], p[1]], vectorNeg(moveVector))
                        p[0] = newPos[0]
                        p[1] = newPos[1]

                        if (isAuto) {
                            let colidedEdge = vectorRotate90deg(collider[0])
                            let collidedEdgeAngle = Math.atan2(colidedEdge[1], colidedEdge[0])

                            p[4] = vectorMul(0.5, p[4])

                            // change auto's rotation
                            p[5] = 0.5 * p[5] + collidedEdgeAngle
                        }
                    }
                }
            }

            // collisions with the bridge
            for (let j = 0; j < bridgeEdges.length; j++) {
                let e = bridgeEdges[j]

                if (edgeProperties[e[2]].isRoad) {
                    let v0 = bridgeVertices[e[0]]
                    let v1 = bridgeVertices[e[1]]

                    let edgePoints = [[v0[0], v0[1]], [v1[0], v1[1]]]
                    let collider = doPolygonsCollide(poly0, edgePoints, center0, pointsCenter([v0[0], v0[1]], [v1[0], v1[1]]))
                    let moveVector = vectorMul(collider[1] * 0.5, collider[0])

                    if (moveVector[0] !== 0 || moveVector[1] !== 0) {
                        let normal = vectorMul(gravitySize, vectorNormalPositive(vectorFromPoints(v0, v1)))
                        let newAcc = vectorAdd(p[4], normal)
                        p[4] = newAcc // set acceleration

                        let newPos = vectorAdd([p[0], p[1]], normal)
                        p[0] = newPos[0]
                        p[1] = newPos[1]

                        // move bridge vertices ?
                        let negNormal = vectorNeg(normal)
                        if (!vertexProperties[v0[2]].isSolid) {
                            let v0move = vectorAdd([v0[0], v0[1]], negNormal)
                            v0[0] = v0move[0]
                            v0[1] = v0move[1]
                        }

                        if (!vertexProperties[v1[2]].isSolid) {
                            let v1move = vectorAdd([v1[0], v1[1]], negNormal)
                            v1[0] = v1move[0]
                            v1[1] = v1move[1]
                        }

                        p[4] = vectorMul(0.5, p[4])

                        // change auto's rotation
                        let collidedEdgeAngle = Math.atan2(v1[1] - v0[1], v1[0] - v0[0])
                        p[5] = 0.5 * p[5] + collidedEdgeAngle
                    }
                }
            }
        }
    }
}

function movePhysicals(physical) {
    switch (physical[2]) {
        case "auto": {
            let auto = autosList[physical[3]]

            // apply gravity
            physical[4] = vectorAdd(physical[4], vectorMul(deltaTime, vectorMul(auto.mass, gravityValue(physical[0], physical[1]))))

            // rotate by angular velocity
            physical[5] += physical[7]

            // move in the direction the auto is facing
            let angle = physical[5]
            let directionVector = vectorMul(auto.speed, vectorFromPoints([0, 0], [Math.cos(angle), Math.sin(angle)]))
            let updatedPosition = vectorAdd([physical[0], physical[1]], vectorMul(deltaTime, vectorAdd(physical[4], directionVector)))
            physical[0] = updatedPosition[0]
            physical[1] = updatedPosition[1]

            // if the car is *gone*, stop the simulation
            if (vectorLength([physical[0], physical[1]]) >= maxCarDistanceFromCenter) {
                killCar("Lost")
            }
        }

        default: {break}
    }
}
