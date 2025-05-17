let questions = [];
let current = 0;
let score = 0;
let timer;
let timeLeft = 15;

async function fetchQuestions() {
  const res = await fetch('/api/questions');
  questions = await res.json();
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("time").textContent = timeLeft;
  timer = setInterval(countdown, 1000);

  const q = questions[current];
  document.getElementById("question-box").textContent = q.question;

  const answersUl = document.getElementById("answers");
  answersUl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.onclick = () => checkAnswer(opt);
    answersUl.appendChild(li);
  });
}

function countdown() {
  timeLeft--;
  document.getElementById("time").textContent = timeLeft;
  if (timeLeft === 0) {
    nextQuestion();
  }
}

function checkAnswer(selected) {
  clearInterval(timer);
  if (selected === questions[current].answer) {
    score++;
  }
  nextQuestion();
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("question-box").classList.add("hidden");
  document.getElementById("answers").classList.add("hidden");
  document.getElementById("timer").classList.add("hidden");
  document.getElementById("next-btn").classList.add("hidden");

  const resultBox = document.getElementById("result-box");
  resultBox.classList.remove("hidden");
  resultBox.textContent = `You scored ${score} out of ${questions.length}`;
}

document.getElementById("next-btn").onclick = nextQuestion;

fetchQuestions();
