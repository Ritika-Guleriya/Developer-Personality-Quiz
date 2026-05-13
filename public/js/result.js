/* ========== RESULT PAGE LOGIC ========== */

// Personality type to color mapping
const PERSONALITY_COLORS = {
  'The Overfit Overlord': '#ef4444',
  'The Chaotic Pandas Wrangler': '#f59e0b',
  'The Silent Visualization Artist': '#ec4899',
  'The Pipeline Architect': '#06b6d4',
  'The Notebook Hoarder': '#8b5cf6',
  'The AutoML Evangelist': '#10b981',
  'The Feature Engineering Ninja': '#f97316',
  'The Metric Manipulator': '#dc2626',
  'The Reproducibility Fanatic': '#0ea5e9',
  'The Stack Overflow Sorcerer': '#a855f7',
  'The Theory Purist': '#6366f1',
  'The Speed Demon': '#a855f7'
};

// Personality descriptions for reference
const PERSONALITY_DATA = {
  'The Overfit Overlord': {
    description: 'Trains on everything, generalizes on nothing',
    traits: ['High model complexity', 'Perfect training fit', 'Terrible generalization']
  },
  'The Chaotic Pandas Wrangler': {
    description: 'df.head() is your morning coffee',
    traits: ['Data manipulation expert', 'DataFrame fluent', 'Transformation wizard']
  },
  'The Silent Visualization Artist': {
    description: 'If it isn\'t beautiful, it isn\'t data',
    traits: ['Aesthetic focused', 'Visual storytelling', 'Chart designer']
  },
  'The Pipeline Architect': {
    description: 'Everything is a DAG, even breakfast',
    traits: ['Systems thinker', 'Orchestration expert', 'Scalability focused']
  },
  'The Notebook Hoarder': {
    description: '300 notebooks, 0 named properly',
    traits: ['Rapid experimenter', 'Iterative thinker', 'Exploration driven']
  },
  'The AutoML Evangelist': {
    description: 'Why code when the machine learns itself?',
    traits: ['Tool leverager', 'Speed focused', 'Pragmatic builder']
  },
  'The Feature Engineering Ninja': {
    description: 'Creates 200 features, uses 3',
    traits: ['Domain expert', 'Creative engineer', 'Feature craftsman']
  },
  'The Metric Manipulator': {
    description: 'Redefines success until the model "works"',
    traits: ['Metric savvy', 'Results oriented', 'Strategic thinker']
  },
  'The Reproducibility Fanatic': {
    description: 'Seeds everything, documents everything',
    traits: ['Perfectionist', 'Documentation writer', 'Quality advocate']
  },
  'The Stack Overflow Sorcerer': {
    description: 'Never written original code, always works',
    traits: ['Problem solver', 'Research expert', 'Pragmatic coder']
  },
  'The Theory Purist': {
    description: 'Knows every paper, has deployed nothing',
    traits: ['Mathematics lover', 'Research driven', 'Theoretical expert']
  },
  'The Speed Demon': {
    description: 'Ships fast, fixes later, apologizes never',
    traits: ['Delivery focused', 'Fast mover', 'Pragmatic operator']
  }
};

