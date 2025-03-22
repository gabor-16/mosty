let c = document.getElementById("canvasBridge")
let ctx = c.getContext("2d")


// All drawing functions assume 1200 x 800 canvas
let canvasSize = [1200, 800]
let canvasSizeHalf = [600, 400]
let canvasTranslate = [0, 0] // used to translate the canvas
let canvasScale = 1 // used to scale the canvas
let canvasScaleReciprocal = 1 / canvasScale



// 



// resetting canvas's values //////////////////////////////////////////////////////////////////////

function resetCanvas() {
    ctx.fillStyle = "#050403"
    ctx.lineWidth = "2"
    ctx.lineJoin = "round"

    resetCanvasTransform()
}

// Resets canvas matrix transform, and sets the transformation center to the bottom-left corner of the canvas
function resetCanvasTransform() {
    ctx.setTransform(canvasScale, 0, 0, -canvasScale, canvasSizeHalf[0] - canvasTranslate[0], canvasSizeHalf[1] - canvasTranslate[1])
}

// Clears everything from the canvas's viewbox
function clearCanvas() {
    ctx.clearRect((canvasTranslate[0] - canvasSizeHalf[0]) * canvasScaleReciprocal, (-canvasTranslate[1] - canvasSizeHalf[1]) * canvasScaleReciprocal, canvasSize[0] * canvasScaleReciprocal, canvasSize[1] * canvasScaleReciprocal)
}

// resetting canvas's values //////////////////////////////////////////////////////////////////////

const CANVASCOLORS = {
    "Black & White": {
        "white": "#f0f7f3",
        "black": "#050403",
        "gray": "#808080",

        "grid": "#ffffff",

        "wooden": "#a97742",
        "road": "#a5a7a2",
        "steel": "#5b1a16",
    },

    "Greyscale": {
        "white": "#f0f7f3",
        "black": "#050403",
        "gray": "#808080",

        "grid": "#a0a0a0",

        "wooden": "#a97742",
        "road": "#a5a7a2",
        "steel": "#5b1a16",
    },

    "Blueprint": {
        "white": "#f0f7f3",
        "black": "#050403",
        "gray": "#808080",

        "grid": "#a0a0a0",

        "wooden": "#a97742",
        "road": "#a5a7a2",
        "steel": "#5b1a16",
    },

    "Strawberry": {
        "white": "#f0f7f3",
        "black": "#050403",
        "gray": "#808080",

        "grid": "#a0a0a0",

        "wooden": "#a97742",
        "road": "#a5a7a2",
        "steel": "#5b1a16",
    },

    "Blood": {
        "white": "#f0f7f3",
        "black": "#050403",
        "gray": "#808080",

        "grid": "#a0a0a0",

        "wooden": "#a97742",
        "road": "#a5a7a2",
        "steel": "#5b1a16",
    },
}
function setCanvasFillColor(color) {
    ctx.fillStyle = CANVASCOLORS[currentStyleName][color]
}

function setCanvasStrokeColor(color) {
    ctx.strokeStyle = CANVASCOLORS[currentStyleName][color]
}

function setCanvasStrokeWidth(size) {
    ctx.lineWidth = size
}

//////////////////////////////////////////////////////////////////////

function translateCanvas(x, y) {
    canvasTranslate = [canvasTranslate[0] + x, canvasTranslate[1] + y]
    resetCanvasTransform()

    bridgeHasChanged = true
}

function translateCanvasReset() {
    translateCanvas(-canvasTranslate[0], -canvasTranslate[1])
}

function scaleCanvas(mult = 2) {
    canvasScale *= mult
    canvasScaleReciprocal = 1 / canvasScale

    canvasTranslate = [canvasTranslate[0] * mult, canvasTranslate[1] * mult]
    resetCanvasTransform()

    bridgeHasChanged = true
}

let canvasScalingFactor = 2 // if ever changed, change the button info as well
function scaleCanvasUp() {scaleCanvas()}
function scaleCanvasDown() {scaleCanvas(1 / canvasScalingFactor)}
function scaleCanvasZero() {scaleCanvas(canvasScaleReciprocal); scaleCanvas(levelsList[currentLevel].cameraScale)}

function scaleCanvasWithWheel(wheel) {
    let sign = Math.sign(wheel.deltaY)
    if (sign > 0) {
        scaleCanvasDown()
    } else if (sign < 0) {
        scaleCanvasUp()
    }
}






// DRAWING SMALLER COMPONENTS



function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function drawRect(x, y, w, h) {
    ctx.fillRect(x, y, w, h)
}

function drawEmptyRect(x, y, w, h) {
    ctx.strokeRect(x, y, w, h)
}

// /doc/angledRectDoc.png for visual representation
function drawAngledRect(cx, cy, angle, length, margin) {
    ctx.translate(cx, cy)
    ctx.rotate(-angle)

    ctx.fillRect(-margin, -margin, 2 * margin + length, 2 * margin)
}
// to draw an angled square with side length a do: drawAngledRect(cx, cy, angle, 0, a / 2)

