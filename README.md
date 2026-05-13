# 🧬 Data Personality Quiz

A fun, viral-worthy web app that determines your Data/AI personality type through a 10-question quiz. Get assigned a unique personality, see your results displayed beautifully, and share with friends!

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm

### Local Setup

1. **Clone or download the project**
   ```bash
   cd data-personality-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   ```

   Get your Groq API key:
   - Visit https://console.groq.com
   - Sign up or log in
   - Create an API key
   - Paste it into your `.env` file

4. **Start the server**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Click "Start Quiz" and take the 10-question quiz
   - View your personality result
   - Check out `/stats.html` to see the leaderboard

## 📁 Project Structure

```
data-personality-quiz/
├── server.js               # Express server + API routes
├── db.js                   # SQLite database setup
├── .env                    # Environment variables (DO NOT COMMIT)
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies & scripts
├── Procfile                # Deployment configuration
├── README.md               # This file
└── public/
    ├── index.html          # Landing page
    ├── quiz.html           # Quiz page
    ├── result.html         # Result page
    ├── stats.html          # Statistics page
    ├── css/
    │   ├── style.css       # Global styles
    │   ├── quiz.css        # Quiz styles
    │   ├── result.css      # Result styles
    │   └── stats.css       # Stats styles
    └── js/
        ├── quiz.js         # Quiz logic
        ├── result.js       # Result display
        └── stats.js        # Stats chart
```

## 🎮 How It Works

1. **Quiz Page** - Answer 10 brutally honest questions about your data habits
2. **AI Analysis** - Groq's LLaMA AI determines your personality type
3. **Result Page** - Beautiful card shows your personality with:
   - Personality emoji and name
   - Funny description
   - Brutal roast
   - Genuine strength
   - Alignment (e.g., "Chaotic Neutral")
   - Skill bars (for fun)
   - Recommended tool
4. **Share** - Copy result and share on LinkedIn, Twitter, etc.
5. **Stats** - See how many people have each personality type

## 🧬 The 12 Personality Types

1. 🔥 **The Overfit Overlord** - Trains on everything, generalizes on nothing
2. 🐼 **The Chaotic Pandas Wrangler** - df.head() is their morning coffee
3. 🎨 **The Silent Visualization Artist** - If it's not beautiful, it's not data
4. 🏗️ **The Pipeline Architect** - Everything is a DAG, even breakfast
5. 📓 **The Notebook Hoarder** - 300 notebooks, 0 named properly
6. 🤖 **The AutoML Evangelist** - Why code when the machine learns itself?
7. 🕵️ **The Feature Engineering Ninja** - Creates 200 features, uses 3
8. 📉 **The Metric Manipulator** - Redefines success until the model "works"
9. 🧪 **The Reproducibility Fanatic** - Seeds everything, documents everything
10. 💥 **The Stack Overflow Sorcerer** - Never written original code, always works
11. 🧠 **The Theory Purist** - Knows every paper, has deployed nothing
12. ⚡ **The Speed Demon** - Ships fast, fixes later, apologizes never

## 📊 API Routes

- `GET /` - Landing page
- `POST /api/submit` - Submit quiz answers
- `GET /api/result/:id` - Fetch a saved result
- `GET /api/stats` - Get personality type statistics
- `GET /api/count` - Get total quiz takers

## 🌐 Deployment

### Deploy to Render

1. Push your code to GitHub
2. Go to https://render.com
3. Create a new Web Service
4. Connect your GitHub repo
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `GROQ_API_KEY`: Your Groq API key
7. Deploy!

### Deploy to Railway

1. Push your code to GitHub
2. Go to https://railway.app
3. Create a new project
4. Connect your GitHub repo
5. Railway auto-detects Node.js
6. Add environment variable: `GROQ_API_KEY`
7. Deploy!

### Deploy to Heroku

```bash
heroku login
heroku create your-app-name
heroku config:set GROQ_API_KEY=your_key
git push heroku main
```

## 🎨 Design System

- **Dark Theme**: `#0d0d0d` background
- **Primary Accent**: Electric Purple `#a855f7`
- **Secondary Accent**: Cyan `#06b6d4`
- **Card Background**: `#1a1a2e`
- **Fonts**: Inter (body), Poppins (headings)
- **Animations**: Smooth transitions and entrance animations throughout
- **Responsive**: Fully mobile-friendly

## 💾 Database

Uses SQLite with `better-sqlite3`:

```sql
CREATE TABLE results (
  id TEXT PRIMARY KEY,
  personality_type TEXT NOT NULL,
  emoji TEXT,
  alignment TEXT,
  full_result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Results are persisted locally, and stats are computed from the database.

## 🔑 Environment Variables

```
GROQ_API_KEY     # Your Groq API key (required)
PORT             # Server port (default: 3000)
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite (better-sqlite3)
- **AI**: Groq API (LLaMA 3 70B)
- **Charts**: Chart.js
- **Effects**: Canvas Confetti
- **Fonts**: Google Fonts (Inter, Poppins)

## 📝 License

MIT

## 🤝 Contributing

Feel free to fork, modify, and use this project for your portfolio!

---

**Built with curiosity and code.** 🧬
