/* ==========================================================
   CHAPTER I — ONCE UPON A TIME
   ========================================================== */


/* ==========================================================
   CHAPTER 1 STATE
   ========================================================== */

const Chapter1State = {

    currentPage: 0,

    totalPages: 5,

    initialized: false,

    introFinished: false,

    chapterFinished: false

};


/* ==========================================================
   INITIALIZE CHAPTER 1
   ========================================================== */

function initChapter1() {

    const chapter =
        document.getElementById("chapter1");

    if (!chapter) {

        console.warn(
            "Chapter 1 element was not found."
        );

        return;

    }


    const pages =
        chapter.querySelectorAll(
            ".chapter1-page"
        );


    const nextButton =
        document.getElementById(
            "chapter1Next"
        );


    const previousButton =
        document.getElementById(
            "chapter1Previous"
        );


    const continueButton =
        document.getElementById(
            "chapter1Continue"
        );


    if (!pages.length) {

        console.warn(
            "Chapter 1 pages were not found."
        );

        return;

    }


    Chapter1State.totalPages =
        pages.length;


    setupChapter1Buttons(
        nextButton,
        previousButton,
        continueButton
    );


    createChapter1Petals();


    updateChapter1Page();


    Chapter1State.initialized =
        true;


    console.log(
        "📖 Chapter 1 initialized."
    );

}


/* ==========================================================
   OPEN CHAPTER 1
   ========================================================== */

function openChapter1Screen() {

    const chapter =
        document.getElementById("chapter1");


    const chapter0 =
        document.getElementById("chapter0");


    if (!chapter) {

        console.warn(
            "Chapter 1 screen does not exist yet."
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
        Show Chapter 1.
    */

    chapter.style.display =
        "flex";


    /*
        Start the intro.
    */

    startChapter1Intro();

}


/* ==========================================================
   CHAPTER 1 INTRO
   ========================================================== */

function startChapter1Intro() {

    const intro =
        document.querySelector(
            ".chapter1-intro"
        );


    const book =
        document.querySelector(
            ".chapter1-book"
        );


    if (!intro || !book) {

        return;

    }


    /*
        Make sure the book starts hidden.
    */

    book.style.opacity =
        "0";


    book.style.transform =
        "scale(0.96)";


    /*
        Intro animation.
    */

    if (
        typeof gsap !== "undefined"
    ) {

        gsap.fromTo(
            intro,

            {
                opacity: 0,

                y: 20

            },

            {
                opacity: 1,

                y: 0,

                duration: 1.4,

                ease: "power3.out",

                onComplete: () => {

                    setTimeout(
                        revealChapter1Book,
                        1800
                    );

                }

            }
        );

        return;

    }


    /*
        Fallback.
    */

    intro.style.opacity =
        "1";


    setTimeout(
        revealChapter1Book,
        1800
    );

}


/* ==========================================================
   REVEAL BOOK
   ========================================================== */

function revealChapter1Book() {

    const intro =
        document.querySelector(
            ".chapter1-intro"
        );


    const book =
        document.querySelector(
            ".chapter1-book"
        );


    if (!book) {

        return;

    }


    Chapter1State.introFinished =
        true;


    if (
        typeof gsap !== "undefined"
    ) {

        const timeline =
            gsap.timeline();


        timeline.to(
            intro,
            {

                opacity: 0,

                duration: 0.8,

                ease: "power2.out"

            }
        );


        timeline.set(
            intro,
            {

                display: "none"

            }
        );


        timeline.set(
            book,
            {

                display: "flex"

            }
        );


        timeline.fromTo(
            book,

            {

                opacity: 0,

                scale: 0.92,

                y: 25

            },

            {

                opacity: 1,

                scale: 1,

                y: 0,

                duration: 1.4,

                ease: "power3.out"

            }
        );


        return;

    }


    /*
        Fallback.
    */

    if (intro) {

        intro.style.display =
            "none";

    }


    book.style.display =
        "flex";

    book.style.opacity =
        "1";

    book.style.transform =
        "scale(1)";

}


/* ==========================================================
   SETUP BUTTONS
   ========================================================== */

function setupChapter1Buttons(
    nextButton,
    previousButton,
    continueButton
) {

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextChapter1Page
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousChapter1Page
        );

    }


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            finishChapter1
        );

    }


    /*
        Keyboard navigation.
    */

    document.addEventListener(
        "keydown",
        handleChapter1Keyboard
    );

}


