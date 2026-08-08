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
        Count letters.
    */

    const letters =
        chapter.querySelectorAll(
            ".chapter4-letter"
        );


    Chapter4State.totalLetters =
        letters.length;


    /*
        Continue button.
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
        Setup navigation buttons.
    */

    setupChapter4Navigation();


    /*
        Setup letter tabs.
    */

    setupChapter4Tabs();


    /*
        Setup letter hover effects.
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
        document.getElementById(
            "chapter4"
        );


    if (!chapter) {

        return;

    }


    /*
        Chapter 4 starts hidden.
    */

    chapter.style.display =
        "none";


    /*
        Reset state.
    */

    Chapter4State.currentLetter =
        1;

    Chapter4State.finished =
        false;


    /*
        Find letters.
    */

    const letters =
        chapter.querySelectorAll(
            ".chapter4-letter"
        );


    Chapter4State.totalLetters =
        letters.length;


    /*
        Show only first letter.
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
        Update controls.
    */

    updateChapter4Navigation();


    /*
        Update letter tabs.
    */

    updateChapter4Tabs();


    /*
        Prepare entrance animation.
    */

    const intro =
        chapter.querySelector(
            ".chapter4-intro"
        );


    const lettersContainer =
        chapter.querySelector(
            ".chapter4-letters"
        );


    const controls =
        chapter.querySelector(
            ".chapter4-letter-controls"
        );


    const ending =
        chapter.querySelector(
            ".chapter4-ending"
        );


    const continueSection =
        chapter.querySelector(
            ".chapter4-continue-section"
        );


    const elements = [

        intro,

        lettersContainer,

        controls,

        ending,

        continueSection

    ];


    elements.forEach(
        (element) => {

            if (!element) {

                return;

            }


            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

        }
    );

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

                changeChapter4Letter(-1);

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                changeChapter4Letter(1);

            }
        );

    }

}


/* ==========================================================
   SETUP LETTER TABS
========================================================== */

function setupChapter4Tabs() {

    const tabs =
        document.querySelectorAll(
            ".chapter4-letter-tab"
        );


    if (!tabs.length) {

        return;

    }


    tabs.forEach(
        (tab) => {

            tab.addEventListener(
                "click",
                () => {

                    const letterNumber =
                        Number(
                            tab.dataset.letter
                        );


                    if (
                        !letterNumber ||
                        letterNumber ===
                            Chapter4State.currentLetter
                    ) {

                        return;

                    }


                    showChapter4Letter(
                        letterNumber
                    );

                }
            );

        }
    );

}


/* ==========================================================
   CHANGE LETTER
========================================================== */

function changeChapter4Letter(
    direction
) {

    const newLetter =
        Chapter4State.currentLetter +
        direction;


    if (
        newLetter < 1 ||
        newLetter >
            Chapter4State.totalLetters
    ) {

        return;

    }


    showChapter4Letter(
        newLetter
    );

}


/* ==========================================================
   SHOW SPECIFIC LETTER
========================================================== */

function showChapter4Letter(
    letterNumber
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


    if (
        letterNumber < 1 ||
        letterNumber >
            letters.length
    ) {

        return;

    }


    const oldIndex =
        Chapter4State.currentLetter - 1;


    const newIndex =
        letterNumber - 1;


    const oldLetter =
        letters[oldIndex];


    const newLetter =
        letters[newIndex];


    /*
        Don't do anything if
        clicking current letter.
    */

    if (
        oldLetter === newLetter
    ) {

        return;

    }


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

    if (newLetter) {

        newLetter.style.display =
            "block";

        newLetter.classList.add(
            "active"
        );


        /*
            Restart letter animation.
        */

        newLetter.style.animation =
            "none";


        void newLetter.offsetWidth;


        newLetter.style.animation =
            "";

    }


    /*
        Update state.
    */

    Chapter4State.currentLetter =
        letterNumber;


    /*
        Update controls.
    */

    updateChapter4Navigation();


    /*
        Update top tabs.
    */

    updateChapter4Tabs();


    /*
        Keep the letter area visible.
    */

    const letterArea =
        chapter.querySelector(
            ".chapter4-letters"
        );


    if (letterArea) {

        letterArea.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }


    console.log(
        `💌 Showing letter ${letterNumber}`
    );

}


/* ==========================================================
   UPDATE NAVIGATION BUTTONS
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
            "chapter4Indicator"
        );


    const current =
        Chapter4State.currentLetter;


    const total =
        Chapter4State.totalLetters;


    /*
        Indicator.
    */

    if (indicator) {

        const romanNumerals = [
            "",
            "I",
            "II",
            "III",
            "IV",
            "V"
        ];


        const currentRoman =
            romanNumerals[current] ||
            current;


        const totalRoman =
            romanNumerals[total] ||
            total;


        indicator.textContent =
            `${currentRoman} / ${totalRoman}`;

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
   UPDATE TOP LETTER TABS
========================================================== */

function updateChapter4Tabs() {

    const tabs =
        document.querySelectorAll(
            ".chapter4-letter-tab"
        );


    tabs.forEach(
        (tab) => {

            const letterNumber =
                Number(
                    tab.dataset.letter
                );


            if (
                letterNumber ===
                Chapter4State.currentLetter
            ) {

                tab.classList.add(
                    "active"
                );

            } else {

                tab.classList.remove(
                    "active"
                );

            }

        }
    );

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


    Chapter4State.visible =
        true;


    Chapter4State.finished =
        false;


    /*
        Reset to first letter.
    */

    const letters =
        chapter.querySelectorAll(
            ".chapter4-letter"
        );


    Chapter4State.currentLetter =
        1;


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

    updateChapter4Tabs();


    /*
        Reset page scroll.
    */

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });


    /*
        Restart entrance animation.
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


    const controls =
        chapter.querySelector(
            ".chapter4-letter-controls"
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
        GSAP available.
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

                    duration: 1,

                    ease: "power3.out"

                },

                "-=0.4"

            );

        }


        if (controls) {

            timeline.to(
                controls,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.7,

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

                    duration: 0.9,

                    ease: "power3.out"

                },

                "-=0.25"

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
        Fallback if GSAP isn't available.
    */

    fallbackChapter4Intro(
        intro,
        letters,
        controls,
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
    controls,
    ending,
    continueSection
) {

    const elements = [

        intro,

        letters,

        controls,

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
                (index * 450)

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
   LETTER HOVER INTERACTION
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
   FINISH CHAPTER 4
========================================================== */

function finishChapter4() {

    if (
        Chapter4State.finished
    ) {

        return;

    }


    const chapter5 =
        document.getElementById(
            "chapter5"
        );


    /*
        Chapter 5 exists.
    */

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
        Chapter 5 doesn't exist yet.
    */

    console.log(
        "💌 Chapter 4 complete. Chapter 5 is not ready yet."
    );

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
            Don't hijack arrow keys
            while typing in an input.
        */

        const tag =
            document.activeElement?.tagName;


        if (
            tag === "INPUT" ||
            tag === "TEXTAREA"
        ) {

            return;

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            event.preventDefault();

            changeChapter4Letter(-1);

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            event.preventDefault();

            changeChapter4Letter(1);

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
