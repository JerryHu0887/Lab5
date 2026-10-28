// CCT360 Lab 5: Simple HTML5 audio and scene interaction
let audio = document.getElementById("cityAudio");
let morning = document.getElementById("morning");
let street = document.getElementById("street");
let title = document.getElementById("sceneTitle");
let description = document.getElementById("description");
let statusText = document.getElementById("status");

// Show one image and hide the other
function showScene(sceneNumber) {
    if (sceneNumber === 1) {
        morning.style.opacity = "1";
        street.style.opacity = "0";
        title.innerHTML = "01 / THE SIXTEENTH FLOOR";
        description.innerHTML = "A morning above the city.";
    } else {
        morning.style.opacity = "0";
        street.style.opacity = "1";
        title.innerHTML = "02 / THE FAMILIAR STREETS";
        description.innerHTML = "Old routines in a modern city.";
    }
}

// Preview scenes immediately, without waiting for the sound
// Pausing keeps the selected scene visible
document.getElementById("scene1Btn").addEventListener("click", function() {
    audio.pause();
    audio.currentTime = 0;
    showScene(1);
    statusText.innerHTML = "Scene 1 preview. Press Play to listen.";
});

document.getElementById("scene2Btn").addEventListener("click", function() {
    audio.pause();
    audio.currentTime = 14;
    showScene(2);
    statusText.innerHTML = "Scene 2 preview. Press Play to listen.";
});

// Custom audio controls from Class 7
document.getElementById("playBtn").addEventListener("click", function() {
    audio.play();
    statusText.innerHTML = "Playing the demo soundscape";
});

document.getElementById("pauseBtn").addEventListener("click", function() {
    audio.pause();
    statusText.innerHTML = "Paused";
});

document.getElementById("restartBtn").addEventListener("click", function() {
    audio.currentTime = 0;
    showScene(1);
    audio.play();
    statusText.innerHTML = "Playing from the beginning";
});

// Automatically change scenes when the audio reaches 13 seconds
audio.addEventListener("timeupdate", function() {
    if (audio.currentTime < 13) {
        showScene(1);
    } else {
        showScene(2);
    }
});

// Update the message when the demo ends
audio.addEventListener("ended", function() {
    statusText.innerHTML = "Demo finished. Press Restart to listen again.";
});
