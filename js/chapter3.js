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
        Connect Continue button.
    */

    if (continueButton) {

        /*
            Prevent duplicate listeners.
        */

        continueButton.removeEventListener(
            "click",
            handleChapter3Continue
        );


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
        Create sparkles.
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
        Reset scroll.
    */

    chapter.scrollTop =
        0;


    /*
        Enable button.
    */

    const continueButton =
        document.getElementById(
            "chapter3Continue"
        );


    if (continueButton) {

        continueButton.disabled =
            false;

        continueButton.style.pointerEvents =
            "auto";

        continueButton.style.opacity =
            "1";

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
        Number(event.detail.chapter);


    /*
        Only react to Chapter 3.
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

    hideOtherChapters(
        "chapter3"
    );


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


    Chapter3State.finished =
        false;


    /*
        Reset internal scroll.
    */

    chapter.scrollTop =
        0;


    /*
        Scroll page to top.
    */

    window.scrollTo({

        top: 0,

        behavior: "instant"

    });


    /*
        Start entrance animation.
    */

    animateChapter3Entrance();


    console.log(
        "🌹 Chapter 3 opened."
    );

}


/* ==========================================================
   HIDE OTHER CHAPTERS
   ========================================================== */

function hideOtherChapters(
    activeChapterId
) {

    const chapters =
        document.querySelectorAll(
            "main[id^='chapter']"
        );


    chapters.forEach(
        (chapter) => {

            if (
                chapter.id !==
                activeChapterId
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

    /*
        IMPORTANT:

        These selectors match the HTML
        you currently provided.
    */

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
        Use GSAP when available.
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

                    duration: 1.2,

                    ease: "power3.out"
                }

            );

        }


        /*
            Poems.
        */

        if (poems.length) {

            gsap.fromTo(

                poems,

                {
                    opacity: 0,

                    y: 35
                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1,

                    stagger: 0.25,

                    delay: 0.25,

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

                    y: 30
                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 1,

                    delay: 0.8,

                    ease: "power3.out"
                }

            );

        }


        /*
            Continue button.
        */

        if (continueButton) {

            gsap.fromTo(

                continueButton,

                {
                    opacity: 0,

                    y: 20
                },

                {
                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    delay: 1.1,

                    ease: "power3.out"
                }

            );

        }


        return;

    }


    /*
        Fallback without GSAP.
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
        Create animation only once.
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

    console.log(
        "💌 Chapter 3 Continue button clicked."
    );


    /*
        Find Chapter 4.
    */

    const chapter4 =
        document.getElementById(
            "chapter4"
        );


    /*
        IMPORTANT:

        If Chapter 4 doesn't exist in index.html,
        we cannot continue.
    */

    if (!chapter4) {

        console.error(
            "❌ Chapter 4 was not found in index.html."
        );

        alert(
            "Chapter 4 could not be found. Please make sure <main id=\"chapter4\"> exists in index.html."
        );

        return;

    }


    /*
        Prevent multiple clicks.
    */

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

        button.disabled =
            true;

        button.style.pointerEvents =
            "none";

    }


    console.log(
        "📖 Opening Chapter 4..."
    );


    /*
        ------------------------------------------------------
        TRY THE EXISTING TRANSITION SYSTEM FIRST
        ------------------------------------------------------
    */

    if (
        typeof transitionToChapter ===
        "function"
    ) {

        try {

            transitionToChapter(4);


            /*
                Give the transition system
                a moment to handle Chapter 4.

                If it doesn't actually open
                Chapter 4, our fallback below
                will handle it.
            */

            setTimeout(
                () => {

                    const chapter4Visible =
                        chapter4.style.display !==
                            "none" &&
                        getComputedStyle(
                            chapter4
                        ).display !==
                            "none";


                    if (
                        !chapter4Visible
                    ) {

                        console.warn(
                            "⚠️ transitionToChapter(4) did not open Chapter 4. Using direct navigation."
                        );


                        openChapter4Directly();

                    }

                },

                700
            );


            return;

        }

        catch (error) {

            console.error(
                "❌ transitionToChapter(4) failed:",
                error
            );

            /*
                Continue to direct navigation.
            */

        }

    }


    /*
        ------------------------------------------------------
        DIRECT NAVIGATION FALLBACK
        ------------------------------------------------------
    */

    openChapter4Directly();

}


/* ==========================================================
   DIRECTLY OPEN CHAPTER 4
   ========================================================== */

function openChapter4Directly() {

    const chapter4 =
        document.getElementById(
            "chapter4"
        );


    if (!chapter4) {

        console.error(
            "❌ Cannot open Chapter 4 because #chapter4 does not exist."
        );

        resetChapter3ContinueButton();

        return;

    }


    /*
        Hide every chapter.
    */

    hideOtherChapters(
        "chapter4"
    );


    /*
        Show Chapter 4.
    */

    chapter4.style.display =
        "block";


    /*
        Make sure Chapter 4
        is positioned at the top.
    */

    chapter4.scrollTop =
        0;


    window.scrollTo({

        top: 0,

        behavior: "instant"

    });


    /*
        Fire the chapterChange event.

        This allows chapter4.js
        to detect that Chapter 4
        is now active.
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
        If Chapter 4 has its own
        opening function, use it.
    */

    if (
        typeof openChapter4Screen ===
        "function"
    ) {

        try {

            openChapter4Screen();

        }

        catch (error) {

            console.warn(
                "Chapter 4 opening function encountered an error:",
                error
            );

        }

    }


    console.log(
        "✨ Chapter 4 opened successfully."
    );

}


/* ==========================================================
   RESET CONTINUE BUTTON
   ========================================================== */

function resetChapter3ContinueButton() {

    Chapter3State.finished =
        false;


    const button =
        document.getElementById(
            "chapter3Continue"
        );


    if (button) {

        button.disabled =
            false;

        button.style.pointerEvents =
            "auto";

        button.style.opacity =
            "1";

    }

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


    window.scrollTo({

        top: 0,

        behavior: "instant"

    });


    /*
        Reset button.
    */

    resetChapter3ContinueButton();


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


        const chapterVisible =
            getComputedStyle(
                chapter
            ).display !== "none";


        if (!chapterVisible) {

            return;

        }


        /*
            Enter when button is focused.
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
   START CHAPTER 3
   ========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initChapter3
    );

}

else {

    initChapter3();

}
