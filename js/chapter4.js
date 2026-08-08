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
        Continue button
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
        Setup navigation
    */

    setupChapter4Navigation();


    /*
        Setup letter tabs
    */

    setupChapter4LetterTabs();


    /*
        Setup letter interactions
    */

    setupChapter4Letter();


    /*
        Prepare Chapter 4
    */

    prepareChapter4();


    Chapter4State.initialized = true;


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

    chapter.style.display = "none";


    /*
        IMPORTANT:
        Do NOT create an internal scrollbar.
        The browser document should handle scrolling.
    */

    chapter.style.height = "auto";

    chapter.style.minHeight = "100vh";

    chapter.style.overflowX = "hidden";

    chapter.style.overflowY = "visible";


    /*
        Find all letters.
    */

    const letters =
        chapter.querySelectorAll(
            ".chapter4-letter"
        );


    Chapter4State.totalLetters =
        letters.length;


    Chapter4State.currentLetter = 1;


    /*
        Reset letters.
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
        Reset letter tabs.
    */

    const tabs =
        chapter.querySelectorAll(
            ".chapter4-letter-tab"
        );


    tabs.forEach(
        (tab, index) => {

            if (index === 0) {

                tab.classList.add(
                    "active"
                );

                tab.setAttribute(
                    "aria-selected",
                    "true"
                );

            } else {

                tab.classList.remove(
                    "active"
                );

                tab.setAttribute(
                    "aria-selected",
                    "false"
                );

            }

        }
    );


    /*
        Update navigation.
    */

    updateChapter4Navigation();


    /*
        Prepare entrance animation.
    */

    const intro =
        chapter.querySelector(
            ".chapter4-intro"
        );


    const navigation =
        chapter.querySelector(
            ".chapter4-letter-nav"
        );


    const letterContainer =
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

        navigation,

        letterContainer,

        controls,

        ending,

        continueSection

    ];


    elements.forEach(
        (element) => {

            if (!element) {

                return;

            }


            element.style.opacity = "0";

            element.style.transform =
                "translateY(25px)";

        }
    );

}


/* ==========================================================
   SETUP LETTER TAB NAVIGATION
========================================================== */

