require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const { saveResult, getResult, getStats, getTotalCount } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Quiz questions for reference
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Your model just hit 99% training accuracy. You:",
    options: [
      "Deploy immediately, ship it 🚀",
      "Check test accuracy nervously 😬",
      "Add more layers just to be safe 🧠",
      "Write a paper about it 📄"
    ]
  },
  {
    id: 2,
    question: "It's 2am. Your pipeline broke. You:",
    options: [
      "print() everything until something makes sense",
      "Open Stack Overflow in 12 tabs",
      "Blame the data, obviously",
      "Rewrite the whole thing from scratch"
    ]
  },
  {
    id: 3,
    question: "Your Jupyter notebook folder looks like:",
    options: [
      "\"Untitled32_final_FINAL_v3.ipynb\" — organized chaos",
      "Perfectly named, dated, and commented",
      "What's a folder? Everything's on the Desktop",
      "I use .py scripts like a civilized person"
    ]
  },
  {
    id: 4,
    question: "Someone asks you to explain your model. You:",
    options: [
      "\"It's just a black box, trust the accuracy\"",
      "Pull out a 47-slide deck you already had ready",
      "Draw a neural net diagram on a napkin",
      "\"Have you heard of SHAP values?\""
    ]
  },
  {
    id: 5,
    question: "Your go-to debugging technique is:",
    options: [
      "print() / console.log() — the classics",
      "A proper debugger with breakpoints",
      "Deleting code until it works",
      "Asking ChatGPT and hoping for the best"
    ]
  },
  {
    id: 6,
    question: "Your relationship with documentation is:",
    options: [
      "I am the documentation",
      "I write it religiously, even for myself",
      "The code is self-explanatory (it's not)",
      "What's documentation?"
    ]
  },
  {
    id: 7,
    question: "You see a dataset with 40% missing values. You:",
    options: [
      "Drop the whole column, no hesitation",
      "Spend 3 days on imputation strategies",
      "Fill everything with the mean and move on",
      "This is a feature, not a bug"
    ]
  },
  {
    id: 8,
    question: "Your favorite way to visualize data is:",
    options: [
      "Matplotlib — ugly but reliable",
      "Seaborn — pretty with minimal effort",
      "Plotly — interactive or nothing",
      "A raw printed DataFrame in the terminal"
    ]
  },
  {
    id: 9,
    question: "When your model underperforms, you:",
    options: [
      "Collect more data (always more data)",
      "Tune hyperparameters for 6 hours straight",
      "Try a completely different algorithm",
      "Lower your expectations and redefine success"
    ]
  },
  {
    id: 10,
    question: "Your dream job title is:",
    options: [
      "ML Engineer — I build things that scale",
      "Data Scientist — I find the stories in data",
      "AI Researcher — I push the frontier",
      "Data Engineer — pipelines are poetry"
    ]
  }
];

