const l = console.log
const p = "Lorem ipsum odor amet, consectetuer adipiscing elit."

// l(bridgeConnections, bridgeEdges, bridgeVertices)


// 

let selectedVertex = null // the index of the current vertex
let bridgeVertices = [ // contains vertices v_k where 
    // [x coord, y coord, type]
    [0, 0, "p"],
    [0, 150, "n"],
    [50, 100, "n"],
    [-50, 100, "n"],
]

let bridgeEdges = [ // contains edges (l, k) where l != k
    // [index of v1, index of v2, type]
    [0, 1, "w"],
    [0, 2, "w"],
    [1, 2, "w"],
    [0, 3, "w"],
    [1, 3, "w"],
]

let bridgeConnections = [ //
    [1, 2, 3],
    [0, 2],
    [0, 1],
    [0, 1],
]

// based on the two upper arrays, makes a bridgeConnections array:
// let bridgeConnections = [
//     // index for a point is equal in bridgeConnections and bridgeVertices, the values are arrays representing the indices of points in bridgeVertices who share a connection via the bridgeEdges
//     [1, 2],
//     [0, 2],
//     [0, 1],
// ] // above is the example for a graph of a triangle (0 is connected to 1 and 2, 1 is connected to 0 and 2, 2, is connected to 0 and 1)
function makeBridgeConnections(edgesArray = bridgeEdges) {
    for (let i = 0; i < edgesArray.length; i++) {
        let e = edgesArray[i]

        // Both vertices are connected to each other via the edge
        addBridgeConnection(e[0], e[1])
        addBridgeConnection(e[1], e[0])
    }
}


// //////////////////////////////////////////////////////////////////////
// DRAWING THE GAME
// //////////////////////////////////////////////////////////////////////

let vertexProperties = {
    n: { // normal
        radius: 4,
        selectedRadius: 6,
        isPermanent: false,
    },
    p: { // permanent
        radius: 6,
        selectedRadius: 8,
        isPermanent: true,
    },
}

let allowedEdgeTypes = ["r", "w", "s"]
let edgeProperties = {
    w: { // wood
        name: "Wood",
        icon: "-",
        width: 4,
    },
    s: { // steel
        name: "Steel",
        icon: "—",
        width: 5,
    },
    r: { // road
        name: "Road",
        icon: "_",
        width: 6,
    },

    // maybe??????
    rr: { // reinforced road
        name: "ReinforcedRoad",
        icon: "‗",
        width: 7,
    },
}



function drawBridge(verticesArray = bridgeVertices, edgesArray = bridgeEdges) {
    clearCanvas()

    // draws the grid only if 
    l(alignToGrid, showGrid)
    if (alignToGrid && showGrid) {
        drawGrid()
    }

    if (verticesArray.length >= 2) {
        for (let i = 0; i < edgesArray.length; i++) {
            let e = edgesArray[i]
    
            // get vertices from the vertex array
            let p0 = verticesArray[e[0]]
            let p1 = verticesArray[e[1]]
            drawEdge(p0, p1, e[2])
        }
    }

    ctx.beginPath()
    for (let i = 0; i < verticesArray.length; i++) {
        let v = verticesArray[i]
        drawVertex(v[0], v[1], v[2])
    }
    ctx.fill()

    if (selectedVertex !== null) {
        let v = verticesArray[selectedVertex]
        drawSelectedPoint(v[0], v[1], v[2])
    }
}

function drawVertex(x, y, type) {
    switch (type) {
        case "n": { // normal vertex
            setCanvasFillColor("white")
            drawPointCont(x, y, vertexProperties.n.radius)
            break;
        }
        case "p": { // permanent vertex
            setCanvasFillColor("black")
            drawSquare(x, y, vertexProperties.p.radius)
            break;
        }

        default: {break}
    }
}

function drawEdge(p0, p1, type) {
    switch (type) {
        case "r": { // road
            setCanvasStrokeColor("road")
            setCanvasStrokeWidth(edgeProperties.r.width)
            drawLine(p0[0], p0[1], p1[0], p1[1])
            break;
        }
        case "w": { // wooden beam edge
            setCanvasStrokeColor("wooden")
            setCanvasStrokeWidth(edgeProperties.w.width)
            drawLine(p0[0], p0[1], p1[0], p1[1])
            break;
        }
        case "s": { // steel beam edge
            setCanvasStrokeColor("steel")
            setCanvasStrokeWidth(edgeProperties.s.width)
            drawLine(p0[0], p0[1], p1[0], p1[1])
            break;
        }

        default: {break}
    }
}

