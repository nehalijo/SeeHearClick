document.getElementById("scanBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: scanAccessibility
        });
    });
});

function scanAccessibility() {
    const issues = [];

    // Example: Check for missing alt attributes on images
    document.querySelectorAll("img:not([alt])").forEach(img => {
        issues.push("❌ Missing alt attribute on an image.");
        img.style.border = "2px solid red"; // Highlight the issue
    });

    // Send results back to popup
    chrome.runtime.sendMessage({ issues });
}

chrome.runtime.onMessage.addListener((message) => {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = message.issues.length > 0 
        ? `<p>${message.issues.join("<br>")}</p>` 
        : "<p>✅ No accessibility issues found!</p>";
});
