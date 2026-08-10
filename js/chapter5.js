/* ==========================================================
   CHAPTER V — MINI GAMES
   Project : Our Story
   File    : chapter5.js
   Purpose : Mini Games
   ========================================================== */


/* ==========================================================
   CHAPTER 5 ELEMENTS
========================================================== */

const chapter5 =
    document.getElementById("chapter5");


const chapter5GameSelectors =
    document.querySelectorAll(
        ".chapter5-game-select"
    );


const chapter5Games =
    document.querySelectorAll(
        ".chapter5-game"
    );


const chapter5Continue =
    document.getElementById(
        "chapter5Continue"
    );


/* ==========================================================
   GAME 1 — FIND MY HEARTS
========================================================== */

const heartBoard =
    document.getElementById(
        "chapter5HeartBoard"
    );


const heartCount =
    document.getElementById(
        "chapter5HeartCount"
    );


const heartReset =
    document.getElementById(
        "chapter5HeartReset"
    );


/* ==========================================================
   GAME 2 — MEMORY
========================================================== */

const memoryBoard =
    document.getElementById(
        "chapter5MemoryBoard"
    );


const memoryMatches =
    document.getElementById(
        "chapter5MemoryMatches"
    );


const memoryReset =
    document.getElementById(
        "chapter5MemoryReset"
    );


/* ==========================================================
   GAME 3 — QUIZ
========================================================== */

const quizContainer =
    document.getElementById(
        "chapter5QuizContainer"
    );


const quizProgress =
    document.getElementById(
        "chapter5QuizProgress"
    );


const quizQuestion =
    document.getElementById(
        "chapter5QuizQuestion"
    );


const quizAnswers =
    document.getElementById(
        "chapter5QuizAnswers"
    );


const quizFeedback =
    document.getElementById(
        "chapter5QuizFeedback"
    );


const quizNext =
    document.getElementById(
        "chapter5QuizNext"
    );


/* ==========================================================
   COMPLETION
========================================================== */

const completion =
    document.getElementById(
        "chapter5Completion"
    );


/* ==========================================================
   GAME STATE
========================================================== */

const state = {

    currentGame: "heart",

    heartsFound: 0,

    totalHearts: 5,

    memoryMatches: 0,

    totalMemoryPairs: 6,

    quizIndex: 0,

    quizScore: 0,

    heartCompleted: false,

    memoryCompleted: false,

    quizCompleted: false

};


/* ==========================================================
   GAME SELECTOR
========================================================== */

