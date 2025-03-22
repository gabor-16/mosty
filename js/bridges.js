const l = console.log
const p = "Lorem ipsum odor amet, consectetuer adipiscing elit."
let car = new Car("Basic Car", "It's a normal car, it drives.", 1500, "../img/cars/samochodzik_2.png", "None", 1, [-350, -100], [0, 0], [], 0, [60, 0])


// values come from the levels.
let bridgeSelectedVertex = null // the index of the current vertex
let bridgeVertices = [ // contains vertices v_k where 
    // [x coord, y coord, type, velocity[vx, vy] ]
]

let bridgeEdges = [ // contains edges (l, k) where l != k
    // [index of v1, index of v2, type, lenght, mass]
]

let bridgeConnections = [ // connections between bridgeVertices[i] and every other vertex
]

let bridgeObjects = [ // a list of objects that have an inpact on the level look and feel (e.i. the floor on either side of the bridge, etc.)

]


let bridgeSaveBasis = {
    levels: [],
}
let bridgeSave = {
    levels: [],
}

let localSaveAlias = "bridgesSave" // don't change this value - it will make older saves unusable without a name change
function saveBridge(localSave = true) {
    let i = selectedLevel

    if (bridgeSave.levels[i] === undefined) {
        bridgeSave.levels[i] = {}
    }

    checkBudget()

    // copies the variables by value, not reference
    bridgeSave.levels[i].saveSelectedVertex         = structuredClone(bridgeSelectedVertex)
    bridgeSave.levels[i].savePreviousPlayerSetPoint = structuredClone(previousPlayerSetPoint)
    bridgeSave.levels[i].saveVertices               = structuredClone(bridgeVertices)
    bridgeSave.levels[i].saveEdges                  = structuredClone(bridgeEdges)
    bridgeSave.levels[i].saveConnections            = structuredClone(bridgeConnections)
    bridgeSave.levels[i].saveObjects                = structuredClone(bridgeObjects)
    bridgeSave.levels[i].saveCost                   = structuredClone(cost)

    // if saving locally, push entire saved levels list to localStorage
    if (localSave) {
        localStorage.setItem(localSaveAlias + profileName, JSON.stringify(bridgeSave))

        sendMessage(true, "savedData")
    }
}

function loadBridge(localLoad = true) {
    if (localLoad) {
        bridgeSave = JSON.parse(localStorage.getItem(localSaveAlias + saveName))
    }

    let i = selectedLevel
    if (bridgeSave !== null && bridgeSave.levels[i].saveEdges.length > 0) {
        bridgeSelectedVertex   = null
        previousPlayerSetPoint = null
        previousPlayerSetPoint = null
        bridgeVertices         = null
        bridgeEdges            = null
        bridgeConnections      = null
        bridgeObjects          = null
        cost                   = null

        bridgeSelectedVertex   = bridgeSave.levels[i].saveSelectedVertex
        previousPlayerSetPoint = bridgeSave.levels[i].savePreviousPlayerSetPoint
        bridgeVertices         = bridgeSave.levels[i].saveVertices
        bridgeEdges            = bridgeSave.levels[i].saveEdges
        bridgeConnections      = bridgeSave.levels[i].saveConnections
        bridgeObjects          = bridgeSave.levels[i].saveObjects
        cost                   = bridgeSave.levels[i].saveCost

        updateBudget()

        bridgeHasChanged = true

        if (localLoad) {
            sendMessage(true, "loadedData")
        }
    }
}

function resetBridge(localSave = true) {
    if (localSave) {
        localStorage.removeItem(localSaveAlias + saveName)
    }

    bridgeSave = structuredClone(bridgeSaveBasis)
}




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
        mass: 1,

        isSolid: false,
    },
    p: { // permanent
        radius: 6,
        selectedRadius: 8,
        mass: Infinity,

        isSolid: true,
    },
}

