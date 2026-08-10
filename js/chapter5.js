/* ==========================================================
   CHAPTER V — MINI GAMES
   Project : Our Story
   File    : chapter5.js
   Purpose : Mini Games + Chapter VI Navigation
   ========================================================== */


/* ==========================================================
   CHAPTER V INITIALIZATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const chapter5 = document.getElementById("chapter5");

    if (!chapter5) {
        return;
    }


    /* ======================================================
       GAME SELECTORS
    ====================================================== */

    const gameSelectors = document.querySelectorAll(
        ".chapter5-game-select"
    );

    const gamePanels = document.querySelectorAll(
        ".chapter5-game"
    );


    /* ======================================================
       GAME STATE
    ====================================================== */

    let currentGame = "heart";


    /* ======================================================
       GAME 1 — FIND THE HEARTS
    ====================================================== */

    const heartBoard = document.getElementById(
        "chapter5HeartBoard"
    );

    const heartCount = document.getElementById(
        "chapter5HeartCount"
    );

    const heartReset = document.getElementById(
        "chapter5HeartReset"
    );


    const TOTAL_HEARTS = 5;

    let foundHearts = 0;


    /* ======================================================
       CREATE HEART GAME
    ====================================================== */

    function createHeartGame() {

        if (!heartBoard) {
            return;
        }

        heartBoard.innerHTML = "";

        foundHearts = 0;

        updateHeartCount();


        const positions = [
            { top: "15%", left: "18%" },
            { top: "30%", left: "72%" },
            { top: "55%", left: "40%" },
            { top: "70%", left: "80%" },
            { top: "78%", left: "20%" }
        ];


        positions.forEach((position, index) => {

            const heart = document.createElement("button");

            heart.type = "button";

            heart.className = "chapter5-hidden-heart";

            heart.innerHTML = "♥";

            heart.setAttribute(
                "aria-label",
                `Hidden heart ${index + 1}`
            );


            heart.style.top = position.top;

            heart.style.left = position.left;


            heart.addEventListener("click", () => {

                if (heart.classList.contains("found")) {
                    return;
                }


                heart.classList.add("found");

                foundHearts++;

                updateHeartCount();


                if (foundHearts === TOTAL_HEARTS) {

                    completeHeartGame();

                }

            });


            heartBoard.appendChild(heart);

        });

    }


    /* ======================================================
       UPDATE HEART COUNT
    ====================================================== */

    function updateHeartCount() {

        if (!heartCount) {
            return;
        }

        heartCount.textContent =
            `${foundHearts} / ${TOTAL_HEARTS}`;

    }


    /* ======================================================
       HEART GAME COMPLETE
    ====================================================== */

    function completeHeartGame() {

        if (!heartBoard) {
            return;
        }


        heartBoard.classList.add(
            "chapter5-game-complete"
        );

    }


    /* ======================================================
       HEART RESET
    ====================================================== */

    if (heartReset) {

        heartReset.addEventListener(
            "click",
            createHeartGame
        );

    }



    /* ======================================================
       GAME 2 — MEMORY MATCHING
    ====================================================== */

    const memoryBoard = document.getElementById(
        "chapter5MemoryBoard"
    );

    const memoryMatches = document.getElementById(
        "chapter5MemoryMatches"
    );

    const memoryReset = document.getElementById(
        "chapter5MemoryReset"
    );


    const memorySymbols = [
        "♥",
        "♡",
        "✦",
        "✧",
        "✿",
        "❀"
    ];


    let memoryCards = [];

    let firstCard = null;

    let secondCard = null;

    let lockBoard = false;

    let matchedPairs = 0;


    /* ======================================================
       CREATE MEMORY GAME
    ====================================================== */

    function createMemoryGame() {

        if (!memoryBoard) {
            return;
        }


        memoryBoard.innerHTML = "";

        memoryCards = [];

        firstCard = null;

        secondCard = null;

        lockBoard = false;

        matchedPairs = 0;


        updateMemoryMatches();


        const cards = [
            ...memorySymbols,
            ...memorySymbols
        ];


        shuffleArray(cards);


        cards.forEach((symbol, index) => {

            const card = document.createElement("button");

            card.type = "button";

            card.className =
                "chapter5-memory-card";


            card.dataset.symbol = symbol;


            card.innerHTML = `

                <span class="chapter5-memory-card-front">
                    ?
                </span>

                <span class="chapter5-memory-card-back">
                    ${symbol}
                </span>

            `;


            card.setAttribute(
                "aria-label",
                `Memory card ${index + 1}`
            );


            card.addEventListener(
                "click",
                () => flipMemoryCard(card)
            );


            memoryBoard.appendChild(card);

            memoryCards.push(card);

        });

    }


    /* ======================================================
       SHUFFLE ARRAY
    ====================================================== */

    function shuffleArray(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() * (i + 1)
                );


            [
                array[i],
                array[randomIndex]
            ] = [
                array[randomIndex],
                array[i]
            ];

        }

    }


    /* ======================================================
       FLIP MEMORY CARD
    ====================================================== */

    function flipMemoryCard(card) {

        if (
            lockBoard ||
            card === firstCard ||
            card.classList.contains("matched")
        ) {

            return;

        }


        card.classList.add("flipped");


        if (!firstCard) {

            firstCard = card;

            return;

        }


        secondCard = card;

        checkMemoryMatch();

    }


    /* ======================================================
       CHECK MEMORY MATCH
    ====================================================== */

    function checkMemoryMatch() {

        const isMatch =
            firstCard.dataset.symbol ===
            secondCard.dataset.symbol;


        if (isMatch) {

            disableMatchedCards();

        } else {

            unflipCards();

        }

    }


    /* ======================================================
       MATCHED CARDS
    ====================================================== */

    function disableMatchedCards() {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");


        matchedPairs++;

        updateMemoryMatches();


        resetMemorySelection();


        if (
            matchedPairs === memorySymbols.length
        ) {

            completeMemoryGame();

        }

    }


    /* ======================================================
       UNFLIP CARDS
    ====================================================== */

    function unflipCards() {

        lockBoard = true;


        setTimeout(() => {

            if (firstCard) {
                firstCard.classList.remove(
                    "flipped"
                );
            }


            if (secondCard) {
                secondCard.classList.remove(
                    "flipped"
                );
            }


            resetMemorySelection();

        }, 800);

    }


    /* ======================================================
       RESET MEMORY SELECTION
    ====================================================== */

    function resetMemorySelection() {

        firstCard = null;

        secondCard = null;

        lockBoard = false;

    }


    /* ======================================================
       UPDATE MEMORY MATCHES
    ====================================================== */

    function updateMemoryMatches() {

        if (!memoryMatches) {
            return;
        }


        memoryMatches.textContent =
            `${matchedPairs} / ${memorySymbols.length}`;

    }


    /* ======================================================
       MEMORY COMPLETE
    ====================================================== */

    function completeMemoryGame() {

        if (!memoryBoard) {
            return;
        }


        memoryBoard.classList.add(
            "chapter5-game-complete"
        );

    }


    /* ======================================================
       MEMORY RESET
    ====================================================== */

    if (memoryReset) {

        memoryReset.addEventListener(
            "click",
            createMemoryGame
        );

    }



    /* ======================================================
       GAME 3 — QUIZ
    ====================================================== */

    const quizQuestion = document.getElementById(
        "chapter5QuizQuestion"
    );

    const quizAnswers = document.getElementById(
        "chapter5QuizAnswers"
    );

    const quizFeedback = document.getElementById(
        "chapter5QuizFeedback"
    );

    const quizProgress = document.getElementById(
        "chapter5QuizProgress"
    );

    const quizNext = document.getElementById(
        "chapter5QuizNext"
    );


    const quizQuestions = [

        {
            question:
                "Who said 'good night' first?",

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
                "What do I enjoy most about our conversations?",

            answers: [
                "How random they can be",
                "How short they are",
                "Nothing",
                "Only the serious ones"
            ],

            correct: 0
        },

        {
            question:
                "What slowly became important to me?",

            answers: [
                "Our little moments",
                "The weather",
                "Video games",
                "Nothing at all"
            ],

            correct: 0
        }

    ];


    let currentQuestion = 0;

    let quizScore = 0;


    /* ======================================================
       LOAD QUIZ QUESTION
    ====================================================== */

    function loadQuizQuestion() {

        if (
            !quizQuestion ||
            !quizAnswers
        ) {

            return;

        }


        const question =
            quizQuestions[currentQuestion];


        quizQuestion.textContent =
            question.question;


        quizProgress.textContent =
            `Question ${currentQuestion + 1} / ${quizQuestions.length}`;


        quizAnswers.innerHTML = "";


        if (quizFeedback) {

            quizFeedback.textContent = "";

            quizFeedback.className =
                "chapter5-quiz-feedback";

        }


        if (quizNext) {

            quizNext.hidden = true;

        }


        question.answers.forEach(
            (answer, index) => {

                const button =
                    document.createElement("button");


                button.type = "button";

                button.className =
                    "chapter5-quiz-answer";


                button.textContent =
                    answer;


                button.addEventListener(
                    "click",
                    () => answerQuiz(index)
                );


                quizAnswers.appendChild(button);

            }
        );

    }


    /* ======================================================
       ANSWER QUIZ
    ====================================================== */

    function answerQuiz(answerIndex) {

        const question =
            quizQuestions[currentQuestion];


        const answerButtons =
            quizAnswers.querySelectorAll(
                ".chapter5-quiz-answer"
            );


        answerButtons.forEach(
            button => {
                button.disabled = true;
            }
        );


        if (
            answerIndex ===
            question.correct
        ) {

            quizScore++;


            if (quizFeedback) {

                quizFeedback.textContent =
                    "That's right. ❤️";

                quizFeedback.classList.add(
                    "correct"
                );

            }

        } else {

            if (quizFeedback) {

                quizFeedback.textContent =
                    "Close! But I'll forgive you. ♡";

                quizFeedback.classList.add(
                    "incorrect"
                );

            }

        }


        if (quizNext) {

            quizNext.hidden = false;

        }

    }


    /* ======================================================
       NEXT QUIZ QUESTION
    ====================================================== */

    if (quizNext) {

        quizNext.addEventListener(
            "click",
            () => {

                currentQuestion++;


                if (
                    currentQuestion >=
                    quizQuestions.length
                ) {

                    finishQuiz();

                    return;

                }


                loadQuizQuestion();

            }
        );

    }


    /* ======================================================
       FINISH QUIZ
    ====================================================== */

    function finishQuiz() {

        if (quizQuestion) {

            quizQuestion.textContent =
                "You made it through! ❤️";

        }


        if (quizProgress) {

            quizProgress.textContent =
                `Score: ${quizScore} / ${quizQuestions.length}`;

        }


        if (quizAnswers) {

            quizAnswers.innerHTML = "";

        }


        if (quizFeedback) {

            quizFeedback.textContent =
                "Maybe now you know a little more about us.";

        }


        if (quizNext) {

            quizNext.hidden = true;

        }

    }



    /* ======================================================
       GAME SELECTOR
    ====================================================== */

    gameSelectors.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const selectedGame =
                    button.dataset.game;


                if (!selectedGame) {
                    return;
                }


                currentGame =
                    selectedGame;


                gameSelectors.forEach(
                    selector => {

                        selector.classList.toggle(
                            "active",
                            selector === button
                        );

                    }
                );


                gamePanels.forEach(panel => {

                    panel.classList.toggle(
                        "active",
                        panel.dataset.gamePanel ===
                        selectedGame
                    );

                });

            }
        );

    });



    /* ======================================================
       CHAPTER V COMPLETION
    ====================================================== */

    const chapter5Completion =
        document.getElementById(
            "chapter5Completion"
        );


    function showChapter5Completion() {

        if (!chapter5Completion) {
            return;
        }


        chapter5Completion.hidden = false;


        requestAnimationFrame(() => {

            chapter5Completion.classList.add(
                "show"
            );

        });

    }



    /* ======================================================
       CHAPTER V → CHAPTER VI
       IMPORTANT NAVIGATION FIX
    ====================================================== */

    const chapter5Continue =
        document.getElementById(
            "chapter5Continue"
        );


    if (chapter5Continue) {

        chapter5Continue.addEventListener(
            "click",
            handleChapter5Continue
        );

    }


    function handleChapter5Continue(event) {

        event.preventDefault();


        /*
         * Prevent accidental double clicks.
         */

        if (
            chapter5Continue.classList.contains(
                "is-navigating"
            )
        ) {

            return;

        }


        chapter5Continue.classList.add(
            "is-navigating"
        );


        /*
         * Same transition-first approach
         * used for the previous chapter
         * navigation fixes.
         */

        if (
            typeof window.goToChapter ===
            "function"
        ) {

            try {

                window.goToChapter(6);

                return;

            } catch (error) {

                console.warn(
                    "goToChapter(6) failed:",
                    error
                );

            }

        }


        /*
         * Second fallback.
         */

        if (
            typeof window.showChapter ===
            "function"
        ) {

            try {

                window.showChapter(6);

                return;

            } catch (error) {

                console.warn(
                    "showChapter(6) failed:",
                    error
                );

            }

        }


        /*
         * Final direct-navigation fallback.
         *
         * This makes sure Chapter VI becomes
         * visible even if the global navigation
         * functions are unavailable.
         */

        const chapter6 =
            document.getElementById(
                "chapter6"
            );


        if (!chapter6) {

            console.error(
                "Chapter VI (#chapter6) was not found."
            );


            chapter5Continue.classList.remove(
                "is-navigating"
            );


            return;

        }


        /*
         * Hide every chapter.
         */

        document
            .querySelectorAll("main")
            .forEach(main => {

                main.classList.remove(
                    "active"
                );

                main.style.display = "none";

            });


        /*
         * Show Chapter VI.
         */

        chapter6.classList.add(
            "active"
        );

        chapter6.style.display = "block";


        /*
         * Make sure the page starts at
         * the beginning of Chapter VI.
         */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        /*
         * Release navigation lock after
         * the transition has had time to finish.
         */

        setTimeout(() => {

            chapter5Continue.classList.remove(
                "is-navigating"
            );

        }, 1000);

    }



    /* ======================================================
       INITIALIZE CHAPTER V
    ====================================================== */

    createHeartGame();

    createMemoryGame();

    loadQuizQuestion();


});
