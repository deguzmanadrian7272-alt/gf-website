/* ==========================================================
   CHAPTER V — MINI GAMES
   Project : Our Story
   File    : chapter5.js
   Purpose : Mini Games Chapter
   ========================================================== */


/* ==========================================================
   CHAPTER V STATE
========================================================== */

const chapter5State = {

    currentGame: "heart",

    heartsFound: 0,

    totalHearts: 5,

    memoryMatches: 0,

    totalMemoryPairs: 6,

    quizIndex: 0,

    quizScore: 0,

    quizFinished: false

};


/* ==========================================================
   CHAPTER V ELEMENTS
========================================================== */

const chapter5GameSelectors =
    document.querySelectorAll(
        ".chapter5-game-select"
    );

const chapter5GamePanels =
    document.querySelectorAll(
        ".chapter5-game"
    );


/* ==========================================================
   GAME SELECTOR
========================================================== */

chapter5GameSelectors.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const game =
                    button.dataset.game;

                if (!game) {
                    return;
                }

                switchChapter5Game(game);

            }
        );

    }
);


/* ==========================================================
   SWITCH GAME
========================================================== */

function switchChapter5Game(game) {

    chapter5State.currentGame = game;


    chapter5GameSelectors.forEach(
        (button) => {

            button.classList.toggle(
                "active",
                button.dataset.game === game
            );

        }
    );


    chapter5GamePanels.forEach(
        (panel) => {

            panel.classList.toggle(
                "active",
                panel.dataset.gamePanel === game
            );

        }
    );


    if (game === "heart") {

        initializeHeartGame();

    }


    if (game === "memory") {

        initializeMemoryGame();

    }


    if (game === "quiz") {

        initializeQuiz();

    }

}


/* ==========================================================
   GAME 1 — FIND MY HEARTS
========================================================== */

const chapter5HeartBoard =
    document.getElementById(
        "chapter5HeartBoard"
    );

const chapter5HeartCount =
    document.getElementById(
        "chapter5HeartCount"
    );

const chapter5HeartReset =
    document.getElementById(
        "chapter5HeartReset"
    );


/* ==========================================================
   CREATE HEART GAME
========================================================== */

function initializeHeartGame() {

    if (!chapter5HeartBoard) {
        return;
    }


    chapter5State.heartsFound = 0;


    updateHeartCounter();


    chapter5HeartBoard.innerHTML = "";


    const positions = [

        {
            top: "18%",
            left: "15%"
        },

        {
            top: "35%",
            left: "70%"
        },

        {
            top: "62%",
            left: "25%"
        },

        {
            top: "72%",
            left: "78%"
        },

        {
            top: "48%",
            left: "50%"
        }

    ];


    positions.forEach(
        (position, index) => {

            const heart =
                document.createElement(
                    "button"
                );


            heart.type = "button";

            heart.className =
                "chapter5-hidden-heart";


            heart.dataset.heart =
                index + 1;


            heart.innerHTML = "♥";


            heart.style.top =
                position.top;

            heart.style.left =
                position.left;


            heart.addEventListener(
                "click",
                () => {

                    if (
                        heart.classList.contains(
                            "found"
                        )
                    ) {

                        return;

                    }


                    heart.classList.add(
                        "found"
                    );


                    chapter5State.heartsFound++;


                    updateHeartCounter();


                    if (
                        chapter5State.heartsFound >=
                        chapter5State.totalHearts
                    ) {

                        completeHeartGame();

                    }

                }
            );


            chapter5HeartBoard.appendChild(
                heart
            );

        }
    );

}


/* ==========================================================
   HEART COUNTER
========================================================== */

function updateHeartCounter() {

    if (!chapter5HeartCount) {
        return;
    }


    chapter5HeartCount.textContent =
        `${chapter5State.heartsFound} / ${chapter5State.totalHearts}`;

}


/* ==========================================================
   HEART GAME COMPLETE
========================================================== */

function completeHeartGame() {

    if (!chapter5HeartBoard) {
        return;
    }


    chapter5HeartBoard.classList.add(
        "completed"
    );

}


/* ==========================================================
   HEART RESET
========================================================== */