// draw a shape around the currently selected vertex
function drawSelectedPoint(x, y, type) {
        setCanvasStrokeWidth(2)
        switch (type) {
        case "n": { // normal vertex
            setCanvasStrokeColor("white")
            drawEmptyPoint(x, y, vertexProperties.n.selectedRadius)
            break;
        }
        case "p": { // permanent vertex
            setCanvasStrokeColor("black")
            drawEmptySquare(x, y, vertexProperties.p.selectedRadius)
            break;
        }

        default: {break}
    }
}

// sets playerSetEdgesType
function setEdgeType(edgeType) {
    playerSetEdgesType = edgeType

    setSelectedEdgeButton(edgeType)
}

function listAllowedEdgeTypes() {
    let edgesList = ""

    if (allowedEdgeTypes.length == 1) {
        let e = edgeProperties[allowedEdgeTypes[0]]

        edgesList = `<button id="edgeSelector${e.name}" class="menuButton borderRadiusTabLeft" onclick="setEdgeType('${allowedEdgeTypes[0]}')">${e.icon}</button>
            <div class="buttonDescription buttonDescriptionLeft">
                <label for="edgeSelector${e.name}">
                    <p><b>Set Edge Type to ${e.name}</b></p>
                </label>
            </div>`
    } else {
        for (let i = 0; i < allowedEdgeTypes.length; i++) {
            let e = edgeProperties[allowedEdgeTypes[i]]

            let borderClass = ""
            if (i == 0) {
                borderClass = "borderRadiusTopLeft"
            } else if (i == allowedEdgeTypes.length - 1) {
                borderClass = "borderRadiusBottomLeft"
            }
    
            edgesList += `<button id="edgeSelector${e.name}" class="menuButton ${borderClass}" onclick="setEdgeType('${allowedEdgeTypes[i]}')">${e.icon}</button>
            <div class="buttonDescription buttonDescriptionLeft">
                <label for="edgeSelector${e.name}">
                    <p><b>Set Edge Type to ${e.name}</b></p>
                </label>
            </div>`
        }
    }

    document.getElementById("edgeSelectorButtonContainer").innerHTML = edgesList
}

function setSelectedEdgeButton(edgeType) {
    for (let i = 0; i < allowedEdgeTypes.length; i++) {
        let e = edgeProperties[allowedEdgeTypes[i]]
        removeClass("edgeSelector" + e.name, "selected")
    }

    let edgeName = edgeProperties[edgeType].name
    addClass("edgeSelector" + edgeName, "selected")
}




// //////////////////////////////////////////////////////////////////////
// INTERACTING WITH THE GAME
// //////////////////////////////////////////////////////////////////////




function addClass(id, className) {
    document.getElementById(id).classList.add(className)
}

function removeClass(id, className) {
    document.getElementById(id).classList.remove(className)
}

function addAttribute(id, attribute) {
    if (!document.getElementById(id).hasAttribute(attribute)) {
        document.getElementById(id).setAttribute(attribute, "true")
    }
}

function removeAttribute(id, attribute) {
    document.getElementById(id).removeAttribute(attribute, "true")
}

function getBooleanValue(id) {
    return document.getElementById(id).checked
}

let canDeleteEdges = true
function setEdgeDeletion() {
    canDeleteEdges = getBooleanValue("canDeleteEdges")
}

function setContinuousBuilding() {
    playerContinuousBuilding = getBooleanValue("canContinuousBuilding")
}

function toggleArrowset() {
    if (getBooleanValue("showArrowset")) {
        removeClass("arrowMockupContainer", "blank")
    } else {
        addClass("arrowMockupContainer", "blank")
    }
}

function setAlignToGrid() {
    alignToGrid = getBooleanValue("canAlignToGrid")

    bridgeHasChanged = true
}

let showGrid = true
function setShowGrid() {
    showGrid = getBooleanValue("showGrid")

    bridgeHasChanged = true
}

// returns true if it could add/remove an edge
function addEdge(v0, v1, type, edgesArray = bridgeEdges) {
    if (v0 != v1) {
        if (checkIfVerticesConnect(v0, v1)) {
            if (canDeleteEdges) {
                deleteEdgeBetweenPoints(v0, v1)
                return true
            }
        } else {
            edgesArray.push([v0, v1, type])
            addBridgeConnection(v0, v1)
            addBridgeConnection(v1, v0)
            return true
        }
    }
    return false
}

