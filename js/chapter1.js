/* ==========================================================
   CHAPTER I — ONCE UPON A TIME
   Project : Our Story
   Purpose : Chapter I Storybook
   ========================================================== */


/* ==========================================================
   CHAPTER 1 STATE
   ========================================================== */

const Chapter1State = {

    currentPage: 0,

    totalPages: 0,

    initialized: false,

    introFinished: false,

    chapterFinished: false,

    isAnimating: false

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


    /*
        Prepare Chapter 1.
    */

    prepareChapter1();


    /*
        Setup buttons.
    */

    setupChapter1Buttons(
        nextButton,
        previousButton,
        continueButton
    );


    /*
        Create falling petals.
    */

    createChapter1Petals();


    /*
        Show Page 1.
    */

    updateChapter1Page();


    Chapter1State.initialized =
        true;


    console.log(
        "📖 Chapter 1 initialized."
    );

}


/* ==========================================================
   PREPARE CHAPTER 1
   ========================================================== */

function prepareChapter1() {

    const chapter =
        document.getElementById(
            "chapter1"
        );


    if (!chapter) {

        return;

    }


    /*
        Chapter 1 stays hidden until
        Chapter 0 finishes.
    */

    chapter.style.display =
        "none";


    /*
        Prepare all pages.

        Only Page 1 will be visible.
    */

    const pages =
        chapter.querySelectorAll(
            ".chapter1-page"
        );


    pages.forEach(
        (page, index) => {

            if (index === 0) {

                page.classList.add(
                    "active"
                );

                page.style.display =
                    "block";

                page.style.opacity =
                    "1";

                page.style.transform =
                    "none";

            } else {

                page.classList.remove(
                    "active"
                );

                page.style.display =
                    "none";

                page.style.opacity =
                    "0";

            }

        }
    );


    /*
        Continue button starts hidden.
    */

    const continueButton =
        document.getElementById(
            "chapter1Continue"
        );


    if (continueButton) {

        continueButton.style.display =
            "none";

    }

}


/* ==========================================================
   OPEN CHAPTER 1 SCREEN
   ========================================================== */

function openChapter1Screen() {

    const chapter =
        document.getElementById(
            "chapter1"
        );


    const chapter0 =
        document.getElementById(
            "chapter0"
        );


    if (!chapter) {

        console.warn(
            "Chapter 1 screen does not exist."
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
        Start Chapter 1 intro.
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


    Chapter1State.introFinished =
        false;


    /*
        Make sure book starts hidden.
    */

    book.style.opacity =
        "0";

    book.style.transform =
        "scale(0.96)";


    /*
        GSAP animation.
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
                        9000
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
        9000
    );

}


/* ==========================================================
   REVEAL STORYBOOK
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


    /*
        GSAP version.
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

        }


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


    if (!chapter) {

        return;

    }


    if (
        chapter.style.display === "none"
    ) {

        return;

    }


    /*
        Don't navigate while an
        animation is running.
    */

    if (
        Chapter1State.isAnimating
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
        Chapter1State.isAnimating
    ) {

        return;

    }


    if (
        Chapter1State.chapterFinished
    ) {

        return;

    }


    /*
        If we're already on the final page,
        clicking Next finishes the story.
    */

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
        Chapter1State.isAnimating
    ) {

        return;

    }


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

    const chapter =
        document.getElementById(
            "chapter1"
        );


    if (!chapter) {

        return null;

    }


    const pages =
        chapter.querySelectorAll(
            ".chapter1-page"
        );


    return pages[
        Chapter1State.currentPage
    ] || null;

}


/* ==========================================================
   UPDATE PAGE
   ========================================================== */

function updateChapter1Page() {

    const chapter =
        document.getElementById(
            "chapter1"
        );


    if (!chapter) {

        return;

    }


    const pages =
        chapter.querySelectorAll(
            ".chapter1-page"
        );


    pages.forEach(
        (page, index) => {

            if (
                index ===
                Chapter1State.currentPage
            ) {

                page.classList.add(
                    "active"
                );

                page.style.display =
                    "block";

                page.style.opacity =
                    "1";

                page.style.transform =
                    "none";

            } else {

                page.classList.remove(
                    "active"
                );

                page.style.display =
                    "none";

                page.style.opacity =
                    "0";

            }

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


    /*
        Previous button.
    */

    if (previousButton) {

        previousButton.disabled =
            Chapter1State.currentPage === 0;

    }


    /*
        Next button.
    */

    if (nextButton) {

        if (
            Chapter1State.currentPage ===
            Chapter1State.totalPages - 1
        ) {

            nextButton.textContent =
                "Finish";

        } else {

            nextButton.textContent =
                "Next →";

        }

    }


    /*
        Page indicator.
    */

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
        Prevent another page click
        while animation is running.
    */

    Chapter1State.isAnimating =
        true;


    /*
        No GSAP fallback.
    */

    if (
        typeof gsap === "undefined"
    ) {

        oldPage.classList.remove(
            "active"
        );

        oldPage.style.display =
            "none";


        newPage.classList.add(
            "active"
        );

        newPage.style.display =
            "block";

        newPage.style.opacity =
            "1";


        newPage.style.transform =
            "none";


        Chapter1State.isAnimating =
            false;


        animateChapter1Text(
            newPage
        );


        return;

    }


    /*
        Make sure new page is visible
        to GSAP before animation.
    */

    newPage.style.display =
        "block";


    newPage.classList.add(
        "active"
    );


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
        Animate old page away.
    */

    gsap.to(
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

            ease: "power2.inOut",

            onComplete: () => {

                oldPage.classList.remove(
                    "active"
                );


                oldPage.style.display =
                    "none";


                /*
                    Animate new page in.
                */

                gsap.to(
                    newPage,
                    {

                        opacity: 1,

                        x: 0,

                        rotateY: 0,

                        duration: 0.65,

                        ease: "power3.out",

                        onComplete: () => {

                            Chapter1State.isAnimating =
                                false;


                            animateChapter1Text(
                                newPage
                            );

                        }

                    }
                );

            }

        }
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


    /*
        Fallback.
    */

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
        Chapter II isn't built yet.

        For now, transitionToChapter(2)
        is prepared for the next chapter.
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
   CREATE FALLING PETALS
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
        Don't create petals twice.
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


    const petalCount =
        14;


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


    Chapter1State.isAnimating =
        false;


    /*
        Reset page visibility.
    */

    updateChapter1Page();


    /*
        Restore navigation.
    */

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

        navigation.style.transform =
            "none";

    }


    if (continueButton) {

        continueButton.style.display =
            "none";

        continueButton.style.opacity =
            "0";

    }

}


/* ==========================================================
   AUTO INITIALIZATION SAFETY
   ========================================================== */

/*
    app.js normally initializes Chapter 1.

    This event is included only as a safety
    measure if Chapter 1 is loaded separately.
*/

document.addEventListener(
    "chapterChange",
    (event) => {

        if (
            !event.detail
        ) {

            return;

        }


        if (
            event.detail.chapter === 1 &&
            !Chapter1State.initialized
        ) {

            initChapter1();

        }

    }
);
