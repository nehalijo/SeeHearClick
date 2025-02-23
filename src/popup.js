document.getElementById("scanBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scanAndFixIssues" }, (response) => {
            const resultsDiv = document.getElementById("results");
            if (response && response.fixedIssues.length > 0) {
                // Count color contrast issues
                const colorContrastIssues = response.fixedIssues.filter(issue => issue.includes("Low contrast")).length;

                // Display fixed issues
                resultsDiv.innerHTML = `
                    <p><strong>Fixed Issues:</strong></p>
                    <p>${response.fixedIssues.join("<br>")}</p>
                `;

                // Add warning for color contrast issues
                if (colorContrastIssues > 0) {
                    resultsDiv.innerHTML += `
                        <p>⚠️ Color contrast issues (${colorContrastIssues} times)</p>
                    `;
                }

                // Display accessibility score
                resultsDiv.innerHTML += `
                    <p><strong>Accessibility Score:</strong> ${response.score}</p>
                `;
            } else {
                resultsDiv.innerHTML = "<p>✅ No accessibility issues found!</p>";
            }
        });
    });
});