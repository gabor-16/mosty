


// //////////////////////////////////////////////////////////////////////
// A.U.T.O.S. (Automatic and not Useless Transportation Of Seated persons)
// //////////////////////////////////////////////////////////////////////

let currentAuto = 0
let currentAutoName = "Bicycle"

let selectedAuto = 0
let availableAutosList = []
let autosList = {
    "Bicycle": {
        name: "Bicycle",
        desc: "A small, lightweight transportation device which uses the power of human legs to move.",
        driver: "50 y.o. Sisyphus",

        difficulty: "Easy",

        // other properties like speed, weight, size, etc.
        speed: 5, // m/s
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

    "City Car": {
        name: "City Car",
        desc: "One of the smallest cars on the market, it can fit everywhere.",
        driver: "City Car Driver",

        difficulty: "Normal",
        
    },

    "Jeep": {
        name: "Jeep",
        desc: "Big terrain car.",
        driver: "Jeeper",

        difficulty: "Normal",

    },

    "Freight Train": {
        name: "Freight Train",
        desc: "An unstoppable mass of metal.",
        driver: "A Train Enthusiast",

        difficulty: "Normal",

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
        difficulty: "Easy",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 0],
        autoEndPosition: [384, 0],
        // gravity: [0, -9.807],
        // gravity: gravityEarth,
        gravity: gravityEarth,

        allowedEdges: ["w", "s", "r"], // sets level's allowed edges
        maxEdgesAmount: [Infinity, Infinity, Infinity],
        availableAutos: ["Bicycle"],

        // the starting values for all of the bridge values
        vertices: [
            [-256, 0, "p", [0, 0]],
            [256, 0, "p", [0, 0]],
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

            ["p", ["gray", 2, "gray"], [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            ["p", ["gray", 2, "gray"], [[256, 0], [512, 0], [512, -256], [192, -256]]],

            // ["e", ["gray", 2, "gray"], [0, -10000000000, 10000000000, 10000000000]], // the rendering breaks for very large values and coordinates
        ],
        physicals: [
            // used for just AND ONLY colliding things, the properties' order is confusing, I know, I'm sorry, I was sad when making these
            [null, "gray", "shape", "polygon", null, null, [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            [null, "gray", "shape", "polygon", null, null, [[256, 0], [512, 0], [512, -256], [192, -256]]],
        ],
    },

    {
        name: "tut2",
        desc: "Hajj :333",
        budget: 100e100, // in euro
        currentCost: 10,
        difficulty: "Hard",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [384, 16],
        gravity: [0, -9.807],

        allowedEdges: ["w", "s", "r"], // sets level's allowed edges
        availableAutos: ["Bicycle"],

        // the starting values for all of the bridge values
        vertices: [
            [-256, 0, "p", [0, 0]],
            [256, 0, "p", [0, 0]],
        ],
        edges: [

        ],
        connections: [

        ],
        objects: [
            ["p", ["gray", 2, "gray"], [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            // ["p", ["gray", 2, "gray"], [[256, 0], [512, 0], [512, -256], [192, -256]]],
        ],
        physicals: [

        ],
    },

    {
        name: "0",
        desc: "l",
        budget: 1e10,
        currentCost: 0,
        difficulty: "Hard",

        cameraScale: 1,
        cameraPosition: [0, 0],
        gravity: [0, -9.807],

        allowedEdges: ["s"],
        availableAutos: ["City Car"],

        vertices: [

        ],
        edges: [

        ],
        connections: [
            
        ],
        objects: [

        ],
    },

    {
        name: "0",
        desc: "l",
        budget: 1e10,
        currentCost: 0,
        difficulty: "Extreme",

        cameraScale: 1,
        cameraPosition: [0, 0],
        gravity: [0, -9.807],

        allowedEdges: ["w", "r", "s"],
        availableAutos: ["City Car"],

        vertices: [

        ],
        edges: [

        ],
        connections: [
            
        ],
        objects: [

        ],
    },
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