const PERSONALITY_TYPES = [
  {
    type: "The Overfit Overlord",
    emoji: "🔥",
    description: "Trains on everything, generalizes on nothing. Your model memorized the training data so well it forgot how to generalize.",
    roast: "You've confused a good training loss with actual intelligence.",
    strength: "You understand model capacity and fitting better than most.",
    alignment: "Chaotic Neutral",
    recommended_tool: "PyTorch (for maximum overfitting potential)"
  },
  {
    type: "The Chaotic Pandas Wrangler",
    emoji: "🐼",
    description: "df.head() is your morning coffee. You speak fluent pandas and think in DataFrames.",
    roast: "Half your notebooks are just different ways to melt and pivot the same data.",
    strength: "You can wrangle any messy dataset into submission.",
    alignment: "Neutral Good",
    recommended_tool: "Pandas (it's basically your native language)"
  },
  {
    type: "The Silent Visualization Artist",
    emoji: "🎨",
    description: "If it's not beautiful, it's not data. Your Plotly charts could hang in a gallery.",
    roast: "You spend 3 hours on a chart that 5 people will glance at for 2 seconds.",
    strength: "You make data speak directly to human intuition.",
    alignment: "Lawful Good",
    recommended_tool: "Plotly (your canvas)"
  },
  {
    type: "The Pipeline Architect",
    emoji: "🏗️",
    description: "Everything is a DAG, even breakfast. You engineer pipelines while others query databases.",
    roast: "Your DAG has more nodes than the actual data flow needs.",
    strength: "You build systems that scale and persist reliably.",
    alignment: "Lawful Neutral",
    recommended_tool: "Airflow (your skyscraper)"
  },
  {
    type: "The Notebook Hoarder",
    emoji: "📓",
    description: "300 notebooks, 0 named properly. Your kernel has crashed more times than you've breathed.",
    roast: "You couldn't tell an untitled_final_v12.ipynb from v11 without running it.",
    strength: "You iterate fast and experiment freely.",
    alignment: "Chaotic Neutral",
    recommended_tool: "Jupyter Lab (your digital hoarding warehouse)"
  },
  {
    type: "The AutoML Evangelist",
    emoji: "🤖",
    description: "Why code when the machine learns itself? You believe AutoML is the future. You might be right.",
    roast: "Your model is a black box wrapped in another black box.",
    strength: "You know how to leverage existing tools to iterate incredibly fast.",
    alignment: "Neutral Good",
    recommended_tool: "AutoGluon (set it and forget it)"
  },
  {
    type: "The Feature Engineering Ninja",
    emoji: "🕵️",
    description: "Creates 200 features, uses 3. Your domain knowledge is your superpower.",
    roast: "Half your features are suspiciously correlated with the target, aren't they?",
    strength: "You turn raw data into gold through creative engineering.",
    alignment: "True Neutral",
    recommended_tool: "Featuretools (your ninja forge)"
  },
  {
    type: "The Metric Manipulator",
    emoji: "📉",
    description: "Redefines success until the model 'works'. Your precision is perfect, if you ignore recall.",
    roast: "Your metrics need a therapist to process all the redefinition trauma.",
    strength: "You understand that the metric is the message.",
    alignment: "Chaotic Evil",
    recommended_tool: "Scikit-learn (for all those metrics to choose from)"
  },
  {
    type: "The Reproducibility Fanatic",
    emoji: "🧪",
    description: "Seeds everything, documents everything. Your code is tested, versioned, and has CI/CD.",
    roast: "Your README is longer than most people's dissertations.",
    strength: "Your work will run on any machine, any time, identically.",
    alignment: "Lawful Good",
    recommended_tool: "DVC (version your data like code)"
  },
  {
    type: "The Stack Overflow Sorcerer",
    emoji: "💥",
    description: "Never written original code, always works. Copy-paste is not a sin, it's a profession.",
    roast: "You've memorized more Stack Overflow links than Python syntax.",
    strength: "You solve problems faster than most can type them.",
    alignment: "True Neutral",
    recommended_tool: "Stack Overflow (your spellbook)"
  },
  {
    type: "The Theory Purist",
    emoji: "🧠",
    description: "Knows every paper, has deployed nothing. Your models are theoretically elegant but practically absent.",
    roast: "Your knowledge is so theoretical it might collapse into a singularity.",
    strength: "You understand the math deeply and can push boundaries.",
    alignment: "Lawful Neutral",
    recommended_tool: "ArXiv (your bedtime reading)"
  },
  {
    type: "The Speed Demon",
    emoji: "⚡",
    description: "Ships fast, fixes later, apologizes never. Your MVP was ready yesterday.",
    roast: "Your code is held together by duct tape, prayers, and denial.",
    strength: "You move fast and actually get things done.",
    alignment: "Chaotic Good",
    recommended_tool: "FastAPI (go fast, break things later)"
  }
];

// Fallback personality for API failures
const FALLBACK_PERSONALITY = {
  type: "The Speed Demon",
  emoji: "⚡",
  description: "Ships fast, fixes later, apologizes never.",
  roast: {
    short: "At least your code made it through the API call, unlike this request.",
    detailed: "You rely on API fallbacks more than you rely on solid error handling. Next time, maybe wrap your life in a try-catch block."
  },
  strength: {
    short: "You keep going even when things break.",
    detailed: "Your ability to power through catastrophic system failures without spilling your coffee is genuinely impressive."
  },
  alignment: "Chaotic Good",
  skill_bars: {
    "Creativity": { percentage: 85, description: "You find creative ways to bypass best practices." },
    "Problem Solving": { percentage: 90, description: "You solve problems by creating new, faster problems." },
    "Data Visualization": { percentage: 40, description: "Your terminal output is your only visualization." },
    "Communication": { percentage: 60, description: "You communicate mostly through commit messages like 'fixed stuff'." }
  },
  recommended_tool: {
    name: "FastAPI",
    description: "Because going fast is the only way you know how to operate, even if it means breaking things."
  }
};

// Helper: Build the prompt for Groq
function buildGroqPrompt(answers) {
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
  const answerSummary = answers.map((ans, i) => 
    `${questionLabels[i]} → Option ${optionLabels[ans]}`
  ).join("\n");

  return `You are a witty personality analyzer for developers and CS students.
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
  "roast": {
    "short": "One brutal, honest roast line",
    "detailed": "A full, detailed paragraph expanding on why they are being roasted this way based on their answers"
  },
  "strength": {
    "short": "One genuine strength line",
    "detailed": "A full, detailed paragraph expanding on why this strength makes them a great data person"
  },
  "alignment": "Chaotic Neutral or Lawful Good etc",
  "skill_bars": {
    "Skill1": 85,
    "Skill2": 23,
    "Skill3": 67,
    "Skill4": 91
  },
  "recommended_tool": {
    "name": "tool name",
    "description": "why they should use it"
  }
}`;
}

// Helper: Parse Groq response
function parseGroqResponse(rawText) {
  try {
    const clean = rawText.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return result;
  } catch (error) {
    console.error('JSON parse error:', error.message);
    return null;
  }
}