let allowedEdgeTypes = ["r", "w", "s"]
let edgeProperties = {
    w: { // wood
        name: "Wooden Beam",
        description: "Strong, cheap, and - most importantly - cheap.<br>Wood is the ideal material for creating small, durable constructions.",
        icon: "-",

        radius: 2, // in centimeters (pixels)
        maxLength: 6, // in meters (100ths of pixels) // chapter 5 of https://alsyedconstruction.com/maximum-beam-span-for-residential-construction/
        cylinderVolume: 12.566370614359172, // π * radius², computed with js
        cost: 0.002940, // per cm³
        density: 0.85, // g/cm³ // oak wood from https://educatoral.com/density_of_substances.html
        stiffness: 0,
    },

    s: { // steel
        name: "Steel Beam",
        description: "A material on the stronger side of things.<br>Steel can be used when a small structure has to support a lot of weight.",
        icon: "—",

        radius: 2.5,
        maxLength: 18, // https://steelconstruction.info/Long-span_beams
        cylinderVolume: 19.634954084936208,
        cost: 0.010775,
        density: 7.75, // bottom value from https://en.wikipedia.org/wiki/Steel
        stiffness: 0,
    },

    r: { // road
        name: "Concrete Road",
        description: "Material tested and prepared for carrying heavy loads.",
        icon: "_",

        radius: 3,
        maxLength: 7, // https://www.quora.com/What-is-the-maximum-span-for-a-simply-supported-concrete-beam
        cylinderVolume: 28.274333882308138,
        cost: 0.005685,
        density: 2.4, // https://en.wikipedia.org/wiki/Properties_of_concrete
        stiffness: 0,
    },
}



function drawBridge(verticesArray = bridgeVertices, edgesArray = bridgeEdges) {
    clearCanvas()

    // draw objects
    for (let i = 0; i < bridgeObjects.length; i++) {
        let o = bridgeObjects[i]
        drawObject(o)
    }

    // draws the grid only if you need to
    if (alignToGrid && showGrid) {
        drawGrid()
    }

    // draw edges
    for (let i = 0; i < edgesArray.length; i++) {
        let e = edgesArray[i]

        // get vertices from the vertex array
        let p0 = verticesArray[e[0]]
        let p1 = verticesArray[e[1]]
        drawEdge(p0, p1, e[2])
    }

    // draw vertices
    for (let i = 0; i < verticesArray.length; i++) {
        let v = verticesArray[i]
        ctx.beginPath()
        drawVertex(v[0], v[1], v[2])
        ctx.fill()
    }

    // draw selected vertex
    if (bridgeSelectedVertex !== null && !isSimulating) {
        let v = verticesArray[bridgeSelectedVertex]
        drawSelectedPoint(v[0], v[1], v[2])
    }

    // draws the car
    // for now its called twice so the car will appear
    car.drawCar()
    car.carHitbox()
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
            setCanvasStrokeWidth(2 * edgeProperties.r.radius)
            drawLine(p0[0], p0[1], p1[0], p1[1])
            break;
        }

        case "w": { // wooden beam edge
            setCanvasStrokeColor("wooden")
            setCanvasStrokeWidth(2 * edgeProperties.r.radius)
            drawLine(p0[0], p0[1], p1[0], p1[1])
            break;
        }

        case "s": { // steel beam edge
            setCanvasStrokeColor("steel")
            setCanvasStrokeWidth(2 * edgeProperties.r.radius)
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

    setCanvasStrokeWidth(1)
    setCanvasStrokeColor("grid")
    drawEmptyPoint(x, y, edgeProperties[playerSetEdgesType].maxLength * 100)
}

// sets playerSetEdgesType
function setEdgeType(edgeType) {
    playerSetEdgesType = edgeType

    setSelectedEdgeButton(edgeType)

    bridgeHasChanged = true
}

