/* ==========================================================
   LOADER.JS
   Project : Our Story
   Purpose : Loading Screen
   Chapter : 0
========================================================== */


/* ==========================================================
   LOADER SETTINGS
========================================================== */

const LoaderSettings = {

    duration: 3500,

    fadeDuration: 900,

    minimumDisplayTime: 1800

};


/* ==========================================================
   LOADER INITIALIZATION
========================================================== */

function initLoader() {

    const loader = document.getElementById("loader");

    const progress = document.getElementById("loader-progress");


    /*
        Safety check.

        If either element doesn't exist,
        don't allow the loader script to break
        the rest of the website.
    */

    if (!loader || !progress) {

        console.warn(
            "Loader elements were not found."
        );

        setLoadingState(false);

        return;

    }


    /*
        Start the loading sequence.
    */

    startLoader(loader, progress);

}


/* ==========================================================
   START LOADER
========================================================== */

function startLoader(loader, progress) {

    const startTime = performance.now();


    /*
        Make sure the loader is visible.
    */

    loader.style.opacity = "1";

    loader.style.visibility = "visible";

    loader.style.pointerEvents = "all";


    /*
        Reset progress.
    */

    progress.style.width = "0%";


    /*
        Begin progress animation.
    */

    animateProgress(
        progress,
        startTime
    );

}


/* ==========================================================
   PROGRESS ANIMATION
========================================================== */

function animateProgress(progress, startTime) {

    const currentTime = performance.now();

    const elapsedTime = currentTime - startTime;


    /*
        Convert elapsed time into a percentage.
    */

    let percentage =
        (elapsedTime / LoaderSettings.duration) * 100;


    /*
        Keep percentage between 0 and 100.
    */

    percentage = Math.min(
        percentage,
        100
    );


    progress.style.width = `${percentage}%`;


    /*
        Continue animation until complete.
    */

    if (percentage < 100) {

        requestAnimationFrame(() => {

            animateProgress(
                progress,
                startTime
            );

        });

        return;

    }


    /*
        Make sure the loader remains visible
        for at least the minimum display time.
    */

    const remainingTime =
        LoaderSettings.minimumDisplayTime -
        elapsedTime;


    if (remainingTime > 0) {

        setTimeout(() => {

            finishLoader();

        }, remainingTime);

    }

    else {

        finishLoader();

    }

}


/* ==========================================================
   FINISH LOADER
========================================================== */

function finishLoader() {

    const loader = document.getElementById("loader");


    if (!loader) {

        setLoadingState(false);

        return;

    }


    /*
        Tell the application that loading is finished.
    */

    setLoadingState(false);


    /*
        Fade the loader away.
    */

    loader.style.transition =
        `opacity ${LoaderSettings.fadeDuration}ms ease`;

    loader.style.opacity = "0";


    /*
        Remove the loader from interaction
        after the fade begins.
    */

    loader.style.pointerEvents = "none";


    /*
        Completely hide it after
        the visual transition finishes.
    */

    setTimeout(() => {

        loader.style.visibility = "hidden";

        loader.style.display = "none";


        /*
            Let Chapter 0 begin its own
            entrance animation.
        */

        document.body.classList.add(
            "loader-complete"
        );


    }, LoaderSettings.fadeDuration);

}


/* ==========================================================
   MANUAL LOADER CONTROL
========================================================== */

/*
    These functions are exposed so that
    other parts of the website can control
    the loader later if necessary.
*/


function showLoader() {

    const loader = document.getElementById("loader");


    if (!loader) {
        return;
    }


    loader.style.display = "flex";

    loader.style.visibility = "visible";

    loader.style.opacity = "1";

    loader.style.pointerEvents = "all";

}


function hideLoader() {

    finishLoader();

}