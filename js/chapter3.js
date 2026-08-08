/* ==========================================================
   CHAPTER III — POETRY
   Project : Our Story
   Purpose : Chapter 3 - Poetry
   ========================================================== */


/* ==========================================================
   CHAPTER 3 STATE
   ========================================================== */

const Chapter3State = {

    initialized: false,

    started: false,

    finished: false

};


/* ==========================================================
   INITIALIZE CHAPTER 3
   ========================================================== */

function initChapter3() {

    /*
        Prevent duplicate initialization.
    */

    if (Chapter3State.initialized) {

        return;

    }


    const chapter =
        document.getElementById("chapter3");


    /*
        Safety check.
    */

    if (!chapter) {

        console.warn(
            "Chapter 3 element was not found."
        );

        return;

    }


    /*
        Find Continue button.
    */

    const continueButton =
        document.getElementById(
            "chapter3Continue"
        );


    /*
        Connect Continue button.
    */

    if (continueButton) {

        /*
            Remove any previous copy of
            the listener before adding it.

            This prevents duplicate clicks.
        */

        continueButton.addEventListener(
            "click",
            handleChapter3Continue
        );

    }


    /*
        Prepare Chapter 3.
    */

    prepareChapter3();


    /*
        Create visual sparkles.
    */

    createChapter3Sparkles();


    /*
        Listen for chapter changes.
    */

    document.addEventListener(
        "chapterChange",
        handleChapter3Change
    );


    Chapter3State.initialized =
        true;


    console.log(
        "🌹 Chapter 3 initialized."
    );

}


/* ==========================================================
   PREPARE CHAPTER 3
   ========================================================== */

function prepareChapter3() {

    const chapter =
        document.getElementById(
            "chapter3"
        );


    if (!chapter) {

        return;

    }


    /*
        Chapter 3 starts hidden.
    */

    chapter.style.display =
        "none";


    /*
        Reset Chapter 3 scroll position.

        IMPORTANT:
        The scroll belongs to #chapter3,
        NOT .chapter3-wrapper.
    */

    chapter.scrollTop =
        0;


    /*
        Make Continue button interactive.
    */

    const continueButton =
        document.getElementById(
            "chapter3Continue"
        );


    if (continueButton) {

        continueButton.style.pointerEvents =
            "auto";

        continueButton.disabled =
            false;

    }

}


/* ==========================================================
   CHAPTER CHANGE HANDLER
   ========================================================== */

function handleChapter3Change(event) {

    if (
        !event ||
        !event.detail
    ) {

        return;

    }


    /*
        Support both:

        detail: {
            chapter: 3
        }

        and

        detail: {
            chapter: "3"
        }
    */

    const chapterNumber =
        Number(
            event.detail.chapter
        );


    /*
        Only respond to Chapter 3.
    */

    if (
        chapterNumber !== 3
    ) {

        return;

    }


    openChapter3Screen();

}


/* ==========================================================
   OPEN CHAPTER 3
   ========================================================== */

function openChapter3Screen() {

    const chapter =
        document.getElementById(
            "chapter3"
        );


    if (!chapter) {

        console.warn(
            "Chapter 3 screen does not exist."
        );

        return;

    }


    /*
        Hide all other chapters.
    */

    hideOtherChapters();


    /*
        Show Chapter 3.
    */

    chapter.style.display =
        "block";


    /*
        Mark Chapter 3 as started.
    */

    Chapter3State.started =
        true;


    /*
        Reset completion state
        whenever Chapter 3 opens.
    */

    Chapter3State.finished =
        false;


    /*
        Reset scroll position.

        #chapter3 is the actual
        scrolling container.
    */

    chapter.scrollTop =
        0;


    /*
        Animate the chapter.
    */

    animateChapter3Entrance();


    console.log(
        "🌹 Chapter 3 opened."
    );

}


/* ==========================================================
   HIDE OTHER CHAPTERS
   ========================================================== */

function hideOtherChapters() {

    const chapters =
        document.querySelectorAll(
            "main[id^='chapter']"
        );


    chapters.forEach(
        (chapter) => {

            if (
                chapter.id !== "chapter3"
            ) {

                chapter.style.display =
                    "none";

            }

        }
    );

}


