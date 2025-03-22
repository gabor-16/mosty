
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
    car.position = [-350, -100]
    car.velocity = [0, 0]
    car.speed = 0
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
        document.getElementById("topMenuSimulationStartedPause").innerText = "⏸"

        isSimulationPaused = false
        
        document.getElementById("simulationState").innerText = "Running"
    } else {
        document.getElementById("topMenuSimulationStartedPause").innerText = "▶"
        
        isSimulationPaused = true
        
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
        car.carGravity(deltaTime)
        car.moveCar(deltaTime)
        // car.carMoveForward(deltaTime)
        
        car.carCollisionResolution(levelsList[0].objects[0][2])
        car.carCollisionResolution(levelsList[0].objects[1][2])
        for(let i = 0; i < bridgeEdges.length; i++) {
            car.carCollisionResolution([[bridgeVertices[bridgeEdges[i][0]][0], bridgeVertices[bridgeEdges[i][0]][1]], [bridgeVertices[bridgeEdges[i][1]][0], bridgeVertices[bridgeEdges[i][1]][1]]])
        }
        
        

    }



    // simulationTick += constraintResolveSubStepAmount
    simulationTick += 1
    document.getElementById("simulationTick").innerText = simulationTick

    bridgeHasChanged = true
}

// l0 is the rest distance - basically the distance that we want the points to be at.
function solveDistanceConstraint(i0, i1, l0, type) {
    let x0 = [bridgeVertices[i0][0], bridgeVertices[i0][1]]
    let x1 = [bridgeVertices[i1][0], bridgeVertices[i1][1]]

    let lc = pointDistance(x0, x1) // current distance between points
    let extent = lc / l0

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

    x0 = vectorAdd(x0, vectorMul(deltaTime, dx0))
    x1 = vectorAdd(x1, vectorMul(deltaTime, dx1))

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

            bridgePhysicals.push([x, y + (objectSize[1] / 2), type, objectName, [0, 0], 0, objectPoints])
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
                    drawPolygon(arrayOfVectorsAddVector(car.points, [physicalObject[0], physicalObject[1]]))
                    ctx.fill()

                    setCanvasFillColor("white")
                    drawText(physicalObject[0], physicalObject[1], "Bicykl", "center")
                    break;
                }

                default: {break}
            }

            break
        }

        case "shape": {
            switch (physicalObject[3]) {
                case "polygon": {
                    setCanvasFillColor(physicalObject[1])
                    drawPolygon(physicalObject[6])
                    ctx.fill()

                    break
                }

                default: {break}
            }

            break
        }

        default: {break}
    }
}

let maxCarDistanceFromCenter = 10000
function simulatePhysicals() {
    for (let i = 0; i < bridgePhysicals.length; i++) {
        let p = bridgePhysicals[i]
        let physicalType = p[2]

        switch (physicalType) {
            case "auto": {
                let auto = autosList[p[3]]

                p[4] = vectorAdd(p[4], vectorMul(deltaTime, vectorMul(auto.mass, gravityValue(p[0], p[1]))))

                let updatedPosition = vectorAdd([p[0], p[1]], vectorMul(deltaTime, p[4]))
                p[0] = updatedPosition[0]
                p[1] = updatedPosition[1]

                // if the car is gone, stop the simulation
                if (vectorLength([p[0], p[1]] > maxCarDistanceFromCenter)) {
                    stopSimulating()

                    sendMessage(true, "carLost")
                }
            }

            default: {break}
        }



        // SIMULATE PHYSICAL'S PHYSICS
        // check for collisions, and then make them not colliding

        let poly0
        switch (physicalType) {
            case "auto": {
                poly0 = arrayOfVectorsAddVector(p[6], [p[0], p[1]])
                break
            }

            default: {break}
        }

        if (poly0) { // if the polygon is set
            // collisions with other physicals
            for (let j = 0; j < bridgePhysicals.length; j++) {
                if (j !== i) {
                    doPolygonsCollide(poly0, bridgePhysicals[j][6])
                }
            }

            // collisions with the bridge
            for (let j = 0; j < bridgeEdges.length; j++) {
                let e = bridgeEdges[i]
    
                let v0 = bridgeVertices[e[0]]
                let v1 = bridgeVertices[e[1]]
    
                let edgePoints = [[v0[0], v0[1]], [v1[0], v1[1]]]
                doPolygonsCollide(poly0, edgePoints)
            }
        }
    }
}
