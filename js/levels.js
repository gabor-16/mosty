


// //////////////////////////////////////////////////////////////////////
// A.U.T.O.S. (Automatic and not Useless Transportation Of Seated persons)
// //////////////////////////////////////////////////////////////////////

let currentAuto = 1
let currentAutoName = "Bicycle"

let selectedAuto = 1
let availableAutosList = []
let autosList = {
    "Bicycle": {
        name: "Bicycle",
        driver: "Sisyphus",
        desc: "A bicycle is a small, lightweight transportation device which uses the power of human legs to move. About the driver... Well, let's just say that he got bored of walking.",

        difficulty: "Easy",

        // other properties like speed, weight, size, etc.
        speed: 10, // / 2 m/s
        maxRoadAngle: 0.25 * π, // the maximum angle of road that the auto is still able to climb
        img: document.getElementById("autoImageBicycle"),
        size: [200, 200], // [width, height]
        points: [
            [80, -100],
            [-80, -100],
            [-100, 50],
            [-80, 100],
            [80, 100],
            [100, 50],
        ],
        mass: 6, // kg
    },

    "Aksiam": {
        name: "Aksiam",
        desc: "One of the smallest cars on the market, it can fit everywhere.",
        driver: "Adam",

        difficulty: "Normal",

        speed: 15,
        maxRoadAngle: 0.25 * π,
        img: document.getElementById("autoImageAksiam"),
        size: [300, 152],
        points: [
            // im not changing the hitboxes
            // dont change very fragile !!!
            [80, -75],
            [-80, -75],
            [-100, 50],
            [-80, 75],
            [80, 75],
            [100, 50],
        ],
        mass: 10,
        
    },

    "Pasat": {
        name: "Pasat",
        desc: "Good ol reliable",
        driver: "Most Polish Men",

        difficulty: "Normal",

        speed: 15,
        maxRoadAngle: 0.25 * π,
        img: document.getElementById("autoImagePasat"),
        size: [400, 127],
        points: [
            // im not changing the hitboxes
            // dont change very fragile !!!
            [80, -75],
            [-80, -75],
            [-100, 50],
            [-80, 75],
            [80, 75],
            [100, 50],
        ],
        mass: 15,
        
    },

    "Audi": {
        name: "Audi",
        desc: "Gotta go fast",
        driver: "Dr Eggman",

        difficulty: "Hard",

        speed: 20,
        maxRoadAngle: 0.25 * π,
        img: document.getElementById("autoImageAudi"),
        size: [400, 120],
        points: [
            // im not changing the hitboxes
            // dont change very fragile !!!
            [80, -75],
            [-80, -75],
            [-100, 50],
            [-80, 75],
            [80, 75],
            [100, 50],
        ],
        mass: 15,
        
    },

    "Motor": {
        name: "Motor",
        desc: "1000 cc, you don't see that everyday",
        driver: "Dawid",

        difficulty: "Extreme",

        speed: 25,
        maxRoadAngle: 0.25 * π,
        img: document.getElementById("autoImageAudi"),
        size: [300, 179],
        points: [
            // im not changing the hitboxes
            // dont change very fragile !!!
            [80, -75],
            [-80, -75],
            [-100, 50],
            [-80, 75],
            [80, 75],
            [100, 50],
        ],
        mass: 8,
        
    },

    "Tir": {
        name: "Tir",
        desc: "Transports very secret data",
        driver: "Mr.Duck",

        difficulty: "Impossible",

        speed: 10,
        maxRoadAngle: 0.25 * π,
        img: document.getElementById("autoImageTir"),
        size: [600, 127],
        points: [
            // im not changing the hitboxes
            // dont change very fragile !!!
            [80, -75],
            [-80, -75],
            [-100, 50],
            [-80, 75],
            [80, 75],
            [100, 50],
        ],
        mass: 20,
        
    },



    // different "party cars" - cars that are just goofy, are a reference to something, and other things like that..



    // "Cybertruck": { // blows up under any slight inconvinience
    //     name: "Cybertruck",

    // },

    // "Lunar Roving Vehicle": { // has a different gravity
    //     name: "Lunar Roving Vehicle",

    // }
}

