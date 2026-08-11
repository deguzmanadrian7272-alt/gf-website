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
        document.getElementById(
            "chapter5"
        );


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

        /*
            GAME 1
        */

        heartsFound: 0,

        totalHearts: 5,

        heartAttempts: 0,

        heartCompleted: false,


        /*
            GAME 2
        */

        memoryMatches: 0,

        totalMemoryPairs: 6,

        memoryCompleted: false,


        /*
            GAME 3
        */

        quizIndex: 0,

        quizScore: 0,

        quizCompleted: false

    };


    /* ======================================================
       GAME 1 — FIND MY HEARTS
       ====================================================== */

    function createHeartHunt() {

        if (!heartBoard) {

            return;

        }


        /*
            Reset game.
        */

        heartBoard.innerHTML = "";

        state.heartsFound = 0;

        state.heartAttempts = 0;

        state.heartCompleted = false;


        /*
            Remove old result message.
        */

        removeGameMessage(
            heartBoard
        );


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
                Slightly different animation.
            */

            heart.style.animationDelay =
                `${Math.random() * 1.5}s`;


            /*
                Heart click.
            */

            heart.addEventListener(
                "click",
                () => {

                    /*
                        Ignore already found hearts.
                    */

                    if (
                        heart.classList.contains(
                            "found"
                        )
                    ) {

                        return;

                    }


                    /*
                        Count attempt.
                    */

                    state.heartAttempts++;


                    /*
                        Mark heart as found.
                    */

                    heart.classList.add(
                        "found"
                    );


                    state.heartsFound++;


                    updateHeartCount();


                    /*
                        Small board feedback.
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
                        Check completion.
                    */

                    if (
                        state.heartsFound >=
                        state.totalHearts
                    ) {

                        finishHeartHunt();

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


    function finishHeartHunt() {

        /*
            Prevent duplicate completion.
        */

        if (
            state.heartCompleted
        ) {

            return;

        }


        state.heartCompleted =
            true;


        /*
            Disable all hearts.
        */

        const hearts =
            heartBoard.querySelectorAll(
                ".chapter5-hunt-heart"
            );


        hearts.forEach(
            heart => {

                heart.disabled =
                    true;

            }
        );


        /*
            Determine performance.
        */

        let message;


        if (
            state.heartAttempts ===
            state.totalHearts
        ) {

            message =
                "You found every little heart. ♡";

        }

        else if (
            state.heartAttempts <= 7
        ) {

            message =
                `You found every little heart. ♡ ${state.heartAttempts} little searches later...`;

        }

        else {

            message =
                "You found every little heart. ♡ It was worth the search.";

        }


        /*
            Highlight the final result.
        */

        showGameMessage(
            heartBoard,
            message,
            true
        );


        /*
            Check all games.
        */

        checkAllGamesComplete();

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


    let memoryFirstCard =
        null;


    let memorySecondCard =
        null;


    let memoryLock =
        false;


    function createMemoryGame() {

        if (!memoryBoard) {

            return;

        }


        /*
            Reset board.
        */

        memoryBoard.innerHTML = "";


        state.memoryMatches =
            0;


        state.memoryCompleted =
            false;


        memoryFirstCard =
            null;


        memorySecondCard =
            null;


        memoryLock =
            false;


        updateMemoryCount();


        removeGameMessage(
            memoryBoard
        );


        /*
            Create pairs.
        */

        const cards = [

            ...memorySymbols,

            ...memorySymbols

        ];


        shuffleArray(cards);


        /*
            Generate cards.
        */

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
                    "Memory card. Click to reveal."
                );


                card.setAttribute(
                    "aria-pressed",
                    "false"
                );


                /*
                    Card inner wrapper.
                */

                const inner =
                    document.createElement(
                        "span"
                    );


                inner.className =
                    "chapter5-memory-card-inner";


                /*
                    Hidden/front side.
                */

                const front =
                    document.createElement(
                        "span"
                    );


                front.className =
                    "chapter5-memory-card-front";


                front.textContent =
                    "♡";


                /*
                    Revealed/back side.
                */

                const back =
                    document.createElement(
                        "span"
                    );


                back.className =
                    "chapter5-memory-card-back";


                back.textContent =
                    symbol;


                /*
                    Build card.
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
                    Card interaction.
                */

                card.addEventListener(
                    "click",
                    () => {

                        handleMemoryCard(
                            card
                        );

                    }
                );

            }
        );

    }


    function handleMemoryCard(card) {

        /*
            Don't allow interaction while
            two cards are being checked.
        */

        if (memoryLock) {

            return;

        }


        /*
            Ignore same card.
        */

        if (
            card === memoryFirstCard
        ) {

            return;

        }


        /*
            Ignore already matched card.
        */

        if (
            card.classList.contains(
                "matched"
            )
        ) {

            return;

        }


        /*
            Ignore a card that is
            already flipped.
        */

        if (
            card.classList.contains(
                "flipped"
            )
        ) {

            return;

        }


        /*
            Flip card.
        */

        card.classList.add(
            "flipped"
        );


        card.setAttribute(
            "aria-pressed",
            "true"
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


        memoryLock =
            true;


        /*
            Get values.
        */

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

                    memoryFirstCard.classList.add(
                        "matched"
                    );


                    memorySecondCard.classList.add(
                        "matched"
                    );


                    memoryFirstCard.disabled =
                        true;


                    memorySecondCard.disabled =
                        true;


                    state.memoryMatches++;


                    updateMemoryCount();


                    /*
                        Check if all pairs
                        are complete.
                    */

                    if (
                        state.memoryMatches ===
                        state.totalMemoryPairs
                    ) {

                        finishMemoryGame();

                    }


                    resetMemoryTurn();

                },
                450
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

                    }


                    resetMemoryTurn();

                },
                850
            );

        }

    }


    function finishMemoryGame() {

        if (
            state.memoryCompleted
        ) {

            return;

        }


        state.memoryCompleted =
            true;


        /*
            Keep all matched cards open.
        */

        const matchedCards =
            memoryBoard.querySelectorAll(
                ".chapter5-memory-card.matched"
            );


        matchedCards.forEach(
            card => {

                card.disabled =
                    true;

            }
        );


        /*
            Show final result.
        */

        showGameMessage(
            memoryBoard,
            "You remembered every little piece of us. ♡",
            true
        );


        /*
            Check all games.
        */

        checkAllGamesComplete();

    }


    function resetMemoryTurn() {

        memoryFirstCard =
            null;


        memorySecondCard =
            null;


        memoryLock =
            false;

    }


    function updateMemoryCount() {

        if (!memoryMatches) {

            return;

        }


        memoryMatches.textContent =
            `${state.memoryMatches} / ${state.totalMemoryPairs}`;

    }


    /* ======================================================
       GAME 3 — HOW WELL DO YOU KNOW US?
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


        removeGameMessage(
            quizFeedback
        );


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


        /*
            If there are no more questions,
            show the final result.
        */

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


        /*
            Update question.
        */

        quizQuestion.textContent =
            current.question;


        /*
            Clear previous answers.
        */

        quizAnswers.innerHTML =
            "";


        /*
            Clear feedback.
        */

        if (quizFeedback) {

            quizFeedback.textContent =
                "";


            quizFeedback.className =
                "chapter5-quiz-feedback";

        }


        /*
            Hide Next button
            until an answer is selected.
        */

        if (quizNext) {

            quizNext.hidden =
                true;


            quizNext.disabled =
                false;

        }


        /*
            Create answer buttons.
        */

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
            Prevent answering twice.
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


                quizFeedback.className =
                    "chapter5-quiz-feedback correct";

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
                Highlight correct answer.
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


                quizFeedback.className =
                    "chapter5-quiz-feedback wrong";

            }

        }


        /*
            Show the appropriate button.
        */

        if (quizNext) {

            quizNext.hidden =
                false;


            if (
                state.quizIndex ===
                quizQuestions.length - 1
            ) {

                quizNext.textContent =
                    "See My Result →";

            }

            else {

                quizNext.textContent =
                    "Next Question →";

            }

        }

    }


    function nextQuizQuestion() {

        /*
            If this is the last question,
            the button is "See My Result".
        */

        if (
            state.quizIndex ===
            quizQuestions.length - 1
        ) {

            finishQuiz();

            return;

        }


        /*
            Move to next question.
        */

        state.quizIndex++;


        renderQuizQuestion();

    }


    function finishQuiz() {

        /*
            Prevent duplicate finalization.
        */

        if (
            state.quizCompleted
        ) {

            return;

        }


        state.quizCompleted =
            true;


        const total =
            quizQuestions.length;


        const score =
            state.quizScore;


        /*
            Update progress.
        */

        if (quizProgress) {

            quizProgress.textContent =
                "Quiz Complete";

        }


        /*
            Show score.
        */

        if (quizQuestion) {

            quizQuestion.textContent =
                `You got ${score} out of ${total} right. ♡`;

        }


        /*
            Remove answer buttons.
        */

        if (quizAnswers) {

            quizAnswers.innerHTML =
                "";

        }


        /*
            Final result message.
        */

        let message =
            "";


        if (
            score === total
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


        /*
            Show result as the highlighted
            final game message.
        */

        if (quizFeedback) {

            quizFeedback.textContent =
                message;


            quizFeedback.className =
                "chapter5-quiz-feedback correct";

        }


        /*
            Hide button after result.
        */

        if (quizNext) {

            quizNext.hidden =
                true;


            quizNext.disabled =
                true;

        }


        /*
            Mark game complete.
        */

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
            Start Game 1.
        */

        if (
            gameName ===
            "heart"
        ) {

            if (
                !state.heartCompleted &&
                heartBoard &&
                heartBoard.children.length === 0
            ) {

                createHeartHunt();

            }

        }


        /*
            Start Game 2.
        */

        if (
            gameName ===
            "memory"
        ) {

            if (
                !state.memoryCompleted &&
                memoryBoard &&
                memoryBoard.children.length === 0
            ) {

                createMemoryGame();

            }

        }


        /*
            Start Game 3.
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
        message,
        highlight = false
    ) {

        if (!board) {

            return;

        }


        /*
            Find existing message inside
            the game's parent.
        */

        let messageElement =
            board.parentElement.querySelector(
                ".chapter5-game-message"
            );


        /*
            Create if necessary.
        */

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


        /*
            Update message.
        */

        messageElement.textContent =
            message;


        /*
            Highlight final result.
        */

        messageElement.classList.toggle(
            "result",
            highlight
        );


        messageElement.classList.add(
            "show"
        );

    }


    function removeGameMessage(
        element
    ) {

        if (!element) {

            return;

        }


        /*
            If the supplied element itself
            is the message, remove its state.
        */

        if (
            element.classList &&
            element.classList.contains(
                "chapter5-game-message"
            )
        ) {

            element.classList.remove(
                "show"
            );

            element.classList.remove(
                "result"
            );

            element.textContent =
                "";

            return;

        }


        /*
            Otherwise search its parent.
        */

        const parent =
            element.parentElement;


        if (!parent) {

            return;

        }


        const message =
            parent.querySelector(
                ".chapter5-game-message"
            );


        if (message) {

            message.classList.remove(
                "show"
            );


            message.classList.remove(
                "result"
            );


            message.textContent =
                "";

        }

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


        /*
            Reveal completion section.
        */

        completion.hidden =
            false;


        completion.classList.add(
            "show"
        );


        /*
            Scroll gently toward completion.
        */

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
            let i = array.length - 1;
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
       CHAPTER 5 → CHAPTER 6
       CONTINUE BUTTON
       ====================================================== */

    if (chapter5Continue) {

        chapter5Continue.addEventListener(
            "click",
            () => {

                console.log(
                    "💌 Chapter 5 Continue button clicked."
                );


                /*
                    Find Chapter 6.
                */

                const chapter6 =
                    document.getElementById(
                        "chapter6"
                    );


                /*
                    Chapter 6 must exist in index.html.
                */

                if (!chapter6) {

                    console.error(
                        "❌ Chapter 6 was not found in index.html."
                    );


                    alert(
                        'Chapter 6 could not be found. Please make sure <main id="chapter6"> exists in index.html.'
                    );


                    return;

                }


                console.log(
                    "📖 Opening Chapter 6..."
                );


                /*
                    --------------------------------------------------
                    TRY EXISTING TRANSITION SYSTEM FIRST
                    --------------------------------------------------
                */

                if (
                    typeof transitionToChapter ===
                    "function"
                ) {

                    try {

                        transitionToChapter(
                            6
                        );


                        /*
                            Give transition.js time
                            to handle Chapter 6.

                            transition.js currently does not
                            directly open Chapter 6, so if
                            Chapter 6 is still hidden,
                            use the direct fallback.
                        */

                        setTimeout(
                            () => {

                                const chapter6Visible =
                                    chapter6.style.display !==
                                        "none" &&
                                    getComputedStyle(
                                        chapter6
                                    ).display !==
                                        "none";


                                if (
                                    !chapter6Visible
                                ) {

                                    console.warn(
                                        "⚠️ transitionToChapter(6) did not open Chapter 6. Using direct navigation."
                                    );


                                    openChapter6Directly();

                                }

                            },
                            700
                        );


                        return;

                    }

                    catch (error) {

                        console.error(
                            "❌ transitionToChapter(6) failed:",
                            error
                        );

                        /*
                            Continue to direct navigation.
                        */

                    }

                }


                /*
                    --------------------------------------------------
                    DIRECT NAVIGATION FALLBACK
                    --------------------------------------------------
                */

                openChapter6Directly();

            }
        );

    }


    /* ======================================================
       DIRECTLY OPEN CHAPTER 6
       ====================================================== */

    function openChapter6Directly() {

        const chapter6 =
            document.getElementById(
                "chapter6"
            );


        if (!chapter6) {

            console.error(
                "❌ Cannot open Chapter 6 because #chapter6 does not exist."
            );


            return;

        }


        /*
            Hide every chapter.
        */

        const chapters =
            document.querySelectorAll(
                "main[id^='chapter']"
            );


        chapters.forEach(
            chapter => {

                if (
                    chapter !== chapter6
                ) {

                    chapter.style.display =
                        "none";

                }

            }
        );


        /*
            Show Chapter 6.
        */

        chapter6.style.display =
            "block";


        /*
            Make sure Chapter 6
            uses the browser document
            for scrolling.
        */

        chapter6.style.height =
            "auto";


        chapter6.style.minHeight =
            "100vh";


        chapter6.style.overflowX =
            "hidden";


        chapter6.style.overflowY =
            "visible";


        /*
            Restore normal browser scrolling.
        */

        document.documentElement.style.height =
            "auto";


        document.documentElement.style.overflowY =
            "auto";


        document.body.style.height =
            "auto";


        document.body.style.overflowY =
            "auto";


        document.body.style.overflowX =
            "hidden";


        /*
            Reset page position.
        */

        if (
            typeof window.scrollTo ===
            "function"
        ) {

            window.scrollTo({

                top: 0,

                behavior: "instant"

            });

        }


        /*
            Update application state.
        */

        if (
            typeof setChapter ===
            "function"
        ) {

            setChapter(
                6
            );

        }


        /*
            Fire chapterChange.

            This allows other chapter modules
            to respond to Chapter 6 being opened.
        */

        document.dispatchEvent(
            new CustomEvent(
                "chapterChange",
                {

                    detail: {

                        chapter: 6

                    }

                }
            )
        );


        console.log(
            "✨ Chapter 6 opened successfully."
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
        Make sure the correct game panel
        is active.
    */

    switchGame(
        "heart"
    );


    console.log(
        "Chapter V — Mini Games initialized ♡"
    );

});
