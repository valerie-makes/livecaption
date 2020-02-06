// ==UserScript==
// @name         Google Slides Caption Helper
// @namespace    https://davidbailey.codes/
// @version      0.1.0
// @description  Send captions from Google Slides speaker notes to LiveCaption
// @author       David Bailey <davidbailey00@outlook.com>
// @match        https://docs.google.com/presentation/d/1lelWQ3hcGNO6WH2-IlqFCaQpHPa5-Zj7QvgLQu1C8uk/present*
// @grant        none
// ==/UserScript==

const containerClass = ".punch-viewer-speakernotes-text-body-scrollable";
const textClass = ".punch-viewer-speakernotes-text-body-zoomable";
const nextSlideClass = ".punch-viewer-speakernotes-page-next";

let lastText = "";
let lines = [];
let currentLine = 0;

function nextOnClick() {
  if (currentLine < lines.length - 1) {
    currentLine += 1;
    if (currentLine === lines.length - 1) {
      this.textContent = "NEXT SLIDE";
      this.onclick = () => {
        document.querySelector(nextSlideClass).click();
      };
    }
    displayCaption();
  }
}

function setupPrevNextButtons() {
  const container = document.querySelector(containerClass);

  let prevButton = container.querySelector(".prev");
  let nextButton = container.querySelector(".next");

  if (nextButton && currentLine < lines.length - 1) {
    nextButton.textContent = "Next";
    nextButton.onclick = nextOnClick;
  }

  if (!prevButton || !nextButton) {
    prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.className = "prev";
    prevButton.onclick = () => {
      if (currentLine > 0) {
        currentLine -= 1;
        displayCaption();
      }
    };
    container.appendChild(prevButton);

    nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = "next";
    nextButton.onclick = nextOnClick;
    container.appendChild(nextButton);
  }
}

function displayCaption() {
  const container = document.querySelector(containerClass);
  let caption = container.querySelector(".caption");

  setupPrevNextButtons();

  if (!caption) {
    caption = document.createElement("div");
    caption.className = "caption";
    caption.style.padding = "0 20px";
    caption.style.fontSize = "1.25rem";
    container.appendChild(caption);
  }

  caption.textContent = lines[currentLine];
  fetch(
    `http://localhost:3000/caption/${encodeURIComponent(lines[currentLine])}`
  );
}

function loop() {
  const notes = document.querySelector(textClass);
  if (!notes) return;

  const text = notes.textContent;
  if (text === lastText) return;
  lastText = text;
  currentLine = 0;

  lines = text
    .replace(/\.(?=[A-Z]| )/g, ".\n")
    .replace(/!/g, "!\n")
    .replace(/\?/g, "?\n")
    .split("\n")
    .filter(line => line !== "");

  displayCaption();
}

setInterval(loop, 200);