/* ==========================================================
   CHAPTER 3 ENTRANCE ANIMATION
   ========================================================== */

function animateChapter3Entrance() {

    const intro =
        document.querySelector(
            "#chapter3 .chapter3-intro"
        );


    const poems =
        document.querySelectorAll(
            "#chapter3 .chapter3-poem"
        );


    const ending =
        document.querySelector(
            "#chapter3 .chapter3-ending"
        );


    const continueButton =
        document.getElementById(
            "chapter3Continue"
        );


    /*
        GSAP animation.
    */

    if (
        typeof gsap !== "undefined"
    ) {


        /* ------------------------------------------
           INTRO
           ------------------------------------------ */

        if (intro) {

            gsap.fromTo(

                intro,

                {
                    opacity: 0,

                    y: 35
                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1.2,

                    ease: "power3.out"
                }

            );

        }


        /* ------------------------------------------
           POEMS
           ------------------------------------------ */

        if (poems.length) {

            gsap.fromTo(

                poems,

                {
                    opacity: 0,

                    y: 40
                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1,

                    stagger: 0.25,

                    delay: 0.35,

                    ease: "power3.out"
                }

            );

        }


        /* ------------------------------------------
           ENDING
           ------------------------------------------ */

        if (ending) {

            gsap.fromTo(

                ending,

                {
                    opacity: 0,

                    y: 30
                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1,

                    delay: 0.9,

                    ease: "power3.out"
                }

            );

        }


        /* ------------------------------------------
           CONTINUE BUTTON
           ------------------------------------------ */

        if (continueButton) {

            gsap.fromTo(

                continueButton,

                {
                    opacity: 0,

                    y: 25
                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 0.9,

                    delay: 1.2,

                    ease: "power3.out"
                }

            );

        }


        return;

    }


    /*
        Fallback if GSAP isn't available.
    */

    if (intro) {

        intro.style.opacity =
            "1";

        intro.style.transform =
            "translateY(0)";

    }


    poems.forEach(
        (poem) => {

            poem.style.opacity =
                "1";

            poem.style.transform =
                "translateY(0)";

        }
    );


    if (ending) {

        ending.style.opacity =
            "1";

        ending.style.transform =
            "translateY(0)";

    }


    if (continueButton) {

        continueButton.style.opacity =
            "1";

        continueButton.style.transform =
            "translateY(0)";

    }

}


/* ==========================================================
   CREATE CHAPTER 3 SPARKLES
   ========================================================== */