function drawSquare(x, y, r) {
    ctx.fillRect(x - r, y - r, 2 * r, 2 * r)
}

function drawEmptySquare(x, y, r) {
    ctx.strokeRect(x - r, y - r, 2 * r, 2 * r)
}

function drawPoint(x, y, r) {
    ctx.beginPath()
    ctx.arc(x - r, y - r, r, 0, 2 * π)
    ctx.fill()
}

function drawEmptyPoint(x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * π)
    ctx.stroke()
}

function drawEllipse(x, y, rx, ry, angle) {
    ctx.ellipse(x, y, rx, ry, angle, 0, 2 * π)
}

function drawText(x, y, text, align = "center", font = "48px sans-serif") {
    ctx.textAlign = align
    ctx.font = font

    ctx.transform(1, 0, 0, -1, 0, 0)
    ctx.fillText(text, x, -y)
    ctx.transform(1, 0, 0, -1, 0, 0)
}

function drawPolygon(points) {
    ctx.beginPath()
    for (let i = 0; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1])
    }
    ctx.closePath()
}


// Continious versions of some of the above functions:
// (they can be used one after the other, without stroking/filling, which makes it less expensive)

function drawLineCont(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
}

function drawPointCont(x, y, r) {
    ctx.moveTo(x, y)
    ctx.arc(x, y, r, 0, 2 * π)
}

function drawPointCenteredCont(x, y, r) {
    ctx.moveTo(x, y)
    ctx.arc(x - r, y - r, r, 0, 2 * π)
}

function drawEmptyPointCont(x, y, r) {
    ctx.arc(x, y, r, 0, 2 * π)
}



// DRAWING BIGGER COMPONENTS



function drawGrid() {
    if (canvasScale <= 0.125) { // don't draw grid if it's not needed (scale too big)
        return 0
    }

    // set variables
    let smallestX = (canvasTranslate[0] - canvasSizeHalf[0]) * canvasScaleReciprocal
    let smallestY = (-canvasTranslate[1] - canvasSizeHalf[1]) * canvasScaleReciprocal

    let biggestX = canvasScaleReciprocal * (canvasTranslate[0] + canvasSizeHalf[0])
    let biggestY = canvasScaleReciprocal * (-canvasTranslate[1] + canvasSizeHalf[1])

    let gridLinesYAmount = canvasSize[1] * canvasScaleReciprocal / gridSize
    let firstYOffset = -(smallestY % gridSize)
    let y = smallestY + firstYOffset

    let gridLinesXAmount = canvasSize[0] * canvasScaleReciprocal / gridSize
    let firstXOffset = -(smallestX % gridSize)
    let x = smallestX + firstXOffset

    // drawGrid
    ctx.beginPath()
    setCanvasStrokeColor("grid")
    setCanvasStrokeWidth(canvasScaleReciprocal)
    for (let i = 0; i <= gridLinesYAmount; i++) {
        drawLineCont(smallestX, y + i * gridSize, biggestX, y + i * gridSize)
    }

    for (let i = 0; i <= gridLinesXAmount; i++) {
        drawLineCont(x + i * gridSize, smallestY, x + i * gridSize, biggestY)
    }
    ctx.stroke()

    // l(gridLinesXAmount, gridLinesYAmount)
}


// 
// 
// 

function setDrawingCanvas(id, width, height) {
    c = document.getElementById(id)
    ctx = c.getContext("2d")

    canvasSize = [width, height]
    canvasSizeHalf = [width / 2, height / 2]
}

function toggleDrawingCanvas(levelId) {
    // Change canvas and draw the required level
    setDrawingCanvas("levelSelectorCanvas", 600, 400)

    let pastScale = canvasScale
    scaleCanvasZero()
    scaleCanvasDown() // because the level canvas is (should be) 2x smaller

    clearCanvas()
    drawBridgeLevelWindow(levelId)

    // Change canvas back
    setDrawingCanvas("canvasBridge", 1200, 800)
    scaleCanvasZero()
    scaleCanvas(pastScale)
}

function drawBridgeLevelWindow(levelId) {
    // draw level on the small canvas

    let levelData = levelsList[levelId]

    for (let i = 0; i < levelData.objects.length; i++) {
        let o = levelData.objects[i]
        drawObject(o)
    }

    for (let i = 0; i < levelData.edges.length; i++) {
        let e = levelData.edges[i]

        let p0 = levelData.vertices[e[0]]
        let p1 = levelData.vertices[e[1]]
        drawEdge(p0, p1, e[2])
    }

    for (let i = 0; i < levelData.vertices.length; i++) {
        let v = levelData.vertices[i]
        ctx.beginPath()
        drawVertex(v[0], v[1], v[2])
        ctx.fill()
    }
}