if (chapter5HeartReset) {

    chapter5HeartReset.addEventListener(
        "click",
        () => {

            chapter5HeartBoard.classList.remove(
                "completed"
            );


            initializeHeartGame();

        }
    );

}


/* ==========================================================
   GAME 2 — MEMORY MATCHING
========================================================== */

const chapter5MemoryBoard =
    document.getElementById(
        "chapter5MemoryBoard"
    );

const chapter5MemoryMatches =
    document.getElementById(
        "chapter5MemoryMatches"
    );

const chapter5MemoryReset =
    document.getElementById(
        "chapter5MemoryReset"
    );


/* ==========================================================
   MEMORY SYMBOLS
========================================================== */

const chapter5MemorySymbols = [

    "♥",

    "♡",

    "✦",

    "✧",

    "✿",

    "❀"

];


/* ==========================================================
   MEMORY STATE
========================================================== */

let chapter5MemoryFirstCard = null;

let chapter5MemorySecondCard = null;

let chapter5MemoryLocked = false;


/* ==========================================================
   SHUFFLE ARRAY
========================================================== */

function shuffleChapter5Array(array) {

    const shuffled =
        [...array];


    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] = [

            shuffled[j],
            shuffled[i]

        ];

    }


    return shuffled;

}


/* ==========================================================
   INITIALIZE MEMORY GAME
========================================================== */

function initializeMemoryGame() {

    if (!chapter5MemoryBoard) {
        return;
    }


    chapter5State.memoryMatches = 0;


    chapter5MemoryFirstCard = null;

    chapter5MemorySecondCard = null;

    chapter5MemoryLocked = false;


    updateMemoryCounter();


    chapter5MemoryBoard.innerHTML = "";


    const cards = shuffleChapter5Array([

        ...chapter5MemorySymbols,

        ...chapter5MemorySymbols

    ]);


    cards.forEach(
        (symbol, index) => {

            const card =
                document.createElement(
                    "button"
                );


            card.type = "button";

            card.className =
                "chapter5-memory-card";


            card.dataset.symbol =
                symbol;


            card.dataset.index =
                index;


            card.innerHTML = `

                <span class="chapter5-memory-card-front">
                    ?
                </span>

                <span class="chapter5-memory-card-back">
                    ${symbol}
                </span>

            `;


            card.addEventListener(
                "click",
                () => {

                    handleMemoryCardClick(
                        card
                    );

                }
            );


            chapter5MemoryBoard.appendChild(
                card
            );

        }
    );

}


/* ==========================================================
   MEMORY CARD CLICK
========================================================== */

function handleMemoryCardClick(card) {

    if (
        chapter5MemoryLocked
    ) {

        return;

    }


    if (
        card.classList.contains(
            "flipped"
        )
    ) {

        return;

    }


    if (
        card.classList.contains(
            "matched"
        )
    ) {

        return;

    }


    card.classList.add(
        "flipped"
    );


    if (
        !chapter5MemoryFirstCard
    ) {

        chapter5MemoryFirstCard =
            card;

        return;

    }


    chapter5MemorySecondCard =
        card;


    chapter5MemoryLocked = true;


    const firstSymbol =
        chapter5MemoryFirstCard.dataset.symbol;

    const secondSymbol =
        chapter5MemorySecondCard.dataset.symbol;


    if (
        firstSymbol ===
        secondSymbol
    ) {

        setTimeout(
            () => {

                chapter5MemoryFirstCard.classList.add(
                    "matched"
                );

                chapter5MemorySecondCard.classList.add(
                    "matched"
                );


                chapter5State.memoryMatches++;


                updateMemoryCounter();


                resetMemorySelection();


                if (
                    chapter5State.memoryMatches >=
                    chapter5State.totalMemoryPairs
                ) {

                    completeMemoryGame();

                }

            },
            450
        );

    }

    else {

        setTimeout(
            () => {

                chapter5MemoryFirstCard.classList.remove(
                    "flipped"
                );

                chapter5MemorySecondCard.classList.remove(
                    "flipped"
                );


                resetMemorySelection();

            },
            800
        );

    }

}


/* ==========================================================
   RESET MEMORY SELECTION
========================================================== */

