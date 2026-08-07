/* ==========================================================
   CHAPTER II — THE LITTLE THINGS
   Project : Our Story
   Purpose : Chapter 2 — Text-Based Story
   ========================================================== */


/* ==========================================================
   CHAPTER 2 STATE
   ========================================================== */

const Chapter2State = {

    initialized: false,

    visible: false,

    finished: false,

    transitioning: false

};


/* ==========================================================
   INITIALIZE CHAPTER 2
   ========================================================== */

function initChapter2() {

    const chapter =
        document.getElementById("chapter2");


    if (!chapter) {

        console.warn(
            "Chapter 2 element was not found."
        );

        return;

    }


    const continueButton =
        document.getElementById(
            "chapter2Continue"
        );


    /*
        Connect Continue button.
    */

    if (continueButton) {

        /*
            Prevent duplicate event listeners.
        */

        continueButton.removeEventListener(
            "click",
            finishChapter2
        );


        continueButton.addEventListener(
            "click",
            finishChapter2
        );

    }


    /*
        Prepare Chapter 2.
    */

    prepareChapter2();


    Chapter2State.initialized =
        true;


    console.log(
        "💗 Chapter 2 initialized."
    );

}


/* ==========================================================
   PREPARE CHAPTER 2
   ========================================================== */

function prepareChapter2() {

    const chapter =
        document.getElementById("chapter2");


    if (!chapter) {

        return;

    }


    /*
        Chapter 2 starts hidden.
    */

    chapter.style.display =
        "none";


    /*
        Get the actual elements
        from your current index.html.
    */

    const intro =
        chapter.querySelector(
            ".chapter2-intro"
        );


    const stories =
        chapter.querySelectorAll(
            ".chapter2-story"
        );


    const jokes =
        chapter.querySelector(
            ".chapter2-inside-jokes"
        );


    const ending =
        chapter.querySelector(
            ".chapter2-ending"
        );


    const continueButton =
        chapter.querySelector(
            ".chapter2-continue"
        );


    const elements = [];


    if (intro) {

        elements.push(intro);

    }


    stories.forEach(
        (story) => {

            elements.push(story);

        }
    );


    if (jokes) {

        elements.push(jokes);

    }


    if (ending) {

        elements.push(ending);

    }


    if (continueButton) {

        elements.push(continueButton);

    }


    /*
        Set initial animation state.
    */

    elements.forEach(
        (element) => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

        }
    );

}


/* ==========================================================
   OPEN CHAPTER 2
   ========================================================== */

function openChapter2Screen() {

    const chapter =
        document.getElementById("chapter2");


    const chapter1 =
        document.getElementById("chapter1");


    const chapter0 =
        document.getElementById("chapter0");


    if (!chapter) {

        console.warn(
            "Chapter 2 screen does not exist."
        );

        return;

    }


    /*
        Hide Chapter 0.
    */

    if (chapter0) {

        chapter0.style.display =
            "none";

    }


    /*
        Hide Chapter 1.
    */

    if (chapter1) {

        chapter1.style.display =
            "none";

    }


    /*
        Show Chapter 2.
    */

    chapter.style.display =
        "flex";


    Chapter2State.visible =
        true;


    Chapter2State.finished =
        false;


    Chapter2State.transitioning =
        false;


    /*
        Scroll to the beginning
        of Chapter 2.
    */

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });


    /*
        Start entrance animation.
    */

    startChapter2Intro();


    console.log(
        "💗 Chapter 2 is now visible."
    );

}


/* ==========================================================
   CHAPTER 2 INTRO ANIMATION
   ========================================================== */

function startChapter2Intro() {

    const chapter =
        document.getElementById("chapter2");


    if (!chapter) {

        return;

    }


    const intro =
        chapter.querySelector(
            ".chapter2-intro"
        );


    const stories =
        chapter.querySelectorAll(
            ".chapter2-story"
        );


    const jokes =
        chapter.querySelector(
            ".chapter2-inside-jokes"
        );


    const ending =
        chapter.querySelector(
            ".chapter2-ending"
        );


    const continueButton =
        chapter.querySelector(
            ".chapter2-continue"
        );


    /*
        GSAP animation.
    */

    if (
        typeof gsap !== "undefined"
    ) {

        const timeline =
            gsap.timeline();


        if (intro) {

            timeline.to(
                intro,
                {

                    opacity: 1,

                    y: 0,

                    duration: 1,

                    ease: "power3.out"

                }
            );

        }


        if (stories.length) {

            timeline.to(
                stories,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    stagger: 0.18,

                    ease: "power3.out"

                },

                "-=0.4"
            );

        }


        if (jokes) {

            timeline.to(
                jokes,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    ease: "power3.out"

                },

                "-=0.35"
            );

        }


        if (ending) {

            timeline.to(
                ending,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    ease: "power3.out"

                },

                "-=0.3"
            );

        }


        if (continueButton) {

            timeline.to(
                continueButton,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    ease: "power3.out"

                },

                "-=0.25"
            );

        }


        return;

    }


    /*
        Fallback without GSAP.
    */

    fallbackChapter2Intro(
        intro,
        stories,
        jokes,
        ending,
        continueButton
    );

}


/* ==========================================================
   FALLBACK INTRO ANIMATION
   ========================================================== */