// Helper: Call Groq API
async function callGroqAPI(answers, retryCount = 0) {
  try {
    if (!GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not set in environment');
      return null;
    }

    console.log('📝 Building prompt for Groq API...');
    const prompt = buildGroqPrompt(answers);
    console.log('Prompt being sent to Groq:\n', prompt);
    console.log('✅ Prompt built. Sending fresh request to Groq (no caching)...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a fun personality analyzer. Respond only with valid JSON, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = `Groq API error: ${response.status} ${response.statusText}`;
      console.error('❌ ' + errorMsg);
      console.error('❌ Error details:', errorData);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in Groq response');
    }

    console.log('Raw response from Groq:\n', content);
    const parsed = parseGroqResponse(content);
    console.log('✅ Parsed personality result:', parsed?.type);
    
    if (!parsed) {
      if (retryCount < 1) {
        console.log('Retrying Groq API...');
        return callGroqAPI(answers, retryCount + 1);
      }
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Groq API error:', error.message);
    return null;
  }
}

// Routes

// Serve index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Submit quiz answers
app.post('/api/submit', async (req, res) => {
  console.log("Received answers:", req.body.answers);
  try {
    const { answers } = req.body;

    // Debug: Log received answers at the very top
    console.log('\n🔵 ===== NEW QUIZ SUBMISSION ===== 🔵');
    console.log('📥 Received answers from client:', answers);
    console.log('📊 Answers array length:', answers ? answers.length : 'undefined');
    if (answers && Array.isArray(answers)) {
      console.log('✅ Answers breakdown:', answers.map((a, i) => `Q${i+1}: Option ${a}`).join(', '));
    }

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      console.log('❌ Invalid answers format received');
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    // Call Groq API
    console.log('🚀 Calling Groq API with the received answers...');
    let result = await callGroqAPI(answers);

    // Use fallback if API fails
    if (!result) {
      console.log('⚠️ Groq API failed, using fallback personality');
      result = FALLBACK_PERSONALITY;
    } else {
      console.log('✅ Successfully generated personality:', result.type);
    }

    // Save to database
    const resultId = saveResult(result);

    console.log('💾 Result saved with ID:', resultId);
    console.log('🔵 ===== END SUBMISSION ===== 🔵\n');

    // Return result with ID (no caching)
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.json({
      result_id: resultId,
      ...result
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Failed to process quiz' });
  }
});

// API: Get result by ID
app.get('/api/result/:id', (req, res) => {
  try {
    const result = getResult(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// API: Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// API: Get total count
app.get('/api/count', (req, res) => {
  try {
    const total = getTotalCount();
    res.json({ total });
  } catch (error) {
    console.error('Count error:', error);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

// API: Get all personality types
app.get('/api/personalities', (req, res) => {
  res.json(PERSONALITY_TYPES);
});

// API: Share result via email
app.post('/api/share', async (req, res) => {
  try {
    const { email, resultId } = req.body;
    if (!email || !resultId) {
      return res.status(400).json({ error: 'Email and resultId are required' });
    }

    const result = getResult(resultId);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    // Create a test account if we don't have real SMTP
    let testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const getDetailedText = (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return `${field.short || field.name || ''}<br><br>${field.detailed || field.description || ''}`;
    };

    const roastText = getDetailedText(result.roast);
    const strengthText = getDetailedText(result.strength);
    const toolText = getDetailedText(result.recommended_tool);

    let htmlContent = `
      <h1>Your Data Personality: ${result.emoji} ${result.type}</h1>
      <p><strong>Alignment:</strong> ${result.alignment}</p>
      <p>${result.description}</p>
      
      <h3>The Roast (Weaknesses)</h3>
      <p>${roastText}</p>
      
      <h3>Your Strength</h3>
      <p>${strengthText}</p>
      
      <h3>Recommended Tool</h3>
      <p>${toolText}</p>
    `;

    if (result.skill_bars) {
      htmlContent += '<h3>Skill Levels</h3><ul>';
      for (const [skill, data] of Object.entries(result.skill_bars)) {
        const pct = typeof data === 'number' ? data : data.percentage;
        const desc = typeof data === 'object' ? data.description : '';
        htmlContent += `<li><strong>${skill}:</strong> ${pct}% ${desc ? '<br>' + desc : ''}</li>`;
      }
      htmlContent += '</ul>';
    }

    htmlContent += '<p><br>Take the quiz again at Data Personality Quiz!</p>';

    let info = await transporter.sendMail({
      from: '"Data Personality Quiz" <noreply@data-personality.quiz>',
      to: email,
      subject: `You are ${result.type}! - Data Personality Quiz`,
      text: "Please view this email in an HTML compatible client.",
      html: htmlContent,
    });

    console.log("Email Message sent: %s", info.messageId);
    console.log("Email Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({ 
      success: true, 
      message: 'Email sent successfully!', 
      previewUrl: nodemailer.getTestMessageUrl(info) 
    });

  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({ error: 'Failed to share result' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Data Personality Quiz server running on http://localhost:${PORT}`);
});
