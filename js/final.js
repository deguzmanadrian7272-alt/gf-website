/* ==========================================================
   FINAL.JS
   Project : Our Story
   Purpose : Final Chapter — The Question / Ending
   Chapter : Final
   ========================================================== */


/* ==========================================================
   INSTAGRAM LINK
========================================================== */

/*
    ==========================================================
    EDIT THIS LINK ONLY
    ==========================================================

    Replace the URL below with your actual Instagram profile.

    Example:

    const INSTAGRAM_URL =
        "https://www.instagram.com/yourusername/";

*/

const INSTAGRAM_URL =
    "https://www.instagram.com/YOUR_USERNAME_HERE/";


/* ==========================================================
   FINAL CHAPTER INITIALIZATION
========================================================== */

function initFinalChapter() {

    console.log(
        "💗 Initializing Final Chapter..."
    );


    /* ======================================================
       FINAL CHAPTER ELEMENT
    ====================================================== */

    const finalChapter =
        document.getElementById(
            "finalChapter"
        );


    if (!finalChapter) {

        console.warn(
            "⚠️ Final Chapter element not found."
        );

        return;

    }


    /* ======================================================
       FINAL CHAPTER ELEMENTS
    ====================================================== */

    const noButton =
        document.getElementById(
            "finalNoBtn"
        );


    const yesButton =
        document.getElementById(
            "finalYesBtn"
        );


    const questionSection =
        document.getElementById(
            "finalQuestion"
        );


    const successSection =
        document.getElementById(
            "finalYesResponse"
        );


    const messageButton =
        document.getElementById(
            "finalMessageBtn"
        );


    const answerArea =
        document.getElementById(
            "finalAnswerArea"
        );


    const hint =
        document.getElementById(
            "finalHint"
        );


    /* ======================================================
       SAFETY CHECK
    ====================================================== */

    if (!noButton) {

        console.warn(
            "⚠️ Final Chapter NO button not found."
        );

    }


    if (!yesButton) {

        console.warn(
            "⚠️ Final Chapter YES button not found."
        );

    }


    if (!questionSection) {

        console.warn(
            "⚠️ Final question section not found."
        );

    }


    if (!successSection) {

        console.warn(
            "⚠️ Final success section not found."
        );

    }


    /* ======================================================
       FINAL CHAPTER STATE
    ====================================================== */

    const state = {

        noClicks: 0,

        maxNoClicks: 3,

        answered: false

    };


    /* ======================================================
       NO BUTTON SIZES
    ====================================================== */

    const noButtonSizes = [

        "1",

        "0.65",

        "0.35"

    ];


    /* ======================================================
       YES BUTTON SIZES
    ====================================================== */

    const yesButtonSizes = [

        "1",

        "1.12",

        "1.28"

    ];


    /* ======================================================
       INITIAL STATE
    ====================================================== */

    /*
        The final success response must begin hidden.
    */

    if (successSection) {

        successSection.hidden =
            true;

        successSection.classList.remove(
            "show"
        );

    }


    /*
        Reset question section.
    */

    if (questionSection) {

        questionSection.classList.remove(
            "question-complete"
        );

    }


    /*
        Reset NO button.
    */

    if (noButton) {

        noButton.style.display =
            "";

        noButton.style.transform =
            "scale(1)";

        noButton.disabled =
            false;

        noButton.removeAttribute(
            "aria-hidden"
        );

        noButton.classList.remove(
            "disappearing"
        );

    }


    /*
        Reset YES button.
    */

    if (yesButton) {

        yesButton.style.transform =
            "scale(1)";

        yesButton.disabled =
            false;

        yesButton.classList.remove(
            "yes-final"
        );

    }


    /*
        Reset hint.
    */

    if (hint) {

        hint.textContent =
            "";

    }


    /* ======================================================
       NO BUTTON CLICK
    ====================================================== */

    if (noButton) {

        noButton.addEventListener(
            "click",
            handleNoClick
        );

    }


    function handleNoClick() {

        /*
            Do nothing after she has answered.
        */

        if (
            state.answered
        ) {

            return;

        }


        /*
            Increase NO click count.
        */

        state.noClicks++;


        console.log(
            `💭 NO clicked ${state.noClicks} time(s).`
        );


        /* ==================================================
           OPTIONAL HINT TEXT
        ================================================== */

        if (hint) {

            if (
                state.noClicks === 1
            ) {

                hint.textContent =
                    "Are you sure? ♡";

            }

            else if (
                state.noClicks === 2
            ) {

                hint.textContent =
                    "Maybe think about it again... ♡";

            }

            else if (
                state.noClicks >=
                state.maxNoClicks
            ) {

                hint.textContent =
                    "I think the NO button has given up... ♡";

            }

        }


        /* ==================================================
           FIRST / SECOND CLICK
        ================================================== */

        if (
            state.noClicks <
            state.maxNoClicks
        ) {

            const sizeIndex =
                state.noClicks - 1;


            const newSize =
                noButtonSizes[
                    sizeIndex
                ];


            const yesSize =
                yesButtonSizes[
                    sizeIndex
                ];


            /*
                Make NO smaller.
            */

            noButton.style.transform =
                `scale(${newSize})`;


            /*
                Make YES bigger.
            */

            if (yesButton) {

                yesButton.style.transform =
                    `scale(${yesSize})`;

            }


            /*
                Add shrinking animation.
            */

            noButton.classList.add(
                "shrinking"
            );


            /*
                Restart animation.
            */

            void noButton.offsetWidth;


            noButton.classList.remove(
                "shrinking"
            );


            /*
                Add emphasis to YES.
            */

            if (yesButton) {

                yesButton.classList.add(
                    "yes-growing"
                );


                void yesButton.offsetWidth;


                yesButton.classList.remove(
                    "yes-growing"
                );

            }


            return;

        }


        /* ==================================================
           THIRD CLICK
        ================================================== */

        if (
            state.noClicks >=
            state.maxNoClicks
        ) {

            /*
                Make NO disappear.
            */

            noButton.classList.add(
                "disappearing"
            );


            /*
                Make YES the largest button.
            */

            if (yesButton) {

                yesButton.style.transform =
                    "scale(1.42)";


                yesButton.classList.add(
                    "yes-final"
                );

            }


            /*
                Disable NO.
            */

            noButton.disabled =
                true;


            noButton.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
                Wait for the animation
                before removing it visually.
            */

            setTimeout(
                () => {

                    noButton.style.display =
                        "none";

                },
                500
            );


            console.log(
                "💗 NO button has disappeared."
            );

        }

    }


    /* ======================================================
       YES BUTTON CLICK
    ====================================================== */

    if (yesButton) {

        yesButton.addEventListener(
            "click",
            handleYesClick
        );

    }


    function handleYesClick() {

        /*
            Prevent multiple clicks.
        */

        if (
            state.answered
        ) {

            return;

        }


        state.answered =
            true;


        console.log(
            "💗 SHE SAID YES!"
        );


        /*
            Disable YES.
        */

        yesButton.disabled =
            true;


        /*
            Disable NO as well.
        */

        if (noButton) {

            noButton.disabled =
                true;

        }


        /*
            Hide the answer buttons.
        */

        if (answerArea) {

            answerArea.classList.add(
                "answer-complete"
            );

        }


        /*
            Complete the question section.
        */

        if (questionSection) {

            questionSection.classList.add(
                "question-complete"
            );

        }


        /*
            Show success screen after
            a short emotional delay.
        */

        setTimeout(
            () => {

                showSuccessScreen();

            },
            700
        );

    }


    /* ======================================================
       SHOW SUCCESS SCREEN
    ====================================================== */

    function showSuccessScreen() {

        if (!successSection) {

            console.warn(
                "⚠️ Final success section not found."
            );

            return;

        }


        /*
            Make success section visible.
        */

        successSection.hidden =
            false;


        /*
            Add animation class
            on the next frame.
        */

        requestAnimationFrame(
            () => {

                successSection.classList.add(
                    "show"
                );

            }
        );


        /*
            Scroll toward success message.
        */

        setTimeout(
            () => {

                successSection.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            },
            400
        );


        /*
            Create heart celebration.
        */

        createHeartCelebration();


        console.log(
            "💕 Final Chapter success screen shown."
        );

    }


    /* ======================================================
       HEART CELEBRATION
    ====================================================== */

    function createHeartCelebration() {

        /*
            Prevent duplicate celebrations.
        */

        const existingCelebration =
            finalChapter.querySelector(
                ".final-heart-celebration"
            );


        if (existingCelebration) {

            existingCelebration.remove();

        }


        const container =
            document.createElement(
                "div"
            );


        container.className =
            "final-heart-celebration";


        /*
            Create floating hearts.
        */

        const hearts = [

            "♡",

            "♥",

            "♡",

            "✦",

            "♥",

            "♡",

            "✧",

            "♥",

            "♡",

            "✦",

            "♥",

            "♡"

        ];


        hearts.forEach(
            (symbol) => {

                const heart =
                    document.createElement(
                        "span"
                    );


                heart.className =
                    "final-floating-heart";


                heart.textContent =
                    symbol;


                /*
                    Random horizontal position.
                */

                heart.style.left =
                    `${Math.random() * 100}%`;


                /*
                    Random animation delay.
                */

                heart.style.animationDelay =
                    `${Math.random() * 1.5}s`;


                /*
                    Slightly different duration.
                */

                heart.style.animationDuration =
                    `${3 + Math.random() * 2}s`;


                container.appendChild(
                    heart
                );

            }
        );


        finalChapter.appendChild(
            container
        );


        /*
            Remove celebration after
            animation finishes.
        */

        setTimeout(
            () => {

                if (
                    container &&
                    container.parentNode
                ) {

                    container.remove();

                }

            },
            6000
        );

    }


    /* ======================================================
       MESSAGE ME BUTTON
    ====================================================== */

    if (messageButton) {

        /*
            Keep the HTML link synchronized
            with the URL above.
        */

        if (
            INSTAGRAM_URL &&
            !INSTAGRAM_URL.includes(
                "YOUR_USERNAME_HERE"
            )
        ) {

            messageButton.href =
                INSTAGRAM_URL;

        }


        messageButton.addEventListener(
            "click",
            handleMessageClick
        );

    }


    function handleMessageClick(event) {

        /*
            Make sure Instagram URL
            has been updated.
        */

        if (
            !INSTAGRAM_URL ||
            INSTAGRAM_URL.includes(
                "YOUR_USERNAME_HERE"
            )
        ) {

            event.preventDefault();


            console.warn(
                "⚠️ Instagram link has not been updated yet."
            );


            alert(
                "Please update the Instagram link in final.js first. ♡"
            );


            return;

        }


        console.log(
            "📱 Opening Instagram..."
        );

    }


    /* ======================================================
       FINAL CHAPTER READY
    ====================================================== */

    console.log(
        "✨ Final Chapter — The Question initialized ♡"
    );

}


/* ==========================================================
   INITIALIZATION
========================================================== */

/*
    Check whether the DOM is already ready.

    This makes final.js safe whether it is loaded
    before or after DOMContentLoaded.
*/

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initFinalChapter
    );

}

else {

    initFinalChapter();

}
