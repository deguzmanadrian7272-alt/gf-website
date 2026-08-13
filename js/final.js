/* ==========================================================
   FINAL.JS
   Project : Our Story
   Purpose : Final Chapter — The Question / Ending
   Chapter : VII
   ========================================================== */


/* ==========================================================
   INSTAGRAM LINK
   ========================================================== */

/*
    ==========================================================
    EDIT THIS LINK ONLY
    ==========================================================

    Replace the URL below with your Instagram profile.

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
            "chapter7"
        );


    if (!finalChapter) {

        console.warn(
            "⚠️ Chapter VII element not found."
        );

        return;

    }


    /* ======================================================
       FINAL CHAPTER ELEMENTS
       ====================================================== */

    const noButton =
        document.getElementById(
            "finalNoButton"
        );


    const yesButton =
        document.getElementById(
            "finalYesButton"
        );


    const questionSection =
        document.getElementById(
            "finalQuestion"
        );


    const successSection =
        document.getElementById(
            "finalSuccess"
        );


    const messageButton =
        document.getElementById(
            "finalMessageButton"
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

    /*
        Each click makes the NO button smaller.

        0 = normal
        1 = smaller
        2 = tiny
        3 = gone
    */

    const noButtonSizes = [

        "1",

        "0.65",

        "0.35"

    ];


    /* ======================================================
       YES BUTTON SIZES
       ====================================================== */

    /*
        The YES button gradually becomes
        more visually dominant.
    */

    const yesButtonSizes = [

        "1",

        "1.12",

        "1.28"

    ];


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
            Don't allow NO to continue
            after the question has been answered.
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
                Add visual class.
            */

            noButton.classList.add(
                "shrinking"
            );


            /*
                Restart the animation.
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

        /*
            The third NO click makes
            the button disappear.
        */

        if (
            state.noClicks >=
            state.maxNoClicks
        ) {

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
                Wait for the disappearance
                animation before hiding it.
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
            Disable the YES button
            to prevent repeated triggering.
        */

        yesButton.disabled =
            true;


        /*
            Hide the question section
            with a CSS class.

            CSS will handle the actual
            animation.
        */

        if (questionSection) {

            questionSection.classList.add(
                "question-complete"
            );

        }


        /*
            Small delay makes the transition
            feel more emotional.
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
            Scroll toward the success message.
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

        const container =
            document.createElement(
                "div"
            );


        container.className =
            "final-heart-celebration";


        /*
            Create several floating hearts.
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
            (symbol, index) => {

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
                    Slightly different
                    animation duration.
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
            Remove the celebration
            after the animation.
        */

        setTimeout(
            () => {

                container.remove();

            },
            6000
        );

    }


    /* ======================================================
       MESSAGE ME BUTTON
       ====================================================== */

    if (messageButton) {

        messageButton.addEventListener(
            "click",
            handleMessageClick
        );

    }


    function handleMessageClick() {

        /*
            Make sure the user has
            actually provided an Instagram URL.
        */

        if (
            !INSTAGRAM_URL ||
            INSTAGRAM_URL.includes(
                "YOUR_USERNAME_HERE"
            )
        ) {

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


        /*
            Open Instagram in a new tab.
        */

        window.open(
            INSTAGRAM_URL,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* ======================================================
       INITIAL FINAL CHAPTER STATE
       ====================================================== */

    /*
        Make sure success screen is
        hidden when Chapter VII starts.
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


    console.log(
        "✨ Final Chapter — The Question initialized ♡"
    );

}


/* ==========================================================
   INITIALIZATION
========================================================== */

/*
    We check whether the DOM is already ready.

    This makes the file safe whether it is loaded
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