function deleteEdgeBetweenPoints(p0, p1, edgesArray = bridgeEdges) {
    if (checkIfVerticesConnect(p0, p1)) {
        for (let i = 0; i < edgesArray.length; i++) {
            e = edgesArray[i]

            if ((e[0] == p0 || e[0] == p1) && (e[1] == p0 || e[1] == p1)) {
                edgesArray.splice(i, 1)
            }
        }

        deleteBridgeConnection(p0, p1)
        deleteBridgeConnection(p1, p0)

        bridgeHasChanged = true
    }
}

function addVertex(x, y, type, vertexArray = bridgeVertices) {
    vertexArray.push([x, y, type])
}

function deleteVertex(index, verticesArray = bridgeVertices, edgesArray = bridgeEdges, connectionsArray = bridgeConnections) {
    if (index < 0 || index >= verticesArray.length) {
        return 0
    }

    verticesArray[index] = null

    for (let i = 0; i < connectionsArray.length; i++) {
        let e = connectionsArray[i]
        deleteEdgeBetweenPoints(index, e[0])
    }

    let lastIndex = verticesArray.length - 1

    // in vertices
    verticesArray[index] = verticesArray[lastIndex]
    verticesArray.pop()

    // in edges
    for (let i = 0; i < edgesArray.length; i++) {
        let e = edgesArray[i];

        if (e[0] == index || e[1] == index) {
            edgesArray.splice(i, 1)
            i--
        } else {
            if (e[0] == lastIndex) {
                e[0] = index
            }

            if (e[1] == lastIndex) {
                e[1] = index
            }

            if ((e[0] == e[1])) {
                edgesArray.splice(i, 1)
                i--
            }
        }
    }

    // in connections
    for (let i = 0; i < connectionsArray.length; i++) {
        let e = connectionsArray[i];

        // delete connections between every vertex and the deleted one
        let indexOfIndex = e.indexOf(index)
        if (indexOfIndex !== -1) {
            deleteBridgeConnection(i, index)
        }

        // replace index with lastIndex in connections
        let indexOfLastIndex = e.indexOf(lastIndex)
        if (lastIndex !== -1) {
            e[indexOfLastIndex] = index
        }
    }

    connectionsArray[index] = connectionsArray[lastIndex]
    connectionsArray.pop()

    bridgeHasChanged = true
}

function addBridgeConnection(to, from) {
    if (bridgeConnections[to] === undefined || bridgeConnections[to] == []) {
        bridgeConnections[to] = [from]
    } else {
        bridgeConnections[to].push(from)
    }
}

function deleteBridgeConnection(to, from) {
    let indexOfFrom = bridgeConnections[to].indexOf(from)
    bridgeConnections[to].splice(indexOfFrom, 1)
}

function checkIfVerticesConnect(v0, v1) {
    if (bridgeConnections[v0] && bridgeConnections[v0].includes(v1)
     && bridgeConnections[v1] && bridgeConnections[v1].includes(v0)) {
        return true
    }
    return false
}

let playerSetPointsType = "n"
let playerSetEdgesType = "w"

let previousPlayerSetPoint = null
let playerContinuousBuilding = true
let playerClickInaccuracy = 8 // px
let bridgeHasChanged = false // updates to true if the bridge has been updated by the user
function setPlayerPoint(x, y) {
    let nearPoints = detectNearPoints(x, y, playerClickInaccuracy)
    if (nearPoints.length != 0) {
        // makes the selected vertex equal to the first nearest point
        selectedVertex = nearPoints[0]

        if (previousPlayerSetPoint === null) {
            // no previous point

            previousPlayerSetPoint = selectedVertex
        } else {
            // there was a previous point

            addEdge(previousPlayerSetPoint, selectedVertex, playerSetEdgesType)

            if (playerContinuousBuilding) {
                previousPlayerSetPoint = selectedVertex
            } else {
                previousPlayerSetPoint = null
                selectedVertex = null
            }
        }
    } else {
        if (previousPlayerSetPoint === null) {
            // no previous point

            previousPlayerSetPoint = bridgeVertices.length // set the previous point to the top index of the vertex array
            addVertex(x, y, playerSetPointsType)
            selectedVertex = previousPlayerSetPoint
        } else {
            // there was a previous point

            let currentPlayerSetPoint = bridgeVertices.length
            addVertex(x, y, playerSetPointsType)
            addEdge(previousPlayerSetPoint, currentPlayerSetPoint, playerSetEdgesType)

            if (playerContinuousBuilding) {
                previousPlayerSetPoint = currentPlayerSetPoint
            } else {
                previousPlayerSetPoint = null
            }

            selectedVertex = currentPlayerSetPoint
        }
    }

    bridgeHasChanged = true
}

