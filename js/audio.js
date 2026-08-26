/* ==========================================================
   AUDIO.JS
   Project : Our Story
   Purpose : Background Music & Sound Effects
   Chapters: 0 → Final
========================================================== */


/* ==========================================================
   AUDIO SETTINGS
========================================================== */

const AudioSettings = {

    musicVolume: 0.35,

    fadeDuration: 1800,

    fadeStep: 0.02,

    fadeInterval: 50,

    volumeStep: 0.05

};


/* ==========================================================
   AUDIO STATE
========================================================== */

const AudioState = {

    musicStarted: false,

    musicPlaying: false,

    currentChapter: null,

    pendingChapter: null

};


/* ==========================================================
   CHAPTER MUSIC
========================================================== */

const ChapterMusic = {

    1: "assets/music/chapter1.mp3",

    2: "assets/music/chapter2.mp3",

    // Add these later:

    // 3: "assets/music/chapter3.mp3",
    // 4: "assets/music/chapter4.mp3",
    // 5: "assets/music/chapter5.mp3",
    // 6: "assets/music/chapter6.mp3",
    // 7: "assets/music/chapter7.mp3",
    // final: "assets/music/final.mp3"

};


/* ==========================================================
   AUDIO ELEMENT
========================================================== */

let storyMusic = null;


/* ==========================================================
   AUDIO CONTROL STATE
========================================================== */

let fadeTimer = null;

let chapterControlsBound = false;

let chapterObserver = null;


/* ==========================================================
   CREATE / GET AUDIO ELEMENT
========================================================== */

function getMusicElement() {

    if (storyMusic) {

        return storyMusic;

    }


    storyMusic =
        document.getElementById("bgMusic");


    /*
        If bgMusic does not exist,
        create it automatically.
    */

    if (!storyMusic) {

        storyMusic =
            document.createElement("audio");

        storyMusic.id = "bgMusic";

        storyMusic.preload = "auto";

        document.body.appendChild(
            storyMusic
        );

    }


    storyMusic.loop = true;


    return storyMusic;

}


/* ==========================================================
   AUDIO INITIALIZATION
========================================================== */

function initAudio() {

    const music =
        getMusicElement();


    if (!music) {

        console.warn(
            "Audio element could not be initialized."
        );

        return;

    }


    /*
        Start completely silent.

        Music begins only after
        the user interacts with the site.
    */

    music.volume = 0;


    /*
        Expose audio controls globally.
    */

    window.OurStoryAudio = {

        playMusic,

        pauseMusic,

        stopMusic,

        fadeInMusic,

        fadeOutMusic,

        setMusicVolume,

        toggleMusic,

        playChapterMusic,

        stopChapterMusic,

        increaseVolume,

        decreaseVolume

    };


    /*
        Connect Chapter 0
        Open My Story button.
    */

    const startBtn =
        document.getElementById(
            "startBtn"
        );


    if (startBtn) {

        startBtn.addEventListener(
            "click",
            handleStoryStart
        );

    }


    /*
        Initialize music buttons.
    */

    initChapterMusicControls();


    /*
        Watch chapter visibility changes.

        This is important because the existing
        navigation system is responsible for
        changing the active chapter.

        We wait until Chapter 2 is ACTUALLY active
        before starting chapter2.mp3.
    */

    initChapterObserver();


    /*
        Check the current chapter immediately.
    */

    detectActiveChapter();


    console.log(
        "🎵 Audio initialized."
    );

}


/* ==========================================================
   STORY START
========================================================== */

function handleStoryStart() {

    /*
        Open My Story starts Chapter 1.
    */

    AudioState.pendingChapter = null;

    playChapterMusic(1);

}


/* ==========================================================
   PLAY CHAPTER MUSIC
========================================================== */

