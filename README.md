# SeeHearClick - Accessibility Checker

SeeHearClick is a Chrome extension that scans websites for accessibility issues and automatically fixes common problems. It also provides a score based on the site's accessibility compliance.

## Features
- ✅ **Scans for missing alt attributes** on images and adds them.
- ✅ **Adds aria-labels to unlabeled buttons** to improve accessibility.
- ✅ **Adds aria-labels to form elements** to ensure proper screen reader support.
- 🔍 **Detects low color contrast** issues based on WCAG guidelines.
- 🏆 **Assigns an accessibility score** to each webpage.
- 🔊 **Hover-to-read feature** that reads out text when hovered.

## Installation
1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" (top right corner).
4. Click "Load unpacked" and select the `SeeHearClick` folder.
5. The extension is now installed!

## Usage
1. Click on the extension icon in Chrome.
2. Click the **Scan & Fix Issues** button.
3. The extension will scan the webpage and highlight fixed elements.
4. A popup will display the accessibility score and detected issues.

## Folder Structure
```
SeeHearClick/
│── assets/
│   ├── icon.png
│   ├── styles.css
│── src/
│   ├── background.js
│   ├── content.js
│   ├── popup.js
│── popup.html
│── manifest.json
│── README.md
```

## Technologies Used
- **JavaScript** (for content and background scripts)
- **Chrome Extensions API** (for messaging and page modifications)
- **Speech Synthesis API** (for hover-to-read feature)
- **WCAG Guidelines** (for color contrast checking)

## Future Improvements
- Add more detailed accessibility reporting.
- Support for ARIA roles and landmark regions.
- Improve color contrast checking using more advanced calculations.
- Provide alternatives for websites with poor accessibility.

## Our Team
- Malavika Panicker
- Neha Susan Lijo
- Saquib Rizwan

## License
This project is open-source and available under the MIT License.
