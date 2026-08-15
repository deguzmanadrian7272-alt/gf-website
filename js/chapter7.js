/* ==========================================================
   CHAPTER VII — THE FUTURE
   Project : Our Story
   File    : chapter7.js
   Purpose : Interactive Future Storybook
   ========================================================== */

function initChapter7() {

    const chapter7 = document.getElementById("chapter7");

    if (!chapter7) {
        console.warn("Chapter 7 element not found.");
        return;
    }

    /* ======================================================
       ELEMENTS
       ====================================================== */

    const navItems =
        chapter7.querySelectorAll(".chapter7-nav-item");

    const sectionCards =
        chapter7.querySelectorAll("[data-chapter7-section]");

    const scrollButtons =
        chapter7.querySelectorAll("[data-chapter7-scroll]");

    const envelopes =
        chapter7.querySelectorAll(".chapter7-envelope");

    const modal =
        document.getElementById("chapter7LetterModal");

    const modalTitle =
        document.getElementById("chapter7LetterTitle");

    const modalText =
        document.getElementById("chapter7LetterText");

    const closeModalButton =
        document.getElementById("chapter7LetterClose");

    const continueButton =
        document.getElementById("chapter7Continue");

    const littleThingCards =
        chapter7.querySelectorAll(".chapter7-polaroid");


    /* ======================================================
       SCROLL HELPER
       ====================================================== */

    function scrollToSection(id) {

        const target =
            document.getElementById(id);

        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /* ======================================================
       SIDEBAR NAVIGATION
       ====================================================== */

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            const targetId =
                item.dataset.target;

            if (!targetId) {
                return;
            }

            scrollToSection(targetId);

        });

    });


    /* ======================================================
       ACTIVE SIDEBAR ITEM
       ====================================================== */

    function setActiveNav(targetId) {

        navItems.forEach((item) => {

            item.classList.toggle(
                "active",
                item.dataset.target === targetId
            );

        });

    }


    /*
        IntersectionObserver keeps the storybook sidebar
        synchronized with the section currently on screen.
    */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    const visibleEntries =
                        entries
                            .filter(
                                entry =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (
                        visibleEntries.length
                    ) {

                        const id =
                            visibleEntries[0]
                                .target
                                .id;

                        setActiveNav(id);

                    }

                },
                {
                    root: null,
                    threshold: [0.2, 0.4, 0.6],
                    rootMargin: "-10% 0px -25% 0px"
                }
            );


        sectionCards.forEach((section) => {

            observer.observe(section);

        });

    }


    /* ======================================================
       SCROLL BUTTONS
       ====================================================== */

    scrollButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.chapter7Scroll;

            if (!targetId) {
                return;
            }

            scrollToSection(targetId);

        });

    });


    /* ======================================================
       LITTLE THINGS — CARD INTERACTION
       ====================================================== */

    littleThingCards.forEach((card) => {

        card.setAttribute(
            "tabindex",
            "0"
        );

        card.setAttribute(
            "role",
            "button"
        );


        function activateCard() {

            littleThingCards.forEach((otherCard) => {

                otherCard.classList.remove(
                    "is-selected"
                );

            });

            card.classList.add(
                "is-selected"
            );

        }


        card.addEventListener(
            "click",
            activateCard
        );


        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    activateCard();

                }

            }
        );

    });


    /* ======================================================
       LETTER DATA
       ====================================================== */

    const letters = {

        travel: {

            title:
                "Open when we want to travel somewhere together",

            text:
                "Maybe one day we'll look at a map and point at a place neither of us has been before. We won't need the perfect plan. I think I'd be happy just knowing that wherever we go, I get to experience something new beside you."

        },


        boring: {

            title:
                "Open when we have a boring day",

            text:
                "I hope we never underestimate an ordinary day. Maybe we'll be sitting around doing absolutely nothing, sending random messages, sharing food, or laughing at something stupid. Somehow, those might become the days I remember most."

        },


        adventure: {

            title:
                "Open when we need an adventure",

            text:
                "Let's say yes to something a little unexpected. A random place. A new food. A late-night walk. A plan that somehow turns into a story. I want us to keep collecting those little moments that begin with, 'Remember when we...?'"

        },


        beginning: {

            title:
                "Open when we look back at how this all started",

            text:
                "If we're reading this much later, I hope we smile at the thought of how our story began. I hope we remember the little moments, the random conversations, and all the tiny things that slowly brought us here."

        }

    };


    /* ======================================================
       OPEN LETTER
       ====================================================== */

    function openLetter(letterKey) {

        if (
            !modal ||
            !modalTitle ||
            !modalText
        ) {

            return;

        }


        const letter =
            letters[letterKey];


        if (!letter) {
            return;
        }


        modalTitle.textContent =
            letter.title;


        modalText.textContent =
            letter.text;


        modal.hidden =
            false;


        requestAnimationFrame(() => {

            modal.classList.add(
                "show"
            );

        });


        document.body.classList.add(
            "chapter7-modal-open"
        );

    }


    /* ======================================================
       CLOSE LETTER
       ====================================================== */

    function closeLetter() {

        if (!modal) {
            return;
        }


        modal.classList.remove(
            "show"
        );


        document.body.classList.remove(
            "chapter7-modal-open"
        );


        setTimeout(() => {

            if (
                !modal.classList.contains(
                    "show"
                )
            ) {

                modal.hidden =
                    true;

            }

        }, 300);

    }


    /* ======================================================
       ENVELOPE CLICK EVENTS
       ====================================================== */

    envelopes.forEach((envelope) => {

        envelope.addEventListener(
            "click",
            () => {

                openLetter(
                    envelope.dataset.letter
                );

            }
        );

    });


    /* ======================================================
       CLOSE BUTTON
       ====================================================== */

    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeLetter
        );

    }


    /* ======================================================
       CLICK OUTSIDE MODAL
       ====================================================== */

    if (modal) {

        modal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === modal
                ) {

                    closeLetter();

                }

            }
        );

    }


    /* ======================================================
       ESCAPE KEY
       ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains("show")
            ) {

                closeLetter();

            }

        }
    );

    
   /* ======================================================
       CHAPTER VII → FINAL CHAPTER
       ====================================================== */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            () => {

                /*
                    Prevent accidental double activation.
                */

                if (continueButton.disabled) {
                    return;
                }


                continueButton.disabled = true;


                console.log(
                    "✨ Chapter VII → Final Chapter"
                );


                /* ==================================================
                   FIND FINAL CHAPTER
                ================================================== */

                const finalChapter =
                    document.getElementById("chapter8") ||
                    document.getElementById("finalChapter");


                /*
                    If the final chapter does not exist,
                    stop here instead of throwing an error.
                */

                if (!finalChapter) {

                    console.warn(
                        "⚠️ Final Chapter element not found."
                    );

                    continueButton.disabled = false;

                    return;

                }


                /* ==================================================
                   TRANSITION SYSTEM FIRST
                ================================================== */

                if (
                    typeof window.transitionToChapter ===
                    "function"
                ) {

                    console.log(
                        "🎬 Using transitionToChapter(8)..."
                    );


                    window.transitionToChapter(8);


                    /*
                        Give the existing transition system
                        time to complete.

                        If Chapter 8 is still not visible,
                        use the direct fallback.
                    */

                    setTimeout(
                        () => {

                            const isVisible =
                                finalChapter.classList.contains(
                                    "active"
                                ) ||
                                getComputedStyle(
                                    finalChapter
                                ).display !== "none";


                            if (!isVisible) {

                                console.warn(
                                    "⚠️ Transition did not open Final Chapter. Using direct fallback."
                                );


                                openFinalChapterDirectly();

                            }

                        },
                        700
                    );


                    return;

                }


                /* ==================================================
                   DIRECT FALLBACK
                ================================================== */

                console.warn(
                    "⚠️ transitionToChapter() not available. Using direct navigation."
                );


                openFinalChapterDirectly();


                /* ==================================================
                   DIRECT FINAL CHAPTER NAVIGATION
                ================================================== */

                function openFinalChapterDirectly() {

                    /*
                        Hide every chapter first.

                        This is important because all chapters
                        exist in the same HTML document.
                    */

                    document
                        .querySelectorAll(
                            "main[id^='chapter'], #finalChapter"
                        )
                        .forEach(
                            (chapter) => {

                                chapter.classList.remove(
                                    "active"
                                );

                                chapter.style.display =
                                    "none";

                            }
                        );


                    /*
                        Show Final Chapter.
                    */

                    finalChapter.classList.add(
                        "active"
                    );

                    finalChapter.style.display =
                        "block";


                    /*
                        Reset the Final Chapter scroll.
                    */

                    finalChapter.scrollTop =
                        0;


                    window.scrollTo({

                        top: 0,

                        behavior:
                            "smooth"

                    });


                    /*
                        Notify the existing navigation system
                        that Chapter 8 is now active.

                        This keeps other project logic synchronized.
                    */

                    document.dispatchEvent(

                        new CustomEvent(
                            "chapterChange",
                            {
                                detail: {
                                    chapter: 8
                                }
                            }
                        )

                    );


                    console.log(
                        "💗 Final Chapter opened directly."
                    );

                }

            }
        );

    }


    /* ======================================================
       INITIAL STATE
       ====================================================== */

    if (modal) {

        modal.hidden =
            true;

        modal.classList.remove(
            "show"
        );

    }


    if (navItems.length) {

        setActiveNav(
            "chapter7Hopes"
        );

    }


    console.log(
        "Chapter VII — The Future initialized ♡"
    );

}


/* ==========================================================
   INITIALIZATION
   ========================================================== */

/*
    If the script loads before the DOM is ready,
    wait for DOMContentLoaded.

    If the script loads after DOMContentLoaded has
    already fired, initialize immediately.
*/

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initChapter7
    );

}

else {

    initChapter7();

}
