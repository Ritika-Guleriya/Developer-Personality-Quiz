/* ========== ALL PERSONALITIES PAGE LOGIC ========== */

// Initialize page
async function initStatsPage() {
  await loadPersonalities();
}

// Load all personalities
async function loadPersonalities() {
  try {
    const response = await fetch('/api/personalities');

    if (!response.ok) {
      throw new Error('Failed to fetch personalities');
    }

    const personalities = await response.json();
    renderPersonalityCards(personalities);
  } catch (error) {
    console.error('Error loading personalities:', error);
    const grid = document.getElementById('personalityGrid');
    grid.innerHTML = '<div style="color: white; text-align: center; width: 100%;">Failed to load personalities. Please try again later.</div>';
  }
}

// Render personality cards
function renderPersonalityCards(personalities) {
  const grid = document.getElementById('personalityGrid');
  grid.innerHTML = '';

  personalities.forEach(p => {
    const card = document.createElement('div');
    card.className = 'personality-stat-card';
    
    card.innerHTML = `
      <div class="stat-card-content" style="display: flex; flex-direction: column; gap: 8px;">
        <span class="stat-emoji" style="font-size: 3rem; margin-bottom: 10px; display: block; text-align: center;">${p.emoji}</span>
        <h3 class="stat-name" style="text-align: center; color: white; margin: 0;">${p.type}</h3>
        <div style="background: rgba(168, 85, 247, 0.1); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; color: #a855f7; display: inline-block; margin: 0 auto;">${p.alignment}</div>
        <p class="stat-description" style="color: #a0a0b0; font-size: 0.95rem; margin-top: 10px; flex-grow: 1;">${p.description}</p>
        <div style="margin-top: 15px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
          <div style="font-size: 0.75rem; color: #ef4444; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">The Roast</div>
          <div style="font-size: 0.85rem; color: #e2e8f0; font-style: italic;">"${p.roast}"</div>
        </div>
        <div style="margin-top: 10px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
          <div style="font-size: 0.75rem; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Your Strength</div>
          <div style="font-size: 0.85rem; color: #e2e8f0;">${p.strength}</div>
        </div>
        <div style="margin-top: 10px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
          <div style="font-size: 0.75rem; color: #06b6d4; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: bold;">Recommended Tool</div>
          <div style="font-size: 0.85rem; color: #e2e8f0;">${p.recommended_tool}</div>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initStatsPage);
