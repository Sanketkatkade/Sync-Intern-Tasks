const quiz = document.getElementById('quiz');
const submitBtn = document.getElementById('submit');

let currentQuiz = 0;
let score = 0;
let quizData = [];

function loadQuiz() {
    deselectAnswers();

    if (currentQuiz < quizData.length) {
        const currentQuizData = quizData[currentQuiz];
        const questionEl = document.getElementById('question');
        questionEl.innerText = decodeHtmlEntities(currentQuizData.question);

        const progress = document.getElementById('progress');
        const a_text = document.getElementById('a_text');
        const b_text = document.getElementById('b_text');
        const c_text = document.getElementById('c_text');
        const d_text = document.getElementById('d_text');

        let answers = [
            currentQuizData.answers
        ];
        answers = shuffleArray(answers[0]);

        progress.innerText = "" + (currentQuiz + 1)+"]";
        a_text.innerText = decodeHtmlEntities(answers[0]);
        b_text.innerText = decodeHtmlEntities(answers[1]);
        c_text.innerText = decodeHtmlEntities(answers[2]);
        d_text.innerText = decodeHtmlEntities(answers[3]);
    } else {
        currentQuiz = -1;
        quiz.innerHTML = `
           <h2 id="result">You answered ${score}/${quizData.length} questions correctly</h2>
           `;
           const h2 = document.getElementById('result');
           h2.setAttribute('style','position: relative; top: 60px; left: 50px;')
           quiz.setAttribute("style","height: 10rem");
           submitBtn.setAttribute("onclick","location.reload()");
           submitBtn.textContent = "Retry";
    }
}

function deselectAnswers() {
    const answerEls = document.querySelectorAll('.answer');
    answerEls.forEach(answerEl => {
        answerEl.checked = false;
    });
}

function getSelected() {
    let answer = '';
    let label = "";
    const answerEls = document.querySelectorAll('.answer');
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            label = document.querySelector(`label[for="${answerEl.id}"]`);
            answer = label.textContent;
        }
    });
    return answer;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function fetchQuizData() {
    fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple')
        .then(response => response.json())
        .then(data => {
            quizData = data.results.map(result => {
                const question = result.question;
                const correctAnswer = result.correct_answer;
                const incorrectAnswers = result.incorrect_answers;
                return {
                    question: question,
                    answers: [...incorrectAnswers, correctAnswer],
                    correct: correctAnswer
                };
            });
            loadQuiz();
        });
}

function decodeHtmlEntities(text) {
    let element = document.createElement('div');
    element.innerHTML = text;
    return element.textContent;
}


fetchQuizData();

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    if (answer) {
        if (answer === quizData[currentQuiz].correct.replace('&quot;', '"')) {
            score++;
        }
        currentQuiz++;
        loadQuiz();
    }
});


