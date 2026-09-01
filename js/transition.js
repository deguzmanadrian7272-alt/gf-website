/* ==========================================================
   TRANSITION.JS
   Project : Our Story
   Purpose : Chapter & Page Transitions
   Chapter : 0
========================================================== */


/* ==========================================================
   TRANSITION SETTINGS
========================================================== */

const TransitionSettings = {

    duration: 1200,

    easing: "power2.inOut"

};


/* ==========================================================
   INITIALIZE TRANSITIONS
========================================================== */

function initTransition() {

    /*
        Prepare the page for smooth transitions.
    */

    document.body.classList.add(
        "transitions-ready"
    );


    /*
        Make sure the page starts at the top.
    */

    window.scrollTo(0, 0);


    console.log("🌙 Transitions initialized.");

}


/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */

function transitionToChapter(
    chapterNumber
) {

    /*
        Prevent invalid chapter numbers.
    */

    if (
        typeof chapterNumber !== "number" ||
        chapterNumber < 0
    ) {

        console.warn(
            "Invalid chapter number:",
            chapterNumber
        );

        return;

    }


    /*
        If GSAP isn't available,
        use a simple fallback.
    */

    if (
        typeof gsap === "undefined"
    ) {

        fallbackChapterTransition(
            chapterNumber
        );

        return;

    }


    /*
        Create a transition overlay.
    */

    const overlay =
        createTransitionOverlay();


    /*
        Animate the overlay in.
    */

    gsap.to(
        overlay,
        {

            opacity: 1,

            duration:
                TransitionSettings.duration / 1000,

            ease:
                TransitionSettings.easing,

            onComplete: () => {

                /*
                    Update application state.
                */

                if (
                      typeof setChapter === "function"
               ) {

                setChapter(
                             chapterNumber
                );

               }


/*
    Open the correct chapter screen.
*/

if (chapterNumber === 1) {

    if (
        typeof openChapter1Screen === "function"
    ) {

        openChapter1Screen();

    }

}


                /*
                    Dispatch an event so
                    other chapters can respond.
                */

                document.dispatchEvent(
                    new CustomEvent(
                        "chapterChange",
                        {

                            detail: {
                                chapter:
                                    chapterNumber
                            }

                        }
                    )
                );


                /*
                    Reveal the next chapter.
                */

                gsap.to(
                    overlay,
                    {

                        opacity: 0,

                        duration: 1,

                        delay: 0.25,

                        ease:
                            TransitionSettings.easing,

                        onComplete: () => {

                            overlay.remove();

                        }

                    }
                );

            }

        }
    );

}


/* ==========================================================
   CREATE TRANSITION OVERLAY
========================================================== */

function createTransitionOverlay() {

    /*
        Prevent duplicate overlays.
    */

    const existingOverlay =
        document.getElementById(
            "transition-overlay"
        );


    if (existingOverlay) {

        existingOverlay.remove();

    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "transition-overlay";


    /*
        The overlay covers the entire
        screen during the transition.
    */

    overlay.style.position =
        "fixed";

    overlay.style.inset =
        "0";

    overlay.style.width =
        "100%";

    overlay.style.height =
        "100%";


    /*
        Keep it above everything else.
    */

    overlay.style.zIndex =
        "9999";


    /*
        Soft romantic transition color.
    */

    overlay.style.background =
        "rgba(18, 12, 20, 1)";


    /*
        Start invisible.
    */

    overlay.style.opacity =
        "0";


    /*
        Don't let the overlay interfere
        with mouse interaction.
    */

    overlay.style.pointerEvents =
        "none";


    document.body.appendChild(
        overlay
    );


    return overlay;

}


/* ==========================================================
   FALLBACK TRANSITION
   Used if GSAP is unavailable.
========================================================== */

function fallbackChapterTransition(
    chapterNumber
) {

    const overlay =
        createTransitionOverlay();


    overlay.style.transition =
        `opacity ${
            TransitionSettings.duration
        }ms ease`;


    requestAnimationFrame(() => {

        overlay.style.opacity =
            "1";


        setTimeout(() => {

            if (
                typeof setChapter === "function"
            ) {

                setChapter(
                    chapterNumber
                );

            }


            document.dispatchEvent(
                new CustomEvent(
                    "chapterChange",
                    {

                        detail: {
                            chapter:
                                chapterNumber
                        }

                    }
                )
            );


            overlay.style.opacity =
                "0";


            setTimeout(() => {

                overlay.remove();

            }, TransitionSettings.duration);

        }, TransitionSettings.duration);

    });

}


/* ==========================================================
   FADE OUT CURRENT PAGE
========================================================== */

function fadeOutPage(
    callback = null
) {

    if (
        typeof gsap === "undefined"
    ) {

        if (
            typeof callback === "function"
        ) {

            callback();

        }

        return;

    }


    gsap.to(
        document.body,
        {

            opacity: 0,

            duration: 0.8,

            ease: "power2.inOut",

            onComplete: () => {

                if (
                    typeof callback === "function"
                ) {

                    callback();

                }

            }

        }
    );

}


/* ==========================================================
   FADE IN CURRENT PAGE
========================================================== */

function fadeInPage() {

    if (
        typeof gsap === "undefined"
    ) {

        document.body.style.opacity =
            "1";

        return;

    }


    gsap.fromTo(
        document.body,

        {
            opacity: 0
        },

        {
            opacity: 1,

            duration: 1,

            ease: "power2.out"

        }
    );

}


/* ==========================================================
   CHAPTER CHANGE LISTENER
========================================================== */

document.addEventListener(
    "chapterChange",
    (event) => {

        const chapter =
            event.detail.chapter;


        console.log(
            `📖 Transitioning to Chapter ${chapter}.`
        );

    }
);
