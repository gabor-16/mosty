// maybe TODO: when you inspect a car it shows it's properties or smth
let carsList = [
    {
        name: "Basic Car",
        desc: "It's a normal car, it drives.",
        weight: 1500, // in kg
        carModel: "", // put here model of the car
        specialQuirk: "None", // diffrent cars may have special properties, maybe ???
        speed: 1, // diffrent cars can have diffrent speeds
        vertex:[0,0], // cars verticle position
    }
]

function addCarVertex(x, y, vertexArray = carsList[0].vertex) {
    vertexArray.push(x, y)
}

// FIXME: you have to call this thing twice for it to work, idk why
function drawCar() {    
    const img = new Image()
    img.src = "img/cars/samochodzik_2.png"
    ctx.save()
    ctx.scale(1,-1)
    ctx.drawImage(img, 0,0 , 80, 80)
    ctx.restore()
    bridgeHasChanged = true
}

function testicles() {
    ctx.fillRect(0, 0, 150, 75)
}

function carGravity(v = carsList) {
    v[0].vertex[1] = vectorAdd(v[0].vertex[1], vectorMul(deltaTime, gravityValue))
}