/* ==========================================================
   KEYBOARD NAVIGATION
   ========================================================== */

function handleChapter1Keyboard(
    event
) {

    const chapter =
        document.getElementById(
            "chapter1"
        );


    if (
        !chapter ||
        chapter.style.display === "none"
    ) {

        return;

    }


    if (
        event.key === "ArrowRight"
    ) {

        nextChapter1Page();

    }


    if (
        event.key === "ArrowLeft"
    ) {

        previousChapter1Page();

    }

}


/* ==========================================================
   NEXT PAGE
   ========================================================== */

function nextChapter1Page() {

    if (
        Chapter1State.chapterFinished
    ) {

        return;

    }


    if (
        Chapter1State.currentPage >=
        Chapter1State.totalPages - 1
    ) {

        finishChapter1Story();

        return;

    }


    const oldPage =
        getCurrentChapter1Page();


    Chapter1State.currentPage++;


    const newPage =
        getCurrentChapter1Page();


    animatePageTurn(
        oldPage,
        newPage,
        "next"
    );


    updateChapter1Navigation();

}


/* ==========================================================
   PREVIOUS PAGE
   ========================================================== */

function previousChapter1Page() {

    if (
        Chapter1State.currentPage <= 0
    ) {

        return;

    }


    const oldPage =
        getCurrentChapter1Page();


    Chapter1State.currentPage--;


    const newPage =
        getCurrentChapter1Page();


    animatePageTurn(
        oldPage,
        newPage,
        "previous"
    );


    updateChapter1Navigation();

}


/* ==========================================================
   GET CURRENT PAGE
   ========================================================== */

function getCurrentChapter1Page() {

    const pages =
        document.querySelectorAll(
            ".chapter1-page"
        );


    return pages[
        Chapter1State.currentPage
    ];

}


/* ==========================================================
   UPDATE PAGE
   ========================================================== */

function updateChapter1Page() {

    const pages =
        document.querySelectorAll(
            ".chapter1-page"
        );


    pages.forEach(
        (page, index) => {

            page.classList.toggle(
                "active",
                index ===
                Chapter1State.currentPage
            );

        }
    );


    updateChapter1Navigation();

}


/* ==========================================================
   UPDATE NAVIGATION
   ========================================================== */

function updateChapter1Navigation() {

    const previousButton =
        document.getElementById(
            "chapter1Previous"
        );


    const nextButton =
        document.getElementById(
            "chapter1Next"
        );


    const indicator =
        document.getElementById(
            "chapter1Indicator"
        );


    if (previousButton) {

        previousButton.disabled =
            Chapter1State.currentPage === 0;

    }


    if (nextButton) {

        nextButton.textContent =
            Chapter1State.currentPage ===
            Chapter1State.totalPages - 1

                ? "Finish"

                : "Next →";

    }


    if (indicator) {

        indicator.textContent =
            `${Chapter1State.currentPage + 1} / ${Chapter1State.totalPages}`;

    }

}


/* ==========================================================
   PAGE TURN ANIMATION
   ========================================================== */

function animatePageTurn(
    oldPage,
    newPage,
    direction
) {

    if (!oldPage || !newPage) {

        updateChapter1Page();

        return;

    }


    /*
        GSAP animation.
    */

    if (
        typeof gsap !== "undefined"
    ) {

        const timeline =
            gsap.timeline();


        /*
            Prepare new page.
        */

        gsap.set(
            newPage,
            {

                opacity: 0,

                x:
                    direction === "next"
                        ? 35
                        : -35,

                rotateY:
                    direction === "next"
                        ? -8
                        : 8

            }
        );


        /*
            Old page leaves.
        */

        timeline.to(
            oldPage,
            {

                opacity: 0,

                x:
                    direction === "next"
                        ? -35
                        : 35,

                rotateY:
                    direction === "next"
                        ? 8
                        : -8,

                duration: 0.45,

                ease: "power2.inOut"

            }
        );


        /*
            Switch active page.
        */

        timeline.call(
            () => {

                oldPage.classList.remove(
                    "active"
                );

                newPage.classList.add(
                    "active"
                );

            }
        );


        /*
            New page enters.
        */

        timeline.to(
            newPage,
            {

                opacity: 1,

                x: 0,

                rotateY: 0,

                duration: 0.65,

                ease: "power3.out"

            }
        );


        /*
            Reset old page.
        */

        timeline.set(
            oldPage,
            {

                x: 0,

                rotateY: 0

            }
        );


        /*
            Trigger a small text animation.
        */

        timeline.call(
            () => {

                animateChapter1Text(
                    newPage
                );

            }
        );


        return;

    }


    /*
        Fallback without GSAP.
    */

    oldPage.classList.remove(
        "active"
    );

    newPage.classList.add(
        "active"
    );

    animateChapter1Text(
        newPage
    );

}


