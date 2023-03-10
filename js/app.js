//registration using username and password and save it in local storage

$(document).ready(function () {
  $("#registration-form").submit(function (e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    console.log("Username: " + username + ", Password: " + password);

    var user = { username: username, password: password };
    var users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful");
    // Redirect to login page
    window.location.href = "login.html";
  });
});

// login users created in local storage

$(document).ready(function () {
  $("#login-form").submit(function (e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    console.log("Username: " + username + ", Password: " + password);

    var users = JSON.parse(localStorage.getItem("users") || "[]");
    var valid = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].password === password) {
        valid = true;
        break;
      }
    }
    if (valid) {
      // Redirect to quiz page
      window.location.href = "Quiz_home.html";
    } else {
      alert("Invalid username or password");
    }
  });
});

//initializing constants for HTML elements

const questionNumber = document.querySelector(".question-no");
const questionText = document.querySelector(".question-text");
const optionsContainer = document.querySelector(".opt-container");
const answerIndicatorContainer = document.querySelector(".ans-indicator");
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const name = document.querySelector(".name");

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attempt = 0;

//Push the quetions into array
function setAvailableQuestions() {
  const totalQuestions = quiz.length;
  for (let i = 0; i < totalQuestions; i++) {
    availableQuestions.push(quiz[i]);
  }
}

function getNewQuestion() {
  questionNumber.innerHTML = "Question " + (questionCounter + 1) + " of 10";

  // use randomly selecting to set question

  const questionIndex =
    availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  currentQuestion = questionIndex;
  questionText.innerHTML = currentQuestion.q;

  const index1 = availableQuestions.indexOf(questionIndex);

  //remove the question ,so the question won't repeate again

  availableQuestions.splice(index1, 1);

  //use randomly selecting to set options

  const optionLen = currentQuestion.options.length;

  //push options in array
  for (let i = 0; i < optionLen; i++) {
    availableOptions.push(i);
  }

  optionsContainer.innerHTML = "";
  let animationDelay = 0.15;

  //create options in HTML
  for (let i = 0; i < optionLen; i++) {
    //random option to get and remove the option, so that option does not repeat
    const optionIndex =
      availableOptions[Math.floor(Math.random() * availableOptions.length)];

    const index2 = availableOptions.indexOf(optionIndex);
    availableOptions.splice(index2, 1);

    // updates the HTML for the question and options. with animation using CSS

    const option = document.createElement("div");
    option.innerHTML = currentQuestion.options[optionIndex];
    option.id = optionIndex;
    option.style.animationDelay = animationDelay + "s";
    animationDelay = animationDelay + 0.15;
    option.className = "option";
    optionsContainer.appendChild(option);
    option.setAttribute("onclick", "getResult(this)");
  }

  questionCounter++;
}

//det result of attempt question

function getResult(element) {
  const id = parseInt(element.id);

  if (id === currentQuestion.answer) {
    element.classList.add("correct");
    updateAnswerIndicator("correct");
    correctAnswers++;

    console.log("correct:" + correctAnswers);
  } else {
    element.classList.add("wrong");
    updateAnswerIndicator("wrong");

    // if the answer is incorrect, show the correct option

    const optionLen = optionsContainer.children.length;
    for (let i = 0; i < optionLen; i++) {
      if (
        parseInt(optionsContainer.children[i].id) === currentQuestion.answer
      ) {
        optionsContainer.children[i].classList.add("correct");
      }
    }
  }
  attempt++;
  unclickableOptions();
}

// user can't select any option if once selected
function unclickableOptions() {
  const optionLen = optionsContainer.children.length;
  for (let i = 0; i < optionLen; i++) {
    optionsContainer.children[i].classList.add("already-answered");
  }
}

// creates the answer indicator to track the user's performance.

function answerIndicator() {
  answerIndicatorContainer.innerHTML = "";
  const totalQuestions = quiz.length;
  for (let i = 0; i < 10; i++) {
    const indicator = document.createElement("div");
    answerIndicatorContainer.appendChild(indicator);
  }
}

//adds the markType ("correct" or "wrong") when user select answer

function updateAnswerIndicator(markType) {
  answerIndicatorContainer.children[questionCounter - 1].classList.add(
    markType
  );
}

function next() {
  if (questionCounter === 10) {
    quizOver();
  } else {
    getNewQuestion();
  }
}

function quizOver() {
  // hide quiz box
  quizBox.classList.add("hide");
  //show result box
  resultBox.classList.remove("hide");
  quizResult();
}

function quizResult() {
  resultBox.querySelector(".tot-question").innerHTML = 10;
  resultBox.querySelector(".tot-attempt").innerHTML = attempt;
  resultBox.querySelector(".tot-correct").innerHTML = correctAnswers;
  resultBox.querySelector(".tot-wrong").innerHTML = attempt - correctAnswers;
  const percentage = (correctAnswers / 10) * 100;
  resultBox.querySelector(".tot-percentage").innerHTML =
    percentage.toFixed(2) + "%";
  resultBox.querySelector(".tot-score").innerHTML = correctAnswers + " / 10";
}

function startQuiz() {
  // hide home box
  homeBox.classList.add("hide");
  // shows quiz box
  quizBox.classList.remove("hide");

  //First we will set all questions in avaibleQuestins array
  setAvailableQuestions();
  //Secondly we will call getNewQuestion() function
  getNewQuestion();
  // to create answer indicators
  answerIndicator();
}

function resetQuiz() {
  questionCounter = 0;
  correctAnswers = 0;
  attempt = 0;
}
function tryAgainQuiz() {
  // hide the result box
  resultBox.classList.add("hide");
  // removes the quiz box
  quizBox.classList.remove("hide");
  resetQuiz();
  startQuiz();
}
function goToHome() {
  // hide result box
  resultBox.classList.add("hide");
  // removes the quiz box
  homeBox.classList.remove("hide");
  resetQuiz();
}
function rEload() {
  quizBox.classList.add("hide");

  homeBox.classList.remove("hide");
  resetQuiz();
}
