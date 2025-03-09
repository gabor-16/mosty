

let currentLevel = 0

let selectedLevel = 0
let levelsList = [
    {
        name: "Tutorial",
        desc: "If you can get throught this level, you can probably play the rest of the game just fine.\nThat's what Tutorials are for.",
        budget: 1000, // in euro
        currentCost: 0,
        difficulty: "Easy",

        cameraScale: 2,
        cameraPosition: [0, 0],
        gravity: [0, -9.807],

        allowedEdges: ["w", "s", "r"], // sets level's allowed edges

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
            // all non-moving objects have simillar structure:
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
    },

    {
        name: "0",
        desc: "l",
        budget: 1e10,
        currentCost: 0,
        difficulty: "Normal",

        cameraScale: 1,
        cameraPosition: [0, 0],
        gravity: [0, -9.807],

        allowedEdges: ["w", "r"],

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
        difficulty: "Hard",

        cameraScale: 1,
        cameraPosition: [0, 0],
        gravity: [0, -9.807],

        allowedEdges: ["s"],

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

    let l = levelsList[levelId]

    document.getElementById("levelSelectorSelectedLevelName").innerText = l.name
    document.getElementById("levelSelectorBugdetAmount").innerText = l.budget
    document.getElementById("levelSelectorLevelNumber").innerText = levelId
    document.getElementById("levelSelectorDesc").innerText = l.desc

    removeClass("levelSelectorInfo", "difficultyEasy")
    removeClass("levelSelectorInfo", "difficultyNormal")
    removeClass("levelSelectorInfo", "difficultyHard")
    removeClass("levelSelectorInfo", "difficultyExtreme")

    addClass("levelSelectorInfo", "difficulty" + l.difficulty)
    document.getElementById("levelSelectorDifficulty").innerText = l.difficulty

}

function playSelectedLevel() {
    setCurrentLevel()

    toggleMenuLevels()

    bridgeHasChanged = true
}

function setCurrentLevel(levelId = selectedLevel) {
    currentLevel = selectedLevel

    saveBridge(false)

    let level = levelsList[currentLevel]

    // setting the level camera
    translateCanvasReset()
    scaleCanvasZero()

    translateCanvas(level.cameraPosition[0], level.cameraPosition[1])
    scaleCanvas(level.cameraScale)

    bridgeSelectedVertex   = null
    previousPlayerSetPoint = null
    bridgeVertices         = structuredClone(level.vertices)
    bridgeEdges            = structuredClone(level.edges)
    bridgeConnections      = structuredClone(level.connections)
    bridgeObjects          = structuredClone(level.objects)

    allowedEdgeTypes = structuredClone(level.allowedEdges)

    for (let i = 0; i < bridgeVertices.length; i++) {
        if (bridgeConnections[i] == undefined) {
            bridgeConnections[i] = []
        }
    }

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