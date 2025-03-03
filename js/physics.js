
// //////////////////////////////////////////////////////////////////////
// PHYSICS SIMULATION
// //////////////////////////////////////////////////////////////////////

let isSimulating = false
function startSimulating() {
    addClass("topMenuStartSimulationContainer", "blank")
    removeClass("topMenuStopSimulationContainer", "blank")

    // saving current bridge
    saveBridge(false)

    isSimulating = true
}

function stopSimulating() {
    removeClass("topMenuStartSimulationContainer", "blank")
    addClass("topMenuStopSimulationContainer", "blank")

    // loading current saved bridge
    loadBridge(false)

    isSimulating = false
}

function toggleSimulating() {
    if (isSimulating) {
        stopSimulating()
    } else {
        startSimulating()
    }
}



function simulateBridge() {
    // everything physics is happening here every tick

    l("Simulating {} (nothing)!")
}