// maybe TODO: when you inspect a car it shows it's properties or smth
let carsList = [
    {
        name: "Basic Car",
        desc: "It's a normal car, it drives.",
        weight: 1500, // in kg
        carModel: "../img/cars/samochodzik_2.png", // put here model of the car
        specialQuirk: "None", // diffrent cars may have special properties, maybe ???
        speed: 1, // diffrent cars can have diffrent speeds
        vertex: [0, 0], // cars verticle position
    },
];

function addCarVertex(x, y, vertexArray = carsList[0].vertex) {
    vertexArray.push(x, y);
}

// FIXME: you have to call this thing twice for it to work, idk why, the car sometimes appears sometimes not, hard to find the cause
// TODO: make the car reappear at default cords when simulation ends
function drawCar(source) {
    const img = new Image();
    img.src = source;
    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(img, carsList[0].vertex[0], carsList[0].vertex[1], 80, 80);
    ctx.restore();
    bridgeHasChanged = true;
}

function rectangleTest() {
    ctx.fillRect(0, 0, 150, 75);
}
// gravity for car, cars y is reversed since the whole canvases y is reversed
function carGravity(v = carsList) {
    l(v[0].vertex)
    v[0].vertex = vectorAddReverse(v[0].vertex, vectorMul(deltaTime, gravityValue));
}