let alignToGrid = true
let gridSize = 16
function detectMouseOnCanvas(event) {
    let boundingRect = document.getElementById("canvasBridge").getBoundingClientRect()

    let clickedX = -(canvasSizeHalf[0] - (event.clientX - boundingRect.x) - canvasTranslate[0]) * canvasScaleReciprocal
    let clickedY = (canvasSizeHalf[1] - (event.clientY - boundingRect.y) - canvasTranslate[1]) * canvasScaleReciprocal

    if (alignToGrid) {
        // when aligning, find the nearest grid-point coordinates
        let gridX = gridSize * Math.round(clickedX / gridSize)
        let gridY = gridSize * Math.round(clickedY / gridSize)

        setPlayerPoint(gridX, gridY)
    } else {
        setPlayerPoint(clickedX, clickedY)
    }
}

// returns indices of points that are closer than threshold to (x, y)
function detectNearPoints(x, y, threshold, verticesArray = bridgeVertices) {
    let outputArray = []
    for (let i = 0; i < verticesArray.length; i++) {
        let v = verticesArray[i]

        if (pointDistance([x, y], [v[0], v[1]]) <= threshold) {
            outputArray.push(i)
        }
    }

    return outputArray
}

function unSelectPoint() {
    selectedVertex = null
    previousPlayerSetPoint = null

    bridgeHasChanged = true
}

function deleteSelectedPoint() {
    if (selectedVertex !== null) {
        if (!vertexProperties[bridgeVertices[selectedVertex][2]].isPermanent) {
            deleteVertex(selectedVertex)
        } else {
            sendMessage(true, "vertexDeletion")
        }
    }

    unSelectPoint()
}

function selectLastVertex() {
    selectedVertex = bridgeVertices.length - 1
    previousPlayerSetPoint = selectedVertex

    bridgeHasChanged = true
}

let canvasStep = 16
function move(direction) {
    let step = canvasStep * canvasScaleReciprocal
    if (event.shiftKey) {
        step *= 16
    }

    switch (direction) {
        case "ul": {translateCanvas(-step, -step); break;} case "u": {translateCanvas(0, -step); break;} case "ur": {translateCanvas(step, -step); break;}
        case  "l": {translateCanvas(-step, 0);     break;}                                               case  "r": {translateCanvas(step, 0);     break;}
        case "dl": {translateCanvas(-step, step);  break;} case "d": {translateCanvas(0, step);  break;} case "dr": {translateCanvas(step, step);  break;}

        case "0": {
            translateCanvas(-canvasTranslate[0], -canvasTranslate[1]); 
            break;
        }
        default: {break;}
    }
}






// //////////////////////////////////////////////////////////////////////
// PHYSICS SIMULATION
// //////////////////////////////////////////////////////////////////////

let isSimulating = false
function prepareBridgeForSimulation() {


    isSimulating = true
}

function simulateBridge() {

}




// //////////////////////////////////////////////////////////////////////
// STYLING THE GAME
// //////////////////////////////////////////////////////////////////////

let currentStyle = 1
let gameStyles = [
    ["Greyscale", "#606060"],
    ["Blueprint", "#2294f3"],
    ["Strawberry", "#e39695"],
]

function applyStyle(styleId) {
    currentStyle = styleId
    document.getElementById("html").setAttribute("colorScheme", gameStyles[currentStyle][0])
}

function listStyles() {
    let styleText = ""
    for (let i = 0; i < gameStyles.length; i++) {
        let e = gameStyles[i]

        styleText += "<button class='colorSchemeButton' style='background-color: " + e[1] + ";' onclick='applyStyle(" + i + ")'>" + e[0] + "</button>"
    }

    document.getElementById("colorSchemes").innerHTML = styleText
}



// //////////////////////////////////////////////////////////////////////



function gameLoop() {
    if (bridgeHasChanged) {
        drawBridge()
        bridgeHasChanged = false
    }

    if (isSimulating) {
        simulateBridge() // TODO
    }
}

