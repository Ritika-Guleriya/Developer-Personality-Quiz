const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const dbPath = path.join(__dirname, 'quiz-results.json');

// Load results from file
function loadResults() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading results:', error.message);
  }
  return [];
}

// Save results to file
function saveToFile(results) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(results, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving results:', error.message);
  }
}

// Save a result
function saveResult(personalityData) {
  const id = randomUUID();
  const result = {
    id,
    personality_type: personalityData.type,
    emoji: personalityData.emoji,
    alignment: personalityData.alignment,
    full_result: personalityData,
    created_at: new Date().toISOString()
  };

  const results = loadResults();
  results.push(result);
  saveToFile(results);

  return id;
}

// Get a single result
function getResult(id) {
  const results = loadResults();
  const result = results.find(r => r.id === id);

  if (result) {
    return {
      id: result.id,
      ...result.full_result,
      created_at: result.created_at
    };
  }
  return null;
}

// Get statistics
function getStats() {
  const results = loadResults();
  const stats = {};

  // Group by personality type
  results.forEach(result => {
    const type = result.personality_type;
    if (!stats[type]) {
      stats[type] = {
        type: type,
        emoji: result.emoji,
        count: 0
      };
    }
    stats[type].count++;
  });

  // Convert to array and calculate percentages
  const statsArray = Object.values(stats);
  const total = results.length;

  return statsArray
    .map(s => ({
      ...s,
      percentage: total > 0 ? Math.round((s.count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
}

// Get total count
function getTotalCount() {
  const results = loadResults();
  return results.length;
}

module.exports = {
  saveResult,
  getResult,
  getStats,
  getTotalCount
};
