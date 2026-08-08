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

    finished: false,

    currentLetter: 1,

    totalLetters: 0

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


    /*
        Find Continue button.
    */

    const continueButton =
        document.getElementById(
            "chapter4Continue"
        );


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            finishChapter4
        );

    }


    /*
        Setup letter navigation.
    */

    setupChapter4Navigation();


    /*
        Setup letter interactions.
    */

    setupChapter4Letter();


    setupChapter4Heart();


    /*
        Prepare chapter.
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
        document.getElementById(
            "chapter4"
        );


    if (!chapter) {

        return;

    }


    /*
        Chapter starts hidden.
    */

    chapter.style.display =
        "none";


    /*
        Find all letters.
    */

    const letters =
        chapter.querySelectorAll(
            ".chapter4-letter"
        );


    Chapter4State.totalLetters =
        letters.length;


    /*
        Reset current letter.
    */

    Chapter4State.currentLetter =
        1;


    /*
        Make first letter active.
    */

    letters.forEach(
        (letter, index) => {

            if (index === 0) {

                letter.classList.add(
                    "active"
                );

                letter.style.display =
                    "block";

            } else {

                letter.classList.remove(
                    "active"
                );

                letter.style.display =
                    "none";

            }

        }
    );


    /*
        Update navigation.
    */

    updateChapter4Navigation();


    /*
        Prepare animations.
    */

    const intro =
        chapter.querySelector(
            ".chapter4-intro"
        );


    const letterContainer =
        chapter.querySelector(
            ".chapter4-letters"
        );


    const ending =
        chapter.querySelector(
            ".chapter4-ending"
        );


    const continueSection =
        chapter.querySelector(
            ".chapter4-continue-section"
        );


    const elements = [];


    if (intro) {

        elements.push(intro);

    }


    if (letterContainer) {

        elements.push(letterContainer);

    }


    if (ending) {

        elements.push(ending);

    }


    if (continueSection) {

        elements.push(continueSection);

    }


    /*
        Hide elements before entrance animation.
    */

    elements.forEach(
        (element) => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

        }
    );


    /*
        Make sure Chapter 4 itself
        can scroll.
    */

    chapter.style.overflowY =
        "auto";

    chapter.style.overflowX =
        "hidden";

}


/* ==========================================================
   SETUP LETTER NAVIGATION
========================================================== */

function setupChapter4Navigation() {

    const previousButton =
        document.getElementById(
            "chapter4Previous"
        );


    const nextButton =
        document.getElementById(
            "chapter4Next"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                changeChapter4Letter(
                    -1
                );

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                changeChapter4Letter(
                    1
                );

            }
        );

    }

}


/* ==========================================================
   CHANGE LETTER
========================================================== */

function changeChapter4Letter(
    direction
) {

    const chapter =
        document.getElementById(
            "chapter4"
        );


    if (!chapter) {

        return;

    }


    const letters =
        chapter.querySelectorAll(
            ".chapter4-letter"
        );


    if (!letters.length) {

        return;

    }


    let newLetter =
        Chapter4State.currentLetter +
        direction;


    /*
        Prevent going before first letter.
    */

    if (newLetter < 1) {

        newLetter = 1;

    }


    /*
        Prevent going beyond last letter.
    */

    if (
        newLetter >
        letters.length
    ) {

        newLetter =
            letters.length;

    }


    /*
        Nothing changed.
    */

    if (
        newLetter ===
        Chapter4State.currentLetter
    ) {

        return;

    }


    const oldIndex =
        Chapter4State.currentLetter - 1;


    const newIndex =
        newLetter - 1;


    const oldLetter =
        letters[oldIndex];


    const newLetterElement =
        letters[newIndex];


    /*
        Hide old letter.
    */

    if (oldLetter) {

        oldLetter.classList.remove(
            "active"
        );

        oldLetter.style.display =
            "none";

    }


    /*
        Show new letter.
    */

    if (newLetterElement) {

        newLetterElement.classList.add(
            "active"
        );

        newLetterElement.style.display =
            "block";

        /*
            Restart CSS animation.
        */

        newLetterElement.style.animation =
            "none";


        /*
            Force browser reflow.
        */

        void newLetterElement.offsetWidth;


        newLetterElement.style.animation =
            "";

    }


    /*
        Update state.
    */

    Chapter4State.currentLetter =
        newLetter;


    /*
        Update buttons and indicator.
    */

    updateChapter4Navigation();


    /*
        Scroll back to top of
        the letter area.

        IMPORTANT:
        This scrolls the Chapter 4
        container itself.
    */

    const letterArea =
        chapter.querySelector(
            ".chapter4-letters"
        );


    if (letterArea) {

        letterArea.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );

    }


    console.log(
        `💌 Showing letter ${newLetter}`
    );

}


/* ==========================================================
   UPDATE LETTER NAVIGATION
========================================================== */

