// QUESTION BANK

const questions = {

html: [
{
q: "HTML stands for?",
o: ["Hyper Text Markup Language",
"High Text Machine Language",
"Hyperlinks Text Mark Language",
"Home Tool Markup Language"],
a: 0
},
{
q: "Which tag creates a hyperlink?",
o: ["<p>", "<a>", "<h1>", "<img>"],
a: 1
},
{
q: "Which tag inserts an image?",
o: ["<image>", "<picture>", "<img>", "<src>"],
a: 2
},
{
q: "Which declaration represents HTML5?",
o: ["<!DOCTYPE html>", "<html5>", "<doctype>", "<head>"],
a: 0
},
{
q: "Which tag creates an unordered list?",
o: ["<ol>", "<ul>", "<li>", "<list>"],
a: 1
}
],

semantic: [
{
q: "Which tag represents the main content?",
o: ["<footer>", "<main>", "<aside>", "<span>"],
a: 1
},
{
q: "Which attribute makes an input mandatory?",
o: ["required", "validate", "must", "check"],
a: 0
},
{
q: "Which tag creates a table row?",
o: ["<td>", "<th>", "<tr>", "<table>"],
a: 2
},
{
q: "Which tag is used for navigation links?",
o: ["<nav>", "<section>", "<article>", "<div>"],
a: 0
},
{
q: "Which attribute connects a label to an input?",
o: ["src", "for", "href", "name"],
a: 1
}
],

css: [
{
q: "CSS stands for?",
o: ["Computer Style Sheets",
"Cascading Style Sheets",
"Creative Style System",
"Colorful Style Sheets"],
a: 1
},
{
q: "Which selector targets an ID?",
o: [".", "#", "*", "$"],
a: 1
},
{
q: "Which property changes text color?",
o: ["background", "font", "color", "text"],
a: 2
},
{
q: "Which layout is mainly one-dimensional?",
o: ["Grid", "Flexbox", "Table", "Float"],
a: 1
},
{
q: "Which property controls space inside an element's border?",
o: ["Margin", "Padding", "Outline", "Position"],
a: 1
}
],

js: [
{
q: "JavaScript is a?",
o: ["Programming Language",
"Markup Language",
"Database",
"Operating System"],
a: 0
},
{
q: "Which keyword declares a constant?",
o: ["var", "let", "const", "static"],
a: 2
},
{
q: "Which symbol is used for strict equality?",
o: ["=", "==", "===", "!="],
a: 2
},
{
q: "Which method adds an element to an array?",
o: ["pop()", "push()", "shift()", "slice()"],
a: 1
},
{
q: "Which keyword defines a function?",
o: ["function", "method", "define", "func"],
a: 0
}
]

};


// VARIABLES

let currentQuestions = [];
let currentIndex = 0;
let answers = {};
let marked = {};
let timeLeft = 300;
let timer;
let studentName = "";


// LOGIN FUNCTION

function loginUser() {

    studentName = document.getElementById("name").value;

    let roll = document.getElementById("roll").value;
    let password = document.getElementById("password").value;

    if(studentName === "" || roll === "" || password === "") {

        alert("Please fill all login details");
        return;
    }

    document.getElementById("login").classList.add("hidden");

    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("welcome").innerText =
        "Welcome, " + studentName;
}


// START EXAMINATION

function startExam(subject) {

    currentQuestions = questions[subject];

    currentIndex = 0;
    answers = {};
    marked = {};

    timeLeft = 300;

    document.getElementById("dashboard").classList.add("hidden");

    document.getElementById("exam").classList.remove("hidden");

    document.getElementById("examTitle").innerText =
        subject.toUpperCase() + " Examination";

    showQuestion();

    clearInterval(timer);

    timer = setInterval(updateTimer, 1000);
}


// DISPLAY QUESTION

function showQuestion() {

    let q = currentQuestions[currentIndex];

    document.getElementById("question").innerText =
        "Q" + (currentIndex + 1) + ". " + q.q;

    let optionHTML = "";

    q.o.forEach((option, index) => {

        optionHTML += `
        <label class="option">

        <input type="radio"
        name="answer"
        value="${index}"
        ${answers[currentIndex] === index ? "checked" : ""}
        onchange="saveAnswer(${index})">

        ${option}

        </label>`;

    });

    document.getElementById("options").innerHTML = optionHTML;

    updatePalette();
}


// SAVE ANSWER

function saveAnswer(index) {

    answers[currentIndex] = index;

    updatePalette();
}


// NEXT QUESTION

function nextQuestion() {

    if(currentIndex < currentQuestions.length - 1) {

        currentIndex++;

        showQuestion();

    } else {

        alert("This is the last question.");
    }
}


// PREVIOUS QUESTION

function previousQuestion() {

    if(currentIndex > 0) {

        currentIndex--;

        showQuestion();
    }
}


// MARK FOR REVIEW

function markReview() {

    marked[currentIndex] = !marked[currentIndex];

    updatePalette();
}


// QUESTION NAVIGATION

function updatePalette() {

    let html = "";

    currentQuestions.forEach((q, index) => {

        let cls = "";

        if(answers[index] !== undefined)
            cls = "answered";

        if(marked[index])
            cls = "review";

        html += `
        <button class="${cls}"
        onclick="goToQuestion(${index})">
        ${index + 1}
        </button>`;

    });

    document.getElementById("palette").innerHTML = html;

    document.getElementById("progress").innerText =
        "Answered: " + Object.keys(answers).length +
        " / " + currentQuestions.length;
}


function goToQuestion(index) {

    currentIndex = index;

    showQuestion();
}


// TIMER FUNCTION

function updateTimer() {

    let minutes = Math.floor(timeLeft / 60);

    let seconds = timeLeft % 60;

    document.getElementById("time").innerText =
        minutes + ":" + String(seconds).padStart(2, "0");

    timeLeft--;

    if(timeLeft < 0) {

        clearInterval(timer);

        alert("Time is over!");

        calculateResult();
    }
}


// SUBMIT EXAM

function submitExam() {

    if(confirm("Are you sure you want to submit?")) {

        clearInterval(timer);

        calculateResult();
    }
}


// CALCULATE RESULT

function calculateResult() {

    let score = 0;

    let reviewHTML = "";

    currentQuestions.forEach((q, index) => {

        let selected = answers[index];

        if(selected === q.a) {
            score++;
        }

        let yourAnswer = selected === undefined
            ? "Not Answered"
            : q.o[selected];

        reviewHTML += `
        <div class="exam-card">

        <b>Q${index + 1}. ${q.q}</b>

        <p>Your Answer: ${yourAnswer}</p>

        <p>Correct Answer: ${q.o[q.a]}</p>

        </div>`;

    });

    let percent =
        (score / currentQuestions.length) * 100;

    document.getElementById("exam").classList.add("hidden");

    document.getElementById("resultPage").classList.remove("hidden");

    document.getElementById("result").innerText =
        "Your Score: " + score + " / " + currentQuestions.length;

    document.getElementById("percentage").innerText =
        "Percentage: " + percent.toFixed(2) + "%";

    document.getElementById("review").innerHTML =
        reviewHTML;

}