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

    finished: false

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
        Prepare cards for entrance animation.
    */

    const intro =
        chapter.querySelector(
            ".chapter2-intro"
        );


    const cards =
        chapter.querySelectorAll(
            ".chapter2-card"
        );


    const special =
        chapter.querySelector(
            ".chapter2-special"
        );


    const continueButton =
        chapter.querySelector(
            ".chapter2-continue"
        );


    const elements = [];


    if (intro) {
        elements.push(intro);
    }


    cards.forEach(
        (card) => {

            elements.push(card);

        }
    );


    if (special) {
        elements.push(special);
    }


    if (continueButton) {
        elements.push(continueButton);
    }


    /*
        Set initial state.
    */

    elements.forEach(
        (element) => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(20px)";

        }
    );

}


/* ==========================================================
   OPEN CHAPTER 2
   ========================================================== */

function openChapter2Screen() {

    const chapter =
        document.getElementById("chapter2");


    const previousChapter =
        document.getElementById("chapter1");


    if (!chapter) {

        console.warn(
            "Chapter 2 screen does not exist."
        );

        return;

    }


    /*
        Hide Chapter 1.
    */

    if (previousChapter) {

        previousChapter.style.display =
            "none";

    }


    /*
        Hide Chapter 0 as an extra safety check.
    */

    const chapter0 =
        document.getElementById("chapter0");


    if (chapter0) {

        chapter0.style.display =
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


    /*
        Start entrance animation.
    */

    startChapter2Intro();

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


    const cards =
        chapter.querySelectorAll(
            ".chapter2-card"
        );


    const special =
        chapter.querySelector(
            ".chapter2-special"
        );


    const continueButton =
        chapter.querySelector(
            ".chapter2-continue"
        );


    /*
        Use GSAP if available.
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


        if (cards.length) {

            timeline.to(
                cards,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    stagger: 0.15,

                    ease: "power3.out"

                },
                "-=0.45"
            );

        }


        if (special) {

            timeline.to(
                special,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    ease: "power3.out"

                },
                "-=0.35"
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
                "-=0.3"
            );

        }


        return;

    }


    /*
        Fallback if GSAP is unavailable.
    */

    fallbackChapter2Intro(
        intro,
        cards,
        special,
        continueButton
    );

}


/* ==========================================================
   FALLBACK INTRO ANIMATION
   ========================================================== */

function fallbackChapter2Intro(
    intro,
    cards,
    special,
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


    cards.forEach(
        (card) => {

            setTimeout(
                () => {

                    revealChapter2Element(
                        card
                    );

                },
                delay
            );


            delay += 250;

        }
    );


    if (special) {

        setTimeout(
            () => {

                revealChapter2Element(
                    special
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
   CARD HOVER INTERACTION
   ========================================================== */

function setupChapter2Cards() {

    const cards =
        document.querySelectorAll(
            ".chapter2-card"
        );


    cards.forEach(
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

    if (
        Chapter2State.finished
    ) {

        return;

    }


    Chapter2State.finished =
        true;


    console.log(
        "💗 Chapter 2 complete."
    );


    /*
        Chapter III isn't built yet.

        For now, transition to Chapter 3
        will be prepared but won't break
        the website if Chapter 3 doesn't
        exist yet.
    */

    if (
        typeof transitionToChapter ===
        "function"
    ) {

        transitionToChapter(3);

        return;

    }


    console.warn(
        "Transition system is not available."
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


        if (
            chapterNumber === 2
        ) {

            openChapter2Screen();

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
