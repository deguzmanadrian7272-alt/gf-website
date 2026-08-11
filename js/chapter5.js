

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
       
       This ensures the flip works even if the CSS
       does not contain the required 3D rules.
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

                -webkit-transform-style:
                    preserve-3d;

            }


            .chapter5-memory-card-inner {

                position: relative;

                width: 100%;

                height: 100%;

                min-height: 100px;

                transform-style: preserve-3d;

                -webkit-transform-style:
                    preserve-3d;

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

                transform:
                    rotateY(180deg);

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

                -webkit-backface-visibility:
                    hidden;

                border-radius: inherit;

            }


            .chapter5-memory-card-front {

                transform:
                    rotateY(0deg);

            }


            .chapter5-memory-card-back {

                transform:
                    rotateY(180deg);

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


            /*
                Random positions.

                Keep hearts away from
                extreme edges.
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


                    setTimeout(
                        () => {

                            heartBoard.classList.remove(
                                "heart-found"
                            );

                        },

                        250
                    );


                    /*
                        Game complete.
                    */

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


        /*
            Make sure the styles exist
            before creating cards.
        */

        setupMemoryCardStyles();


        /*
            Reset board.
        */

        memoryBoard.innerHTML = "";


        /*
            Reset game state.
        */

        state.memoryMatches = 0;

        state.memoryCompleted = false;


        memoryFirstCard = null;

        memorySecondCard = null;

        memoryLock = false;


        updateMemoryCount();


        /*
            Remove previous game message.
        */

        const oldMessage =
            memoryBoard.parentElement
                ?.querySelector(
                    ".chapter5-game-message"
                );


        if (oldMessage) {

            oldMessage.remove();

        }


        /*
            Duplicate each symbol
            to create matching pairs.
        */

        const cards = [

            ...memorySymbols,

            ...memorySymbols

        ];


        /*
            Shuffle the cards.
        */

        shuffleArray(cards);


        /*
            Create all cards.
        */

        cards.forEach(
            (symbol, index) => {

                const card =
                    document.createElement(
                        "button"
                    );


                /*
                    Basic button settings.
                */

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


                /*
                    Create card inner wrapper.
                */

                const inner =
                    document.createElement(
                        "span"
                    );


                inner.className =
                    "chapter5-memory-card-inner";


                /*
                    Front of card.
                */

                const front =
                    document.createElement(
                        "span"
                    );


                front.className =
                    "chapter5-memory-card-front";


                front.innerHTML =
                    "♡";


                /*
                    Back of card.
                */

                const back =
                    document.createElement(
                        "span"
                    );


                back.className =
                    "chapter5-memory-card-back";


                back.innerHTML =
                    symbol;


                /*
                    Put front and back
                    inside the inner wrapper.
                */

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


                /*
                    CLICK EVENT
                */

                card.addEventListener(
                    "click",
                    () => {

                        handleMemoryCard(
                            card
                        );

                    }
                );


                /*
                    KEYBOARD ACCESSIBILITY
                */

                card.addEventListener(
                    "keydown",
                    (event) => {

                        if (
                            event.key ===
                            "Enter" ||
                            event.key ===
                            " "
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

        /*
            Don't allow clicks while
            two cards are being checked.
        */

        if (memoryLock) {

            return;

        }


        /*
            Don't click the same card twice.
        */

        if (
            card ===
            memoryFirstCard
        ) {

            return;

        }


        /*
            Don't click an already
            matched card.
        */

        if (
            card.classList.contains(
                "matched"
            )
        ) {

            return;

        }


        /*
            Don't allow an already flipped
            card to be clicked again.
        */

        if (
            card.classList.contains(
                "flipped"
            )
        ) {

            return;

        }


        /*
            FLIP CARD
        */

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


        /*
            First card.
        */

        if (!memoryFirstCard) {

            memoryFirstCard =
                card;

            return;

        }


        /*
            Second card.
        */

        memorySecondCard =
            card;


        /*
            Lock the board while
            checking the pair.
        */

        memoryLock = true;


        const firstValue =
            memoryFirstCard.dataset.value;


        const secondValue =
            memorySecondCard.dataset.value;


        /*
            MATCH
        */

        if (
            firstValue ===
            secondValue
        ) {

            setTimeout(
                () => {

                    /*
                        Keep both cards open.
                    */

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


                    /*
                        Check if every pair
                        has been matched.
                    */

                    const completed =
                        state.memoryMatches ===
                        state.totalMemoryPairs;


                    /*
                        Reset turn before
                        checking completion.
                    */

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


        /*
            WRONG PAIR
        */

        else {

            setTimeout(
                () => {

                    if (
                        memoryFirstCard
                    ) {

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


                    if (
                        memorySecondCard
                    ) {

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
       GAME 3 — HOW WELL DO YOU KNOW ME?
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


        /*
            Prevent multiple answers.
        */

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


        /*
            Correct answer.
        */

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


        /*
            Wrong answer.
        */

        else {

            selectedButton.classList.add(
                "wrong"
            );


            /*
                Highlight actual
                correct answer.
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


        /*
            Show Next / Result button.
        */

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
            Start Game 1 when needed.
        */

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


        /*
            Start Game 2 when needed.
        */

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


        /*
            Start Game 3 when needed.
        */

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
       CHAPTER 5 CONTINUE BUTTON
       ====================================================== */

    if (chapter5Continue) {

        chapter5Continue.addEventListener(
            "click",
            () => {

                /*
                    Existing global navigation
                    systems first.
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
                    Look for Chapter VI.
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

                        top:
                            0,

                        behavior:
                            "smooth"

                    });


                    return;

                }


                /*
                    Chapter VI doesn't exist yet.
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
        Start Game 1 immediately because
        it is active by default.
    */

    createHeartHunt();


    /*
        Make sure the correct game
        panel is active.
    */

    switchGame(
        "heart"
    );


    console.log(
        "Chapter V — Mini Games initialized ♡"
    );

});