function selectNextAuto() {
    selectedAuto += 1
    displayAutoInfo()
}

function selectPreviousAuto() {
    selectedAuto -= 1
    displayAutoInfo()
}

function selectFirstAuto() {
    selectedAuto = 0
    displayAutoInfo()
}

function selectLastAuto() {
    selectedAuto = availableAutosList.length - 1
    displayAutoInfo()
}

function displayAutoInfo(autoId = selectedAuto) {
    let autoName = availableAutosList[autoId]
    let aut = autosList[autoName]

    if (autoId <= 0) {
        autoId = 0
        addAttribute("autoSelectorPreviousButton", "disabled")
        addAttribute("autoSelectorFirstButton", "disabled")
    } else {
        removeAttribute("autoSelectorPreviousButton", "disabled")
        removeAttribute("autoSelectorFirstButton", "disabled")
    }

    if (autoId >= availableAutosList.length - 1) {
        autoId = availableAutosList.length - 1
        addAttribute("autoSelectorNextButton", "disabled")
        addAttribute("autoSelectorLastButton", "disabled")
    } else {
        removeAttribute("autoSelectorNextButton", "disabled")
        removeAttribute("autoSelectorLastButton", "disabled")
    }

    document.getElementById("optionsAutoSelectorName").innerText = aut.name
    document.getElementById("optionsAutoSelectorStig").innerText = aut.driver
    document.getElementById("optionsAutoMaxAngle").innerHTML = round(aut.maxRoadAngle)
    document.getElementById("optionsAutoDescription").innerHTML = aut.desc

    removeClass("autoSelectorInfo", "difficultyEasy")
    removeClass("autoSelectorInfo", "difficultyNormal")
    removeClass("autoSelectorInfo", "difficultyHard")
    removeClass("autoSelectorInfo", "difficultyExtreme")
    removeClass("autoSelectorInfo", "difficultyImpossible")

    addClass("autoSelectorInfo", "difficulty" + aut.difficulty)
    document.getElementById("optionsAutoSelectorDifficulty").innerText = aut.difficulty
}

function setAvailableAutos() {
    availableAutosList = levelsList[selectedLevel].availableAutos
}



// //////////////////////////////////////////////////////////////////////
// LEVELS
// //////////////////////////////////////////////////////////////////////

let currentLevel = 0