chapter5GameSelectors.forEach(
    selector => {

        selector.addEventListener(
            "click",
            () => {

                const selectedGame =
                    selector.dataset.game;


                if (!selectedGame) {
                    return;
                }


                state.currentGame =
                    selectedGame;


                /*
                    Remove active state
                    from all selectors.
                */

                chapter5GameSelectors.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                    Activate selected selector.
                */

                selector.classList.add(
                    "active"
                );


                /*
                    Hide all game panels.
                */

                chapter5Games.forEach(
                    game => {

                        game.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                    Show selected game panel.
                */

                const selectedPanel =
                    document.querySelector(
                        `[data-game-panel="${selectedGame}"]`
                    );


                if (selectedPanel) {

                    selectedPanel.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* ==========================================================
   GAME 1 — FIND MY HEARTS
========================================================== */

function createHeartHunt() {

    if (!heartBoard) {
        return;
    }


    heartBoard.innerHTML = "";


    state.heartsFound = 0;

    state.heartCompleted = false;


    updateHeartCount();


    /*
        Create five hidden hearts.
    */

    for (
        let i = 0;
        i < state.totalHearts;
        i++
    ) {

        const heart =
            document.createElement(
                "button"
            );


        heart.type = "button";


        heart.className =
            "chapter5-hunt-heart";


        heart.innerHTML = "♥";


        heart.setAttribute(
            "aria-label",
            `Hidden heart ${i + 1}`
        );


        /*
            Random position.
        */

        const left =
            Math.floor(
                Math.random() * 82
            ) + 5;


        const top =
            Math.floor(
                Math.random() * 78
            ) + 5;


        heart.style.left =
            `${left}%`;


        heart.style.top =
            `${top}%`;


        /*
            Random animation delay.
        */

        heart.style.animationDelay =
            `${Math.random() * 1.5}s`;


        /*
            Heart click.
        */

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


                state.heartsFound++;


                updateHeartCount();


                /*
                    Check completion.
                */

                if (
                    state.heartsFound >=
                    state.totalHearts
                ) {

                    state.heartCompleted =
                        true;


                    showGameMessage(
                        heartBoard,
                        "You found all my hearts. ♥"
                    );


                    checkAllGamesComplete();

                }

            }
        );


        heartBoard.appendChild(
            heart
        );

    }

}


/* ==========================================================
   UPDATE HEART COUNT
========================================================== */

function updateHeartCount() {

    if (!heartCount) {
        return;
    }


    heartCount.textContent =
        `${state.heartsFound} / ${state.totalHearts}`;

}


/* ==========================================================
   GAME 2 — MEMORY MATCHING
========================================================== */

const memorySymbols = [

    "♥",
    "♡",
    "✦",
    "✧",
    "❀",
    "✿"

];


let memoryFirstCard = null;

let memorySecondCard = null;

let memoryLock = false;


/* ==========================================================
   CREATE MEMORY GAME
========================================================== */

function createMemoryGame() {

    if (!memoryBoard) {
        return;
    }


    memoryBoard.innerHTML = "";


    state.memoryMatches = 0;

    state.memoryCompleted = false;


    memoryFirstCard = null;

    memorySecondCard = null;

    memoryLock = false;


    updateMemoryCount();


    /*
        Create two cards for each symbol.
    */

    const cards = [

        ...memorySymbols,

        ...memorySymbols

    ];


    /*
        Shuffle cards.
    */

    cards.sort(
        () =>
            Math.random() - 0.5
    );


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


            card.setAttribute(
                "aria-label",
                `Memory card ${index + 1}`
            );


            card.innerHTML = `

                <span class="chapter5-memory-card-inner">

                    <span class="chapter5-memory-card-front">
                        ?
                    </span>

                    <span class="chapter5-memory-card-back">
                        ${symbol}
                    </span>

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


            memoryBoard.appendChild(
                card
            );

        }
    );

}


/* ==========================================================
   MEMORY CARD CLICK
========================================================== */

function handleMemoryCardClick(
    card
) {

    if (
        memoryLock ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {

        return;

    }


    card.classList.add(
        "flipped"
    );


    if (!memoryFirstCard) {

        memoryFirstCard =
            card;

        return;

    }


    memorySecondCard =
        card;


    memoryLock = true;


    const firstSymbol =
        memoryFirstCard.dataset.symbol;


    const secondSymbol =
        memorySecondCard.dataset.symbol;


    /*
        Match.
    */

    if (
        firstSymbol ===
        secondSymbol
    ) {

        memoryFirstCard.classList.add(
            "matched"
        );


        memorySecondCard.classList.add(
            "matched"
        );


        state.memoryMatches++;


        updateMemoryCount();


        memoryFirstCard = null;

        memorySecondCard = null;

        memoryLock = false;


        if (
            state.memoryMatches >=
            state.totalMemoryPairs
        ) {

            state.memoryCompleted =
                true;


            showGameMessage(
                memoryBoard,
                "You remembered all our little pieces. ♡"
            );


            checkAllGamesComplete();

        }


        return;

    }


    /*
        Not a match.
    */

    setTimeout(
        () => {

            memoryFirstCard.classList.remove(
                "flipped"
            );


            memorySecondCard.classList.remove(
                "flipped"
            );


            memoryFirstCard = null;

            memorySecondCard = null;

            memoryLock = false;

        },
        850
    );

}


/* ==========================================================
   UPDATE MEMORY COUNT
========================================================== */

function updateMemoryCount() {

    if (!memoryMatches) {
        return;
    }


    memoryMatches.textContent =
        `${state.memoryMatches} / ${state.totalMemoryPairs}`;

}


/* ==========================================================
   GAME 3 — QUIZ
========================================================== */

const quizQuestions = [

    {

        question:
            "Who said good night first?",

        answers: [

            "Me",

            "You",

            "We both did",

            "Nobody"

        ],

        correct: 1

    },

    {

        question:
            "What do I like most about our conversations?",

        answers: [

            "How random they can be",

            "How short they are",

            "Nothing",

            "That they never happen"

        ],

        correct: 0

    },

    {

        question:
            "What kind of moments do I remember most?",

        answers: [

            "The little ones",

            "Only huge events",

            "Only serious conversations",

            "None"

        ],

        correct: 0

    },

    {

        question:
            "What chapter are we currently playing?",

        answers: [

            "Chapter II",

            "Chapter III",

            "Chapter IV",

            "Chapter V"

        ],

        correct: 3

    },

    {

        question:
            "What is this whole story really about?",

        answers: [

            "A school project",

            "A random website",

            "Us",

            "A game"

        ],

        correct: 2

    }

];


/* ==========================================================
   START QUIZ
========================================================== */

function startQuiz() {

    state.quizIndex = 0;

    state.quizScore = 0;

    state.quizCompleted = false;


    renderQuizQuestion();

}


/* ==========================================================
   RENDER QUIZ QUESTION
========================================================== */

function renderQuizQuestion() {

    if (
        !quizQuestion ||
        !quizAnswers ||
        !quizProgress
    ) {

        return;

    }


    const current =
        quizQuestions[
            state.quizIndex
        ];


    if (!current) {

        finishQuiz();

        return;

    }


    quizProgress.textContent =
        `Question ${state.quizIndex + 1} / ${quizQuestions.length}`;


    quizQuestion.textContent =
        current.question;


    quizAnswers.innerHTML = "";


    if (quizFeedback) {

        quizFeedback.textContent = "";

        quizFeedback.className =
            "chapter5-quiz-feedback";

    }


    if (quizNext) {

        quizNext.hidden = true;

    }


    current.answers.forEach(
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

                    answerQuiz(
                        index
                    );

                }
            );


            quizAnswers.appendChild(
                button
            );

        }
    );

}


/* ==========================================================
   ANSWER QUIZ
========================================================== */

function answerQuiz(
    selectedIndex
) {

    const current =
        quizQuestions[
            state.quizIndex
        ];


    if (!current) {
        return;
    }


    const answerButtons =
        quizAnswers.querySelectorAll(
            ".chapter5-quiz-answer"
        );


    answerButtons.forEach(
        button => {

            button.disabled = true;

        }
    );


    const correct =
        selectedIndex ===
        current.correct;


    if (correct) {

        state.quizScore++;


        answerButtons[
            selectedIndex
        ].classList.add(
            "correct"
        );


        if (quizFeedback) {

            quizFeedback.textContent =
                "That's right. ♥";


            quizFeedback.classList.add(
                "correct"
            );

        }

    } else {

        answerButtons[
            selectedIndex
        ].classList.add(
            "wrong"
        );


        answerButtons[
            current.correct
        ].classList.add(
            "correct"
        );


        if (quizFeedback) {

            quizFeedback.textContent =
                "Almost. But you know me better than that. ♡";


            quizFeedback.classList.add(
                "wrong"
            );

        }

    }


    if (quizNext) {

        quizNext.hidden = false;

    }

}


/* ==========================================================
   NEXT QUIZ QUESTION
========================================================== */

if (quizNext) {

    quizNext.addEventListener(
        "click",
        () => {

            state.quizIndex++;


            if (
                state.quizIndex >=
                quizQuestions.length
            ) {

                finishQuiz();

                return;

            }


            renderQuizQuestion();

        }
    );

}


/* ==========================================================
   FINISH QUIZ
========================================================== */

function finishQuiz() {

    state.quizCompleted = true;


    if (quizProgress) {

        quizProgress.textContent =
            "Quiz Complete";

    }


    if (quizQuestion) {

        quizQuestion.textContent =
            `You got ${state.quizScore} out of ${quizQuestions.length}. ♥`;

    }


    if (quizAnswers) {

        quizAnswers.innerHTML = "";

    }


    if (quizFeedback) {

        quizFeedback.textContent =
            "No matter the score, I hope you enjoyed this little game.";

    }


    if (quizNext) {

        quizNext.hidden = true;

    }


    checkAllGamesComplete();

}


/* ==========================================================
   GAME MESSAGE
========================================================== */

function showGameMessage(
    board,
    message
) {

    if (!board) {
        return;
    }


    let messageElement =
        board.parentElement.querySelector(
            ".chapter5-game-message"
        );


    if (!messageElement) {

        messageElement =
            document.createElement(
                "div"
            );


        messageElement.className =
            "chapter5-game-message";


        board.insertAdjacentElement(
            "afterend",
            messageElement
        );

    }


    messageElement.textContent =
        message;


    messageElement.classList.add(
        "show"
    );

}


/* ==========================================================
   CHECK ALL GAMES
========================================================== */

function checkAllGamesComplete() {

    if (
        state.heartCompleted &&
        state.memoryCompleted &&
        state.quizCompleted
    ) {

        showCompletion();

    }

}


/* ==========================================================
   SHOW COMPLETION
========================================================== */

function showCompletion() {

    if (!completion) {
        return;
    }


    completion.hidden = false;


    completion.classList.add(
        "show"
    );


    setTimeout(
        () => {

            completion.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        },
        300
    );

}


/* ==========================================================
   RESET HEART GAME
========================================================== */

if (heartReset) {

    heartReset.addEventListener(
        "click",
        () => {

            createHeartHunt();

        }
    );

}


/* ==========================================================
   RESET MEMORY GAME
========================================================== */

if (memoryReset) {

    memoryReset.addEventListener(
        "click",
        () => {

            createMemoryGame();

        }
    );

}


/* ==========================================================
   CHAPTER 5 CONTINUE → CHAPTER 6
========================================================== */

if (chapter5Continue) {

    chapter5Continue.addEventListener(
        "click",
        () => {

            console.log(
                "Chapter 5 → Chapter 6"
            );


            /*
                Find Chapter VI.
            */

            const chapter6 =
                document.getElementById(
                    "chapter6"
                );


            /*
                Use the SAME transition
                method that worked for
                Chapter 4 → Chapter 5.
            */

            if (
                chapter6 &&
                typeof transitionToChapter ===
                    "function"
            ) {

                transitionToChapter(6);

                return;

            }


            /*
                Direct fallback if the
                transition function isn't
                available.
            */

            if (chapter6) {

                document
                    .querySelectorAll(
                        "main[id^='chapter']"
                    )
                    .forEach(
                        chapter => {

                            chapter.classList.remove(
                                "active"
                            );

                        }
                    );


                chapter6.classList.add(
                    "active"
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


                return;

            }


            /*
                Chapter VI cannot be found.
            */

            console.warn(
                "Chapter VI could not be found. Make sure <main id=\"chapter6\"> exists in index.html."
            );

        }
    );

}


/* ==========================================================
   INITIALIZE CHAPTER 5
========================================================== */

function initializeChapter5() {

    /*
        Create games.
    */

    createHeartHunt();

    createMemoryGame();

    startQuiz();


    /*
        Make sure Chapter 5 starts
        with the Heart game visible.
    */

    chapter5Games.forEach(
        game => {

            game.classList.remove(
                "active"
            );

        }
    );


    const heartGame =
        document.getElementById(
            "chapter5HeartGame"
        );


    if (heartGame) {

        heartGame.classList.add(
            "active"
        );

    }


    chapter5GameSelectors.forEach(
        selector => {

            selector.classList.remove(
                "active"
            );

        }
    );


    const heartSelector =
        document.getElementById(
            "chapter5GameHeart"
        );


    if (heartSelector) {

        heartSelector.classList.add(
            "active"
        );

    }

}


/* ==========================================================
   START
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChapter5
    );

} else {

    initializeChapter5();

}
