// maybe TODO: when you inspect a car it shows it's properties or smth
let carsList = [
    {
        name: "Basic Car",
        desc: "It's a normal car, it drives.",
        mass: 0.4, // in tons
        carModel: null, //"../img/cars/samochodzik_2.png", // put here model of the car
        specialQuirk: "None", // diffrent cars may have special properties, maybe ???
        speed: 1, // diffrent cars can have diffrent speeds
        position: [0, 0], // cars verticle position
        velocity: [0, 0], // cars velocity
        hitbox: [80, 80], // hitbox size
        acceleration: [0, 0]
    },
];
let carGravityValue = [0 , 9.807]

class Car{
    constructor(name, desc, mass, carModel, specialQuirk, speed, position, velocity, hitbox, rotation, acceleration) {
        this.name = name
        this.desc = desc
        this.mass = mass
        this.carModel = carModel
        this.img = new Image()
        this.img.src = this.carModel
        this.specialQuirk = specialQuirk
        this.speed = speed
        this.position = position
        this.velocity = velocity
        this.hitbox = hitbox
        this.rotation = rotation
        this.acceleration = acceleration
    }
    drawCar() {
        if (this.img.complete) { // Check if image is loaded
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(this.img, this.position[0], this.position[1], 80, 80);
            ctx.restore();
            bridgeHasChanged = true;
        } else {
            this.img.onload = () => {
                ctx.save();
                ctx.scale(1, -1);
                ctx.drawImage(this.img, this.position[0], this.position[1], 80, 80);
                ctx.restore();
                bridgeHasChanged = true;
            };
        }
    }
    moveCar() {
        this.position[0] += this.velocity[0] * deltaTime
        this.position[1] += this.velocity[1] * deltaTime
    }
    // this is a very basic collision detection, you should use a better one
    carGravity(deltaTime)
    {
        const force = this.mass * carGravityValue[1]
        this.speed += force / this.mass
        this.velocity[1] += this.speed * deltaTime
    }

    carMoveForward()
    {   
        this.velocity[0] += this.acceleration[0] * deltaTime
        this.velocity[1] += this.acceleration[1] * deltaTime
    }
    carCollisionResolution(other) {
        if(CollisionIntersect(this.hitbox, other))
        {
            this.velocity[1] = 0
            this.speed = 0
            car.carMoveForward()
        }
        // CollisionIntersect(this.hitbox, other, collisions)
        
        // for(let i = 0; i < collisions.length; i++)
        // {
        //     let c = collisions[i]
        //     if(c[i] === "yes")
        //     {
        //         this.velocity[1] = 0
        //         car.carMoveForward()
        //         break;
        //     }
        // }
         }

    carHitbox()
    {
        // Left up corner = x1, y1; right down corner = x2, y2; left down corner = x3, y3; right up corner = x4, y4;
        const x1 = this.position[0] - 20;
        const y1 = this.position[1] + 20;
        const x2 = this.position[0] + 20;
        const y2 = this.position[1] - 20;
        const x3 = x1;
        const y3 = y2;
        const x4 = x2;
        const y4 = y1;
        ctx.save();
        ctx.scale(1, -1);
        drawLine(x1, y1, x3, y3)
        drawLine(x3, y3, x2, y2)
        drawLine(x2, y2, x4, y4)
        drawLine(x4, y4, x1, y1)
        ctx.restore();
        this.hitbox = []
        this.hitbox.push([x1, y1], [x4, y4], [x2, y2], [x3, y3]);
    }
}

function addCar() {
    let car = new Car("Basic Car", "It's a normal car, it drives.", 1500, "../img/cars/samochodzik_2.png", "None", [0, 0], [0, 0], [0, 0], [])
    car.drawCar()
    return car
}
function carForces() {
    // add forces here
    car.carGravity()
}

function normalize(v) {
    let length = Math.hypot(v[0], v[1]);
    return [v[0] / length, v[1] / length];
}
function projectReversedVerticies(verticies, axis) {

    axis = normalize(axis)

    let project = dot(verticies[0], axis)
    let min = project;
    let max = project;

    for (let i = 0; i<verticies.length; i++)
    {
        let v = verticies[i]
        let project = dot(v, axis)
        project *= -1
        if(project < min) 
        {
            min = project
        }
        else if(project > max)
        {
            max = project
        }
    }

    return [min, max]
}

function flipY(v)
{
    let flippedY = []
    let i=0
    for(let j = 0; j < v.length; j++)
        {
            flippedY.push([v[i][0], -v[i][1]])
            i++
        }
    return flippedY
}

