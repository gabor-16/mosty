// maybe TODO: when you inspect a car it shows it's properties or smth
let carsList = [
    {
        name: "basicCar",
        desc: "It's a normal car, it drives.",
        weight: 1, // in tons
        carModel: "../img/cars/samochodzik_2.png", // put here model of the car
        specialQuirk: "None", // diffrent cars may have special properties, maybe ???
        speed: 10, // diffrent cars can have diffrent speeds
        vertex: [0, 0], // cars verticle position
        velocity: [0,0],
        hitboxes: [[], []], // cords for polygon making the hitbox
    },
    {
        name: "bottomGear",
        desc: "K, I'll have a wiff",
        weight: 1,
        carModel: "../img/cars/pojazd.png",
        specialQuirk: "Ery nice",
        speed: 5,
        vertex: [-50, -50],
        velocity: [0,0],
        hitboxes: [[], []],
    },
];

function addCarVertex(x, y, vertexArray = carsList[0].vertex) {
    vertexArray.push(x, y);
}

// FIXME: you have to call this thing twice for it to work, idk why, the car sometimes appears sometimes not, hard to find the cause
// TODO: make the car reappear at default cords when simulation ends
function drawCar(source, loadedCar) {
    const img = new Image()
    img.src = source
    ctx.save()
    ctx.scale(1, -1)
    ctx.drawImage(img, carsList[loadedCar].vertex[0], carsList[loadedCar].vertex[1], 80, 80)
    ctx.restore()
    bridgeHasChanged = true
}

function rectangleTest() {
    ctx.fillRect(0, 0, 150, 75);
}
// can change it to cars speed for drifting properties
let carGravityValue = [0,1]
// gravity for car, cars y is reversed since the whole canvases y is reversed
function carGravity(v = carsList, loadedCar) {
    // l(v[0].vertex) //for testing
    carGravityValue[1] = carsList[loadedCar].weight * gravityValue[1]
    v[loadedCar].velocity = vectorAddReverse(v[0].velocity, vectorMul(deltaTime, carGravityValue))
    v[loadedCar].vertex = vectorAdd(v[0].vertex, v[0].velocity)
}