let selectedLevel = 0
let levelsList = [
    {
        name: "Tutorial",
        desc: "If you can get throught this level, you can probably play the rest of the game just fine.\nThat's what Tutorials are for, after all.",
        budget: 1000, // in euro
        currentCost: 0,
        difficulty: "Easy", // Easy, Normal, Hard, Extreme, Impossible

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 0],
        gravity: gravityEarth,
        maxCarDistanceFromCenter: 100,

        allowedEdges: ["w", "s", "r"], // sets level's allowed edges
        maxEdgesAmount: [Infinity, Infinity, Infinity],
        availableAutos: ["Bicycle", "Aksiam"],

        // the starting values for all of the bridge values
        vertices: [
            [-256, 0, "p", [0, 0]],
            [256, 0, "p", [0, 0]],
            [-192, -256, "p", [0, 0]],
            [192, -256, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            // all of the decoration objects have simillar structure:
            // [type, color & drawing options, parameteres]

            // color & drawing options:
            // [stroke color, stroke width, fill color]

            // types:
            //      "p" = polygon: parameters is a list of [x, y] points to be connected (last one gets connected to the first one)
            // ["p", [undefined, undefined, "gray"], [[0, 100], [-Math.sqrt(3) / 2 * 100, -50], [Math.sqrt(3) / 2 * 100, -50]]], // creates an equilateral triangle with the center of mass at the origin

            //      "e" = ellipse, (circle): parameters is a list [x coordinate, y coordinate, x radius, y radius (if not set, the same as x radius), angle from x-axis in radians (0 if not set)]
            // ["e", ["gray", 2, "gray"], [0, 0, 1000, 1700, Math.PI / 4]], // creates an ellipse centered at origin with x radius of 1000 and y radius of 1700, the ellipse is rotated by 45 degrees

            //      "t" = text: parameters is a list [text, x, y, align?, font?]

            ["p", ["gray", 2, "gray"], [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            ["p", ["gray", 2, "gray"], [[256, 0], [512, 0], [512, -256], [192, -256]]],
            ["t", ["gray", 2, "black"], ["Get this Bicycle...", -384, 256]],
            ["t", ["gray", 2, "black"], ["...to here:", 384, 256]],

            ["t", [undefined, undefined, "gray"], ["", 0, 0]], //this one fixes the colors, I'm not going to wawste my time.

            // ["e", ["gray", 2, "gray"], [0, -10000000000, 10000000000, 10000000000]], // the rendering breaks for very large values and coordinates
        ],
        physicals: [
            // used for just AND ONLY colliding things, the properties' order is confusing, I know, I'm sorry, I was sad when making these
            [[-384, -128], "red", "shape", "polygon", null, null, [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            [[ 384, -128], "red", "shape", "polygon", null, null, [[256, 0], [512, 0], [512, -256], [192, -256]]],

            [[384, 100], "white", "shape", "flag", null, null, [[352, 200], [416, 200], [416, 0], [352, 0]]],
        ],
    },

    {    
        name: "There is where the fun begins",
        desc: "There is where the fun begins",
        budget: 10000, // in euro
        currentCost: 0,
        difficulty: "Normal",

        cameraScale: 0.5,
        cameraPosition: [288, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1500, 16],
        gravity: gravityEarth,

        allowedEdges: ["w", "r"], 
        availableAutos: ["Bicycle", "Aksiam", "Pasat", "Audi", "Motor", "Tir"],

        vertices: [
            [-256, 0, "p", [0, 0]],
            [-215, -150, "p", [0, 0]],
            [1400, 0, "p", [0, 0]],
            [1330, -150, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            ["p", ["gray", 2, "gray"], [[-256, 0], [-600, 0], [-600, -256], [-192, -256]]],
            ["p", ["gray", 2, "gray"], [[1750, 0], [1400, 0], [1300, -256], [1750, -256]]],
        ],
        physicals: [
            [[-412, -128], "red", "shape", "polygon", null, null, [[-256, 0], [-600, 0], [-600, -256], [-192, -256]]],
            [[1550, -128], "red", "shape", "polygon", null, null, [[1750, 0], [1400, 0], [1300, -256], [1750, -256]]],

            [[1575, 100], "white", "shape", "flag", null, null, [[1543, 200], [1607, 200], [1607, 0], [1543, 0]]],
        ],
       
    },

    {
        name: "Huge hole",
        desc: "Its a really huge hole",
        budget: 20000, // in euro
        currentCost: 0,
        difficulty: "Hard",

        cameraScale: 0.25,
        cameraPosition: [188, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1800, 16],
        gravity: gravityEarth,

        allowedEdges: ["w", "r", "s"], 
        availableAutos: ["Bicycle", "Aksiam", "Pasat", "Audi", "Motor", "Tir"], //Tu damy auto 

        vertices: [
            [-256, 0, "p", [0, 0]],
            [-215, -150, "p", [0, 0]],
            [1750, 0, "p", [0, 0]],
            [1660, -150, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            ["p", ["gray", 2, "gray"], [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            ["p", ["gray", 2, "gray"], [[2048, 0], [1750, 0], [1600, -256], [2048, -256]]],
        ],
        physicals: [
            [[-368, -128], "red", "shape", "polygon", null, null, [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            [[1861.5, -128], "red", "shape", "polygon", null, null, [[2048, 0], [1750, 0], [1600, -256], [2048, -256]]],

            [[1899, 100], "white", "shape", "flag", null, null, [[1867, 200], [1931, 200], [1931, 0], [1867, 0]]],
        ],    
    },

    {
        name: "Uphill road",
        desc: "Uphill road",
        budget: 30000, // in euro
        currentCost: 0,
        difficulty: "Hard",

        cameraScale: 0.5,
        cameraPosition: [288, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1600, 16],
        gravity: gravityEarth,

        allowedEdges: ["w", "r", "s"], 
        availableAutos: ["Bicycle", "Aksiam", "Pasat", "Audi", "Motor", "Tir"],

        vertices: [
            [-256, 0, "p", [0, 0]],
            [-215, -150, "p", [0, 0]],
            [1400, 250, "p", [0, 0]],
            [1340, 100, "p", [0, 0]],
            [875, -200, "p", [0, 0]],
            [825, -200, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            ["p", ["gray", 2, "gray"], [[-256, 0], [-600, 0], [-600, -256], [-192, -256]]],
            ["p", ["gray", 2, "gray"], [[1750, 250], [1400, 250], [1200, -256], [1750, -256]]],
            ["p", ["gray", 2, "gray"], [[875, -200], [825, -200], [800, -256], [900, -256]]],
        ],
        physicals: [
            [[-412, -128], "red", "shape", "polygon", null, null, [[-256, 0], [-600, 0], [-600, -256], [-192, -256]]],
            [[1525, -3], "red", "shape", "polygon", null, null, [[1750, 250], [1400, 250], [1200, -256], [1750, -256]]],
            [[850, -228], "red", "shape", "polygon", null, null, [[875, -200], [825, -200], [800, -256], [900, -256]]],

            [[1575, 350], "white", "shape", "flag", null, null, [[1543, 450], [1607, 450], [1607, 250], [1543, 250]]],
        ],
       
    },
    
    {
        name: "Mountain",
        desc: "Mountain",
        budget: 50000, // in euro
        currentCost: 0,
        difficulty: "Extreme",

        cameraScale: 0.25,
        cameraPosition: [196, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1500, 16],
        gravity: gravityEarth,

        allowedEdges: ["w", "r", "s"], 
        availableAutos: ["Bicycle", "Aksiam", "Pasat", "Audi", "Motor", "Tir"],

        vertices: [
            [-256, 0, "p", [0, 0]],
            [-215, -150, "p", [0, 0]],
            [1650, 0, "p", [0, 0]],
            [1620, -150, "p", [0, 0]],
            [600, 300, "p", [0, 0]],
            [800, 300, "p", [0, 0]],
            [575, 150, "p", [0, 0]],
            [825, 150, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            ["p", ["gray", 2, "gray"], [[-256, 0], [-600, 0], [-600, -256], [-192, -256]]],
            ["p", ["gray", 2, "gray"], [[2000, 0], [1650, 0], [1600, -256], [2000, -256]]],
            ["p", ["gray", 2, "gray"], [[600, 300], [800, 300], [900, -256], [500, -256]]],
        ],
        physicals: [
            [[-412, -128], "red", "shape", "polygon", null, null, [[-256, 0], [-600, 0], [-600, -256], [-192, -256]]],
            [[1812.5, -128], "red", "shape", "polygon", null, null, [[2000, 0], [1650, 0], [1600, -256], [2000, -256]]],
            [[700, 22], "red", "shape", "polygon", null, null, [[600, 300], [800, 300], [900, -256], [500, -256]]],


            [[1825, 100], "white", "shape", "flag", null, null, [[1793, 200], [1857, 200], [1857, 0], [1793, 0]]],
        ],
       
    },

    {
        name: "Final",
        desc: "Final",
        budget: 100000, // in euro
        currentCost: 0,
        difficulty: "Impossible",

        cameraScale: 0.25,
        cameraPosition: [256, 0],
        autoStartPosition: [-384, 320],
        autoEndPosition: [1500, 16],
        gravity: gravityEarth,

        allowedEdges: ["w", "r", "s"], 
        availableAutos: ["Bicycle", "Aksiam", "Pasat", "Audi", "Motor", "Tir"],

        vertices: [
            [-256, 300, "p", [0, 0]],
            [-240, 150, "p", [0, 0]],
            [2650, 0, "p", [0, 0]],
            [2590, -150, "p", [0, 0]],
            [800, 500, "p", [0, 0]],
            [600, 500, "p", [0, 0]],
            [857, 350, "p", [0, 0]],
            [582, 350, "p", [0, 0]],
            [1325, -200, "p", [0, 0]],
            [1375, -200, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            ["p", ["gray", 2, "gray"], [[-256, 300], [-600, 300], [-600, -256], [-192, -256]]],
            ["p", ["gray", 2, "gray"], [[3000, 0], [2650, 0], [2550, -256], [3000, -256]]],
            ["p", ["gray", 2, "gray"], [[800, 500], [600, 500], [500, -256], [1100, -256]]],
            ["p", ["gray", 2, "gray"], [[1325, -200], [1375, -200], [1400, -256], [1300, -256]]],
        ],
        physicals: [
            [[-412, 22], "red", "shape", "polygon", null, null, [[-256, 300], [-600, 300], [-600, -256], [-192, -256]]],
            [[2800, -128], "red", "shape", "polygon", null, null, [[3000, 0], [2650, 0], [2550, -256], [3000, -256]]],
            [[750, 122], "red", "shape", "polygon", null, null, [[800, 500], [600, 500], [500, -256], [1100, -256]]],
            [[1350, -228], "red", "shape", "polygon", null, null, [[1325, -200], [1375, -200], [1400, -256], [1300, -256]]],

            [[2825, 100], "white", "shape", "flag", null, null, [[2793, 200], [2857, 200], [2857, 0], [2793, 0]]],
        ],
    },

    {
        name: "Sandbox",
        desc: "Everything is possible (I guess?)",
        budget: -0,
        currentCost: 0,
        difficulty: "Easy",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-2048, 0],
        gravity: gravityEarth,
        maxCarDistanceFromCenter: 1000,

        allowedEdges: ["w", "s", "r"],
        maxEdgesAmount: [Infinity, Infinity, Infinity],
        availableAutos: ["Bicycle"],

        vertices: [
            [0, 0, "p", [0, 0]],
            [1024, 0, "p", [0, 0]],
            [-1024, 0, "p", [0, 0]],
            [2048, 0, "p", [0, 0]],
            [-2048, 0, "p", [0, 0]],
            [3072, 0, "p", [0, 0]],
            [-3072, 0, "p", [0, 0]],
            [4096, 0, "p", [0, 0]],
            [-4096, 0, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            ["p", ["gray", 2, "gray"], [[-4096, 0], [4096, 0], [4096, -64], [-4096, -64]]],
        ],
        physicals: [
            [[0, -32], "red", "shape", "polygon", null, null, [[-4096, 0], [4096, 0], [4096, -64], [-4096, -64]]],
        ],
    },

    // more to come :3 ~~~
]

function selectNextLevel() {
    selectedLevel += 1
    displayLevelInfo()
}

function selectPreviousLevel() {
    selectedLevel -= 1
    displayLevelInfo()
}

function selectFirstLevel() {
    selectedLevel = 0
    displayLevelInfo()
}

function selectLastLevel() {
    selectedLevel = levelsList.length - 1
    displayLevelInfo()
}

function displayLevelInfo(levelId = selectedLevel) {
    if (levelId <= 0) {
        levelId = 0
        addAttribute("levelSelectorPreviousButton", "disabled")
        addAttribute("levelSelectorFirstButton", "disabled")
    } else {
        removeAttribute("levelSelectorPreviousButton", "disabled")
        removeAttribute("levelSelectorFirstButton", "disabled")
    }

    if (levelId >= levelsList.length - 1) {
        levelId = levelsList.length - 1
        addAttribute("levelSelectorNextButton", "disabled")
        addAttribute("levelSelectorLastButton", "disabled")
    } else {
        removeAttribute("levelSelectorNextButton", "disabled")
        removeAttribute("levelSelectorLastButton", "disabled")
    }

    let lev = levelsList[levelId]

    document.getElementById("levelSelectorSelectedLevelName").innerText = lev.name
    document.getElementById("levelSelectorBugdetAmount").innerText = lev.budget
    document.getElementById("levelSelectorLevelNumber").innerText = levelId
    document.getElementById("levelSelectorDesc").innerText = lev.desc

    removeClass("levelSelectorInfo", "difficultyEasy")
    removeClass("levelSelectorInfo", "difficultyNormal")
    removeClass("levelSelectorInfo", "difficultyHard")
    removeClass("levelSelectorInfo", "difficultyExtreme")
    removeClass("levelSelectorInfo", "difficultyImpossible")

    addClass("levelSelectorInfo", "difficulty" + lev.difficulty)
    document.getElementById("levelSelectorDifficulty").innerText = lev.difficulty

    listBeams(levelId)

    toggleDrawingCanvas(levelId)

    setAvailableAutos()
    displayAutoInfo()
}

function playSelectedLevel() {
    setCurrentLevel()

    toggleMenuLevels()

    bridgeHasChanged = true
    drawBridge()
}

function setCurrentLevel(levelId = selectedLevel) {
    currentLevel = selectedLevel

    currentAuto = selectedAuto
    availableAutosList = levelsList[currentLevel].availableAutos
    currentAutoName = autosList[availableAutosList[currentAuto]].name

    maxCarDistanceFromCenter = levelsList[currentLevel].maxCarDistanceFromCenter ** 2

    saveBridge(false)

    let level = levelsList[currentLevel]

    // setting the level camera
    translateCanvasReset()
    scaleCanvasZero()

    translateCanvas(level.cameraPosition[0], level.cameraPosition[1])
    // scaleCanvas(level.cameraScale)

    bridgeSelectedVertex   = null
    previousPlayerSetPoint = null
    bridgeVertices         = structuredClone(level.vertices)
    bridgeEdges            = structuredClone(level.edges)
    bridgeConnections      = structuredClone(level.connections)
    bridgeObjects          = structuredClone(level.objects)
    bridgePhysicals        = structuredClone(level.physicals)
    bridgeCost             = structuredClone(level.cost)

    allowedEdgeTypes = structuredClone(level.allowedEdges)

    for (let i = 0; i < bridgeVertices.length; i++) {
        if (bridgeConnections[i] == undefined) {
            bridgeConnections[i] = []
        }
    }

    let autoStartCoordinates = level.autoStartPosition
    let autoEndCoordinates = level.autoEndPosition
    addPhysical(autoStartCoordinates[0], autoStartCoordinates[1], "auto", currentAutoName)

    listAllowedEdgeTypes()
    setEdgeType(allowedEdgeTypes[0]) // sets the selected edge type to the first available one

    setGravity(level.gravity) // set level gravity

    cost = level.currentCost
    maxBudget = level.budget
    setBudget()
    updateBudget()

    bridgeHasChanged = true
}

let cost = 0
let maxBudget = 0
function setBudget(max = maxBudget) {
    document.getElementById("budgetControlMax").innerText = max
    document.getElementById("budgetControlProgress").max = max
}

function updateBudget(amount = 0, setting = false) {
    if (setting) {
        cost = amount
    } else {
        cost += amount
    }

    document.getElementById("budgetControlAmount").innerText = round(cost) || 0
    document.getElementById("budgetControlProgress").value = round(cost) || 0
}

function checkBudget() {
    let allCost = 0
    for (let i = 0; i < bridgeEdges.length; i++) {
        allCost += bridgeEdges[i][5]
    }

    updateBudget(allCost, true)
}

function listBeams(levelId) {
    let beams = ""

    let allBeams = levelsList[levelId].allowedEdges
    let beamLengths = levelsList[levelId].maxEdgesAmount
    for (let i = 0; i < allBeams.length; i++) {
        let b = edgeProperties[allBeams[i]].name

        let maxAmount = beamLengths && beamLengths[i] || Infinity
        if (maxAmount == Infinity) {
            maxAmount = "&infin;"
        }

        beams += ` <span class="emphasis">${b} [${maxAmount}]</span>`
    }

    document.getElementById("levelSelectorBeams").innerHTML = beams
}