window.onload = function() {
    resetCanvas()

    document.getElementById("canvasBridge").addEventListener("click", detectMouseOnCanvas)

    // buttons
    document.getElementById("unselectPointButton").addEventListener("click", unSelectPoint)
    document.getElementById("deletePointButton").addEventListener("click", deleteSelectedPoint)
    document.getElementById("selectLastVertex").addEventListener("click", selectLastVertex)

    document.getElementById("levelSelectorNextButton").addEventListener("click", selectNextLevel)
    document.getElementById("levelSelectorPreviousButton").addEventListener("click", selectPreviousLevel)
    
    document.getElementById("levelSelectorLastButton").addEventListener("click", selectLastLevel)
    document.getElementById("levelSelectorFirstButton").addEventListener("click", selectFirstLevel)
    
    document.getElementById("scaleControlUp").addEventListener("click", scaleCanvasUp)
    document.getElementById("scaleControlZero").addEventListener("click", scaleCanvasZero)
    document.getElementById("scaleControlDown").addEventListener("click", scaleCanvasDown)

    document.getElementById("messageLogClear").addEventListener("click", clearMessages)
    document.getElementById("messageLogCopy").addEventListener("click", copyMessages)

    // menu buttons
    document.getElementById("optionsMenuOpenButton").addEventListener("click", toggleMenuOptions)
    document.getElementById("optionsMenuCloseButton").addEventListener("click", toggleMenuOptions)

    document.getElementById("levelSelectorOpenButton").addEventListener("click", toggleMenuLevels)
    document.getElementById("levelSelectorCloseButton").addEventListener("click", toggleMenuLevels)

    // checkboxes
    document.getElementById("canDeleteEdges").addEventListener("change", setEdgeDeletion)
    document.getElementById("canContinuousBuilding").addEventListener("change", setContinuousBuilding)
    document.getElementById("showArrowset").addEventListener("change", toggleArrowset)
    document.getElementById("canAlignToGrid").addEventListener("change", setAlignToGrid)
    document.getElementById("showGrid").addEventListener("change", setShowGrid)

    setEdgeDeletion()
    setContinuousBuilding()
    setAlignToGrid()
    setShowGrid()

    drawBridge(bridgeVertices, bridgeEdges)
    // each tick of the game is 1/10 of a second
    setInterval(gameLoop, 100)

    sendMessage(true, "welcome")

    listAllowedEdgeTypes()
    setEdgeType(allowedEdgeTypes[0]) // sets the selected edge type to the first one

    listStyles()
    displayLevelInfo(selectedLevel)

    // DEV
    // toggleDialog("optionsMenu")
}

window.onkeyup = (event) => {
    if (canUseKeyboardShortcuts) {
        switch (event.key) {
            case "Delete": {
                deleteSelectedPoint()
                break;
            }

            case "Backspace": {
                unSelectPoint()
                break;
            }
    
            case "Enter": {
                selectLastVertex()
                break;
            }

            case "z": {
                scaleCanvasUp()
                break;
            }

            case "x": {
                scaleCanvasZero()
                break;
            }

            case "c": {
                scaleCanvasDown()
                break;
            }

            // menus
            case "\`": {
                toggleMenuOptions()
                break;
            }

            case "Q": {
                toggleMenuLevels()
                break;
            }
        
            default: {break}
        }
    } else {
        if (event.key == "\`") {
            toggleMenuOptions()
            canUseKeyboardShortcuts = true
        } else if (event.key == "Q") {
            toggleMenuLevels()
            canUseKeyboardShortcuts = true
        }
    }
}

// movement of camera
window.onkeydown = (event) => {
    let step = canvasStep * canvasScaleReciprocal
    if (event.shiftKey) {
        step *= 16
    }

    switch (event.code) {
        case "Numpad8":
        case "ArrowUp":
        case "KeyK":
        case "KeyW": {
            translateCanvas(0, -step); break;
        }
        
        case "Numpad4":
        case "ArrowLeft":
        case "KeyH":
        case "KeyA": {
            translateCanvas(-step, 0); break;
        }

        case "Numpad2":
        case "ArrowDown":
        case "KeyJ":
        case "KeyS": {
            translateCanvas(0, step); break;
        }

        case "Numpad6":
        case "ArrowRight":
        case "KeyL":
        case "KeyD": {
            translateCanvas(step, 0); break;
        }

        case "Numpad7": {
            translateCanvas(-step, -step); break;
        }

        case "Numpad9": {
            translateCanvas(step, -step); break;
        }

        case "Numpad1": {
            translateCanvas(-step, step); break;
        }

        case "Numpad3":{
            translateCanvas(step, step); break;
        }

        case "Numpad5":
        case "Numpad0": {
            translateCanvas(-canvasTranslate[0], -canvasTranslate[1]); break;
        }
    }
}