function createChapter3Sparkles() {

    const background =
        document.querySelector(
            "#chapter3 .chapter3-background"
        );


    if (!background) {

        return;

    }


    /*
        Prevent duplicate sparkles.
    */

    if (
        background.dataset.sparklesCreated ===
        "true"
    ) {

        return;

    }


    const sparkleCount =
        18;


    for (
        let i = 0;
        i < sparkleCount;
        i++
    ) {


        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "chapter3-sparkle";


        sparkle.textContent =
            Math.random() > 0.5
                ? "✦"
                : "✧";


        sparkle.style.position =
            "absolute";


        sparkle.style.left =
            `${Math.random() * 100}%`;


        sparkle.style.top =
            `${Math.random() * 100}%`;


        sparkle.style.fontSize =
            `${0.35 + Math.random() * 0.55}rem`;


        sparkle.style.color =
            "rgba(255, 215, 235, 0.45)";


        sparkle.style.pointerEvents =
            "none";


        sparkle.style.userSelect =
            "none";


        sparkle.style.animation =
            "chapter3SparkleFloat " +
            `${4 + Math.random() * 6}s ` +
            "ease-in-out infinite";


        sparkle.style.animationDelay =
            `${Math.random() * 5}s`;


        background.appendChild(
            sparkle
        );

    }


    background.dataset.sparklesCreated =
        "true";


    /*
        Create sparkle animation
        only once.
    */

    if (
        !document.getElementById(
            "chapter3-sparkle-animation"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "chapter3-sparkle-animation";


        style.textContent = `

            @keyframes chapter3SparkleFloat {

                0% {

                    opacity: 0;

                    transform:
                        translateY(15px)
                        scale(0.7);

                }

                40% {

                    opacity: 0.65;

                }

                70% {

                    opacity: 0.3;

                }

                100% {

                    opacity: 0;

                    transform:
                        translateY(-25px)
                        scale(1.1);

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}


/* ==========================================================
   CONTINUE TO CHAPTER 4
   ========================================================== */

function handleChapter3Continue() {

    /*
        Prevent multiple clicks.
    */

    if (
        Chapter3State.finished
    ) {

        return;

    }


    const button =
        document.getElementById(
            "chapter3Continue"
        );


    /*
        Mark Chapter 3 as complete.
    */

    Chapter3State.finished =
        true;


    /*
        Temporarily disable button.
    */

    if (button) {

        button.style.pointerEvents =
            "none";

        button.disabled =
            true;

    }


    console.log(
        "💌 Chapter 3 complete."
    );


    /* ======================================================
       OPTION 1 — USE EXISTING TRANSITION SYSTEM
       ====================================================== */

    if (
        typeof transitionToChapter ===
        "function"
    ) {

        console.log(
            "➡️ Transitioning to Chapter 4..."
        );


        /*
            Give the transition system
            Chapter 4.

            Small timeout allows the
            button interaction to finish
            cleanly before transition.
        */

        setTimeout(
            () => {

                transitionToChapter(4);

            },

            50

        );


        return;

    }


    /* ======================================================
       OPTION 2 — DIRECT CHAPTER 4 FALLBACK
       ====================================================== */

    const chapter4 =
        document.getElementById(
            "chapter4"
        );


    if (chapter4) {

        console.log(
            "➡️ Transition system unavailable."
        );

        console.log(
            "➡️ Opening Chapter 4 directly."
        );


        /*
            Hide all chapters.
        */

        document
            .querySelectorAll(
                "main[id^='chapter']"
            )
            .forEach(
                (chapter) => {

                    chapter.style.display =
                        "none";

                }
            );


        /*
            Show Chapter 4.
        */

        chapter4.style.display =
            "block";


        /*
            Reset Chapter 4 scroll.
        */

        chapter4.scrollTop =
            0;


        /*
            Dispatch chapterChange event
            so Chapter 4's JS can react.
        */

        document.dispatchEvent(

            new CustomEvent(
                "chapterChange",
                {
                    detail: {
                        chapter: 4
                    }
                }
            )

        );


        /*
            Reset Chapter 3 state.
        */

        Chapter3State.finished =
            false;


        return;

    }


    /* ======================================================
       CHAPTER 4 DOES NOT EXIST
       ====================================================== */

    console.warn(
        "Chapter IV is not available yet."
    );


    /*
        Restore button if Chapter 4
        cannot be found.
    */

    if (button) {

        button.style.pointerEvents =
            "auto";

        button.disabled =
            false;

    }


    Chapter3State.finished =
        false;

}


/* ==========================================================
   RESET CHAPTER 3
   ========================================================== */

function resetChapter3() {

    Chapter3State.started =
        false;


    Chapter3State.finished =
        false;


    const chapter =
        document.getElementById(
            "chapter3"
        );


    if (!chapter) {

        return;

    }


    /*
        Reset scroll.
    */

    chapter.scrollTop =
        0;


    /*
        Reset Continue button.
    */

    const button =
        document.getElementById(
            "chapter3Continue"
        );


    if (button) {

        button.style.pointerEvents =
            "auto";

        button.disabled =
            false;

    }


    /*
        Hide Chapter 3.
    */

    chapter.style.display =
        "none";

}


/* ==========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        const chapter =
            document.getElementById(
                "chapter3"
            );


        if (!chapter) {

            return;

        }


        /*
            Don't respond if Chapter 3
            isn't visible.
        */

        if (
            chapter.style.display ===
            "none"
        ) {

            return;

        }


        /*
            Enter key when Continue
            button is focused.
        */

        if (

            event.key === "Enter" &&

            document.activeElement &&

            document.activeElement.id ===
                "chapter3Continue"

        ) {

            event.preventDefault();

            handleChapter3Continue();

        }

    }
);


/* ==========================================================
   DOM READY
   ========================================================== */

/*
    This is important.

    It makes sure Chapter 3 actually
    initializes even if app.js does
    not call initChapter3().
*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initChapter3
    );

} else {

    initChapter3();

}
