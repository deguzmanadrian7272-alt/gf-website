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

    currentChapter: null

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

let audioInitialized = false;

let chapterObserver = null;

let lastDetectedChapter = null;


/* ==========================================================
   CREATE / GET AUDIO ELEMENT
========================================================== */

function getMusicElement() {

    /*
        Return existing reference.
    */

    if (storyMusic) {

        return storyMusic;

    }


    /*
        Try to find existing audio element.
    */

    storyMusic =
        document.getElementById("bgMusic");


    /*
        If no audio element exists,
        create one automatically.
    */

    if (!storyMusic) {

        storyMusic =
            document.createElement("audio");

        storyMusic.id =
            "bgMusic";

        storyMusic.preload =
            "auto";

        document.body.appendChild(
            storyMusic
        );

    }


    storyMusic.loop = true;

    storyMusic.volume =
        AudioSettings.musicVolume;


    return storyMusic;

}


/* ==========================================================
   AUDIO INITIALIZATION
========================================================== */

function initAudio() {

    /*
        Prevent initialization twice.
    */

    if (audioInitialized) {

        return;

    }


    audioInitialized = true;


    const music =
        getMusicElement();


    if (!music) {

        console.warn(
            "Audio element could not be initialized."
        );

        return;

    }


    /*
        Start silent.

        Chapter 1 music will begin after
        the user opens the story.
    */

    music.volume = 0;


    /*
        IMPORTANT:

        Listen to the REAL audio element.

        This keeps the button synchronized
        with the actual music state.
    */

    music.addEventListener(
        "play",
        handleMusicPlay
    );


    music.addEventListener(
        "pause",
        handleMusicPause
    );


    music.addEventListener(
        "ended",
        handleMusicPause
    );


    /*
        Expose controls globally.
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
        Chapter 0 → Chapter 1
    */

    initStoryStart();


    /*
        Music buttons for all chapters.
    */

    initMusicControls();


    /*
        Detect which chapter becomes active.

        This is the important fix for
        Chapter 1 → Chapter 2.
    */

    initChapterObserver();


    /*
        Initial button state.
    */

    updateAllMusicButtons();


    console.log(
        "🎵 Audio initialized."
    );

}


/* ==========================================================
   AUDIO PLAY EVENT
========================================================== */

function handleMusicPlay() {

    AudioState.musicStarted =
        true;

    AudioState.musicPlaying =
        true;


    updateAllMusicButtons();


    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(true);

    }


    console.log(
        "▶️ Music is playing."
    );

}


/* ==========================================================
   AUDIO PAUSE EVENT
========================================================== */

function handleMusicPause() {

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
        "⏸️ Music is paused."
    );

}


/* ==========================================================
   STORY START
========================================================== */

function initStoryStart() {

    const startBtn =
        document.getElementById(
            "startBtn"
        );


    if (!startBtn) {

        return;

    }


    startBtn.addEventListener(
        "click",
        handleStoryStart
    );

}


/* ==========================================================
   HANDLE STORY START
========================================================== */

