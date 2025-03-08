

let currentLevel = 0

let selectedLevel = 0
let levelsList = [
    {
        name: "Tutorial",
        desc: "If you can get throught this level, you can probably play the rest of the game just fine.\nThat's what Tutorials are for.",
        budget: 1000, // in euro
        difficulty: "Easy",

        allowedEdges: ["w", "s", "r"], // sets level's allowed edges

        // the starting values for all of the bridge values
        vertices: [
            [0, 0, "p"],
            [0, 128, "n"],
            [64, 64, "n"],
            [-64, 64, "n"],
        ],

        edges: [
            [0, 1, "w"],
            [0, 2, "w"],
            [1, 2, "w"],
            [0, 3, "w"],
            [1, 3, "w"],
        ],

        connections: [
            [1, 2, 3],
            [0, 2],
            [0, 1],
            [0, 1],
        ],

        objects: [

        ],
    },

    {
        name: "0",
        desc: "l",
        budget: 1e10,
        difficulty: "Normal",

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
        difficulty: "Hard",

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
        difficulty: "Extreme",

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
}

function setCurrentLevel(levelId = selectedLevel) {
    currentLevel = selectedLevel

    saveBridge(false)

    let level = levelsList[currentLevel]

    bridgeSelectedVertex   = null
    previousPlayerSetPoint = null
    bridgeVertices         = structuredClone(level.vertices)
    bridgeEdges            = structuredClone(level.edges)
    bridgeConnections      = structuredClone(level.connections)
    bridgeObjects          = structuredClone(level.objects)

    allowedEdgeTypes = structuredClone(level.allowedEdges)

    listAllowedEdgeTypes()
    setEdgeType(allowedEdgeTypes[0]) // sets the selected edge type to the first available one

    bridgeHasChanged = true
}