function fallbackChapter2Intro(
    intro,
    stories,
    jokes,
    ending,
    continueButton
) {

    let delay = 200;


    if (intro) {

        setTimeout(
            () => {

                revealChapter2Element(
                    intro
                );

            },
            delay
        );


        delay += 500;

    }


    stories.forEach(
        (story) => {

            setTimeout(
                () => {

                    revealChapter2Element(
                        story
                    );

                },
                delay
            );


            delay += 250;

        }
    );


    if (jokes) {

        setTimeout(
            () => {

                revealChapter2Element(
                    jokes
                );

            },
            delay
        );


        delay += 400;

    }


    if (ending) {

        setTimeout(
            () => {

                revealChapter2Element(
                    ending
                );

            },
            delay
        );


        delay += 400;

    }


    if (continueButton) {

        setTimeout(
            () => {

                revealChapter2Element(
                    continueButton
                );

            },
            delay
        );

    }

}


/* ==========================================================
   REVEAL ELEMENT
   ========================================================== */

function revealChapter2Element(
    element
) {

    if (!element) {

        return;

    }


    element.style.transition =
        "opacity 0.8s ease, transform 0.8s ease";


    element.style.opacity =
        "1";


    element.style.transform =
        "translateY(0)";

}


/* ==========================================================
   CARD / STORY HOVER INTERACTION
   ========================================================== */

function setupChapter2Cards() {

    /*
        Your current index.html uses
        .chapter2-story instead of
        .chapter2-card.
    */

    const stories =
        document.querySelectorAll(
            ".chapter2-story"
        );


    stories.forEach(
        (story) => {

            story.addEventListener(
                "mouseenter",
                () => {

                    story.classList.add(
                        "is-hovered"
                    );

                }
            );


            story.addEventListener(
                "mouseleave",
                () => {

                    story.classList.remove(
                        "is-hovered"
                    );

                }
            );

        }
    );


    /*
        Inside joke cards.
    */

    const jokeCards =
        document.querySelectorAll(
            ".chapter2-joke-card"
        );


    jokeCards.forEach(
        (card) => {

            card.addEventListener(
                "mouseenter",
                () => {

                    card.classList.add(
                        "is-hovered"
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.classList.remove(
                        "is-hovered"
                    );

                }
            );

        }
    );

}


/* ==========================================================
   FINISH CHAPTER 2
   ========================================================== */

function finishChapter2() {

    /*
        Prevent double clicking.
    */

    if (
        Chapter2State.finished ||
        Chapter2State.transitioning
    ) {

        return;

    }


    Chapter2State.finished =
        true;


    Chapter2State.transitioning =
        true;


    console.log(
        "💗 Chapter 2 complete."
    );


    console.log(
        "📖 Opening Chapter 3..."
    );


    /*
        IMPORTANT:
        Use the existing transition system.
    */

    if (
        typeof transitionToChapter ===
        "function"
    ) {

        transitionToChapter(3);

        return;

    }


    /*
        Emergency fallback if
        transition.js isn't loaded.
    */

    console.warn(
        "Transition system is not available. Using direct Chapter 3 opening."
    );


    openChapter3Screen();

}


/* ==========================================================
   OPEN CHAPTER 3 DIRECTLY
   ========================================================== */

function openChapter3Screen() {

    const chapter2 =
        document.getElementById(
            "chapter2"
        );


    const chapter3 =
        document.getElementById(
            "chapter3"
        );


    if (!chapter3) {

        console.error(
            "❌ Chapter 3 was not found in index.html."
        );

        Chapter2State.transitioning =
            false;

        return;

    }


    /*
        Hide Chapter 2.
    */

    if (chapter2) {

        chapter2.style.display =
            "none";

    }


    /*
        Hide previous chapters
        as extra protection.
    */

    const chapter0 =
        document.getElementById(
            "chapter0"
        );


    const chapter1 =
        document.getElementById(
            "chapter1"
        );


    if (chapter0) {

        chapter0.style.display =
            "none";

    }


    if (chapter1) {

        chapter1.style.display =
            "none";

    }


    /*
        Show Chapter 3.
    */

    chapter3.style.display =
        "flex";


    /*
        Scroll to the top.
    */

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });


    /*
        If Chapter 3 has its own
        opening function, run it.
    */

    if (
        typeof startChapter3Intro ===
        "function"
    ) {

        startChapter3Intro();

    }


    if (
        typeof openChapter3 ===
        "function"
    ) {

        openChapter3();

    }


    console.log(
        "🌹 Chapter 3 is now visible."
    );

}


/* ==========================================================
   CHAPTER CHANGE LISTENER
   ========================================================== */

document.addEventListener(
    "chapterChange",
    (event) => {

        const chapterNumber =
            event.detail.chapter;


        /*
            Chapter II
        */

        if (
            chapterNumber === 2
        ) {

            openChapter2Screen();

        }


        /*
            Chapter III
        */

        if (
            chapterNumber === 3
        ) {

            openChapter3Screen();

        }

    }
);


/* ==========================================================
   RESET CHAPTER 2
   ========================================================== */

function resetChapter2() {

    Chapter2State.visible =
        false;


    Chapter2State.finished =
        false;


    Chapter2State.transitioning =
        false;


    prepareChapter2();

}


/* ==========================================================
   INITIAL SETUP
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initChapter2();

        setupChapter2Cards();

    }
);
