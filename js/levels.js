


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
        driver: "Sisyphus",
        desc: "A bicycle is a small, lightweight transportation device which uses the power of human legs to move. About the driver... Well, let's just ay that he got bored of walking.",

        difficulty: "Easy",

        // other properties like speed, weight, size, etc.
        speed: 10, // / 2 m/s
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
// BASE VALUE 0
let currentLevel = 0

let selectedLevel = 0
let levelsList = [
    {
        name: "Tutorial",
        desc: "If you can get throught this level, you can probably play the rest of the game just fine.\nThat's what Tutorials are for, after all.",
        budget: 1000, // in euro
        currentCost: 0,
        difficulty: "Easy", // Easy, Normal, Hard, Extreme, Impossible
        difficulty: "Easy",
        // TODO: maxEdges: number, max ammount of edges allowed on level

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 0],
        gravity: gravityEarth,

        allowedEdges: ["w", "s", "r"], // sets level's allowed edges
        maxEdgesAmount: [Infinity, Infinity, Infinity],
        availableAutos: ["Bicycle"],

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
            [null, "gray", "shape", "polygon", null, null, [[-256, 0], [-512, 0], [-512, -256], [-192, -256]]],
            [null, "gray", "shape", "polygon", null, null, [[256, 0], [512, 0], [512, -256], [192, -256]]],
        ],
    },

    {    
        name: "There is where the fun begins",
        desc: "There is where the fun begins",
        budget: 30000, // in euro
        currentCost: 0,
        difficulty: "easy",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1500, 16],
        gravity: [0, -9.807],

        allowedEdges: ["w", "r"], 
        availableAutos: ["Bicycle"],

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

        ],
       
    },

    {
        name: "Huge hole",
        desc: "Its a really huge hole",
        budget: 30000, // in euro
        currentCost: 0,
        difficulty: "easy",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1800, 16],
        gravity: [0, -9.807],

        allowedEdges: ["w", "r"], 
        availableAutos: ["Bicycle"], //Tu damy auto 

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
            // ["p", ["gray", 2, "gray"], [[256, 0], [512, 0], [512, -256], [192, -256]]],
            ["p", ["gray", 2, "gray"], [[2048, 0], [1750, 0], [1600, -256], [2048, -256]]],
        ],
        physicals: [

        ],    
    },

    {
        name: "Uphill road",
        desc: "Uphill road",
        budget: 30000, // in euro
        currentCost: 0,
        difficulty: "easy",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1600, 16],
        gravity: [0, -9.807],

        allowedEdges: ["w", "r"], 
        availableAutos: ["Bicycle"],

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

        ],
       
    },
    
    {
        name: "Mountain",
        desc: "Mountain",
        budget: 30000, // in euro
        currentCost: 0,
        difficulty: "easy",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 16],
        autoEndPosition: [1500, 16],
        gravity: [0, -9.807],

        allowedEdges: ["w", "r"], 
        availableAutos: ["Bicycle"],

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

        ],
       
    },

    {
        name: "Final",
        desc: "Final",
        budget: 30000, // in euro
        currentCost: 0,
        difficulty: "easy",

        cameraScale: 1,
        cameraPosition: [0, 0],
        autoStartPosition: [-384, 320],
        autoEndPosition: [1500, 16],
        gravity: [0, -9.807],

        allowedEdges: ["w", "r"], 
        availableAutos: ["Bicycle"],

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