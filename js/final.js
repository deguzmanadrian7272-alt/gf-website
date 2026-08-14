/* ==========================================================
   FINAL.JS
   Project : Our Story
   Purpose : Final Chapter — The Question / Ending
   Chapter : FINAL
   ========================================================== */


/* ==========================================================
   INSTAGRAM LINK
   ========================================================== */

/*
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

    /*
        IMPORTANT:

        Final Chapter uses #chapter8.

        This matches final.css.

        We DO NOT force the chapter to become
        visible here.

        Visibility is controlled by the
        existing chapter navigation system
        through the .active class.
    */

    const finalChapter =
        document.getElementById(
            "chapter8"
        );


    if (!finalChapter) {

        console.warn(
            "⚠️ Final Chapter #chapter8 not found."
        );

        return;

    }


    /* ======================================================
       FINAL CHAPTER ELEMENTS
       ====================================================== */

    /*
        These IDs match final.css.
    */

    const noButton =
        document.getElementById(
            "chapter7No"
        );


    const yesButton =
        document.getElementById(
            "chapter7Yes"
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
            "chapter7Message"
        );


    /* ======================================================
       SAFETY CHECKS
       ====================================================== */

    if (!noButton) {

        console.warn(
            "⚠️ Final Chapter NO button #chapter7No not found."
        );

    }


    if (!yesButton) {

        console.warn(
            "⚠️ Final Chapter YES button #chapter7Yes not found."
        );

    }


    if (!questionSection) {

        console.warn(
            "⚠️ Final question section #finalQuestion not found."
        );

    }


    if (!successSection) {

        console.warn(
            "⚠️ Final success section #finalSuccess not found."
        );

    }


    if (!messageButton) {

        console.warn(
            "⚠️ Final message button #chapter7Message not found."
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
       INITIAL STATE
       ====================================================== */

    /*
        Success screen starts hidden.

        IMPORTANT:

        We only control the SUCCESS SECTION here.

        We do NOT hide/show #chapter8 itself.

        The chapter navigation system controls
        #chapter8.active.
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
            "";

        noButton.disabled =
            false;

        noButton.removeAttribute(
            "aria-hidden"
        );

        noButton.classList.remove(
            "shrink-1",
            "shrink-2",
            "shrink-3"
        );

    }


    /*
        Reset YES button.
    */

    if (yesButton) {

        yesButton.style.transform =
            "";

        yesButton.disabled =
            false;

        yesButton.classList.remove(
            "grow-1",
            "grow-2",
            "grow-3"
        );

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
            Don't allow NO to continue
            after the question has been answered.
        */

        if (
            state.answered
        ) {

            return;

        }


        /*
            Increase click count.
        */

        state.noClicks++;


        console.log(
            `💭 NO clicked ${state.noClicks} time(s).`
        );


        /* ==================================================
           FIRST CLICK
           ================================================== */

        if (
            state.noClicks === 1
        ) {

            /*
                Remove any previous state.
            */

            noButton.classList.remove(
                "shrink-2",
                "shrink-3"
            );


            /*
                Make NO smaller.
            */

            noButton.classList.add(
                "shrink-1"
            );


            /*
                Make YES slightly larger.
            */

            if (yesButton) {

                yesButton.classList.remove(
                    "grow-2",
                    "grow-3"
                );

                yesButton.classList.add(
                    "grow-1"
                );

            }

            return;

        }


        /* ==================================================
           SECOND CLICK
           ================================================== */

        if (
            state.noClicks === 2
        ) {

            /*
                Make NO even smaller.
            */

            noButton.classList.remove(
                "shrink-1",
                "shrink-3"
            );

            noButton.classList.add(
                "shrink-2"
            );


            /*
                Make YES larger.
            */

            if (yesButton) {

                yesButton.classList.remove(
                    "grow-1",
                    "grow-3"
                );

                yesButton.classList.add(
                    "grow-2"
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

            noButton.classList.remove(
                "shrink-1",
                "shrink-2"
            );

            noButton.classList.add(
                "shrink-3"
            );


            /*
                Make YES the dominant button.
            */

            if (yesButton) {

                yesButton.classList.remove(
                    "grow-1",
                    "grow-2"
                );

                yesButton.classList.add(
                    "grow-3"
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
                After the CSS transition,
                completely remove it from layout.
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
            Hide/complete the question section.

            The CSS associated with this class
            can handle the visual transition.
        */

        if (questionSection) {

            questionSection.classList.add(
                "question-complete"
            );

        }


        /*
            Give the question a moment
            before showing the success message.
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
            Trigger CSS animation
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
            Scroll to the success message.
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
            Floating heart symbols.
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
                    Random animation duration.
                */

                heart.style.animationDuration =
                    `${3 + Math.random() * 2}s`;


                container.appendChild(
                    heart
                );

            }
        );


        /*
            Add celebration to FINAL CHAPTER,
            not to the entire document.
        */

        finalChapter.appendChild(
            container
        );


        /*
            Remove celebration after animation.
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
            Make sure Instagram URL
            has been updated.
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
       FINAL INITIALIZATION COMPLETE
       ====================================================== */

    console.log(
        "✨ Final Chapter — The Question initialized ♡"
    );

}


/* ==========================================================
   DOM INITIALIZATION
   ========================================================== */

/*
    Safe whether final.js is loaded
    before or after the DOM.
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
