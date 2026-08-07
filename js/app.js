/* ==========================================================
   APP.JS
   Project : Our Story
   Purpose : Main Application Controller
   Chapter : 0
========================================================== */


/* ==========================================================
   APPLICATION STATE
========================================================== */

const App = {

    initialized: false,

    chapter: 0,

    isLoading: true,

    musicStarted: false

};


/* ==========================================================
   APPLICATION INITIALIZATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});


/* ==========================================================
   INITIALIZE APP
========================================================== */

function initializeApp() {

    if (App.initialized) {
        return;
    }


    console.log("🌸 Our Story is starting...");


    /*
        Each module is checked before being initialized.

        This allows us to build the JavaScript files
        one at a time without breaking the entire app.
    */


    initializeModule(
        "Loader",
        typeof initLoader === "function",
        initLoader
    );


    initializeModule(
        "Cursor",
        typeof initCursor === "function",
        initCursor
    );


    initializeModule(
        "Audio",
        typeof initAudio === "function",
        initAudio
    );


    initializeModule(
        "Particles",
        typeof initParticles === "function",
        initParticles
    );


    initializeModule(
        "Transition",
        typeof initTransition === "function",
        initTransition
    );


    initializeModule(
        "Chapter 0",
        typeof initChapter0 === "function",
        initChapter0
    );

   initializeModule(
       "Chapter 1",
       typeof initChapter1 === "function",
       initChapter1
   );


    App.initialized = true;


    console.log("✨ Our Story is ready.");

}


/* ==========================================================
   MODULE INITIALIZER
========================================================== */

function initializeModule(
    moduleName,
    isAvailable,
    initializeFunction
) {

    if (!isAvailable) {

        console.warn(
            `⏳ ${moduleName} is not available yet.`
        );

        return;

    }


    try {

        initializeFunction();

        console.log(
            `✓ ${moduleName} initialized.`
        );

    }

    catch (error) {

        console.error(
            `✕ Error initializing ${moduleName}:`,
            error
        );

    }

}


/* ==========================================================
   APP STATE HELPERS
========================================================== */

function setChapter(chapterNumber) {

    App.chapter = chapterNumber;


    console.log(
        `📖 Current chapter: ${chapterNumber}`
    );

}


function setLoadingState(isLoading) {

    App.isLoading = isLoading;

}


function setMusicState(isPlaying) {

    App.musicStarted = isPlaying;

}


/* ==========================================================
   GLOBAL ACCESS
========================================================== */

window.OurStory = {

    App,

    setChapter,

    setLoadingState,

    setMusicState

};
