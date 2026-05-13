/* ========== QUIZ LOGIC ========== */

const QUESTIONS = [
  {
    question: "Your model just hit 99% training accuracy. You:",
    options: [
      "Deploy immediately, ship it 🚀",
      "Check test accuracy nervously 😬",
      "Add more layers just to be safe 🧠",
      "Write a paper about it 📄"
    ]
  },
  {
    question: "It's 2am. Your pipeline broke. You:",
    options: [
      "print() everything until something makes sense",
      "Open Stack Overflow in 12 tabs",
      "Blame the data, obviously",
      "Rewrite the whole thing from scratch"
    ]
  },
  {
    question: "Your Jupyter notebook folder looks like:",
    options: [
      "\"Untitled32_final_FINAL_v3.ipynb\" — organized chaos",
      "Perfectly named, dated, and commented",
      "What's a folder? Everything's on the Desktop",
      "I use .py scripts like a civilized person"
    ]
  },
  {
    question: "Someone asks you to explain your model. You:",
    options: [
      "\"It's just a black box, trust the accuracy\"",
      "Pull out a 47-slide deck you already had ready",
      "Draw a neural net diagram on a napkin",
      "\"Have you heard of SHAP values?\""
    ]
  },
  {
    question: "Your go-to debugging technique is:",
    options: [
      "print() / console.log() — the classics",
      "A proper debugger with breakpoints",
      "Deleting code until it works",
      "Asking ChatGPT and hoping for the best"
    ]
  },
  {
    question: "Your relationship with documentation is:",
    options: [
      "I am the documentation",
      "I write it religiously, even for myself",
      "The code is self-explanatory (it's not)",
      "What's documentation?"
    ]
  },
  {
    question: "You see a dataset with 40% missing values. You:",
    options: [
      "Drop the whole column, no hesitation",
      "Spend 3 days on imputation strategies",
      "Fill everything with the mean and move on",
      "This is a feature, not a bug"
    ]
  },
  {
    question: "Your favorite way to visualize data is:",
    options: [
      "Matplotlib — ugly but reliable",
      "Seaborn — pretty with minimal effort",
      "Plotly — interactive or nothing",
      "A raw printed DataFrame in the terminal"
    ]
  },
  {
    question: "When your model underperforms, you:",
    options: [
      "Collect more data (always more data)",
      "Tune hyperparameters for 6 hours straight",
      "Try a completely different algorithm",
      "Lower your expectations and redefine success"
    ]
  },
  {
    question: "Your dream job title is:",
    options: [
      "ML Engineer — I build things that scale",
      "Data Scientist — I find the stories in data",
      "AI Researcher — I push the frontier",
      "Data Engineer — pipelines are poetry"
    ]
  }
];

const LOADING_MESSAGES = [
  "Consulting the data gods...",
  "Analyzing your chaos...",
  "Running your vibes through a neural net...",
  "Training your personality model...",
  "Generating your essence in embeddings...",
  "Searching the data multiverse...",
  "Calculating your data alignment...",
  "Querying the personality database..."
];

let currentQuestion = 0;
let selectedAnswers = [];

// Initialize quiz
function initQuiz() {
  renderQuestion();
  updateProgressBar();
}

// Render current question
function renderQuestion() {
  const question = QUESTIONS[currentQuestion];
  const questionText = document.getElementById('questionText');
  const questionBadge = document.getElementById('questionBadge');
  const optionsGrid = document.getElementById('optionsGrid');

  // Update question number
  questionBadge.textContent = `Q${currentQuestion + 1}`;

  // Update question text
  questionText.textContent = question.question;

  // Clear options
  optionsGrid.innerHTML = '';

  // Render options
  question.options.forEach((option, index) => {
    const card = document.createElement('div');
    card.className = 'option-card';
    if (selectedAnswers[currentQuestion] === index) {
      card.classList.add('selected');
    }
    card.textContent = option;
    
    card.addEventListener('click', () => selectOption(index));
    optionsGrid.appendChild(card);
  });

  // Add animation
  animateQuestionIn();
}

// Select an option
function selectOption(index) {
  selectedAnswers[currentQuestion] = index;

  // Highlight selected
  document.querySelectorAll('.option-card').forEach((card, i) => {
    if (i === index) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  // Auto-advance after 400ms
  setTimeout(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      currentQuestion++;
      renderQuestion();
      updateProgressBar();
    } else {
      submitQuiz();
    }
  }, 400);
}

// Update progress bar
function updateProgressBar() {
  const percentage = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  document.getElementById('progressFill').style.width = percentage + '%';
}

// Animate question in
function animateQuestionIn() {
  const questionText = document.getElementById('questionText');
  const optionsGrid = document.getElementById('optionsGrid');

  questionText.style.animation = 'none';
  optionsGrid.style.animation = 'none';

  setTimeout(() => {
    questionText.style.animation = 'fadeInUp 0.5s ease-out';
    optionsGrid.style.animation = 'fadeInUp 0.5s ease-out 0.2s both';
  }, 10);
}

// Submit quiz
async function submitQuiz() {
  // Show loading screen
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.classList.add('active');

  // Cycle through loading messages
  const loadingMessage = document.getElementById('loadingMessage');
  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    loadingMessage.textContent = LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length];
    messageIndex++;
  }, 1500);

  // Debug: Log answers before sending
  console.log('📤 Sending answers to server:', selectedAnswers);
  console.log('📊 Answers array length:', selectedAnswers.length);
  console.log('✅ Answers breakdown:', selectedAnswers.map((a, i) => `Q${i+1}: Option ${a}`).join(', '));

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({ answers: selectedAnswers })
    });

    if (!response.ok) {
      throw new Error('Failed to submit quiz');
    }

    const data = await response.json();

    // Store result ID in session storage
    sessionStorage.setItem('resultId', data.result_id);

    clearInterval(messageInterval);

    // Redirect to result page
    setTimeout(() => {
      window.location.href = '/result.html';
    }, 800);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    clearInterval(messageInterval);
    loadingScreen.classList.remove('active');
    alert('Failed to process your quiz. Please try again.');
  }
}

// Start quiz
document.addEventListener('DOMContentLoaded', initQuiz);
