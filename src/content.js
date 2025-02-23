// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scanAndFixIssues") {
        const results = scanAndFixAccessibility();
        sendResponse(results);
    }
});

// Scan for issues and automatically fix them
function scanAndFixAccessibility() {
    let issueCount = {};
    let score = 100; // Set to 100

    function addIssue(issueText, points = 5) {
        if (issueCount[issueText]) {
            issueCount[issueText]++;
        } else {
            issueCount[issueText] = 1;
        }
        score -= points; // Subtract points for each issue
    }

    // Fix missing alt attributes on images
    document.querySelectorAll("img:not([alt])").forEach(img => {
        img.setAttribute("alt", "Image");
        img.style.border = "2px solid green"; 
        addIssue("✅ Fixed: Added alt attribute to images");
    });

    // Fix buttons without labels
    document.querySelectorAll("button, [role='button']").forEach(button => {
        let hasLabel = button.hasAttribute("aria-label") || 
                       button.hasAttribute("aria-labelledby") || 
                       button.innerText.trim().length > 0;

        if (!hasLabel) {
            button.setAttribute("aria-label", "Button");
            button.style.border = "2px solid green"; 
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

    // Subtract more points for contrast issues
    const contrastIssues = checkColorContrast();
    contrastIssues.forEach(issue => {
        addIssue(issue, 10); 
    });

    console.log("Accessibility scan and fixes completed.");

    // Convert object to array with counts
    let fixedIssues = Object.entries(issueCount).map(([text, count]) => `${text} (${count} times)`);

    return { fixedIssues, score };
}

// Calculate luminance
function getLuminance(color) {
    const rgb = color.match(/\d+/g);
    const [r, g, b] = rgb.map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Check color contrast issues
function checkColorContrast() {
    let contrastIssues = [];

    document.querySelectorAll('*').forEach(element => {
        const styles = window.getComputedStyle(element);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;

        if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
            const contrastRatio = getContrastRatio(bgColor, textColor);
            if (contrastRatio < 4.5) {
                contrastIssues.push(`⚠️ Low contrast: ${element.tagName} with text "${element.innerText.trim()}"`);
            }
        }
    });

    return contrastIssues;
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

// Make all interactive elements focusable
function ensureFocusability() {
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    interactiveElements.forEach((el) => {
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0'); // Make focusable
        }
    });
}

// Fix logical tab order
function fixTabOrder() {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach((el, index) => {
        el.setAttribute('tabindex', index + 1); // Set a logical tab order
    });
}

// Add a visible focus indicator
function addFocusIndicator() {
    const style = document.createElement('style');
    style.textContent = `
        :focus {
            outline: 2px solid #0066ff !important; /* Blue outline for focus */
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
}

// Detect and fix keyboard navigation issues
function detectAndFixKeyboardNavigation() {
    console.log('Ensuring focusability...');
    ensureFocusability();

    console.log('Fixing tab order...');
    fixTabOrder();

    console.log('Adding visible focus indicator...');
    addFocusIndicator();

    console.log('Keyboard navigation enhancements applied!');
}

// Keyboard navigation enhancements
document.addEventListener('DOMContentLoaded', detectAndFixKeyboardNavigation);

// Rerun when DOM changes
const observer = new MutationObserver(detectAndFixKeyboardNavigation);
observer.observe(document.body, { childList: true, subtree: true });