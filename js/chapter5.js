/* ==========================================================
   CHAPTER V — MINI GAMES
   Project : Our Story
   File    : chapter5.js
   Purpose : Interactive Mini Games
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       CHAPTER 5 ELEMENTS
       ====================================================== */

    const chapter5 = document.getElementById("chapter5");

    if (!chapter5) {
        console.warn("Chapter 5 element not found.");
        return;
    }

    const gameSelectors = document.querySelectorAll(
        ".chapter5-game-select"
    );

    const gamePanels = document.querySelectorAll(
        ".chapter5-game"
    );


    /* ======================================================
       GAME 1 ELEMENTS — FIND MY HEARTS
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


    /* ======================================================
       GAME 2 ELEMENTS — MEMORY
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


    /* ======================================================
       GAME 3 ELEMENTS — QUIZ
       ====================================================== */

    const quizProgress = document.getElementById(
        "chapter5QuizProgress"
    );

    const quizQuestion = document.getElementById(
        "chapter5QuizQuestion"
    );

    const quizAnswers = document.getElementById(
        "chapter5QuizAnswers"
    );

    const quizFeedback = document.getElementById(
        "chapter5QuizFeedback"
    );

    const quizNext = document.getElementById(
        "chapter5QuizNext"
    );


    /* ======================================================
       COMPLETION / CONTINUE
       ====================================================== */

    const completion = document.getElementById(
        "chapter5Completion"
    );

    const chapter5Continue = document.getElementById(
        "chapter5Continue"
    );


    /* ======================================================
       CHAPTER 5 STATE
       ====================================================== */

    const state = {

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


    /* ======================================================
       GAME 1 — FIND MY HEARTS
       ====================================================== */

    function createHeartHunt() {

        if (!heartBoard) return;

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

            const heart = document.createElement("button");

            heart.type = "button";

            heart.className =
                "chapter5-hunt-heart";

            heart.innerHTML = "♥";

            heart.setAttribute(
                "aria-label",
                `Hidden heart ${i + 1}`
            );


            /*
                Random positions.

                Keep the hearts away from the
                extreme edges so they remain clickable.
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
                Slightly different animation timing
                for each heart.
            */

            heart.style.animationDelay =
                `${Math.random() * 1.5}s`;


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
                        Small feedback effect.
                    */

                    heartBoard.classList.add(
                        "heart-found"
                    );

                    setTimeout(() => {

                        heartBoard.classList.remove(
                            "heart-found"
                        );

                    }, 250);


                    /*
                        Game complete.
                    */

                    if (
                        state.heartsFound ===
                        state.totalHearts
                    ) {

                        state.heartCompleted = true;

                        showGameMessage(
                            heartBoard,
                            "You found every little heart. ♡"
                        );

                        checkAllGamesComplete();

                    }

                }
            );


            heartBoard.appendChild(heart);

        }

    }


    function updateHeartCount() {

        if (!heartCount) return;

        heartCount.textContent =
            `${state.heartsFound} / ${state.totalHearts}`;

    }


    /* ======================================================
       GAME 2 — MEMORY OF US
       ====================================================== */

    const memorySymbols = [

        "♡",
        "✦",
        "♥",
        "☾",
        "✧",
        "∞"

    ];


    let memoryFirstCard = null;

    let memorySecondCard = null;

    let memoryLock = false;


    function createMemoryGame() {

        if (!memoryBoard) return;

        memoryBoard.innerHTML = "";

        state.memoryMatches = 0;

        state.memoryCompleted = false;

        memoryFirstCard = null;

        memorySecondCard = null;

        memoryLock = false;

        updateMemoryCount();


        /*
            Duplicate each symbol to create pairs.
        */

        const cards = [
            ...memorySymbols,
            ...memorySymbols
        ];


        shuffleArray(cards);


        cards.forEach(
            (symbol, index) => {

                const card =
                    document.createElement(
                        "button"
                    );

                card.type = "button";

                card.className =
                    "chapter5-memory-card";

                card.dataset.value =
                    symbol;

                card.dataset.index =
                    index;

                card.setAttribute(
                    "aria-label",
                    "Memory card"
                );


                const inner =
                    document.createElement(
                        "span"
                    );

                inner.className =
                    "chapter5-memory-card-inner";


                const front =
                    document.createElement(
                        "span"
                    );

                front.className =
                    "chapter5-memory-card-front";

                front.innerHTML = "♡";


                const back =
                    document.createElement(
                        "span"
                    );

                back.className =
                    "chapter5-memory-card-back";

                back.innerHTML = symbol;


                inner.appendChild(front);

                inner.appendChild(back);

                card.appendChild(inner);

                memoryBoard.appendChild(card);


                card.addEventListener(
                    "click",
                    () => {

                        handleMemoryCard(card);

                    }
                );

            }
        );

    }


    function handleMemoryCard(card) {

        if (memoryLock) return;

        if (
            card === memoryFirstCard
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


        if (!memoryFirstCard) {

            memoryFirstCard = card;

            return;

        }


        memorySecondCard = card;

        memoryLock = true;


        const firstValue =
            memoryFirstCard.dataset.value;

        const secondValue =
            memorySecondCard.dataset.value;


        if (
            firstValue === secondValue
        ) {

            /*
                Matching pair.
            */

            setTimeout(() => {

                memoryFirstCard.classList.add(
                    "matched"
                );

                memorySecondCard.classList.add(
                    "matched"
                );


                state.memoryMatches++;

                updateMemoryCount();


                resetMemoryTurn();


                if (
                    state.memoryMatches ===
                    state.totalMemoryPairs
                ) {

                    state.memoryCompleted =
                        true;


                    showGameMessage(
                        memoryBoard,
                        "You remembered every little piece of us. ♡"
                    );


                    checkAllGamesComplete();

                }

            }, 450);

        }

        else {

            /*
                Wrong pair.
                Flip both cards back.
            */

            setTimeout(() => {

                memoryFirstCard.classList.remove(
                    "flipped"
                );

                memorySecondCard.classList.remove(
                    "flipped"
                );


                resetMemoryTurn();

            }, 850);

        }

    }


    function resetMemoryTurn() {

        memoryFirstCard = null;

        memorySecondCard = null;

        memoryLock = false;

    }


    function updateMemoryCount() {

        if (!memoryMatches) return;

        memoryMatches.textContent =
            `${state.memoryMatches} / ${state.totalMemoryPairs}`;

    }


    /* ======================================================
       GAME 3 — QUIZ
       ======================================================

       IMPORTANT:
       These are example questions.

       Replace them with your REAL questions about
       your relationship/story.

       Each question needs:

       question
       answers
       correct
       ====================================================== */

    const quizQuestions = [

        {
            question:
                "Which chapter are we playing right now?",

            answers: [
                "Chapter III",
                "Chapter IV",
                "Chapter V",
                "Chapter VI"
            ],

            correct: 2
        },


        {
            question:
                "How many mini games are waiting for you?",

            answers: [
                "One",
                "Two",
                "Three",
                "Five"
            ],

            correct: 2
        },


        {
            question:
                "What are you supposed to find in the first game?",

            answers: [
                "Stars",
                "Hearts",
                "Letters",
                "Flowers"
            ],

            correct: 1
        },


        {
            question:
                "What do we have to match in the second game?",

            answers: [
                "Pictures",
                "Numbers",
                "Hearts",
                "Pairs"
            ],

            correct: 3
        },


        {
            question:
                "What is the best part of this little game?",

            answers: [
                "Winning",
                "The score",
                "Spending time together",
                "Finishing quickly"
            ],

            correct: 2
        }

    ];


    function startQuiz() {

        state.quizIndex = 0;

        state.quizScore = 0;

        state.quizCompleted = false;

        renderQuizQuestion();

    }


    function renderQuizQuestion() {

        if (
            !quizQuestion ||
            !quizAnswers
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


        /*
            Update progress.
        */

        if (quizProgress) {

            quizProgress.textContent =
                `Question ${
                    state.quizIndex + 1
                } of ${
                    quizQuestions.length
                }`;

        }


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


                button.dataset.answer =
                    index;


                button.addEventListener(
                    "click",
                    () => {

                        answerQuiz(
                            button,
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


    function answerQuiz(
        selectedButton,
        selectedIndex
    ) {

        const current =
            quizQuestions[
                state.quizIndex
            ];


        if (!current) return;


        /*
            Prevent multiple answers.
        */

        const allButtons =
            quizAnswers.querySelectorAll(
                ".chapter5-quiz-answer"
            );


        allButtons.forEach(
            button => {

                button.disabled = true;

            }
        );


        if (
            selectedIndex ===
            current.correct
        ) {

            selectedButton.classList.add(
                "correct"
            );


            state.quizScore++;


            if (quizFeedback) {

                quizFeedback.textContent =
                    "That's right. ♡";

                quizFeedback.classList.add(
                    "correct"
                );

            }

        }

        else {

            selectedButton.classList.add(
                "wrong"
            );


            /*
                Show the actual correct answer.
            */

            allButtons.forEach(
                (button, index) => {

                    if (
                        index ===
                        current.correct
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }

                }
            );


            if (quizFeedback) {

                quizFeedback.textContent =
                    "Not quite... but that's okay. ♡";

                quizFeedback.classList.add(
                    "wrong"
                );

            }

        }


        if (quizNext) {

            quizNext.hidden = false;

            quizNext.textContent =
                state.quizIndex ===
                quizQuestions.length - 1

                    ? "See My Result →"

                    : "Next Question →";

        }

    }


    function nextQuizQuestion() {

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


    function finishQuiz() {

        state.quizCompleted = true;


        const total =
            quizQuestions.length;

        const score =
            state.quizScore;


        if (quizProgress) {

            quizProgress.textContent =
                "Quiz Complete";

        }


        if (quizQuestion) {

            quizQuestion.textContent =
                `You got ${score} out of ${total} right. ♡`;

        }


        if (quizAnswers) {

            quizAnswers.innerHTML = "";

        }


        if (quizFeedback) {

            let message = "";


            if (score === total) {

                message =
                    "You remembered everything. Maybe you really do know us. ♡";

            }

            else if (score >= 3) {

                message =
                    "Not bad... I think you know us pretty well. ♡";

            }

            else {

                message =
                    "Looks like we need a few more memories together. ♡";

            }


            quizFeedback.textContent =
                message;

        }


        if (quizNext) {

            quizNext.hidden = true;

        }


        checkAllGamesComplete();

    }


    /* ======================================================
       GAME SELECTOR
       ====================================================== */

    gameSelectors.forEach(
        selector => {

            selector.addEventListener(
                "click",
                () => {

                    const game =
                        selector.dataset.game;


                    switchGame(game);

                }
            );

        }
    );


    function switchGame(gameName) {

        /*
            Update selected tab.
        */

        gameSelectors.forEach(
            selector => {

                const isActive =
                    selector.dataset.game ===
                    gameName;


                selector.classList.toggle(
                    "active",
                    isActive
                );

            }
        );


        /*
            Update game panels.
        */

        gamePanels.forEach(
            panel => {

                const isActive =
                    panel.dataset.gamePanel ===
                    gameName;


                panel.classList.toggle(
                    "active",
                    isActive
                );

            }
        );


        /*
            Start / reset the requested
            game only when necessary.
        */

        if (gameName === "heart") {

            /*
                If the player already completed it,
                don't automatically erase progress.
            */

            if (
                !state.heartCompleted &&
                heartBoard &&
                heartBoard.children.length === 0
            ) {

                createHeartHunt();

            }

        }


        if (gameName === "memory") {

            if (
                memoryBoard &&
                memoryBoard.children.length === 0
            ) {

                createMemoryGame();

            }

        }


        if (gameName === "quiz") {

            if (
                state.quizIndex === 0 &&
                state.quizScore === 0 &&
                !state.quizCompleted
            ) {

                startQuiz();

            }

        }

    }


    /* ======================================================
       GAME MESSAGE HELPER
       ====================================================== */

    function showGameMessage(
        board,
        message
    ) {

        if (!board) return;


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


    /* ======================================================
       CHECK ALL GAMES
       ====================================================== */

    function checkAllGamesComplete() {

        if (
            state.heartCompleted &&
            state.memoryCompleted &&
            state.quizCompleted
        ) {

            showCompletion();

        }

    }


    function showCompletion() {

        if (!completion) return;


        completion.hidden = false;


        /*
            Give the completion section
            a small animation if CSS supports it.
        */

        completion.classList.add(
            "show"
        );


        /*
            Scroll gently toward the
            completion message.
        */

        setTimeout(() => {

            completion.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 300);

    }


    /* ======================================================
       RESET BUTTONS
       ====================================================== */

    if (heartReset) {

        heartReset.addEventListener(
            "click",
            () => {

                createHeartHunt();

            }
        );

    }


    if (memoryReset) {

        memoryReset.addEventListener(
            "click",
            () => {

                createMemoryGame();

            }
        );

    }


    if (quizNext) {

        quizNext.addEventListener(
            "click",
            () => {

                nextQuizQuestion();

            }
        );

    }


    /* ======================================================
       ARRAY SHUFFLE
       ====================================================== */

    function shuffleArray(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );


            [
                array[i],
                array[j]
            ] = [
                array[j],
                array[i]
            ];

        }


        return array;

    }


    /* ======================================================
       CHAPTER 5 CONTINUE BUTTON
       ====================================================== */

    if (chapter5Continue) {

        chapter5Continue.addEventListener(
            "click",
            () => {

                /*
                    If your global transition system
                    provides a chapter navigation function,
                    use it first.
                */

                if (
                    typeof window.goToChapter ===
                    "function"
                ) {

                    window.goToChapter(6);

                    return;

                }


                if (
                    typeof window.showChapter ===
                    "function"
                ) {

                    window.showChapter(6);

                    return;

                }


                /*
                    Fallback:
                    Look for Chapter VI in the page.
                */

                const chapter6 =
                    document.getElementById(
                        "chapter6"
                    );


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
                    Chapter VI does not exist yet.
                */

                console.info(
                    "Chapter VI has not been added yet."
                );

            }
        );

    }


    /* ======================================================
       INITIALIZE
       ====================================================== */

    /*
        Start Game 1 immediately because it is
        active by default in the HTML.
    */

    createHeartHunt();


    /*
        Make sure the correct game panel is active.
    */

    switchGame("heart");


    console.log(
        "Chapter V — Mini Games initialized ♡"
    );

});