function projectReversedVerticies(verticies, axis)
{
    axis = normalize(axis)
    let flippedY = flipY(verticies)

    let project = dot(flippedY[0], axis)
    let min = project;
    let max = project;

    for (let i = 0; i<verticies.length; i++)
    {
        let v = flippedY[i]
        let project = dot(v, axis)
        if(project < min) 
        {
            min = project
        }
        else if(project > max)
        {
            max = project
        }
    }

    return [min, max]
}

function projectVerticies(verticies, axis) {

    axis = normalize(axis)


    let project = dot(verticies[0], axis)
    let min = project;
    let max = project;

    for (let i = 0; i<verticies.length; i++)
    {
        let v = verticies[i]
        let project = dot(v, axis)
        if(project < min) 
        {
            min = project
        }
        else if(project > max)
        {
            max = project
        }
    }

    return [min, max]
}

function CollisionIntersect(object1, object2, collisions) {

    let minOverlap = Infinity
    let smallestAxis = []

    for (let i = 0; i < object1.length; i++)
    {
        
        // va is a first verticises in the edge and vb is second
        const va = object1[i]
        const vb = object1[(i+1) % object1.length]
        const edge = [vb[0] - va[0], vb[1] - va[1]]
        const normal = [-edge[1], edge[0]]

        // borders = [min , max]
        const bordersA = projectReversedVerticies(object1, normal)
        const bordersB = projectVerticies(object2, normal)

        let overlap  = Math.min(bordersA[1], bordersB[1]) - Math.max(bordersA[0], bordersB[0])
        if (overlap < minOverlap)
        {
            minOverlap = overlap
            smallestAxis = normal
        }
        if(bordersA[0] >= bordersB[1] || bordersB[0] >= bordersA[1])
        {
            return false
        }
    }


    for (let i = 0; i < object2.length; i++)
    {
        // va is a first verticises in the edge and vb is second
        const va = object2[i]
        const vb = object2[(i+1) % object2.length]
        const edge = [vb[0] - va[0], vb[1] - va[1]];
        const normal = [-edge[1], edge[0]]
        // borders = [min , max]
        const bordersA = projectReversedVerticies(object1, normal)
        const bordersB = projectVerticies(object2, normal)
        if(bordersA[0] >= bordersB[1] || bordersB[0] >= bordersA[1])
        {
            return false
        }
    }
    let d = []
    if (dot(d, smallestAxis) < 0)
        smallestAxis = -smallestAxis;

    mtv_out = smallestAxis * minOverlap;

    return true

}



function circleCollisionDetection(circle1 , circle2) {
    // circle collision detection
    const distance = Math.sqrt(Math.pow(circle2[0]-circle1[0])+Math.pow(circle2[1]-circle1[1]))
    // radius is |r1 + r2|
    const radius = Math.abs(circle1[2] + circle2[2])
    if(distance > radius)
    {
        return false
    }
    else
    {
        return true
    }
}

function centerCalculation(polygon)
{
    flipY(polygon)
    let area = 0;
    let center = [0, 0]
    for(let i = 0; i< polygon.length; i++)
    {
        const x0 = polygon[i][0]
        const y0 = polygon[i][1]
        const x1 = polygon[(i+1) % polygon.length][0]
        const y1 = polygon[(i+1) % polygon.length][1]

        const a = x0 * y1 - x1 * y0;
        area += a
        center[0] += (x0 + x1) * a
        center[1] += (y0 + y1) * a
    }
    area *= 0.5
    center[0] /= (6.0 * area);
    center[1] /= (6.0 * area);
    return center
}

// function addCarVertex(x, y, vertexArray = carsList[0].vertex) {
//     vertexArray.push(x, y)
// }

// FIXME: you have to call this thing twice for it to work, idk why, the car sometimes appears sometimes not, hard to find the cause
// TODO: make the car reappear at default cords when simulation ends
// function drawCar(source) {
//     const img = new Image();
//     img.src = source;
//     ctx.save();
//     ctx.scale(1, -1);
//     ctx.drawImage(img, carsList[0].vertex[0], carsList[0].vertex[1], 80, 80);
//     ctx.restore();
//     bridgeHasChanged = true;
// }

// function rectangleTest() {
//     ctx.fillRect(0, 0, 150, 75);
// }
// // gravity for car, cars y is reversed since the whole canvases y is reversed
// function carGravity(v = carsList) {

//     v.
//     l(v[0].vertex)
//     v[0].vertex = vectorAddReverse(v[0].vertex, vectorMul(deltaTime, gravityValue));
// }

