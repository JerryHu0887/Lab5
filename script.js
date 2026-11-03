// Get the audio player and page controls.
let audio = document.getElementById("cityAudio");
let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let restartBtn = document.getElementById("restartBtn");
let muteBtn = document.getElementById("muteBtn");
let slider = document.getElementById("timeSlider");
let statusText = document.getElementById("status");
let currentTimeText = document.getElementById("currentTime");
let sceneTitle = document.getElementById("sceneTitle");
let sceneSubtitle = document.getElementById("sceneSubtitle");
let sceneLabel = document.getElementById("sceneLabel");
let sceneNumber = document.getElementById("sceneNumber");
let largeSceneNumber = document.getElementById("largeSceneNumber");
let soundBars = document.getElementById("soundBars");
let photoFrame = document.getElementsByClassName("photo-frame")[0];

// Store the time, title, and description for each chapter.
let sceneTimes = [0, 19, 38, 58];
let sceneNames = ["Above the city", "Streets in between", "Moving forward", "Lights after dark"];
let sceneDescriptions = [
    "The morning begins on the sixteenth floor.",
    "Familiar routines live among changing streets.",
    "The city grows taller, louder, and faster.",
    "The streets quiet down, but the skyline remains."
];
let sceneLabels = [
    "MEMORY 01 · 00:00—00:19",
    "MEMORY 02 · 00:19—00:38",
    "MEMORY 03 · 00:38—00:58",
    "MEMORY 04 · 00:58—01:15"
];
let photos = document.getElementsByClassName("photo-layer");
let chapters = document.getElementsByClassName("chapter");
let activeScene = -1;

// Show the selected photograph and update its caption.
function showScene(number) {
    if (number === activeScene) {
        return;
    }
    activeScene = number;
    if (photos[number].classList.contains("image-unavailable")) {
        photoFrame.classList.add("image-unavailable");
    } else {
        photoFrame.classList.remove("image-unavailable");
    }
    // Highlight one chapter and hide the other photographs.
    for (let i = 0; i < photos.length; i++) {
        if (i === number) {
            photos[i].classList.add("active");
            chapters[i].classList.add("selected");
            chapters[i].setAttribute("aria-current", "true");
        } else {
            photos[i].classList.remove("active");
            chapters[i].classList.remove("selected");
            chapters[i].removeAttribute("aria-current");
        }
    }
    sceneTitle.innerHTML = sceneNames[number];
    sceneSubtitle.innerHTML = sceneDescriptions[number];
    sceneLabel.innerHTML = sceneLabels[number];
    sceneNumber.innerHTML = "0" + (number + 1) + " <span>/ 04</span>";
    largeSceneNumber.innerHTML = number + 1;
}

// Convert playback seconds into minutes and seconds.
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remaining = Math.floor(seconds) - minutes * 60;
    if (remaining < 10) {
        return "0" + minutes + ":0" + remaining;
    }
    return "0" + minutes + ":" + remaining;
}

// Keep the scene and progress bar synchronized with the sound.
function updateProgress() {
    let time = audio.currentTime;
    slider.value = Math.floor(time);
    slider.style.backgroundSize = (time / 75 * 100) + "% 100%";
    currentTimeText.innerHTML = formatTime(time);
    // Switch scenes at each chapter start time.
    if (time < 19) {
        showScene(0);
    } else if (time < 38) {
        showScene(1);
    } else if (time < 58) {
        showScene(2);
    } else {
        showScene(3);
    }
}

// Play, pause, and restart the soundscape.
playBtn.addEventListener("click", function() {
    audio.play();
});
pauseBtn.addEventListener("click", function() {
    audio.pause();
});
restartBtn.addEventListener("click", function() {
    audio.currentTime = 0;
    updateProgress();
    audio.play();
});

// Jump to the selected chapter's opening time.
for (let i = 0; i < chapters.length; i++) {
    chapters[i].addEventListener("click", function() {
        audio.currentTime = sceneTimes[i];
        updateProgress();
        statusText.innerHTML = "Chapter " + (i + 1) + " selected.";
    });
}

// Let the user move to a different point in the soundscape.
slider.addEventListener("input", function() {
    audio.currentTime = Number(slider.value);
    updateProgress();
});

// Toggle sound without stopping playback.
muteBtn.addEventListener("click", function() {
    audio.muted = !audio.muted;
    if (audio.muted) {
        muteBtn.innerHTML = "× <span>Muted</span>";
    } else {
        muteBtn.innerHTML = "♫ <span>Sound on</span>";
    }
});

// Update visual feedback when the audio state changes.
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", function() {
    soundBars.classList.add("playing");
    statusText.innerHTML = "Playing the soundscape";
    playBtn.classList.add("is-playing");
});
audio.addEventListener("pause", function() {
    soundBars.classList.remove("playing");
    playBtn.classList.remove("is-playing");
    if (!audio.ended) {
        statusText.innerHTML = "Paused. Press Play to continue.";
    }
});
audio.addEventListener("ended", function() {
    soundBars.classList.remove("playing");
    playBtn.classList.remove("is-playing");
    statusText.innerHTML = "Journey complete. Press Restart to listen again.";
});
audio.addEventListener("error", function() {
    statusText.innerHTML = "Audio could not load. Check the audio file path.";
});

// Use a plain archival placeholder if a photograph cannot load.
for (let i = 0; i < photos.length; i++) {
    let img = photos[i].getElementsByTagName("img")[0];
    // Display a fallback message if this image is unavailable.
    img.addEventListener("error", function() {
        photos[i].classList.add("image-unavailable");
        img.style.display = "none";
        if (i === activeScene) {
            photoFrame.classList.add("image-unavailable");
        }
    });
}

showScene(0);
