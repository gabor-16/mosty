





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
    } else {
        canUseKeyboardShortcuts = true
    }
}

function switchOptionsDialogMenu(tabId) {
    addClass("optionsDialogMenuGeneral", "blank")
    addClass("optionsDialogMenuStyling", "blank")

    removeClass("optionsDialogMenu" + tabId, "blank")
}

function switchOptionsDialogLevel(tabId) {
    addClass("optionsLevelSelectorLevel", "blank")
    addClass("optionsLevelSelectorOptions", "blank")

    removeClass("optionsLevelSelector" + tabId, "blank")

    if (tabId == "Options") {
        addAttribute("levelSelectorNextButton", "disabled")
        addAttribute("levelSelectorLastButton", "disabled")
        addAttribute("levelSelectorPreviousButton", "disabled")
        addAttribute("levelSelectorFirstButton", "disabled")
    } else {
        displayLevelInfo()
    }
}




// //////////////////////////////////////////////////////////////////////
// USER MESSAGES
// //////////////////////////////////////////////////////////////////////

function sendMessage(isSaved, text) {
    if (isSaved) {
        text = userMessages[text]
    }

    console.log("Message:", text)

    let previousText = document.getElementById("messageLog").innerHTML
    document.getElementById("messageLog").innerHTML = "<p>" + text + "</p>" + previousText
}

function clearMessages() {
    document.getElementById("messageLog").innerHTML = ""
}

function copyMessages() {
    let copyText = document.getElementById("messageLog").innerText
    navigator.clipboard.writeText(copyText)
}

function error(message) {
    throw new Error(message)
}



let userMessages = {
    "welcome": "Welcome to the game!<br>For starters, try clicking somewhere on the screen above!",

    // errors, info
    "vertexDeletion": "Can't delete permenent vertices!",
    "savedData": "Data saved in the memory.",
    "loadedData": "Data loaded from memory.",
}
