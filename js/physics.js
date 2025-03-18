
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

function forwardSimulation(event, count = 1) {
    for (let i = 0; i < count; i++) {
        simulateBridge()
    }
}



function setGravity(v) {
    gravityValue = v
}

let gravityValue = [0, -9.807] // m/s²
let constraintResolveSubStepAmount = 4

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

            if (!vertexProperties[v[2]].isSolid) {
                v[3] = vectorAdd(v[3], vectorMul(deltaTime, gravityValue))
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

            // set the position th average of deltas from deltaPositions
            let averageDelta = [0, 0]
            if (deltaPositions[i]) {
                averageDelta = averageVector(deltaPositions[i])
            }

            v[0] = v[0] + averageDelta[0] * deltaTime
            v[1] = v[1] + averageDelta[1] * deltaTime

            v[3] = vectorDiv(vectorSub([v[0], v[1]], previousPositions[i]), deltaTime)
        }

        deltaPositions = []
        
        carGravity(undefined, 0)
        carDrive(carsList, 0)
    }



    simulationTick += constraintResolveSubStepAmount
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

