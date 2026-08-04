/* ==========================================================
   CHAPTER0.JS
   Project : Our Story
   Purpose : Chapter 0 - Welcome
========================================================== */


/* ==========================================================
   CHAPTER 0 SETTINGS
========================================================== */

const Chapter0Settings = {

    greetingDelay: 300,

    line1Delay: 900,

    line2Delay: 1900,

    buttonDelay: 3000,

    transitionDelay: 500

};


/* ==========================================================
   CHAPTER 0 STATE
========================================================== */

const Chapter0State = {

    initialized: false,

    started: false

};


/* ==========================================================
   INITIALIZE CHAPTER 0
========================================================== */

function initChapter0() {

    const chapter =
        document.getElementById("chapter0");


    const greeting =
        document.getElementById("greeting");


    const line1 =
        document.getElementById("line1");


    const line2 =
        document.getElementById("line2");


    const startButton =
        document.getElementById("startBtn");


    /*
        Safety check.
    */

    if (
        !chapter ||
        !greeting ||
        !line1 ||
        !line2 ||
        !startButton
    ) {

        console.warn(
            "Chapter 0 elements were not found."
        );

        return;

    }


    /*
        Prepare the chapter.
    */

    prepareChapter0(
        greeting,
        line1,
        line2,
        startButton
    );


    /*
        Start the entrance sequence.
    */

    startChapter0Intro(
        greeting,
        line1,
        line2,
        startButton
    );


    /*
        Connect the button.
    */

    setupStartButton(
        startButton
    );


    Chapter0State.initialized =
        true;


    console.log(
        "🌸 Chapter 0 initialized."
    );

}


/* ==========================================================
   PREPARE CHAPTER 0
========================================================== */

function prepareChapter0(
    greeting,
    line1,
    line2,
    startButton
) {

    /*
        Hide everything before the
        entrance animation begins.
    */

    greeting.style.opacity = "0";

    line1.style.opacity = "0";

    line2.style.opacity = "0";

    startButton.style.opacity = "0";


    /*
        Prevent the button from being clicked
        while it is still appearing.
    */

    startButton.style.pointerEvents =
        "none";


    /*
        Set initial positions.
    */

    greeting.style.transform =
        "translateY(20px)";

    line1.style.transform =
        "translateY(15px)";

    line2.style.transform =
        "translateY(15px)";

    startButton.style.transform =
        "translateY(15px)";

}


/* ==========================================================
   START INTRO ANIMATION
========================================================== */

function startChapter0Intro(
    greeting,
    line1,
    line2,
    startButton
) {

    /*
        Use GSAP if available.
    */

    if (
        typeof gsap !== "undefined"
    ) {

        gsap.to(
            greeting,
            {

                opacity: 1,

                y: 0,

                duration: 1.2,

                delay:
                    Chapter0Settings.greetingDelay / 1000,

                ease: "power3.out"

            }
        );


        gsap.to(
            line1,
            {

                opacity: 1,

                y: 0,

                duration: 1,

                delay:
                    Chapter0Settings.line1Delay / 1000,

                ease: "power2.out"

            }
        );


        gsap.to(
            line2,
            {

                opacity: 1,

                y: 0,

                duration: 1,

                delay:
                    Chapter0Settings.line2Delay / 1000,

                ease: "power2.out"

            }
        );


        gsap.to(
            startButton,
            {

                opacity: 1,

                y: 0,

                duration: 1.2,

                delay:
                    Chapter0Settings.buttonDelay / 1000,

                ease: "power3.out",

                onComplete: () => {

                    startButton.style.pointerEvents =
                        "auto";

                }

            }
        );


        return;

    }


    /*
        Fallback if GSAP isn't available.
    */

    fallbackIntroAnimation(
        greeting,
        line1,
        line2,
        startButton
    );

}


/* ==========================================================
   FALLBACK INTRO ANIMATION
========================================================== */

function fallbackIntroAnimation(
    greeting,
    line1,
    line2,
    startButton
) {

    setTimeout(() => {

        revealElement(
            greeting
        );

    }, Chapter0Settings.greetingDelay);


    setTimeout(() => {

        revealElement(
            line1
        );

    }, Chapter0Settings.line1Delay);


    setTimeout(() => {

        revealElement(
            line2
        );

    }, Chapter0Settings.line2Delay);


    setTimeout(() => {

        revealElement(
            startButton
        );

        startButton.style.pointerEvents =
            "auto";

    }, Chapter0Settings.buttonDelay);

}


/* ==========================================================
   REVEAL ELEMENT
========================================================== */

function revealElement(
    element
) {

    element.style.transition =
        "opacity 1s ease, transform 1s ease";

    element.style.opacity =
        "1";

    element.style.transform =
        "translateY(0)";

}


/* ==========================================================
   START BUTTON
========================================================== */

function setupStartButton(
    startButton
) {

    /*
        Mouse interaction.
    */

    startButton.addEventListener(
        "click",
        handleStartButton
    );


    /*
        Keyboard accessibility.

        Native buttons already support Enter and Space,
        but this gives us a dedicated place to expand
        the interaction later.
    */

    startButton.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                handleStartButton();

            }

        }
    );

}


/* ==========================================================
   HANDLE OPEN MY STORY
========================================================== */

function handleStartButton() {

    /*
        Prevent multiple clicks.
    */

    if (
        Chapter0State.started
    ) {

        return;

    }


    Chapter0State.started =
        true;


    const startButton =
        document.getElementById("startBtn");


    if (startButton) {

        startButton.style.pointerEvents =
            "none";

    }


    console.log(
        "🌸 She opened your story."
    );


    /*
        Start the music.

        This is intentionally triggered by
        the user's click so browser autoplay
        restrictions are respected.
    */

    if (
        typeof playMusic === "function"
    ) {

        playMusic();

    }


    /*
        Give the music a moment to begin
        before transitioning.
    */

    setTimeout(() => {

        openChapter1();

    }, Chapter0Settings.transitionDelay);

}


/* ==========================================================
   OPEN CHAPTER 1
========================================================== */

function openChapter1() {

    console.log(
        "📖 Opening Chapter 1..."
    );


    /*
        Use our transition system.
    */

    if (
        typeof transitionToChapter === "function"
    ) {

        transitionToChapter(1);

        return;

    }


    /*
        Fallback if transition.js
        isn't available yet.
    */

    console.warn(
        "Transition system is not available."
    );

}


/* ==========================================================
   RESET CHAPTER 0
========================================================== */

function resetChapter0() {

    Chapter0State.started =
        false;


    const greeting =
        document.getElementById("greeting");

    const line1 =
        document.getElementById("line1");

    const line2 =
        document.getElementById("line2");

    const startButton =
        document.getElementById("startBtn");


    if (
        !greeting ||
        !line1 ||
        !line2 ||
        !startButton
    ) {

        return;

    }


    prepareChapter0(
        greeting,
        line1,
        line2,
        startButton
    );


    startChapter0Intro(
        greeting,
        line1,
        line2,
        startButton
    );

}