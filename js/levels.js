

let selectedLevel = 0
let levelsList = [
    {
        name: "Tutorial",
        desc: "If you can get throught this level, you can probably play the rest of the game just fine.\nThat's what Tutorials are for.",
        budget: 1000, // in euro
        difficulty: "Easy",

        allowedEdges: ["w"], // sets level's allowed edges

        // the starting values for all of the bridge values
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
        difficulty: "Normal",
    },

    {
        name: "0",
        desc: "l",
        budget: 1e10,
        difficulty: "Hard",
    },

    {
        name: "0",
        desc: "l",
        budget: 1e10,
        difficulty: "Extreme",
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

}