const c = document.getElementById("canvasBridge")
const ctx = c.getContext("2d")


// All drawing functions assume 1200 x 800 canvas
const canvasSize = [1200, 800]
const canvasSizeHalf = [600, 400]
let canvasTranslate = [0, 0] // used to translate the canvas
let canvasScale = 1 // used to scale the canvas
let canvasScaleReciprocal = 1 / canvasScale



// 



// resetting canvas's values //////////////////////////////////////////////////////////////////////

function resetCanvas() {
    ctx.fillStyle = "#050403"
    ctx.lineWidth = "2"

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
    "white": "#f0f7f3",
    "black": "#050403",

    "wooden": "#a97742",
    "road": "#a5a7a2",
    "steel": "#5b1a16",
}
function setCanvasFillColor(color) {
    ctx.fillStyle = CANVASCOLORS[color]
}

function setCanvasStrokeColor(color) {
    ctx.strokeStyle = CANVASCOLORS[color]
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

function scaleCanvas(mult) {
    canvasScale *= mult
    canvasScaleReciprocal = 1 / canvasScale

    canvasTranslate = [canvasTranslate[0] * mult, canvasTranslate[1] * mult]
    resetCanvasTransform()

    bridgeHasChanged = true
}

let canvasScalingFactor = 2 // if ever changed, change the button info as well
function scaleCanvasUp() {scaleCanvas(2)}
function scaleCanvasDown() {scaleCanvas(1 / canvasScalingFactor)}
function scaleCanvasZero() {scaleCanvas(canvasScaleReciprocal)}






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