function updateChapter4Navigation() {

    const previousButton =
        document.getElementById(
            "chapter4Previous"
        );


    const nextButton =
        document.getElementById(
            "chapter4Next"
        );


    const indicator =
        document.getElementById(
            "chapter4LetterIndicator"
        );


    const total =
        Chapter4State.totalLetters;


    const current =
        Chapter4State.currentLetter;


    /*
        Indicator.
    */

    if (indicator) {

        indicator.textContent =
            `${current} / ${total}`;

    }


    /*
        Previous button.
    */

    if (previousButton) {

        previousButton.disabled =
            current <= 1;

    }


    /*
        Next button.
    */

    if (nextButton) {

        nextButton.disabled =
            current >= total;

    }

}


/* ==========================================================
   OPEN CHAPTER 4
========================================================== */

function openChapter4Screen() {

    const chapter =
        document.getElementById(
            "chapter4"
        );


    if (!chapter) {

        console.warn(
            "Chapter 4 screen does not exist."
        );

        return;

    }


    /*
        Hide all other chapters.
    */

    const chapters =
        document.querySelectorAll(
            "main[id^='chapter']"
        );


    chapters.forEach(
        (otherChapter) => {

            if (
                otherChapter !== chapter
            ) {

                otherChapter.style.display =
                    "none";

            }

        }
    );


    /*
        Show Chapter 4.
    */

    chapter.style.display =
        "block";


    /*
        Make Chapter 4 the
        active scrolling container.
    */

    chapter.style.overflowY =
        "auto";

    chapter.style.overflowX =
        "hidden";


    Chapter4State.visible =
        true;


    Chapter4State.finished =
        false;


    /*
        Reset to first letter.
    */

    Chapter4State.currentLetter =
        1;


    const letters =
        chapter.querySelectorAll(
            ".chapter4-letter"
        );


    letters.forEach(
        (letter, index) => {

            if (index === 0) {

                letter.classList.add(
                    "active"
                );

                letter.style.display =
                    "block";

            } else {

                letter.classList.remove(
                    "active"
                );

                letter.style.display =
                    "none";

            }

        }
    );


    updateChapter4Navigation();


    /*
        Reset Chapter 4 scroll.
    */

    chapter.scrollTop =
        0;


    /*
        Start animation.
    */

    startChapter4Intro();


    console.log(
        "💌 Chapter 4 opened."
    );

}


/* ==========================================================
   CHAPTER 4 INTRO ANIMATION
========================================================== */

function startChapter4Intro() {

    const chapter =
        document.getElementById(
            "chapter4"
        );


    if (!chapter) {

        return;

    }


    const intro =
        chapter.querySelector(
            ".chapter4-intro"
        );


    const letters =
        chapter.querySelector(
            ".chapter4-letters"
        );


    const ending =
        chapter.querySelector(
            ".chapter4-ending"
        );


    const continueSection =
        chapter.querySelector(
            ".chapter4-continue-section"
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

                    duration: 1.1,

                    ease: "power3.out"

                }
            );

        }


        if (letters) {

            timeline.to(
                letters,
                {

                    opacity: 1,

                    y: 0,

                    duration: 1.1,

                    ease: "power3.out"

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

                "-=0.35"

            );

        }


        if (continueSection) {

            timeline.to(
                continueSection,
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
        Fallback.
    */

    fallbackChapter4Intro(
        intro,
        letters,
        ending,
        continueSection
    );

}


/* ==========================================================
   FALLBACK INTRO
========================================================== */

function fallbackChapter4Intro(
    intro,
    letters,
    ending,
    continueSection
) {

    const elements = [

        intro,

        letters,

        ending,

        continueSection

    ];


    elements.forEach(
        (element, index) => {

            if (!element) {

                return;

            }


            setTimeout(
                () => {

                    revealChapter4Element(
                        element
                    );

                },

                250 +
                (index * 500)

            );

        }
    );

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

    const letters =
        document.querySelectorAll(
            ".chapter4-letter"
        );


    if (!letters.length) {

        return;

    }


    letters.forEach(
        (letter) => {

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


    /*
        If Chapter 5 exists,
        transition to it.
    */

    const chapter5 =
        document.getElementById(
            "chapter5"
        );


    if (
        chapter5 &&
        typeof transitionToChapter ===
            "function"
    ) {

        Chapter4State.finished =
            true;


        console.log(
            "💌 Chapter 4 complete."
        );


        transitionToChapter(5);

        return;

    }


    /*
        Chapter 5 isn't ready yet.
    */

    console.log(
        "💌 Chapter 4 complete. Chapter 5 is not ready yet."
    );


    /*
        Keep button usable.
    */

    Chapter4State.finished =
        false;

}


/* ==========================================================
   CHAPTER CHANGE LISTENER
========================================================== */

document.addEventListener(
    "chapterChange",
    (event) => {

        if (
            !event ||
            !event.detail
        ) {

            return;

        }


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


    Chapter4State.currentLetter =
        1;


    prepareChapter4();

}


/* ==========================================================
   KEYBOARD NAVIGATION
========================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        const chapter =
            document.getElementById(
                "chapter4"
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
            Left arrow = previous letter.
        */

        if (
            event.key ===
            "ArrowLeft"
        ) {

            changeChapter4Letter(
                -1
            );

        }


        /*
            Right arrow = next letter.
        */

        if (
            event.key ===
            "ArrowRight"
        ) {

            changeChapter4Letter(
                1
            );

        }

    }
);


/* ==========================================================
   INITIAL SETUP
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initChapter4();

    }
);
