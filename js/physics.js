
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



function simulateBridge() {
    // everything physics is happening here every tick

    l("Simulating {} (nothing)!")

    gravity()

    simulationTick += 1
    document.getElementById("simulationTick").innerText = simulationTick

    bridgeHasChanged = true
}



function gravity() {
    for (let i = 0; i < bridgeVertices.length; i++) {
        let v = bridgeVertices[i];

        if (!vertexProperties[v[2]].isPermanent) {
            v[1] -= 1
        }
    }
}