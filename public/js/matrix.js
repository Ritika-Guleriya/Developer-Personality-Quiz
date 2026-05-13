// public/js/matrix.js

const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width, height;
let columns;
const drops = [];

// Cyberpunk Blue colors
const charColor = '#00f3ff'; // Bright neon cyan
const fadeColor = 'rgba(5, 5, 16, 0.08)'; // Deep navy fade
const fontSize = 16;

// Characters: mostly 0 and 1, some letters, numbers, and syntax
const chars = '01010101010101010101010101010101010101010101010101abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ23456789{}()=+-*/;<>[]~|';

function initMatrix() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  
  columns = Math.floor(width / fontSize);
  
  // Initialize drops randomly across the screen height instead of off-screen
  drops.length = 0;
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * (height / fontSize);
  }
  
  // Pre-fill the screen instantly so it doesn't start empty
  ctx.fillStyle = '#050510'; 
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 50; i++) {
    drawFrame();
  }
}

function drawFrame() {
  if (!canvas) return;
  // Draw translucent background to create trailing effect
  ctx.fillStyle = fadeColor;
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    // Select random character
    const text = chars.charAt(Math.floor(Math.random() * chars.length));

    // Draw character
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    
    // Vary brightness occasionally for a glitchy neon look
    if (Math.random() > 0.98) {
      ctx.fillStyle = '#ffffff'; // White flash
    } else if (Math.random() > 0.9) {
      ctx.fillStyle = '#0066ff'; // Darker blue flicker
    } else {
      ctx.fillStyle = charColor;
    }

    ctx.fillText(text, x, y);

    // Reset drop to top randomly, or increment
    if (y > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Handle resize
window.addEventListener('resize', initMatrix);

// Start
initMatrix();
setInterval(drawFrame, 50); // Using setInterval for consistent Matrix speed
