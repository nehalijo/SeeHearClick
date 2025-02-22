// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "highlightIssues") {
        document.querySelectorAll("img:not([alt])").forEach(img => {
            img.style.border = "2px solid red"; // Highlight missing alt attributes
        });
    }
});

//Read out text
function readText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";  // language
    speech.rate = 1;        // speed 
    speech.pitch = 1;       // pitch
    speech.volume = 1;      // volume

    window.speechSynthesis.speak(speech);
}

// Enable hover-to-read
document.body.addEventListener("mouseover", (event) => {
    const text = event.target.innerText.trim(); // Get text of hovered element
    if (text) {
        readText(text);
    }
});

// Stop reading when mouse leaves
document.body.addEventListener("mouseout", () => {
    window.speechSynthesis.cancel();
});


