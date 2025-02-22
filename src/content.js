// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scanAndFixIssues") {
        const results = scanAndFixAccessibility();
        sendResponse(results);
    }
});

// Function to scan for issues and automatically fix them
function scanAndFixAccessibility() {
    let issueCount = {};

    function addIssue(issueText) {
        if (issueCount[issueText]) {
            issueCount[issueText]++;
        } else {
            issueCount[issueText] = 1;
        }
    }

    // Fix missing alt attributes on images
    document.querySelectorAll("img:not([alt])").forEach(img => {
        img.setAttribute("alt", "Image");
        img.style.border = "2px solid green"; // Indicate fixed
        addIssue("✅ Fixed: Added alt attribute to images");
    });

    // Fix buttons without labels
    document.querySelectorAll("button, [role='button']").forEach(button => {
        let hasLabel = button.hasAttribute("aria-label") || 
                       button.hasAttribute("aria-labelledby") || 
                       button.innerText.trim().length > 0;

        if (!hasLabel) {
            button.setAttribute("aria-label", "Button");
            button.style.border = "2px solid green"; // Indicate fixed
            addIssue("✅ Fixed: Added aria-label to buttons");
        }
    });

    // Fix form elements without labels
    document.querySelectorAll("input, textarea, select").forEach(input => {
        let id = input.id;
        let hasLabel = input.hasAttribute("aria-label") || 
                       input.hasAttribute("aria-labelledby") || 
                       (id && document.querySelector(`label[for="${id}"]`));

        if (!hasLabel) {
            input.setAttribute("aria-label", "Form Input");
            input.style.border = "2px solid green"; // Indicate fixed
            addIssue("✅ Fixed: Added aria-label to form elements");
        }
    });

    console.log("Accessibility scan and fixes completed.");

    // Convert object to array with counts
    let fixedIssues = Object.entries(issueCount).map(([text, count]) => `${text} (${count} times)`);

    return { fixedIssues };
}

// Read out text on hover
function readText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";  
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

// Enable hover-to-read
document.body.addEventListener("mouseover", (event) => {
    const text = event.target.innerText.trim();
    if (text) {
        readText(text);
    }
});

// Stop reading when mouse leaves
document.body.addEventListener("mouseout", () => {
    window.speechSynthesis.cancel();
});