/* ==========================================================
   TEXT ANIMATION
   ========================================================== */

function animateChapter1Text(
    page
) {

    if (!page) {

        return;

    }


    const content =
        page.querySelector(
            ".chapter1-page-content"
        );


    if (!content) {

        return;

    }


    if (
        typeof gsap !== "undefined"
    ) {

        gsap.fromTo(
            content,

            {

                opacity: 0,

                y: 12

            },

            {

                opacity: 1,

                y: 0,

                duration: 0.7,

                delay: 0.1,

                ease: "power2.out"

            }
        );

    }

}


/* ==========================================================
   FINISH STORY
   ========================================================== */

function finishChapter1Story() {

    if (
        Chapter1State.chapterFinished
    ) {

        return;

    }


    Chapter1State.chapterFinished =
        true;


    const navigation =
        document.querySelector(
            ".chapter1-navigation"
        );


    const continueButton =
        document.getElementById(
            "chapter1Continue"
        );


    if (
        typeof gsap !== "undefined"
    ) {

        if (navigation) {

            gsap.to(
                navigation,
                {

                    opacity: 0,

                    y: 15,

                    duration: 0.5,

                    onComplete: () => {

                        navigation.style.display =
                            "none";

                    }

                }
            );

        }


        if (continueButton) {

            continueButton.style.display =
                "inline-block";


            gsap.fromTo(
                continueButton,

                {

                    opacity: 0,

                    y: 15

                },

                {

                    opacity: 1,

                    y: 0,

                    duration: 0.8,

                    delay: 0.5,

                    ease: "power3.out"

                }
            );

        }


        return;

    }


    if (navigation) {

        navigation.style.display =
            "none";

    }


    if (continueButton) {

        continueButton.style.display =
            "inline-block";

    }

}


/* ==========================================================
   FINISH CHAPTER 1
   ========================================================== */

function finishChapter1() {

    console.log(
        "🌸 Chapter 1 complete."
    );


    /*
        We are not building Chapter II yet.

        For now, we simply prepare the transition.
    */

    if (
        typeof transitionToChapter ===
        "function"
    ) {

        transitionToChapter(2);

        return;

    }


    console.warn(
        "Chapter transition system is not available."
    );

}


/* ==========================================================
   CREATE PETALS
   ========================================================== */

function createChapter1Petals() {

    const container =
        document.querySelector(
            ".chapter1-background"
        );


    if (!container) {

        return;

    }


    /*
        Avoid creating them twice.
    */

    if (
        container.dataset.petalsCreated ===
        "true"
    ) {

        return;

    }


    const petalSymbols = [
        "✿",
        "❀",
        "🌸"
    ];


    const petalCount = 14;


    for (
        let i = 0;
        i < petalCount;
        i++
    ) {

        const petal =
            document.createElement(
                "span"
            );


        petal.className =
            "chapter1-petal";


        petal.textContent =
            petalSymbols[
                Math.floor(
                    Math.random() *
                    petalSymbols.length
                )
            ];


        petal.style.left =
            `${Math.random() * 100}%`;


        petal.style.animationDuration =
            `${8 + Math.random() * 8}s`;


        petal.style.animationDelay =
            `${Math.random() * 8}s`;


        petal.style.fontSize =
            `${0.7 + Math.random() * 0.8}rem`;


        container.appendChild(
            petal
        );

    }


    container.dataset.petalsCreated =
        "true";

}


/* ==========================================================
   RESET CHAPTER 1
   ========================================================== */

function resetChapter1() {

    Chapter1State.currentPage =
        0;

    Chapter1State.chapterFinished =
        false;

    Chapter1State.introFinished =
        false;


    updateChapter1Page();


    const navigation =
        document.querySelector(
            ".chapter1-navigation"
        );


    const continueButton =
        document.getElementById(
            "chapter1Continue"
        );


    if (navigation) {

        navigation.style.display =
            "flex";

        navigation.style.opacity =
            "1";

    }


    if (continueButton) {

        continueButton.style.display =
            "none";

    }

}
