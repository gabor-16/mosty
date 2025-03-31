





function toggleDialog(id) {
    if (checkIfDialogOpen(id)) {
        document.getElementById(id).close()
        document.getElementById(id).classList.add("blank")
    } else {
        document.getElementById(id).showModal()
        document.getElementById(id).classList.remove("blank")
    }

    return document.getElementById(id).open
}

function checkIfDialogOpen(id) {
    return document.getElementById(id).open
}

// //////////////////////////////////////////////////////////////////////

let canUseKeyboardShortcuts = true
function toggleMenuOptions() {
    if (toggleDialog("optionsMenu")) {
        canUseKeyboardShortcuts = false
    } else {
        canUseKeyboardShortcuts = true
    }
}

function toggleMenuLevels() {
    if (toggleDialog("levelSelectorMenu")) {
        canUseKeyboardShortcuts = false

        // stop the simulation when opening the dialog
        if (isSimulating) {
            stopSimulating()
        }
    } else {
        canUseKeyboardShortcuts = true
    }
}

function switchOptionsDialogMenu(tabId) {
    addClass("optionsDialogMenuGeneral", "blank")
    addClass("optionsDialogMenuStyling", "blank")

    removeClass("optionsDialogMenu" + tabId, "blank")
}

function toggleMenuWin() {
    if (toggleDialog("winMenu")) {
        canUseKeyboardShortcuts = false
    } else {
        canUseKeyboardShortcuts = true
    }
}

function win() {
    checkBudget()
    sendMessage(true, "win")

    document.getElementById("winMenuBudget").innerText = round(cost)

    let costPercentage = round(cost / maxBudget * 100)
    document.getElementById("winMenuBudgetPercentage").innerText = costPercentage

    let budgetMessage = "(What Unlimited Budget does to a person...)"
    if (costPercentage <= 50) {
        budgetMessage = "(Tight! ...Budget, I mean...)"
    } else if (costPercentage <= 100) {
        budgetMessage = "(You did it! Like we intended!)"
    }
    document.getElementById("winMenuBudgetComment").innerText = budgetMessage

    document.getElementById("winMenuBeams").innerText = bridgeEdges.length
    document.getElementById("winMenuTime").innerText = simulationTick

    let timeMessage = "(Did you knew that everybody else did it faster?)"
    if (simulationTick <= 800) {
        timeMessage = "(You finished pretty quick.)" // That's what she said.
    } else if (simulationTick <= 2400) {
        timeMessage = "(That's... Not that bad.)"
    } else if (simulationTick <= 7200) {
        timeMessage = "(That's is faster than a snail, at least.)"
    } else if (simulationTick <= 24000) {
        timeMessage = "(...Which is a long time. What were you doing when the Car was travelling?)"
    }
    document.getElementById("winMenuTimeComment").innerText = timeMessage

    document.getElementById("minExtent").innerText = round(minExtent * 100)
    document.getElementById("maxExtent").innerText = round(maxExtent * 100)

    let finalPoints = 1000 * Math.max(0, 1 - Math.sqrt(cost / maxBudget))
    document.getElementById("winMenuPoints").innerText = round(finalPoints, 1)

    toggleMenuWin()
    stopSimulating()
}




// //////////////////////////////////////////////////////////////////////
// USER MESSAGES
// //////////////////////////////////////////////////////////////////////

let currentMessageId = 0
let messagesMaxAmount = 10
let messagesArray = []
function sendMessage(isSaved, text) {
    if (isSaved) {
        text = userMessages[text]
    }

    console.log("Message no.", currentMessageId + ":", text)

    messagesArray.unshift(text)
    fixMessagesLenght()

    writeMessages()

    currentMessageId++
}

function fixMessagesLenght() {
    if (messagesArray.length > messagesMaxAmount) {
        let overflow = messagesArray.length - messagesMaxAmount
        messagesArray.splice(-overflow, overflow)

        writeMessages()
    }
}

function writeMessages() {
    let messagesText = ""
    for (let i = 0; i < messagesArray.length; i++) {
        messagesText += "<p>" + messagesArray[i] + "</p>"
    }

    document.getElementById("messageLog").innerHTML = messagesText
}

function clearMessages() {
    messagesArray = []
    document.getElementById("messageLog").innerHTML = ""
}

function copyMessages() {
    let copyText = document.getElementById("messageLog").innerText
    navigator.clipboard.writeText(copyText)
}

function setMaxMessages() {
    messagesMaxAmount = document.getElementById("messagesMaxAmount").value
    fixMessagesLenght()
}

function error(message) {
    throw new Error(message)
}
const eroor = error



let userMessages = {
    "welcome": "Welcome to the game!<br>For starters, try clicking somewhere on the screen above!<br>(It should do things...)",
    "win": "Congratulations on winning the Game- I mean, the level. Right.",

    // errors, info
    "vertexDeletion": "Can't delete permenent Vertices!",
    "cantMakeVertex": "Can't create a Veretex here!",

    "carLost": "The car flew through and to Infinity.", // when the car flies too far
    "edgeDestroyed": "Edge destroyed!",

    "savedData": "Data saved in the memory.",
    "loadedData": "Data loaded from memory.",
}