async function playChapterMusic(
    chapter
) {

    const music =
        getMusicElement();


    const musicFile =
        ChapterMusic[chapter];


    if (!musicFile) {

        console.warn(
            `No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Do not restart the same song
        if it is already playing.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying
    ) {

        updateAllMusicButtons();

        return;

    }


    /*
        Cancel any existing fade.
    */

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );

        fadeTimer = null;

    }


    /*
        Stop the previous song.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load the new chapter song.
    */

    music.src = musicFile;

    music.loop = true;


    AudioState.currentChapter =
        chapter;

    AudioState.pendingChapter =
        null;


    try {

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            Fade in the new chapter music.
        */

        fadeInMusic();


        /*
            Update the button AFTER
            the song successfully starts.
        */

        updateAllMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        console.log(
            `🎵 Chapter ${chapter} music started.`
        );

    }

    catch (error) {

        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;


        updateAllMusicButtons();


        console.warn(
            `Chapter ${chapter} music could not start:`,
            error
        );

    }

}


/* ==========================================================
   PLAY / RESUME CURRENT MUSIC
========================================================== */

async function playMusic() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        If no song exists yet,
        start Chapter 1.
    */

    if (!music.src) {

        playChapterMusic(1);

        return;

    }


    try {

        /*
            IMPORTANT:

            Do NOT reset currentTime.

            This resumes the song exactly
            where it was paused.
        */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            If volume was zero because
            the music was previously stopped,
            restore the selected volume.
        */

        if (
            music.volume === 0
        ) {

            music.volume =
                AudioSettings.musicVolume;

        }


        updateAllMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        console.log(
            "🎵 Music resumed."
        );

    }

    catch (error) {

        console.warn(
            "Music could not resume:",
            error
        );

    }

}


/* ==========================================================
   PAUSE MUSIC
========================================================== */

function pauseMusic() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        Pause only.

        currentTime is NOT reset.
    */

    music.pause();


    AudioState.musicPlaying =
        false;


    updateAllMusicButtons();


    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(false);

    }


    console.log(
        "⏸️ Music paused."
    );

}


/* ==========================================================
   STOP ALL MUSIC
========================================================== */

function stopMusic() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        Cancel active fade.
    */

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );

        fadeTimer = null;

    }


    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    AudioState.musicStarted =
        false;

    AudioState.musicPlaying =
        false;

    AudioState.currentChapter =
        null;

    AudioState.pendingChapter =
        null;


    updateAllMusicButtons();


    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(false);

    }


    console.log(
        "⏹️ Music stopped."
    );

}


/* ==========================================================
   STOP CURRENT CHAPTER MUSIC
========================================================== */

function stopChapterMusic(
    callback = null
) {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        Cancel previous fade.
    */

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );

        fadeTimer = null;

    }


    /*
        Fade out the current music.
    */

    fadeOutMusic(() => {

        music.pause();

        music.currentTime = 0;

        music.volume = 0;


        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;


        /*
            Do NOT immediately assign
            the next chapter here.

            The navigation system needs
            to finish changing chapters first.
        */

        updateAllMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(false);

        }


        console.log(
            "⏹️ Current chapter music stopped."
        );


        /*
            Run callback if one exists.
        */

        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

    });

}


/* ==========================================================
   FADE IN MUSIC
========================================================== */

function fadeInMusic() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        Cancel existing fade.
    */

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );

        fadeTimer = null;

    }


    const targetVolume =
        AudioSettings.musicVolume;


    music.volume = 0;


    const steps =
        targetVolume /
        AudioSettings.fadeStep;


    const intervalTime =
        AudioSettings.fadeDuration /
        steps;


    fadeTimer =
        setInterval(() => {

            if (
                music.volume >=
                targetVolume
            ) {

                music.volume =
                    targetVolume;

                clearInterval(
                    fadeTimer
                );

                fadeTimer = null;

                return;

            }


            music.volume =
                Math.min(
                    music.volume +
                    AudioSettings.fadeStep,

                    targetVolume
                );

        }, intervalTime);

}


/* ==========================================================
   FADE OUT MUSIC
========================================================== */

function fadeOutMusic(
    callback = null
) {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        Cancel existing fade.
    */

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );

        fadeTimer = null;

    }


    /*
        Already silent.
    */

    if (
        music.volume <= 0.01
    ) {

        music.volume = 0;


        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

        return;

    }


    fadeTimer =
        setInterval(() => {

            if (
                music.volume <= 0.01
            ) {

                music.volume = 0;

                clearInterval(
                    fadeTimer
                );

                fadeTimer = null;


                if (
                    typeof callback ===
                    "function"
                ) {

                    callback();

                }

                return;

            }


            music.volume =
                Math.max(
                    music.volume -
                    AudioSettings.fadeStep,

                    0
                );

        }, AudioSettings.fadeInterval);

}


/* ==========================================================
   SET MUSIC VOLUME
========================================================== */

function setMusicVolume(
    volume
) {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    const safeVolume =
        Math.max(
            0,
            Math.min(
                volume,
                1
            )
        );


    music.volume =
        safeVolume;


    AudioSettings.musicVolume =
        safeVolume;


}


/* ==========================================================
   INCREASE VOLUME
========================================================== */

function increaseVolume() {

    setMusicVolume(
        AudioSettings.musicVolume +
        AudioSettings.volumeStep
    );

}


/* ==========================================================
   DECREASE VOLUME
========================================================== */

function decreaseVolume() {

    setMusicVolume(
        AudioSettings.musicVolume -
        AudioSettings.volumeStep
    );

}


/* ==========================================================
   TOGGLE MUSIC
========================================================== */

function toggleMusic() {

    /*
        PLAYING
        ↓
        PAUSE

        PAUSED
        ↓
        RESUME
    */

    if (
        AudioState.musicPlaying
    ) {

        pauseMusic();

    }

    else {

        playMusic();

    }

}


/* ==========================================================
   MUSIC CONTROL EVENT DELEGATION
========================================================== */

function initChapterMusicControls() {

    if (chapterControlsBound) {

        return;

    }


    chapterControlsBound = true;


    document.addEventListener(
        "click",
        (event) => {


            /* ==================================================
               CHAPTER 1 MUSIC TOGGLE
            ================================================== */

            if (
                event.target.closest(
                    "#chapter1MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /* ==================================================
               CHAPTER 1 VOLUME DOWN
            ================================================== */

            if (
                event.target.closest(
                    "#chapter1VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /* ==================================================
               CHAPTER 1 VOLUME UP
            ================================================== */

            if (
                event.target.closest(
                    "#chapter1VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /* ==================================================
               CHAPTER 1 → CHAPTER 2
            ================================================== */

            if (
                event.target.closest(
                    "#chapter1Continue"
                )
            ) {

                /*
                    IMPORTANT:

                    We are NOT starting Chapter 2
                    immediately.

                    We only mark Chapter 2 as
                    the next music that should play.

                    The chapter observer below will
                    detect when Chapter 2 actually
                    becomes active.
                */

                AudioState.pendingChapter = 2;


                /*
                    Stop Chapter 1 music.

                    The existing navigation system
                    is still responsible for moving
                    to Chapter 2.
                */

                stopChapterMusic();

                return;

            }


            /* ==================================================
               CHAPTER 2 MUSIC TOGGLE
            ================================================== */

            if (
                event.target.closest(
                    "#chapter2MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /* ==================================================
               CHAPTER 2 VOLUME DOWN
            ================================================== */

            if (
                event.target.closest(
                    "#chapter2VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /* ==================================================
               CHAPTER 2 VOLUME UP
            ================================================== */

            if (
                event.target.closest(
                    "#chapter2VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }

        }
    );

}


/* ==========================================================
   CHAPTER OBSERVER
========================================================== */

function initChapterObserver() {

    /*
        Prevent duplicate observers.
    */

    if (chapterObserver) {

        return;

    }


    /*
        Watch the document for changes to
        chapter classes.

        This works with navigation systems
        that switch chapters using:

            classList.add("active")
            classList.remove("active")
            className changes
            DOM replacement
    */

    chapterObserver =
        new MutationObserver(() => {

            detectActiveChapter();

        });


    chapterObserver.observe(
        document.body,
        {

            subtree: true,

            attributes: true,

            attributeFilter: [
                "class"
            ]

        }
    );

}


/* ==========================================================
   DETECT ACTIVE CHAPTER
========================================================== */

function detectActiveChapter() {

    /*
        If Chapter 2 is now active AND
        Chapter 2 is the pending chapter,
        start Chapter 2 music.
    */

    const chapter2 =
        document.getElementById(
            "chapter2"
        );


    if (
        chapter2 &&
        chapter2.classList.contains(
            "active"
        )
    ) {

        if (
            AudioState.pendingChapter === 2
        ) {

            /*
                Clear pending state first
                to prevent repeated starts.
            */

            AudioState.pendingChapter =
                null;


            /*
                Now Chapter 2 is ACTUALLY active.

                Start chapter2.mp3.
            */

            playChapterMusic(2);

        }

    }


    /*
        Future chapters can be added here
        using the same pattern.

        Example:

        if (
            chapter3 &&
            chapter3.classList.contains("active") &&
            AudioState.pendingChapter === 3
        ) {
            AudioState.pendingChapter = null;
            playChapterMusic(3);
        }
    */

}


/* ==========================================================
   UPDATE ALL MUSIC BUTTONS
========================================================== */

function updateAllMusicButtons() {

    /*
        Chapter 1
    */

    updateMusicButton(
        "chapter1MusicToggle",
        "Chapter I"
    );


    /*
        Chapter 2
    */

    updateMusicButton(
        "chapter2MusicToggle",
        "Chapter II"
    );

}


/* ==========================================================
   UPDATE MUSIC BUTTON
========================================================== */

function updateMusicButton(
    buttonId,
    chapterName
) {

    const button =
        document.getElementById(
            buttonId
        );


    if (!button) {

        return;

    }


    /*
        MUSIC IS PLAYING
    */

    if (
        AudioState.musicPlaying
    ) {

        button.textContent =
            "❚❚";

        button.setAttribute(
            "aria-label",
            `Pause ${chapterName} music`
        );

        button.setAttribute(
            "title",
            `Pause ${chapterName} music`
        );

    }


    /*
        MUSIC IS NOT PLAYING
    */

    else {

        button.textContent =
            "▶";

        button.setAttribute(
            "aria-label",
            `Play ${chapterName} music`
        );

        button.setAttribute(
            "title",
            `Play ${chapterName} music`
        );

    }

}


/* ==========================================================
   BACKWARD COMPATIBILITY
========================================================== */

function updateChapterMusicButton() {

    updateAllMusicButtons();

}


/* ==========================================================
   AUTOMATIC INITIALIZATION
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initAudio
    );

}

else {

    initAudio();

}
