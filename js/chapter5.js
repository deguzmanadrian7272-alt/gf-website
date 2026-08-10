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

    const chapter5 =
        document.getElementById("chapter5");


    if (!chapter5) {

        console.warn(
            "Chapter 5 element not found."
        );

        return;

    }


    const gameSelectors =
        document.querySelectorAll(
            ".chapter5-game-select"
        );


    const gamePanels =
        document.querySelectorAll(
            ".chapter5-game"
        );


    /* ======================================================
       GAME 1 ELEMENTS — FIND MY HEARTS
    ====================================================== */

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


    /* ======================================================
       GAME 2 ELEMENTS — MEMORY OF US
    ====================================================== */

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


    /* ======================================================
       GAME 3 ELEMENTS — QUIZ
    ====================================================== */

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


    /* ======================================================
       COMPLETION / CONTINUE
    ====================================================== */

    const completion =
        document.getElementById(
            "chapter5Completion"
        );


    const chapter5Continue =
        document.getElementById(
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
       MEMORY GAME VARIABLES
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


    /* ======================================================
       MEMORY CARD STYLE FALLBACK
    ====================================================== */

    function setupMemoryCardStyles() {

        if (
            document.getElementById(
                "chapter5-memory-js-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement("style");


        style.id =
            "chapter5-memory-js-styles";


        style.textContent = `

            .chapter5-memory-board {
                perspective: 1000px;
            }

            .chapter5-memory-card {
                position: relative;
                perspective: 1000px;
                cursor: pointer;
                border: none;
                padding: 0;
                background: transparent;
                transform-style: preserve-3d;
                -webkit-transform-style: preserve-3d;
            }

            .chapter5-memory-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                min-height: 100px;
                transform-style: preserve-3d;
                -webkit-transform-style: preserve-3d;
                transition:
                    transform 0.6s
                    cubic-bezier(
                        0.4,
                        0.2,
                        0.2,
                        1
                    );
            }

            .chapter5-memory-card.flipped
            .chapter5-memory-card-inner {
                transform: rotateY(180deg);
            }

            .chapter5-memory-card-front,
            .chapter5-memory-card-back {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                border-radius: inherit;
            }

            .chapter5-memory-card-front {
                transform: rotateY(0deg);
            }

            .chapter5-memory-card-back {
                transform: rotateY(180deg);
            }

            .chapter5-memory-card.matched {
                cursor: default;
            }

            .chapter5-memory-card:focus-visible {
                outline: 3px solid
                    rgba(
                        255,
                        182,
                        213,
                        0.9
                    );

                outline-offset: 4px;
            }

        `;


        document.head.appendChild(
            style
        );

    }


    setupMemoryCardStyles();


    /* ======================================================
       GAME 1 — FIND MY HEARTS
    ====================================================== */

    function createHeartHunt() {

        if (!heartBoard) {

            return;

        }


        heartBoard.innerHTML = "";


        state.heartsFound = 0;

        state.heartCompleted = false;


        updateHeartCount();


        for (
            let i = 0;
            i < state.totalHearts;
            i++
        ) {

            const heart =
                document.createElement(
                    "button"
                );


            heart.type =
                "button";


            heart.className =
                "chapter5-hunt-heart";


            heart.innerHTML =
                "♥";


            heart.setAttribute(
                "aria-label",
                `Hidden heart ${i + 1}`
            );


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


                    heartBoard.classList.add(
                        "heart-found"
                    );


                    setTimeout(
                        () => {

                            heartBoard.classList.remove(
                                "heart-found"
                            );

                        },

                        250
                    );


                    if (
                        state.heartsFound ===
                        state.totalHearts
                    ) {

                        state.heartCompleted =
                            true;


                        showGameMessage(
                            heartBoard,
                            "You found every little heart. ♡"
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


    function updateHeartCount() {

        if (!heartCount) {

            return;

        }


        heartCount.textContent =
            `${state.heartsFound} / ${state.totalHearts}`;

    }


    /* ======================================================
       GAME 2 — MEMORY OF US
    ====================================================== */

    function createMemoryGame() {

        if (!memoryBoard) {

            return;

        }


        setupMemoryCardStyles();


        memoryBoard.innerHTML = "";


        state.memoryMatches = 0;

        state.memoryCompleted = false;


        memoryFirstCard = null;

        memorySecondCard = null;

        memoryLock = false;


        updateMemoryCount();


        const oldMessage =
            memoryBoard.parentElement
                ?.querySelector(
                    ".chapter5-game-message"
                );


        if (oldMessage) {

            oldMessage.remove();

        }


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


                card.type =
                    "button";


                card.className =
                    "chapter5-memory-card";


                card.dataset.value =
                    symbol;


                card.dataset.index =
                    index;


                card.setAttribute(
                    "aria-label",
                    "Hidden memory card"
                );


                card.setAttribute(
                    "aria-pressed",
                    "false"
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


                front.innerHTML =
                    "♡";


                const back =
                    document.createElement(
                        "span"
                    );


                back.className =
                    "chapter5-memory-card-back";


                back.innerHTML =
                    symbol;


                inner.appendChild(
                    front
                );


                inner.appendChild(
                    back
                );


                card.appendChild(
                    inner
                );


                memoryBoard.appendChild(
                    card
                );


                card.addEventListener(
                    "click",
                    () => {

                        handleMemoryCard(
                            card
                        );

                    }
                );


                card.addEventListener(
                    "keydown",
                    (event) => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            handleMemoryCard(
                                card
                            );

                        }

                    }
                );

            }
        );

    }


    /* ======================================================
       HANDLE MEMORY CARD
    ====================================================== */

    function handleMemoryCard(card) {

        if (memoryLock) {

            return;

        }


        if (
            card ===
            memoryFirstCard
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


        if (
            card.classList.contains(
                "flipped"
            )
        ) {

            return;

        }


        card.classList.add(
            "flipped"
        );


        card.setAttribute(
            "aria-pressed",
            "true"
        );


        card.setAttribute(
            "aria-label",
            `Memory card showing ${card.dataset.value}`
        );


        if (!memoryFirstCard) {

            memoryFirstCard =
                card;

            return;

        }


        memorySecondCard =
            card;


        memoryLock =
            true;


        const firstValue =
            memoryFirstCard.dataset.value;


        const secondValue =
            memorySecondCard.dataset.value;


        if (
            firstValue ===
            secondValue
        ) {

            setTimeout(
                () => {

                    memoryFirstCard.classList.add(
                        "matched"
                    );


                    memorySecondCard.classList.add(
                        "matched"
                    );


                    memoryFirstCard.setAttribute(
                        "aria-label",
                        `Matched memory card ${firstValue}`
                    );


                    memorySecondCard.setAttribute(
                        "aria-label",
                        `Matched memory card ${secondValue}`
                    );


                    state.memoryMatches++;


                    updateMemoryCount();


                    const completed =
                        state.memoryMatches ===
                        state.totalMemoryPairs;


                    resetMemoryTurn();


                    if (completed) {

                        state.memoryCompleted =
                            true;


                        showGameMessage(
                            memoryBoard,
                            "You remembered every little piece of us. ♡"
                        );


                        checkAllGamesComplete();

                    }

                },

                600

            );

        }

        else {

            setTimeout(
                () => {

                    if (memoryFirstCard) {

                        memoryFirstCard.classList.remove(
                            "flipped"
                        );


                        memoryFirstCard.setAttribute(
                            "aria-pressed",
                            "false"
                        );


                        memoryFirstCard.setAttribute(
                            "aria-label",
                            "Hidden memory card"
                        );

                    }


                    if (memorySecondCard) {

                        memorySecondCard.classList.remove(
                            "flipped"
                        );


                        memorySecondCard.setAttribute(
                            "aria-pressed",
                            "false"
                        );


                        memorySecondCard.setAttribute(
                            "aria-label",
                            "Hidden memory card"
                        );

                    }


                    resetMemoryTurn();

                },

                1000

            );

        }

    }


    /* ======================================================
       RESET MEMORY TURN
    ====================================================== */

    function resetMemoryTurn() {

        memoryFirstCard =
            null;


        memorySecondCard =
            null;


        memoryLock =
            false;

    }


    /* ======================================================
       UPDATE MEMORY COUNTER
    ====================================================== */

    function updateMemoryCount() {

        if (!memoryMatches) {

            return;

        }


        memoryMatches.textContent =
            `${state.memoryMatches} / ${state.totalMemoryPairs}`;

    }


    /* ======================================================
       GAME 3 — QUIZ
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

        state.quizIndex =
            0;


        state.quizScore =
            0;


        state.quizCompleted =
            false;


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


        quizAnswers.innerHTML =
            "";


        if (quizFeedback) {

            quizFeedback.textContent =
                "";


            quizFeedback.className =
                "chapter5-quiz-feedback";

        }


        if (quizNext) {

            quizNext.hidden =
                true;

        }


        current.answers.forEach(
            (answer, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


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


        if (!current) {

            return;

        }


        const allButtons =
            quizAnswers.querySelectorAll(
                ".chapter5-quiz-answer"
            );


        allButtons.forEach(
            button => {

                button.disabled =
                    true;

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

            quizNext.hidden =
                false;


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

        state.quizCompleted =
            true;


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

            quizAnswers.innerHTML =
                "";

        }


        if (quizFeedback) {

            let message =
                "";


            if (
                score ===
                total
            ) {

                message =
                    "You remembered everything. Maybe you really do know us. ♡";

            }

            else if (
                score >= 3
            ) {

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

            quizNext.hidden =
                true;

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


                    switchGame(
                        game
                    );

                }
            );

        }
    );


    function switchGame(
        gameName
    ) {

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


        if (
            gameName ===
            "heart"
        ) {

            if (
                !state.heartCompleted &&
                heartBoard &&
                heartBoard.children.length ===
                    0
            ) {

                createHeartHunt();

            }

        }


        if (
            gameName ===
            "memory"
        ) {

            if (
                memoryBoard &&
                memoryBoard.children.length ===
                    0
            ) {

                createMemoryGame();

            }

        }


        if (
            gameName ===
            "quiz"
        ) {

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

        if (!completion) {

            return;

        }


        completion.hidden =
            false;


        completion.classList.add(
            "show"
        );


        setTimeout(
            () => {

                completion.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            },

            300
        );

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

    function shuffleArray(
        array
    ) {

        for (
            let i =
                array.length - 1;

            i > 0;

            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
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
       CHAPTER 5 → CHAPTER 6 NAVIGATION
       
       IMPORTANT:
       This is intentionally handled locally here.
       We do NOT modify transition.js or app.js.
    ====================================================== */

    if (chapter5Continue) {

        chapter5Continue.addEventListener(
            "click",
            handleChapter5Continue
        );

    }


    function handleChapter5Continue(event) {

        event.preventDefault();

        event.stopPropagation();


        const chapter6 =
            document.getElementById(
                "chapter6"
            );


        /*
            Chapter 6 must exist.
        */

        if (!chapter6) {

            console.error(
                "Chapter 6 was not found. Make sure <main id=\"chapter6\"> exists in index.html."
            );

            return;

        }


        /*
            Prevent double clicks.
        */

        if (
            chapter5Continue.dataset.transitioning ===
            "true"
        ) {

            return;

        }


        chapter5Continue.dataset.transitioning =
            "true";


        /*
            ------------------------------------------------
            FIRST OPTION:
            Use the existing global navigation system.
            ------------------------------------------------
        */

        if (
            typeof window.goToChapter ===
            "function"
        ) {

            try {

                window.goToChapter(6);

                /*
                    Give the global system a chance
                    to perform its own transition.
                */

                setTimeout(
                    () => {

                        verifyChapter6Visible();

                    },

                    700
                );


                setTimeout(
                    () => {

                        chapter5Continue.dataset.transitioning =
                            "false";

                    },

                    1200
                );


                return;

            }

            catch (error) {

                console.warn(
                    "goToChapter(6) failed. Using direct Chapter 6 navigation.",
                    error
                );

            }

        }


        /*
            ------------------------------------------------
            SECOND OPTION:
            Use showChapter if it exists.
            ------------------------------------------------
        */

        if (
            typeof window.showChapter ===
            "function"
        ) {

            try {

                window.showChapter(6);


                setTimeout(
                    () => {

                        verifyChapter6Visible();

                    },

                    700
                );


                setTimeout(
                    () => {

                        chapter5Continue.dataset.transitioning =
                            "false";

                    },

                    1200
                );


                return;

            }

            catch (error) {

                console.warn(
                    "showChapter(6) failed. Using direct Chapter 6 navigation.",
                    error
                );

            }

        }


        /*
            ------------------------------------------------
            FINAL FALLBACK:
            Directly activate Chapter 6.
            ------------------------------------------------
        */

        activateChapter6Directly();


        chapter5Continue.dataset.transitioning =
            "false";

    }


    /* ======================================================
       VERIFY CHAPTER 6
    ====================================================== */

    function verifyChapter6Visible() {

        const chapter6 =
            document.getElementById(
                "chapter6"
            );


        if (!chapter6) {

            return;

        }


        const isVisible =
            chapter6.classList.contains(
                "active"
            );


        /*
            If the global system didn't make
            Chapter 6 active, force the fallback.
        */

        if (!isVisible) {

            activateChapter6Directly();

        }

    }


    /* ======================================================
       DIRECT CHAPTER 6 ACTIVATION
    ====================================================== */

    function activateChapter6Directly() {

        const chapter6 =
            document.getElementById(
                "chapter6"
            );


        if (!chapter6) {

            console.error(
                "Cannot activate Chapter 6 because #chapter6 does not exist."
            );

            return;

        }


        /*
            Hide every chapter.
        */

        const allChapters =
            document.querySelectorAll(
                "main[id^='chapter']"
            );


        allChapters.forEach(
            chapter => {

                chapter.classList.remove(
                    "active"
                );

            }
        );


        /*
            Activate Chapter 6.
        */

        chapter6.classList.add(
            "active"
        );


        /*
            Keep chapter6 visible even if
            another global class system exists.
        */

        chapter6.removeAttribute(
            "hidden"
        );


        /*
            Reset scroll position.
        */

        window.scrollTo({

            top: 0,

            left: 0,

            behavior: "smooth"

        });


        /*
            Update common current-chapter
            variables if your app uses them.
        */

        document.body.dataset.chapter =
            "6";


        document.documentElement.dataset.chapter =
            "6";


        /*
            Dispatch an event so other scripts
            can react without us modifying them.
        */

        document.dispatchEvent(
            new CustomEvent(
                "chapterchange",
                {
                    detail: {
                        chapter: 6
                    }
                }
            )
        );


        console.log(
            "Chapter V → Chapter VI navigation completed."
        );

    }


    /* ======================================================
       INITIALIZE
    ====================================================== */

    createHeartHunt();


    switchGame(
        "heart"
    );


    console.log(
        "Chapter V — Mini Games initialized ♡"
    );

});