// Initialize result page
async function initResultPage() {
  const resultId = sessionStorage.getItem('resultId');

  if (!resultId) {
    alert('No result found. Please retake the quiz.');
    window.location.href = '/quiz.html';
    return;
  }

  try {
    const response = await fetch(`/api/result/${resultId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch result');
    }

    const result = await response.json();
    renderResult(result);
    playConfetti();
  } catch (error) {
    console.error('Error fetching result:', error);
    alert('Failed to load your result. Please try again.');
    window.location.href = '/quiz.html';
  }
}

// Render result card
function renderResult(result) {
  const resultCard = document.getElementById('resultCard');

  // Get personality color
  const color = PERSONALITY_COLORS[result.type] || '#a855f7';

  // Helper to extract short and detailed strings
  const parseDetail = (field) => {
    if (!field) return { short: '', detailed: null };
    if (typeof field === 'string') return { short: field, detailed: null };
    return { short: field.short || field.name || '', detailed: field.detailed || field.description || null };
  };

  const roast = parseDetail(result.roast);
  const strength = parseDetail(result.strength);
  const tool = parseDetail(result.recommended_tool);

  // Helper to create HTML for expandable items
  const createExpandableHTML = (label, shortText, detailedText, extraClass = '') => {
    if (!detailedText) {
      return `
        <div class="detail-item ${extraClass}">
          <span class="detail-label">${label}</span>
          <p>${shortText}</p>
        </div>
      `;
    }
    return `
      <div class="detail-item expandable-item ${extraClass}">
        <div class="expandable-header">
          <span class="detail-label" style="margin-bottom:0;">${label}</span>
          <span class="expand-indicator">▼</span>
        </div>
        <p class="short-text">${shortText}</p>
        <p class="detailed-text">${detailedText}</p>
      </div>
    `;
  };

  // Build skill bars HTML
  const skillBarsHTML = result.skill_bars
    ? Object.entries(result.skill_bars)
        .map(([skill, data]) => {
          let percentage = typeof data === 'number' ? data : data.percentage;
          let desc = typeof data === 'object' ? data.description : null;
          
          if (!desc) {
            return `
              <div class="skill-item">
                <div class="skill-header">
                  <span class="skill-name">${skill}</span>
                  <span class="skill-percentage">${percentage}%</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-fill" style="--fill-width: ${percentage}%"></div>
                </div>
              </div>
            `;
          }
          
          return `
            <div class="skill-item detail-item expandable-item" style="padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 0.75rem;">
              <div class="expandable-header">
                <span class="skill-name font-semibold" style="color: var(--text-primary); font-size: 0.85rem;">${skill}</span>
                <span class="skill-percentage" style="color: var(--accent-purple); font-size: 0.85rem; font-weight: 600;">${percentage}% <span class="expand-indicator" style="display:inline-block; margin-left:5px;">▼</span></span>
              </div>
              <div class="skill-bar" style="margin-top:0.5rem;">
                <div class="skill-fill" style="--fill-width: ${percentage}%"></div>
              </div>
              <p class="detailed-text">${desc}</p>
            </div>
          `;
        })
        .join('')
    : '';

  // Build result card HTML
  resultCard.innerHTML = `
    <div class="result-card-content">
      <div class="result-personality-header">
        <span class="result-emoji">${result.emoji}</span>
        <h1 class="result-type-name">${result.type}</h1>
        <p class="result-description">${result.description}</p>
      </div>

      <div class="alignment-badge">${result.alignment}</div>

      <div class="result-details">
        ${createExpandableHTML('The Roast', roast.short, roast.detailed, 'detail-roast')}
        ${createExpandableHTML('Your Strength', strength.short, strength.detailed, 'detail-strength')}
      </div>

      ${
        skillBarsHTML
          ? `<div class="skill-bars" style="display:flex; flex-direction:column; gap:1rem;">${skillBarsHTML}</div>`
          : ''
      }

      ${createExpandableHTML('Recommended Tool', '✨ ' + tool.short, tool.detailed, 'recommended-tool')}
    </div>
  `;

  // Apply color to card border
  resultCard.style.borderColor = color + '40';
  resultCard.style.boxShadow = `0 0 40px ${color}33`;

  // Add click listeners for expandable items
  document.querySelectorAll('.expandable-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('expanded');
    });
  });
}

// Play confetti
function playConfetti() {
  if (typeof confetti === 'undefined') {
    console.warn('Confetti library not loaded');
    return;
  }

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Download as Text
function downloadAsText() {
  const resultId = sessionStorage.getItem('resultId');
  if (!resultId) {
    alert('No result found to download!');
    return;
  }
  const resultType = document.querySelector('.result-type-name')?.textContent || 'StackSelf Result';
  const emoji = document.querySelector('.result-emoji')?.textContent || '';
  const description = document.querySelector('.result-description')?.textContent || '';
  const alignment = document.querySelector('.alignment-badge')?.textContent || '';
  
  let content = `Your StackSelf Result: ${emoji} ${resultType}\n`;
  content += `Alignment: ${alignment}\n\n`;
  content += `${description}\n\n`;
  
  // Get all detail items
  document.querySelectorAll('.detail-item:not(.skill-item)').forEach(item => {
    const label = item.querySelector('.detail-label')?.textContent || '';
    // Handle short text which might be a <p> with class 'short-text' or just a regular <p>
    let short = '';
    const shortEl = item.querySelector('.short-text');
    if (shortEl) {
      short = shortEl.textContent;
    } else {
      const pEl = item.querySelector('p:not(.short-text):not(.detailed-text)');
      if (pEl) short = pEl.textContent;
    }
    const detailed = item.querySelector('.detailed-text')?.textContent || '';
    
    if (label && short) {
       content += `--- ${label} ---\n${short}\n`;
       if (detailed) content += `${detailed}\n`;
       content += '\n';
    }
  });

  // Get skills
  const skillsContainer = document.querySelector('.skill-bars');
  if (skillsContainer) {
    content += `--- Skills ---\n`;
    document.querySelectorAll('.skill-item').forEach(item => {
      const name = item.querySelector('.skill-name')?.textContent || '';
      let pct = item.querySelector('.skill-percentage')?.textContent || '';
      pct = pct.replace('▼', '').trim(); // Remove the arrow
      const desc = item.querySelector('.detailed-text')?.textContent || '';
      if (name) {
        content += `${name}: ${pct}\n`;
        if (desc) content += `${desc}\n`;
      }
    });
    content += '\n';
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `StackSelf_${resultType.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Retake quiz
function retakeQuiz() {
  sessionStorage.removeItem('resultId');
  window.location.href = '/quiz.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initResultPage();

  document.getElementById('shareBtn').addEventListener('click', downloadAsText);
  document.getElementById('retakeBtn').addEventListener('click', retakeQuiz);
});
