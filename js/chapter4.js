/* ==========================================================
   CHAPTER IV — LETTERS
   Project : Our Story
   Purpose : Chapter 4 — Heartfelt Letters
========================================================== */


/* ==========================================================
   CHAPTER 4 STATE
========================================================== */

const Chapter4State = {

    initialized: false,

    visible: false,

    finished: false

};


/* ==========================================================
   INITIALIZE CHAPTER 4
========================================================== */

function initChapter4() {

    const chapter =
        document.getElementById("chapter4");


    if (!chapter) {

        console.warn(
            "Chapter 4 element was not found."
        );

        return;

    }


    const continueButton =
        document.getElementById(
            "chapter4Continue"
        );


    /*
        Connect Continue button.
    */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            finishChapter4
        );

    }


    /*
        Connect letter interaction.
    */

    setupChapter4Letter();


    /*
        Prepare Chapter 4.
    */

    prepareChapter4();


    Chapter4State.initialized =
        true;


    console.log(
        "💌 Chapter 4 initialized."
    );

}


/* ==========================================================
   PREPARE CHAPTER 4
========================================================== */

function prepareChapter4() {

    const chapter =
        document.getElementById("chapter4");


    if (!chapter) {

        return;

    }


    /*
        Chapter 4 starts hidden.
    */

    chapter.style.display =
        "none";


    /*
        Find animated elements.
    */

    const intro =
        chapter.querySelector(
            ".chapter4-intro"
        );


    const letter =
        chapter.querySelector(
            ".chapter4-letter"
        );


    const letterParts =
        chapter.querySelectorAll(
            ".chapter4-letter-content > *"
        );


    const ending =
        chapter.querySelector(
            ".chapter4-ending"
        );


    const continueButton =
        chapter.querySelector(
            ".chapter4-continue"
        );


    const elements = [];


    if (intro) {

        elements.push(intro);

    }


    if (letter) {

        elements.push(letter);

    }


    letterParts.forEach(
        (element) => {

            elements.push(element);

        }
    );


    if (ending) {

        elements.push(ending);

    }


    if (continueButton) {

        elements.push(continueButton);

    }


    /*
        Initial hidden state.
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
   OPEN CHAPTER 4
========================================================== */

function openChapter4Screen() {

    const chapter =
        document.getElementById("chapter4");


    const previousChapter =
        document.getElementById("chapter3");


    if (!chapter) {

        console.warn(
            "Chapter 4 screen does not exist."
        );

        return;

    }


    /*
        Hide Chapter 3.
    */

    if (previousChapter) {

        previousChapter.style.display =
            "none";

    }


    /*
        Hide previous chapters as
        an extra safety measure.
    */

    const chapter0 =
        document.getElementById("chapter0");


    const chapter1 =
        document.getElementById("chapter1");


    const chapter2 =
        document.getElementById("chapter2");


    if (chapter0) {

        chapter0.style.display =
            "none";

    }


    if (chapter1) {

        chapter1.style.display =
            "none";

    }


    if (chapter2) {

        chapter2.style.display =
            "none";

    }


    /*
        Show Chapter 4.
    */

    chapter.style.display =
        "block";


    Chapter4State.visible =
        true;


    Chapter4State.finished =
        false;


    /*
        Reset scroll position.
    */

    chapter.scrollTop =
        0;


    /*
        Restart entrance animation.
    */

    startChapter4Intro();

}


/* ==========================================================
   CHAPTER 4 INTRO ANIMATION
========================================================== */

function startChapter4Intro() {

    const chapter =
        document.getElementById("chapter4");


    if (!chapter) {

        return;

    }


    const intro =
        chapter.querySelector(
            ".chapter4-intro"
        );


    const letter =
        chapter.querySelector(
            ".chapter4-letter"
        );


    const ending =
        chapter.querySelector(
            ".chapter4-ending"
        );


    const continueButton =
        chapter.querySelector(
            ".chapter4-continue"
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

                    duration: 1.1,

                    ease: "power3.out"

                }
            );

        }


        if (letter) {

            timeline.to(
                letter,
                {

                    opacity: 1,

                    y: 0,

                    duration: 1.1,

                    ease: "power3.out"

                },
                "-=0.45"
            );

        }


        /*
            Reveal letter content slowly.
        */

        const letterParts =
            chapter.querySelectorAll(
                ".chapter4-letter-content > *"
            );


        if (letterParts.length) {

            timeline.to(
                letterParts,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.65,

                    stagger: 0.18,

                    ease: "power2.out"

                },
                "-=0.45"
            );

        }


        if (ending) {

            timeline.to(
                ending,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.9,

                    ease: "power3.out"

                },
                "-=0.25"
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
        Fallback if GSAP isn't available.
    */

    fallbackChapter4Intro(
        intro,
        letter,
        ending,
        continueButton
    );

}


/* ==========================================================
   FALLBACK INTRO ANIMATION
========================================================== */

function fallbackChapter4Intro(
    intro,
    letter,
    ending,
    continueButton
) {

    let delay =
        200;


    if (intro) {

        setTimeout(
            () => {

                revealChapter4Element(
                    intro
                );

            },
            delay
        );


        delay += 600;

    }


    if (letter) {

        setTimeout(
            () => {

                revealChapter4Element(
                    letter
                );

            },
            delay
        );


        delay += 700;

    }


    const letterParts =
        document.querySelectorAll(
            ".chapter4-letter-content > *"
        );


    letterParts.forEach(
        (element) => {

            setTimeout(
                () => {

                    revealChapter4Element(
                        element
                    );

                },
                delay
            );


            delay += 250;

        }
    );


    if (ending) {

        setTimeout(
            () => {

                revealChapter4Element(
                    ending
                );

            },
            delay
        );


        delay += 500;

    }


    if (continueButton) {

        setTimeout(
            () => {

                revealChapter4Element(
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

function revealChapter4Element(
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
   LETTER INTERACTION
========================================================== */

function setupChapter4Letter() {

    const letter =
        document.querySelector(
            ".chapter4-letter"
        );


    if (!letter) {

        return;

    }


    /*
        Gentle hover effect.
    */

    letter.addEventListener(
        "mouseenter",
        () => {

            letter.classList.add(
                "is-open"
            );

        }
    );


    letter.addEventListener(
        "mouseleave",
        () => {

            letter.classList.remove(
                "is-open"
            );

        }
    );

}


/* ==========================================================
   LETTER HEART INTERACTION
========================================================== */

function setupChapter4Heart() {

    const heart =
        document.querySelector(
            ".chapter4-letter-heart"
        );


    if (!heart) {

        return;

    }


    heart.addEventListener(
        "click",
        () => {

            heart.classList.toggle(
                "is-active"
            );

        }
    );

}


/* ==========================================================
   FINISH CHAPTER 4
========================================================== */

function finishChapter4() {

    if (
        Chapter4State.finished
    ) {

        return;

    }


    Chapter4State.finished =
        true;


    console.log(
        "💌 Chapter 4 complete."
    );


    /*
        Chapter V isn't built yet.

        Once Chapter 5 is ready,
        transitionToChapter(5)
        will open it.
    */

    if (
        typeof transitionToChapter ===
        "function"
    ) {

        transitionToChapter(5);

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
            chapterNumber === 4
        ) {

            openChapter4Screen();

        }

    }
);


/* ==========================================================
   RESET CHAPTER 4
========================================================== */

function resetChapter4() {

    Chapter4State.visible =
        false;


    Chapter4State.finished =
        false;


    prepareChapter4();

}


/* ==========================================================
   INITIAL SETUP
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initChapter4();

        setupChapter4Heart();

    }
);
