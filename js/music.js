


let soundsList = [ // list of playable files in mus/ as arrays of [filename, id]
    ["loop0.wav", "Chiptune for the Poor", "DJ I'm done with this."],
    ["loop1.wav", "Chiptune for the Poor, but shorter (like their lives)", "The Corporate"],
    ["loop2.wav", "Elevator Music Extreme", "The Elevator Music Orchestra"],
    
    ["loop beepbox FM expert.mp3", "Hell", "Satan"],
    ["loop beepbox FM expert layered.mp3", "Hell, but there's more pain", "God"],

    // vvv Actual songs              ^^^ Mental ilnesses
    ["loop5.wav", "Happy Happy", ""],
    ["loop3.wav", "What is this drumming?", ""],
    ["loop4.wav", "A cruise", ""],
    ["loop6.wav", "Boring Gutuiare- Giture? Gietuer; Guitar.", ""],
    ["loop7.wav", "Flute on a Cementary", ""],
    ["loop8.wav", "This City is breathing (in the Rain)", ""],
    ["loop9.wav", "when the car flies too far", ""],
    ["loop10.wav", "Electrocuted on purpose", ""],
    ["loop11.wav", "Ascending?", ""],
    ["loop12.wav", "Parrots and Caves", ""],
]

let currentSong = 0
let playedSongsList = []
let playedSongsMaxLength = 32

let primaryVolume = 0.1
let loopMusic = true
let autoplayMusic = false
const musicEl = document.getElementById("audioLogMusic")
function changeMusic(musicId) {
    let mus = soundsList[musicId]
    musicEl.src = "mus/" + mus[0]
    musicEl.volume = primaryVolume

    document.getElementById("audioLogNumber").innerText = musicId

    if (mus[1] === "") {
        addClass("audioLogName", "blank")
    } else {
        removeClass("audioLogName", "blank")
        document.getElementById("audioLogName").innerText = mus[1]
    }

    if (mus[2] === "") {
        addClass("audioLogAuthorContainer", "blank")
    } else {
        removeClass("audioLogAuthorContainer", "blank")
        document.getElementById("audioLogAuthor").innerText = mus[2]
    }
}

function playMusicFromList(index) {    
    if (index <= 0) {
        index = 0

        addAttribute("audioLogPrevious", "disabled")
    } else {
        removeAttribute("audioLogPrevious", "disabled")
    }

    currentSong = index

    changeMusic(playedSongsList[index])
}

function addMusicToList() {
    playedSongsList.push(random(0, soundsList.length))
}

function nextMusicFromList() {
    let nextSong = currentSong + 1

    if (nextSong >= playedSongsList.length) {
        addMusicToList()

        playedSongsList.shift()
        playMusicFromList(currentSong)
    } else {
        playMusicFromList(nextSong)
    }

    playMusic()
}

function previousMusicFromList() {
    let previousSong = currentSong - 1
    playMusicFromList(previousSong)

    playMusic()
}

function playMusic() {
    musicEl.play()
}

function setLoopMusic() {
    loopMusic = getBooleanValue("shouldMusicLoop")
}

function setAutoplayMusic() {
    autoplayMusic = getBooleanValue("autoplayMusic")
}

window.addEventListener("load", () => {
    let max = soundsList.length
    for (let i = 0; i < playedSongsMaxLength; i++) {
        playedSongsList.push(random(0, max))
    }


    document.getElementById("audioLogMaxSongsNumber").innerText = playedSongsMaxLength

    setLoopMusic()
    setAutoplayMusic()

    playMusicFromList(playedSongsMaxLength - 1)
    if (autoplayMusic) {
        playMusic()
    }
})

document.getElementById("audioLogMusic").addEventListener("ended", function() {
    if (!loopMusic) {
        nextMusicFromList()
    }

    playMusic()
})

