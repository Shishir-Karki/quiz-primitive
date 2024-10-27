const Questions = [
  {
    question: "What does SQL stand for?",
    options: [
      "Stylish Question Language",
      "Stylesheet Query Language",
      "Statement Question Language",
      "Structured Query Language"
    ],
    correct_answer: "Structured Query Language"
  },
  {
    question: "What does XML stand for?",
    options: [
      "eXtensible Markup Language",
      "eXecutable Multiple Language",
      "eXTra Multi-Program Language",
      "eXamine Multiple Language"
    ],
    correct_answer: "eXtensible Markup Language"
  },
  {
    question: "What is the name of the town located in the Kanglatongbi area?",
    options: [
      "Imphal",
      "Kangpokpi",
      "Kakching",
      "Churachandpur"
    ],
    correct_answer: "Kangpokpi"
  }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;
let userAnswers = [];

window.onload = () => {
  loadQuestion();
  startTimer();
};

function loadQuestion() {
  const questionElement = document.getElementById("ques");
  const optionsContainer = document.getElementById("opt");
  const questionNumber = document.getElementById("questionNumber");
  
  questionElement.textContent = Questions[currentQuestion].question;
  questionNumber.textContent = `${currentQuestion + 1} of ${Questions.length} Questions`;
  optionsContainer.innerHTML = "";

  Questions[currentQuestion].options.forEach(option => {
    const optionDiv = document.createElement("div");
    optionDiv.textContent = option;
    optionDiv.className = "option";
    optionDiv.onclick = () => selectOption(optionDiv);
    optionsContainer.appendChild(optionDiv);
  });

  resetOptionStyles();
  resetTimer();
}

function selectOption(selectedDiv) {
  const answerValue = selectedDiv.textContent;
  const correctAnswer = Questions[currentQuestion].correct_answer;

  userAnswers.push({
    question: Questions[currentQuestion].question,
    user_answer: answerValue,
    correct_answer: correctAnswer,
    is_correct: answerValue === correctAnswer
  });

  if (answerValue === correctAnswer) score++;

  document.querySelectorAll(".options-container div").forEach(div => div.classList.add("disabled"));
  setTimeout(nextQuestion, 1000);
}

function skipQuestion() {
  userAnswers.push({
    question: Questions[currentQuestion].question,
    user_answer: "Skipped",
    correct_answer: Questions[currentQuestion].correct_answer,
    is_correct: false
  });
  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < Questions.length) {
    loadQuestion();
  } else {
    clearInterval(timer);
    showResults();
  }
}

function showResults() {
  document.querySelector(".timer-container").style.display = "none"; 
  document.querySelector(".question-container").innerHTML = `<h2>Your Score: ${score}/${Questions.length}</h2>`;
  document.getElementById("opt").style.display = "none";
  document.querySelector(".footer").style.display = "none";

  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results-summary";

  userAnswers.forEach((answer, index) => {
    const resultDiv = document.createElement("div");
    resultDiv.className = "result-item";

    const selectedClass = answer.is_correct ? "correct-answer" : "incorrect-answer";

    resultDiv.innerHTML = `
      <p><strong>${answer.question}</strong></p>
      <div class="answer ${selectedClass}">Selected: ${answer.user_answer}</div>
      <div class="answer correct">Correct: ${answer.correct_answer}</div>
      <hr>
    `;

    resultsContainer.appendChild(resultDiv);
  });

  document.querySelector(".question-container").appendChild(resultsContainer);
  document.getElementById("score").innerHTML = `<p>3 of ${Questions.length} Questions</p>`;
  
  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Quiz";
  restartButton.onclick = restartQuiz;
  document.querySelector(".question-container").appendChild(restartButton);
}



function resetOptionStyles() {
  document.querySelectorAll(".option").forEach(option => {
    option.classList.remove("disabled");
  });
}

function startTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = String(timeLeft).padStart(2, "0");

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = String(timeLeft).padStart(2, "0");

    if (timeLeft <= 0) {
      clearInterval(timer);
      skipQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  startTimer();
}
