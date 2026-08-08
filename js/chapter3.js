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
        Connect button.
    */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            handleChapter3Continue
        );

    }


    /*
        Prepare the chapter.
    */

    prepareChapter3();


    /*
        Create additional visual effects.
    */

    createChapter3Sparkles();


    /*
        Allow the chapter to react
        when it becomes visible.
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
        Chapter 3 begins hidden.

        The transition system or Chapter 2
        will reveal it when appropriate.
    */

    chapter.style.display =
        "none";


    /*
        Make sure the page starts
        at the beginning.
    */

    const wrapper =
        chapter.querySelector(
            ".chapter3-wrapper"
        );


    if (wrapper) {

        wrapper.scrollTop =
            0;

    }


    /*
        Make the continue button
        ready for interaction.
    */

    const continueButton =
        document.getElementById(
            "chapter3Continue"
        );


    if (continueButton) {

        continueButton.style.pointerEvents =
            "auto";

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


    const chapterNumber =
        event.detail.chapter;


    /*
        Only react when Chapter 3
        becomes active.
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
        Hide other chapter screens.
    */

    hideOtherChapters();


    /*
        Show Chapter 3.
    */

    chapter.style.display =
        "block";


    /*
        Mark as started.
    */

    Chapter3State.started =
        true;


    /*
        Scroll to the beginning.
    */

    window.scrollTo(
        {
            top: 0,
            behavior: "instant"
        }
    );


    /*
        Start the entrance animation.
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
   CHAPTER 3 ENTRANCE
   ========================================================== */

function animateChapter3Entrance() {

    const intro =
        document.querySelector(
            "#chapter3 .chapter3-intro"
        );


    const poemIntro =
        document.querySelector(
            "#chapter3 .chapter3-poem-intro"
        );


    const stanzas =
        document.querySelectorAll(
            "#chapter3 .chapter3-stanza"
        );


    const ending =
        document.querySelector(
            "#chapter3 .chapter3-ending"
        );


    const continueSection =
        document.querySelector(
            "#chapter3 .chapter3-continue-section"
        );


    /*
        If GSAP exists,
        create a smooth entrance.
    */

    if (
        typeof gsap !== "undefined"
    ) {

        /*
            Intro.
        */

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

                    duration: 1.3,

                    ease: "power3.out"

                }
            );

        }


        /*
            Poem introduction.
        */

        if (poemIntro) {

            gsap.fromTo(
                poemIntro,

                {
                    opacity: 0,

                    y: 25

                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1,

                    delay: 0.35,

                    ease: "power3.out"

                }
            );

        }


        /*
            Stanzas.
        */

        if (stanzas.length) {

            gsap.fromTo(
                stanzas,

                {
                    opacity: 0,

                    y: 30

                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 0.9,

                    stagger: 0.18,

                    delay: 0.55,

                    ease: "power3.out"

                }
            );

        }


        /*
            Ending.
        */

        if (ending) {

            gsap.fromTo(
                ending,

                {
                    opacity: 0,

                    y: 25

                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1,

                    delay: 1.1,

                    ease: "power3.out"

                }
            );

        }


        /*
            Continue section.
        */

        if (continueSection) {

            gsap.fromTo(
                continueSection,

                {
                    opacity: 0,

                    y: 25

                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1,

                    delay: 1.3,

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

    }


    if (poemIntro) {

        poemIntro.style.opacity =
            "1";

    }


    stanzas.forEach(
        (stanza) => {

            stanza.style.opacity =
                "1";

            stanza.style.transform =
                "translateY(0)";

        }
    );


    if (ending) {

        ending.style.opacity =
            "1";

    }


    if (continueSection) {

        continueSection.style.opacity =
            "1";

    }

}


/* ==========================================================
   CREATE SPARKLES
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
        Prevent duplicates.
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
            "✦";


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
        Add animation dynamically.
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
   CONTINUE BUTTON
   ========================================================== */

function handleChapter3Continue() {

    if (
        Chapter3State.finished
    ) {

        return;

    }


    Chapter3State.finished =
        true;


    const button =
        document.getElementById(
            "chapter3Continue"
        );


    if (button) {

        button.style.pointerEvents =
            "none";

    }


    console.log(
        "💌 Chapter 3 complete."
    );


    /*
        If our transition system exists,
        transition to Chapter IV.
    */

    if (
        typeof transitionToChapter ===
        "function"
    ) {

        transitionToChapter(4);

        return;

    }


    /*
        Fallback.

        Chapter IV isn't built yet,
        so don't leave the user with
        a broken screen.
    */

    console.log(
        "Chapter IV is not available yet."
    );


    if (button) {

        button.style.pointerEvents =
            "auto";

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
        Reset scroll position.
    */

    window.scrollTo(
        {
            top: 0,
            behavior: "instant"
        }
    );


    /*
        Reset button.
    */

    const button =
        document.getElementById(
            "chapter3Continue"
        );


    if (button) {

        button.style.pointerEvents =
            "auto";

    }


    /*
        Reset chapter visibility.
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


        if (
            chapter.style.display ===
            "none"
        ) {

            return;

        }


        /*
            Press Enter when the
            Continue button is focused.
        */

        if (
            event.key === "Enter" &&
            document.activeElement &&
            document.activeElement.id ===
                "chapter3Continue"
        ) {

            handleChapter3Continue();

        }

    }
);