function setupChapter4LetterTabs() {

    const chapter =
        document.getElementById(
            "chapter4"
        );


    if (!chapter) {

        return;

    }


    const tabs =
        chapter.querySelectorAll(
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
                        Number.isNaN(
                            letterNumber
                        )
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
   SETUP PREVIOUS / NEXT BUTTONS
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


    const tabs =
        chapter.querySelectorAll(
            ".chapter4-letter-tab"
        );


    if (!letters.length) {

        return;

    }


    if (
        letterNumber < 1 ||
        letterNumber > letters.length
    ) {

        return;

    }


    const targetIndex =
        letterNumber - 1;


    /*
        Hide all letters.
    */

    letters.forEach(
        (letter) => {

            letter.classList.remove(
                "active"
            );

            letter.style.display =
                "none";

        }
    );


    /*
        Show selected letter.
    */

    const selectedLetter =
        letters[targetIndex];


    if (selectedLetter) {

        selectedLetter.style.display =
            "block";


        /*
            Restart animation.
        */

        selectedLetter.classList.remove(
            "active"
        );


        void selectedLetter.offsetWidth;


        selectedLetter.classList.add(
            "active"
        );

    }


    /*
        Update tabs.
    */

    tabs.forEach(
        (tab, index) => {

            if (
                index === targetIndex
            ) {

                tab.classList.add(
                    "active"
                );

                tab.setAttribute(
                    "aria-selected",
                    "true"
                );

            } else {

                tab.classList.remove(
                    "active"
                );

                tab.setAttribute(
                    "aria-selected",
                    "false"
                );

            }

        }
    );


    /*
        Update state.
    */

    Chapter4State.currentLetter =
        letterNumber;


    /*
        Update Previous / Next.
    */

    updateChapter4Navigation();


    /*
        Scroll the DOCUMENT,
        not Chapter 4 itself.

        This prevents nested scrolling.
    */

    const letterNav =
        chapter.querySelector(
            ".chapter4-letter-nav"
        );


    if (letterNav) {

        const navTop =
            letterNav.getBoundingClientRect().top +
            window.scrollY;


        window.scrollTo({

            top:
                Math.max(
                    0,
                    navTop - 30
                ),

            behavior: "smooth"

        });

    }


    console.log(
        `💌 Showing letter ${letterNumber}`
    );

}


/* ==========================================================
   UPDATE NAVIGATION
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
        Indicator
    */

    if (indicator) {

        /*
            Your HTML uses:
            I / III

            So we use Roman numerals.
        */

        const romanNumerals = [
            "",
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X"
        ];


        const currentText =
            romanNumerals[current] ||
            current;


        const totalText =
            romanNumerals[total] ||
            total;


        indicator.textContent =
            `${currentText} / ${totalText}`;

    }


    /*
        Previous
    */

    if (previousButton) {

        previousButton.disabled =
            current <= 1;

    }


    /*
        Next
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
        Hide every chapter.
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
        VERY IMPORTANT:
        Chapter 4 must NOT become
        its own scrolling container.
    */

    chapter.style.height = "auto";

    chapter.style.minHeight =
        "100vh";

    chapter.style.overflowX =
        "hidden";

    chapter.style.overflowY =
        "visible";


    /*
        Restore normal browser scrolling.

        This is especially important if
        earlier chapters use body overflow hidden.
    */

    document.documentElement.style.height =
        "auto";


    document.documentElement.style.overflowY =
        "auto";


    document.body.style.height =
        "auto";


    document.body.style.overflowY =
        "auto";


    document.body.style.overflowX =
        "hidden";


    /*
        Update state.
    */

    Chapter4State.visible =
        true;


    Chapter4State.finished =
        false;


    /*
        Always start at Letter I.
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


    /*
        Reset tabs.
    */

    const tabs =
        chapter.querySelectorAll(
            ".chapter4-letter-tab"
        );


    tabs.forEach(
        (tab, index) => {

            if (index === 0) {

                tab.classList.add(
                    "active"
                );

                tab.setAttribute(
                    "aria-selected",
                    "true"
                );

            } else {

                tab.classList.remove(
                    "active"
                );

                tab.setAttribute(
                    "aria-selected",
                    "false"
                );

            }

        }
    );


    updateChapter4Navigation();


    /*
        Scroll the DOCUMENT to the top.
    */

    window.scrollTo({

        top: 0,

        behavior: "instant"

    });


    /*
        Start entrance animation.
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


    const navigation =
        chapter.querySelector(
            ".chapter4-letter-nav"
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
        GSAP available
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

                    duration: 0.9,

                    ease: "power3.out"

                }
            );

        }


        if (navigation) {

            timeline.to(
                navigation,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.7,

                    ease: "power3.out"

                },

                "-=0.45"

            );

        }


        if (letters) {

            timeline.to(
                letters,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.9,

                    ease: "power3.out"

                },

                "-=0.35"

            );

        }


        if (controls) {

            timeline.to(
                controls,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.6,

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

                "-=0.25"

            );

        }


        if (continueSection) {

            timeline.to(
                continueSection,
                {

                    opacity: 1,

                    y: 0,

                    duration: 0.7,

                    ease: "power3.out"

                },

                "-=0.2"

            );

        }


        return;

    }


    /*
        Fallback
    */

    fallbackChapter4Intro(

        intro,

        navigation,

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
    navigation,
    letters,
    controls,
    ending,
    continueSection
) {

    const elements = [

        intro,

        navigation,

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

                150 +
                index * 300

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
        If Chapter 5 exists,
        continue to it.
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


    Chapter4State.finished =
        false;

}


/* ==========================================================
   CHAPTER CHANGE EVENT
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
            Don't hijack arrow keys while
            typing into an input or textarea.
        */

        const activeElement =
            document.activeElement;


        if (
            activeElement &&
            (
                activeElement.tagName ===
                    "INPUT" ||

                activeElement.tagName ===
                    "TEXTAREA"
            )
        ) {

            return;

        }


        /*
            Left = previous
        */

        if (
            event.key ===
            "ArrowLeft"
        ) {

            event.preventDefault();

            changeChapter4Letter(
                -1
            );

        }


        /*
            Right = next
        */

        if (
            event.key ===
            "ArrowRight"
        ) {

            event.preventDefault();

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
