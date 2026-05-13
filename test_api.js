require('dotenv').config();

const answers = [0,1,2,3,0,1,2,3,0,1];
const questionLabels = [
  "Q1: Your model just hit 99% training accuracy. You:",
  "Q2: It's 2am. Your pipeline broke. You:",
  "Q3: Your Jupyter notebook folder looks like:",
  "Q4: Someone asks you to explain your model. You:",
  "Q5: Your go-to debugging technique is:",
  "Q6: Your relationship with documentation is:",
  "Q7: You see a dataset with 40% missing values. You:",
  "Q8: Your favorite way to visualize data is:",
  "Q9: When your model underperforms, you:",
  "Q10: Your dream job title is:"
];
const optionLabels = ["A", "B", "C", "D"];
const answerSummary = answers.map((ans, i) => `${questionLabels[i]} → Option ${optionLabels[ans]}`).join('\n');

const prompt = `You are a witty personality analyzer for developers and CS students.
Based on these quiz answers, assign ONE personality type from the list below.

User's answers:
${answerSummary}

Personality types to choose from:
- The Overfit Overlord
- The Chaotic Pandas Wrangler
- The Silent Visualization Artist
- The Pipeline Architect
- The Notebook Hoarder
- The AutoML Evangelist
- The Feature Engineering Ninja
- The Metric Manipulator
- The Reproducibility Fanatic
- The Stack Overflow Sorcerer
- The Theory Purist
- The Speed Demon

Return ONLY a valid JSON object, no markdown, no backticks, no explanation:
{
  "type": "personality name here",
  "emoji": "one emoji",
  "description": "two funny lines",
  "roast": "one brutal roast line",
  "strength": "one genuine strength",
  "alignment": "Chaotic Neutral or Lawful Good etc",
  "skill_bars": {
    "Skill1": 85,
    "Skill2": 23,
    "Skill3": 67,
    "Skill4": 91
  },
  "recommended_tool": "tool name and why"
}`;

async function run() {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a fun personality analyzer. Respond only with valid JSON, no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1024
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      console.log("Content:", content);
      
      const clean = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      console.log("Parsed successful!", parsed.type);
    } else {
        console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch(e) {
    console.error("Error:", e);
  }
}
run();