function resetMemorySelection() {

    chapter5MemoryFirstCard = null;

    chapter5MemorySecondCard = null;

    chapter5MemoryLocked = false;

}


/* ==========================================================
   MEMORY COUNTER
========================================================== */

function updateMemoryCounter() {

    if (!chapter5MemoryMatches) {
        return;
    }


    chapter5MemoryMatches.textContent =
        `${chapter5State.memoryMatches} / ${chapter5State.totalMemoryPairs}`;

}


/* ==========================================================
   MEMORY COMPLETE
========================================================== */

function completeMemoryGame() {

    if (!chapter5MemoryBoard) {
        return;
    }


    chapter5MemoryBoard.classList.add(
        "completed"
    );

}


/* ==========================================================
   MEMORY RESET
========================================================== */

if (chapter5MemoryReset) {

    chapter5MemoryReset.addEventListener(
        "click",
        () => {

            chapter5MemoryBoard.classList.remove(
                "completed"
            );


            initializeMemoryGame();

        }
    );

}


/* ==========================================================
   GAME 3 — QUIZ
========================================================== */

const chapter5QuizProgress =
    document.getElementById(
        "chapter5QuizProgress"
    );

const chapter5QuizQuestion =
    document.getElementById(
        "chapter5QuizQuestion"
    );

const chapter5QuizAnswers =
    document.getElementById(
        "chapter5QuizAnswers"
    );

const chapter5QuizFeedback =
    document.getElementById(
        "chapter5QuizFeedback"
    );

const chapter5QuizNext =
    document.getElementById(
        "chapter5QuizNext"
    );


/* ==========================================================
   QUIZ QUESTIONS
========================================================== */

const chapter5QuizQuestions = [

    {

        question:
            "Who said good night first?",

        answers: [

            "Me",

            "You",

            "We both did",

            "I don't remember"

        ],

        correct: 0

    },


    {

        question:
            "Which part of our story matters most?",

        answers: [

            "The big moments",

            "The little moments",

            "The funny moments",

            "All of them"

        ],

        correct: 3

    },


    {

        question:
            "What do I think makes you special?",

        answers: [

            "Everything about you",

            "Your little habits",

            "The way you make moments special",

            "All of the above"

        ],

        correct: 3

    },


    {

        question:
            "What do I want to keep doing with you?",

        answers: [

            "Making memories",

            "Laughing together",

            "Writing our story",

            "All of these"

        ],

        correct: 3

    }

];


/* ==========================================================
   INITIALIZE QUIZ
========================================================== */

function initializeQuiz() {

    if (
        !chapter5QuizQuestion ||
        !chapter5QuizAnswers
    ) {

        return;

    }


    chapter5State.quizIndex = 0;

    chapter5State.quizScore = 0;

    chapter5State.quizFinished = false;


    if (chapter5QuizNext) {

        chapter5QuizNext.hidden = true;

    }


    if (chapter5QuizFeedback) {

        chapter5QuizFeedback.textContent = "";

        chapter5QuizFeedback.className =
            "chapter5-quiz-feedback";

    }


    renderQuizQuestion();

}


/* ==========================================================
   RENDER QUIZ QUESTION
========================================================== */

function renderQuizQuestion() {

    const question =
        chapter5QuizQuestions[
            chapter5State.quizIndex
        ];


    if (!question) {

        finishQuiz();

        return;

    }


    if (chapter5QuizProgress) {

        chapter5QuizProgress.textContent =
            `Question ${chapter5State.quizIndex + 1} of ${chapter5QuizQuestions.length}`;

    }


    chapter5QuizQuestion.textContent =
        question.question;


    chapter5QuizAnswers.innerHTML = "";


    if (chapter5QuizFeedback) {

        chapter5QuizFeedback.textContent = "";

        chapter5QuizFeedback.className =
            "chapter5-quiz-feedback";

    }


    if (chapter5QuizNext) {

        chapter5QuizNext.hidden = true;

    }


    question.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "chapter5-quiz-answer";


            button.textContent =
                answer;


            button.addEventListener(
                "click",
                () => {

                    handleQuizAnswer(
                        index
                    );

                }
            );


            chapter5QuizAnswers.appendChild(
                button
            );

        }
    );

}


