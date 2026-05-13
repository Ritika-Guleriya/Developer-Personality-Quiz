document.addEventListener('DOMContentLoaded', async () => {
  const track = document.getElementById('previewMarquee');
  if (!track) return;

  try {
    const response = await fetch('/api/personalities');
    const personalities = await response.json();
    
    if (personalities && personalities.length > 0) {
      track.innerHTML = ''; // Clear loading state
      
      // We duplicate the list to create a seamless infinite scrolling effect
      const marqueeItems = [...personalities, ...personalities];
      
      marqueeItems.forEach(p => {
        const card = document.createElement('div');
        card.className = 'personality-card tease';
        card.innerHTML = `
          <div class="personality-emoji">${p.emoji}</div>
          <div class="personality-name">${p.type}</div>
        `;
        track.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Failed to load personalities for preview marquee:', error);
  }
});
