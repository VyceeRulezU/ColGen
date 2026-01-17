document.addEventListener("DOMContentLoaded", () => {
  const colorGrid = document.getElementById("color-grid");
  const generateBtn = document.getElementById("generate-btn");

  // Create Toast Element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = "Color copied to clipboard!";
  document.body.appendChild(toast);

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // Helper: Generate Random Hex
  function generateHex() {
    const chars = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Helper: Hex to RGB (for valid contrast if needed later, but just displaying for now)
  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Determine if text should be black or white based on background luminance
  function getContrastColor(hex) {
    // Convert hex to rgb
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    // Calculate Y, luminance
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
  }

  function createCard(color) {
    const card = document.createElement("div");
    card.className = "color-card";

    // Visual Display
    const display = document.createElement("div");
    display.className = "color-display";
    display.style.backgroundColor = color;

    // Info Container
    const info = document.createElement("div");
    info.className = "color-info";

    const hexText = document.createElement("span");
    hexText.className = "hex-code";
    hexText.textContent = color;

    // Optionally show RGB
    const rgbText = document.createElement("span");
    rgbText.className = "rgb-code";
    rgbText.textContent = hexToRgb(color);

    info.appendChild(hexText);
    info.appendChild(rgbText);

    card.appendChild(display);
    card.appendChild(info);

    // Click to copy
    card.addEventListener("click", () => {
      navigator.clipboard.writeText(color).then(() => {
        showToast(`Copied ${color}`);
      });
    });

    return card;
  }

  function generatePalette() {
    colorGrid.innerHTML = "";
    const palette = [];

    for (let i = 0; i < 6; i++) {
      const color = generateHex();
      palette.push(color);
      const card = createCard(color);
      // Add a tiny delay for stagger effect if not handled by CSS nth-child
      card.style.animationDelay = `${i * 0.05}s`;
      colorGrid.appendChild(card);
    }
  }

  // Event Listeners
  generateBtn.addEventListener("click", () => {
    // Add rotation animation to icon
    const icon = generateBtn.querySelector(".icon svg");
    icon.style.transition = "transform 0.4s ease";
    icon.style.transform = `rotate(${Math.random() * 360 + 360}deg)`;

    generatePalette();
  });

  // Spacebar to generate
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault(); // Prevent scrolling
      generateBtn.click();
    }
  });

  // Initial Load
  generatePalette();
});
