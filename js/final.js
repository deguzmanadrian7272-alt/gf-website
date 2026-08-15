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

    const yesButton =
        document.getElementById(
            "finalYesBtn"
        );


    const noButton =
        document.getElementById(
            "finalNoBtn"
        );


    const questionSection =
        document.getElementById(
            "finalQuestion"
        );


    const answerArea =
        document.getElementById(
            "finalAnswerArea"
        );


    const hint =
        document.getElementById(
            "finalHint"
        );


    const successSection =
        document.getElementById(
            "finalYesResponse"
        );


    const messageButton =
        document.getElementById(
            "finalMessageBtn"
        );


    /* ======================================================
       SAFETY CHECKS
    ====================================================== */

    if (!yesButton) {

        console.warn(
            "⚠️ Final YES button not found."
        );

    }


    if (!noButton) {

        console.warn(
            "⚠️ Final NO button not found."
        );

    }


    if (!questionSection) {

        console.warn(
            "⚠️ Final question section not found."
        );

    }


    if (!answerArea) {

        console.warn(
            "⚠️ Final answer area not found."
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
       INITIALIZE SUCCESS SECTION
    ====================================================== */

    if (successSection) {

        successSection.hidden =
            true;

        successSection.classList.remove(
            "show"
        );

    }


    /* ======================================================
       INITIALIZE NO BUTTON
    ====================================================== */

    if (noButton) {

        noButton.disabled =
            false;

        noButton.style.display =
            "";

        noButton.style.opacity =
            "";

        noButton.style.transform =
            "scale(1)";

        noButton.removeAttribute(
            "aria-hidden"
        );

    }


    /* ======================================================
       INITIALIZE YES BUTTON
    ====================================================== */

    if (yesButton) {

        yesButton.disabled =
            false;

        yesButton.style.transform =
            "scale(1)";

    }


    /* ======================================================
       INITIALIZE HINT
    ====================================================== */

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
            Prevent interaction after YES.
        */

        if (
            state.answered
        ) {

            return;

        }


        /* ==================================================
           INCREASE NO COUNT
        ================================================== */

        state.noClicks++;


        console.log(
            `💭 NO clicked ${state.noClicks} time(s).`
        );


        /* ==================================================
           HINT TEXT
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

            else {

                hint.textContent =
                    "I think the NO button has given up... ♡";

            }

        }


        /* ==================================================
           SHRINK NO BUTTON
        ================================================== */

        if (
            state.noClicks === 1
        ) {

            noButton.style.transform =
                "scale(0.72)";

        }

        else if (
            state.noClicks === 2
        ) {

            noButton.style.transform =
                "scale(0.44)";

        }


        /* ==================================================
           GROW YES BUTTON
        ================================================== */

        if (yesButton) {

            if (
                state.noClicks === 1
            ) {

                yesButton.style.transform =
                    "scale(1.08)";

            }

            else if (
                state.noClicks === 2
            ) {

                yesButton.style.transform =
                    "scale(1.18)";

            }

        }


        /* ==================================================
           THIRD NO CLICK
        ================================================== */

        if (
            state.noClicks >=
            state.maxNoClicks
        ) {

            /*
                Make NO disappear.
            */

            noButton.style.transform =
                "scale(0)";

            noButton.style.opacity =
                "0";

            noButton.disabled =
                true;

            noButton.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
                Remove NO from interaction
                after the visual transition.
            */

            setTimeout(
                () => {

                    noButton.style.display =
                        "none";

                },
                500
            );


            /*
                Make YES the main choice.
            */

            if (yesButton) {

                yesButton.style.transform =
                    "scale(1.32)";

            }


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
            Prevent multiple answers.
        */

        if (
            state.answered
        ) {

            return;

        }


        /* ==================================================
           SET ANSWERED STATE
        ================================================== */

        state.answered =
            true;


        console.log(
            "💗 SHE SAID YES!"
        );


        /* ==================================================
           DISABLE BUTTONS
        ================================================== */

        yesButton.disabled =
            true;


        if (noButton) {

            noButton.disabled =
                true;

        }


        /* ==================================================
           HIDE ANSWER AREA
        ================================================== */

        if (answerArea) {

            answerArea.style.opacity =
                "0";

            answerArea.style.transform =
                "translateY(-10px)";

            answerArea.style.pointerEvents =
                "none";

            answerArea.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";

        }


        /* ==================================================
           HIDE QUESTION CARD CONTENT
        ================================================== */

        if (questionSection) {

            questionSection.classList.add(
                "answered"
            );

        }


        /* ==================================================
           SHOW SUCCESS AFTER DELAY
        ================================================== */

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


        /* ==================================================
           SHOW SUCCESS SECTION
        ================================================== */

        successSection.hidden =
            false;


        /*
            Trigger CSS animation
            on the next rendering frame.
        */

        requestAnimationFrame(
            () => {

                successSection.classList.add(
                    "show"
                );

            }
        );


        /* ==================================================
           HEART CELEBRATION
        ================================================== */

        createHeartCelebration();


        /* ==================================================
           SCROLL TO SUCCESS
        ================================================== */

        setTimeout(
            () => {

                successSection.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            },
            450
        );


        console.log(
            "💕 Final Chapter success screen shown."
        );

    }


    /* ======================================================
       HEART CELEBRATION
    ====================================================== */

    function createHeartCelebration() {

        /*
            Remove an existing celebration first.
        */

        const existingCelebration =
            finalChapter.querySelector(
                ".final-heart-celebration"
            );


        if (existingCelebration) {

            existingCelebration.remove();

        }


        /* ==================================================
           CREATE CONTAINER
        ================================================== */

        const container =
            document.createElement(
                "div"
            );


        container.className =
            "final-heart-celebration";


        container.setAttribute(
            "aria-hidden",
            "true"
        );


        /* ==================================================
           HEART SYMBOLS
        ================================================== */

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


        /* ==================================================
           CREATE FLOATING HEARTS
        ================================================== */

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
                    Random animation duration.
                */

                heart.style.animationDuration =
                    `${3 + Math.random() * 2}s`;


                container.appendChild(
                    heart
                );

            }
        );


        /* ==================================================
           ADD TO FINAL CHAPTER
        ================================================== */

        finalChapter.appendChild(
            container
        );


        /* ==================================================
           CLEANUP
        ================================================== */

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
            Prevent opening the placeholder URL.
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
    This allows final.js to work whether it is loaded
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
