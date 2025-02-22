document.getElementById("scanBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scanAndFixIssues" }, (response) => {
            const resultsDiv = document.getElementById("results");
            if (response && response.fixedIssues.length > 0) {
                resultsDiv.innerHTML = `<p><strong>Fixed Issues:</strong></p><p>${response.fixedIssues.join("<br>")}</p>`;
            } else {
                resultsDiv.innerHTML = "<p>✅ No accessibility issues found!</p>";
            }
        });
    });
});