/* ==========================================================
   HANDLE QUIZ ANSWER
========================================================== */

function handleQuizAnswer(answerIndex) {

    const question =
        chapter5QuizQuestions[
            chapter5State.quizIndex
        ];


    if (!question) {
        return;
    }


    const answerButtons =
        chapter5QuizAnswers.querySelectorAll(
            "button"
        );


    answerButtons.forEach(
        (button) => {

            button.disabled = true;

        }
    );


    if (
        answerIndex ===
        question.correct
    ) {

        chapter5State.quizScore++;


        if (chapter5QuizFeedback) {

            chapter5QuizFeedback.textContent =
                "That's right. ❤️";

            chapter5QuizFeedback.classList.add(
                "correct"
            );

        }

    }

    else {

        if (chapter5QuizFeedback) {

            chapter5QuizFeedback.textContent =
                "Close enough... I'll let it slide. ♡";

            chapter5QuizFeedback.classList.add(
                "incorrect"
            );

        }

    }


    if (chapter5QuizNext) {

        chapter5QuizNext.hidden = false;

    }

}


/* ==========================================================
   NEXT QUIZ QUESTION
========================================================== */

if (chapter5QuizNext) {

    chapter5QuizNext.addEventListener(
        "click",
        () => {

            chapter5State.quizIndex++;


            if (
                chapter5State.quizIndex >=
                chapter5QuizQuestions.length
            ) {

                finishQuiz();

            }

            else {

                renderQuizQuestion();

            }

        }
    );

}


/* ==========================================================
   FINISH QUIZ
========================================================== */

function finishQuiz() {

    chapter5State.quizFinished = true;


    if (chapter5QuizProgress) {

        chapter5QuizProgress.textContent =
            "Quiz Complete";

    }


    if (chapter5QuizQuestion) {

        chapter5QuizQuestion.textContent =
            `You got ${chapter5State.quizScore} out of ${chapter5QuizQuestions.length}!`;

    }


    if (chapter5QuizAnswers) {

        chapter5QuizAnswers.innerHTML = "";

    }


    if (chapter5QuizFeedback) {

        chapter5QuizFeedback.textContent =
            "Maybe what matters most is that we made it this far together. ♡";

        chapter5QuizFeedback.className =
            "chapter5-quiz-feedback correct";

    }


    if (chapter5QuizNext) {

        chapter5QuizNext.hidden = true;

    }

}


/* ==========================================================
   CHAPTER V COMPLETION
========================================================== */

const chapter5Completion =
    document.getElementById(
        "chapter5Completion"
    );


/* ==========================================================
   SHOW COMPLETION
========================================================== */

function showChapter5Completion() {

    if (!chapter5Completion) {
        return;
    }


    chapter5Completion.hidden =
        false;


    requestAnimationFrame(
        () => {

            chapter5Completion.classList.add(
                "show"
            );

        }
    );

}


/* ==========================================================
   CHAPTER V → CHAPTER VI
   IMPORTANT:
   Uses the SAME transition system as
   Chapter III → IV and Chapter IV → V.
========================================================== */

const chapter5Continue =
    document.getElementById(
        "chapter5Continue"
    );


if (chapter5Continue) {

    chapter5Continue.addEventListener(
        "click",
        () => {

            console.log(
                "💌 Chapter 5 complete. Continuing to Chapter 6..."
            );


            /*
             * DO NOT use:
             *
             * window.goToChapter(6)
             *
             * DO NOT use:
             *
             * window.showChapter(6)
             *
             * The existing project navigation uses:
             *
             * transitionToChapter()
             */


            if (
                typeof transitionToChapter ===
                "function"
            ) {

                transitionToChapter(6);

                return;

            }


            console.warn(
                "Chapter transition system is not available."
            );

        }
    );

}


/* ==========================================================
   INITIALIZE CHAPTER V
========================================================== */

function initializeChapter5() {

    initializeHeartGame();

    initializeMemoryGame();

    initializeQuiz();

}


/* ==========================================================
   START CHAPTER V
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChapter5
    );

}

else {

    initializeChapter5();

}


/* ==========================================================
   END OF CHAPTER V
========================================================== */