function listAllowedEdgeTypes() {
    let edgesList = ""

    if (allowedEdgeTypes.length == 1) {
        let e = edgeProperties[allowedEdgeTypes[0]]

        edgesList = `<button id="edgeSelector${e.name}" class="menuButton borderRadiusTabLeft" onclick="setEdgeType('${allowedEdgeTypes[0]}')">${e.icon}</button>
            <div class="buttonDescription buttonDescriptionLeft">
                <label for="edgeSelector${e.name}">
                    <p><b>Set Edge Type to<br>${e.name}</b></p>
                    <p>${e.description}</p>
                    <p>Maximal lenght: <span class="emphasis">${e.maxLength}m</span></p>
                    <p>Cost per m³: <span class="emphasis">${round(e.cost * 1000000)}€</span></p>
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
                    <p><b>Set Edge Type to<br>${e.name}</b></p>
                    <p>${e.description}</p>
                    <p>Maximal lenght: <span class="emphasis">${e.maxLength}m</span></p>
                    <p>Cost per m³: <span class="emphasis">${round(e.cost * 1000000)}€</span></p>
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

function drawObject(o) {
    switch (o[0]) {
        case "p": { // polygon
            ctx.beginPath()
            for (let i = 0; i < o[2].length; i++) {
                ctx.lineTo(o[2][i][0], o[2][i][1])
            }
            ctx.closePath()
            break
        }

        case "e": { // ellipse
            ctx.beginPath()
            drawEllipse(
                o[2][0],
                o[2][1],
                o[2][2],
                o[2][3] || o[2][2], // if there's no yradius, it's the same as xradius
                -o[2][4] || 0 // defaultAngle = 0
            )
            ctx.closePath()
            break
        }

        default: {break}
    }

    if (o[1][0] !== undefined) {
        setCanvasStrokeColor(o[1][0])
        setCanvasStrokeWidth(o[1][1])

        ctx.stroke()
    }

    if (o[1][2] !== undefined) {
        setCanvasFillColor(o[1][2])

        ctx.fill()
    }
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

let profileName = ""
function setProfileName() {
    profileName = "Default"

    saveName = document.getElementById("profileName").value 
    if (saveName.length > 0) {
        profileName = saveName
    }

    document.getElementById("profileNameValue").innerText = profileName
    document.getElementById("profileSaveDataName").innerText = profileName
    document.getElementById("profileLoadDataName").innerText = profileName
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

function addEdge(v0, v1, type, vertexArray = bridgeVertices, edgesArray = bridgeEdges) {
    if (v0 != v1) {
        if (checkIfVerticesConnect(v0, v1)) {
            if (canDeleteEdges) {
                deleteEdgeBetweenPoints(v0, v1)
                return true
            }
        } else {
            let edgeTypeProperties = edgeProperties[type]

            let p0 = vertexArray[v0]
            let p1 = vertexArray[v1]
            let edgeLength = pointDistance(p0, p1)
            let edgeVolume = edgeTypeProperties.cylinderVolume * edgeLength
            let edgeMass = edgeVolume * edgeTypeProperties.density

            let edgeCost = edgeTypeProperties.cost * edgeVolume
            updateBudget(edgeCost)

            edgesArray.push([v0, v1, type, edgeLength, edgeMass, edgeCost])
            addBridgeConnection(v0, v1)
            addBridgeConnection(v1, v0)
            return true
        }
    }

    return false // returns true if it could add/remove an edge
}

function deleteEdgeBetweenPoints(p0, p1, edgesArray = bridgeEdges) {
    if (checkIfVerticesConnect(p0, p1)) {
        for (let i = 0; i < edgesArray.length; i++) {
            e = edgesArray[i]

            if ((e[0] == p0 || e[0] == p1) && (e[1] == p0 || e[1] == p1)) {
                edgesArray.splice(i, 1)

                updateBudget(-e[5])
            }
        }

        deleteBridgeConnection(p0, p1)
        deleteBridgeConnection(p1, p0)

        bridgeHasChanged = true
    }
}

let startVelocity = [0, 0]
function addVertex(x, y, type, vertexArray = bridgeVertices) {
    if (alignToGrid) {
        // when aligning, find the nearest grid-point coordinates
        x = gridSize * Math.round(x / gridSize)
        y = gridSize * Math.round(y / gridSize)

        vertexArray.push([x, y, type, startVelocity])
    } else {
        vertexArray.push([x, y, type, startVelocity])
    }
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

    // checkBudget()

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

let infiniteEdgeLengths = false
let makeLongerEdgesShorter = true

let playerSetPointsType = "n"
let playerSetEdgesType = "w"
let playerContinuousBuilding = true

let previousPlayerSetPoint = null
let playerClickInaccuracy = 8 // px
let bridgeHasChanged = false // updates to true if the bridge has been updated by the user
function setPlayerPoint(x, y) {
    let nearPoints = detectNearPoints(x, y, playerClickInaccuracy)
    if (nearPoints.length != 0) {
        // makes the selected vertex equal to the first nearest point
        bridgeSelectedVertex = nearPoints[0]

        if (previousPlayerSetPoint === null) {
            // no previous point

            previousPlayerSetPoint = bridgeSelectedVertex
        } else {
            // there was a previous point

            if (!infiniteEdgeLengths) {
                let lastVertex = bridgeVertices[previousPlayerSetPoint]
                let selectedVertex = bridgeVertices[bridgeSelectedVertex]
                let pointToPointLength = pointDistance(lastVertex, selectedVertex)

                if (pointToPointLength > (edgeProperties[playerSetEdgesType].maxLength * 100)) {
                    return null
                }
            }

            addEdge(previousPlayerSetPoint, bridgeSelectedVertex, playerSetEdgesType)

            if (playerContinuousBuilding) {
                previousPlayerSetPoint = bridgeSelectedVertex
            } else {
                previousPlayerSetPoint = null
                bridgeSelectedVertex = null
            }
        }
    } else {
        if (previousPlayerSetPoint === null) {
            // no previous point

            previousPlayerSetPoint = bridgeVertices.length // set the previous point to the top index of the vertex array
            addVertex(x, y, playerSetPointsType)
            bridgeSelectedVertex = previousPlayerSetPoint
        } else {
            // there was a previous point

            if (!infiniteEdgeLengths) {
                let lastVertex = bridgeVertices[previousPlayerSetPoint]
                let pointToPointLength = pointDistance([x, y], lastVertex)
                let lengthMax = edgeProperties[playerSetEdgesType].maxLength * 100

                if (pointToPointLength > lengthMax) {
                    let mult = lengthMax / pointToPointLength

                    let distanceX = lastVertex[0] - x
                    let distanceY = lastVertex[1] - y
                    let currentPlayerSetPoint = bridgeVertices.length

                    addVertex(lastVertex[0] - (distanceX * mult), lastVertex[1] - (distanceY * mult), playerSetPointsType)
                    addEdge(previousPlayerSetPoint, currentPlayerSetPoint, playerSetEdgesType)

                    if (playerContinuousBuilding) {
                        previousPlayerSetPoint = currentPlayerSetPoint
                    } else {
                        previousPlayerSetPoint = null
                    }

                    bridgeSelectedVertex = currentPlayerSetPoint
                    bridgeHasChanged = true
                    return null
                }
            }

            let currentPlayerSetPoint = bridgeVertices.length
            addVertex(x, y, playerSetPointsType)
            addEdge(previousPlayerSetPoint, currentPlayerSetPoint, playerSetEdgesType)

            if (playerContinuousBuilding) {
                previousPlayerSetPoint = currentPlayerSetPoint
            } else {
                previousPlayerSetPoint = null
            }

            bridgeSelectedVertex = currentPlayerSetPoint
        }
    }

    bridgeHasChanged = true
}

let alignToGrid = true
let gridSize = 16
function detectMouseOnCanvas(event) {
    if (isSimulating) { // does exactly nothing when the bridge is being simulated (is collapsing)
        return 0
    }

    let boundingRect = document.getElementById("canvasBridge").getBoundingClientRect()

    let clickedX = -(canvasSizeHalf[0] - (event.clientX - boundingRect.x) - canvasTranslate[0]) * canvasScaleReciprocal
    let clickedY = (canvasSizeHalf[1] - (event.clientY - boundingRect.y) - canvasTranslate[1]) * canvasScaleReciprocal

    setPlayerPoint(clickedX, clickedY)
}

function simulateMouseOnCanvas(x, y) {
    let boundingRect = document.getElementById("canvasBridge").getBoundingClientRect()
    detectMouseOnCanvas({clientX: x + boundingRect.x, clientY: y + boundingRect.y})
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
    bridgeSelectedVertex = null
    previousPlayerSetPoint = null

    bridgeHasChanged = true
}

function deleteSelectedPoint() {
    if (bridgeSelectedVertex !== null) {
        if (!vertexProperties[bridgeVertices[bridgeSelectedVertex][2]].isSolid) {
            deleteVertex(bridgeSelectedVertex)
        } else {
            sendMessage(true, "vertexDeletion")
        }
    }

    unSelectPoint()
}

function selectLastVertex() {
    if (bridgeSelectedVertex === null) {
        bridgeSelectedVertex = bridgeVertices.length - 1
    } else {
        if (bridgeSelectedVertex != 0) {
            bridgeSelectedVertex -= 1
        } else {
            bridgeSelectedVertex = bridgeVertices.length - 1
        }
    }

    previousPlayerSetPoint = bridgeSelectedVertex
    bridgeHasChanged = true
}

let canvasStep = 16
function move(direction) {
    let step = canvasStep * canvasScale
    if (event.shiftKey) {
        step *= 16
    }

    switch (direction) {
        case "ul": {translateCanvas(-step, -step); break;} case "u": {translateCanvas(0, -step); break;} case "ur": {translateCanvas(step, -step); break;}
        case  "l": {translateCanvas(-step, 0);     break;}                                               case  "r": {translateCanvas(step, 0);     break;}
        case "dl": {translateCanvas(-step, step);  break;} case "d": {translateCanvas(0, step);  break;} case "dr": {translateCanvas(step, step);  break;}

        case "0": {
            translateCanvasReset(); 
            break;
        }
        default: {break;}
    }
}





// //////////////////////////////////////////////////////////////////////
// STYLING THE GAME
// //////////////////////////////////////////////////////////////////////

let currentStyle = 2
let currentStyleName = "Blueprint"
let gameStyles = [
    ["Black & White", "#000000"],
    ["Greyscale", "#606060"],
    ["Blueprint", "#2294f3"],
    ["Strawberry", "#e39695"],
    ["Blood", "#dd0c39"],
]

function applyStyle(styleId) {
    currentStyle = styleId
    currentStyleName = gameStyles[currentStyle][0]
    document.getElementById("html").setAttribute("colorScheme", currentStyleName)

    bridgeHasChanged = true
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

    if (isSimulating && !isSimulationPaused) {
        simulateBridge()
    }
}

window.onload = function() {
    resetCanvas()

    applyStyle(currentStyle)

    document.getElementById("canvasBridge").addEventListener("click", detectMouseOnCanvas)
    document.getElementById("canvasBridge").addEventListener("wheel", scaleCanvasWithWheel)

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

    document.getElementById("profileSaveData").addEventListener("click", saveBridge)
    document.getElementById("profileLoadData").addEventListener("click", loadBridge)
    document.getElementById("profileResetData").addEventListener("click", resetBridge)

    document.getElementById("topMenuStartSimulation").addEventListener("click", startSimulating)
    document.getElementById("topMenuStopSimulation").addEventListener("click", stopSimulating)

    document.getElementById("topMenuSimulationStartedPause").addEventListener("click", toggleSimulationPause)
    document.getElementById("topMenuSimulationStartedForward").addEventListener("click", forwardSimulation)
    
    document.getElementById("budgetControlProgress").addEventListener("click", checkBudget)

    // menu buttons
    document.getElementById("optionsMenuOpenButton").addEventListener("click", toggleMenuOptions)
    document.getElementById("optionsMenuCloseButton").addEventListener("click", toggleMenuOptions)

    document.getElementById("levelSelectorOpenButton").addEventListener("click", toggleMenuLevels)
    document.getElementById("levelSelectorCloseButton").addEventListener("click", toggleMenuLevels)

    document.getElementById("playSelectedLevelButton").addEventListener("click", playSelectedLevel)

    // checkboxes, inputs
    document.getElementById("canDeleteEdges").addEventListener("change", setEdgeDeletion)
    document.getElementById("canContinuousBuilding").addEventListener("change", setContinuousBuilding)
    document.getElementById("showArrowset").addEventListener("change", toggleArrowset)
    document.getElementById("canAlignToGrid").addEventListener("change", setAlignToGrid)
    document.getElementById("showGrid").addEventListener("change", setShowGrid)

    document.getElementById("profileName").addEventListener("change", setProfileName)



    setInterval(gameLoop, tickTime * 1000)

    setEdgeDeletion()
    setContinuousBuilding()
    setAlignToGrid()
    setShowGrid()
    setProfileName()

    sendMessage(true, "welcome")

    setCurrentLevel(0)
    drawBridge()

    listStyles()
    displayLevelInfo(selectedLevel)
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

            // simulation
            case " ": {
                if (event.ctrlKey) {
                    forwardSimulation()
                    break
                }

                if (!event.shiftKey) {
                    toggleSimulating()
                } else {
                    toggleSimulationPause()
                }

                break;
            }
        
            default: {break}
        }
    } else {
        if (event.key == "\`") {
            toggleMenuOptions()
            // canUseKeyboardShortcuts = true
        } else if (event.key == "Q") {
            toggleMenuLevels()
            // canUseKeyboardShortcuts = true
        }
    }
}

// movement of camera
window.onkeydown = (event) => {
    if (canUseKeyboardShortcuts) {
        let step = canvasStep
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

            case "Numpad5": {
                translateCanvas(-canvasTranslate[0], -canvasTranslate[1]); break;
            }

            case "Numpad0": {
                translateCanvasReset()
                scaleCanvasZero()
                break;
            }
        }
    }
}