function handleStoryStart() {

    /*
        Chapter 0:

        Open My Story
        ↓
        Chapter 1 music
    */

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
        If the requested chapter is
        already playing, do nothing.
    */

    if (
        AudioState.currentChapter ===
        chapter &&
        !music.paused
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
        Stop the current song.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load the new chapter song.
    */

    music.src =
        musicFile;

    music.loop =
        true;


    AudioState.currentChapter =
        chapter;


    try {

        /*
            The browser allows this because
            this function is ultimately triggered
            by the user's interaction/navigation.
        */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            Fade in the new chapter song.
        */

        fadeInMusic();


        updateAllMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        console.log(
            `🎵 Chapter ${chapter} music started: ${musicFile}`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;


        updateAllMusicButtons();


        console.warn(
            `🎵 Chapter ${chapter} music could not start:`,
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
        No song selected yet.

        Start Chapter 1.
    */

    if (
        !music.src
    ) {

        if (
            ChapterMusic[1]
        ) {

            await playChapterMusic(1);

        }

        return;

    }


    try {

        /*
            IMPORTANT:

            Do NOT reset currentTime.

            This resumes the song exactly
            where the user paused it.
        */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            If volume became zero,
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
            "🎵 Music could not resume:",
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

        DO NOT reset currentTime.
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
        Cancel fade.
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
        Fade out current music.
    */

    fadeOutMusic(() => {

        music.pause();

        music.currentTime = 0;

        music.volume = 0;


        AudioState.musicStarted =
            false;

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
            "⏹️ Current chapter music stopped."
        );


        /*
            Continue with the next action.
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
   CHANGE CHAPTER MUSIC
========================================================== */

function changeChapterMusic(
    chapter
) {

    /*
        If this chapter is already playing,
        don't restart it.
    */

    if (
        AudioState.currentChapter ===
        chapter
    ) {

        const music =
            getMusicElement();

        if (
            music &&
            !music.paused
        ) {

            return;

        }

    }


    /*
        If another chapter is currently playing,
        fade it out first.
    */

    const music =
        getMusicElement();


    if (
        music &&
        !music.paused &&
        AudioState.currentChapter !==
        chapter
    ) {

        stopChapterMusic(() => {

            playChapterMusic(
                chapter
            );

        });

        return;

    }


    /*
        Otherwise start directly.
    */

    playChapterMusic(
        chapter
    );

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
        Cancel previous fade.
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
        Cancel previous fade.
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
        music.volume <=
        0.01
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
                music.volume <=
                0.01
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


    AudioSettings.musicVolume =
        safeVolume;


    music.volume =
        safeVolume;


    updateAllMusicButtons();

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

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        IMPORTANT:

        Check the REAL audio element.

        Do not rely only on AudioState.
    */

    if (
        !music.paused
    ) {

        pauseMusic();

    }

    else {

        playMusic();

    }

}


/* ==========================================================
   MUSIC BUTTON CONTROLS
========================================================== */

function initMusicControls() {

    document.addEventListener(
        "click",
        (event) => {


            /* ==================================================
               CHAPTER 1 PLAY / PAUSE
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
               CHAPTER 2 PLAY / PAUSE
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
   CHAPTER DETECTION
========================================================== */

function initChapterObserver() {

    /*
        Find the main chapter elements.
    */

    const chapter1 =
        document.getElementById(
            "chapter1"
        );


    const chapter2 =
        document.getElementById(
            "chapter2"
        );


    if (
        !chapter1 &&
        !chapter2
    ) {

        console.warn(
            "No chapter elements found for audio observer."
        );

        return;

    }


    /*
        Watch for changes to the "active" class.

        This is important because your existing
        chapter navigation controls which chapter
        is visible.
    */

    chapterObserver =
        new MutationObserver(() => {

            detectActiveChapter();

        });


    /*
        Observe Chapter 1.
    */

    if (chapter1) {

        chapterObserver.observe(
            chapter1,
            {
                attributes: true,
                attributeFilter: [
                    "class"
                ]
            }
        );

    }


    /*
        Observe Chapter 2.
    */

    if (chapter2) {

        chapterObserver.observe(
            chapter2,
            {
                attributes: true,
                attributeFilter: [
                    "class"
                ]
            }
        );

    }


    /*
        Check immediately.
    */

    detectActiveChapter();

}


/* ==========================================================
   DETECT ACTIVE CHAPTER
========================================================== */

function detectActiveChapter() {

    const chapter1 =
        document.getElementById(
            "chapter1"
        );


    const chapter2 =
        document.getElementById(
            "chapter2"
        );


    /*
        Chapter 2 is active.
    */

    if (
        chapter2 &&
        chapter2.classList.contains(
            "active"
        )
    ) {

        if (
            lastDetectedChapter !== 2
        ) {

            lastDetectedChapter =
                2;


            console.log(
                "📖 Chapter II detected."
            );


            changeChapterMusic(2);

        }

        return;

    }


    /*
        Chapter 1 is active.
    */

    if (
        chapter1 &&
        chapter1.classList.contains(
            "active"
        )
    ) {

        if (
            lastDetectedChapter !== 1
        ) {

            lastDetectedChapter =
                1;


            /*
                Do not automatically restart
                Chapter 1 if it is already playing.
            */

            const music =
                getMusicElement();


            if (
                !music.src
            ) {

                console.log(
                    "📖 Chapter I detected."
                );

                changeChapterMusic(1);

            }

        }

    }

}


/* ==========================================================
   UPDATE ALL MUSIC BUTTONS
========================================================== */

function updateAllMusicButtons() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        IMPORTANT:

        Use the ACTUAL audio state.

        paused = true  → ▶
        paused = false → ❚❚
    */

    const isPlaying =
        !music.paused;


    /*
        Chapter 1 button.
    */

    updateMusicButton(
        "chapter1MusicToggle",
        "Chapter I",
        isPlaying
    );


    /*
        Chapter 2 button.
    */

    updateMusicButton(
        "chapter2MusicToggle",
        "Chapter II",
        isPlaying
    );

}


/* ==========================================================
   UPDATE INDIVIDUAL MUSIC BUTTON
========================================================== */

function updateMusicButton(
    buttonId,
    chapterName,
    isPlaying
) {

    const button =
        document.getElementById(
            buttonId
        );


    if (!button) {

        return;

    }


    if (isPlaying) {

        button.textContent =
            "❚❚";

        button.setAttribute(
            "aria-label",
            `Pause ${chapterName} music`
        );

        button.classList.remove(
            "chapter1-music-play"
        );

        button.classList.add(
            "chapter1-music-pause"
        );

    }

    else {

        button.textContent =
            "▶";

        button.setAttribute(
            "aria-label",
            `Play ${chapterName} music`
        );

        button.classList.remove(
            "chapter1-music-pause"
        );

        button.classList.add(
            "chapter1-music-play"
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
