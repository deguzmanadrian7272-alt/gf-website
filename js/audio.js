/* ==========================================================
   AUDIO.JS
   Project : Our Story
   Purpose : Background Music & Sound Effects
   Chapters: 0 → Final

   MUSIC FLOW:

   Open My Story
        ↓
   Chapter 1 music
        ↓
   Chapter 1 Continue
        ↓
   Chapter 1 fades out
        ↓
   Chapter 2 music starts
        ↓
   Chapter 2 fades in
        ↓
   Chapter 2 Continue
        ↓
   Chapter 2 fades out
        ↓
   Chapter 3 music starts
        ↓
   Chapter 3 fades in
        ↓
   Chapter 3 Continue
        ↓
   Chapter 3 fades out
        ↓
   Chapter 4 music starts
        ↓
   Chapter 4 fades in
        ↓
   Chapter 4 Continue
        ↓
   Chapter 4 fades out
        ↓
   Chapter 5 music starts

   Same pattern will later be used for:

   Chapter 5 → 6
   Chapter 6 → 7
   Chapter 7 → Final
========================================================== */


/* ==========================================================
   AUDIO SETTINGS
========================================================== */

const AudioSettings = {

    /*
        Default background music volume.

        Range:
        0.0 = silent
        1.0 = maximum
    */

    musicVolume: 0.35,

    /*
        Duration of fade-in.

        1800ms = 1.8 seconds
    */

    fadeDuration: 1800,

    /*
        Amount added/removed during fades.
    */

    fadeStep: 0.02,

    /*
        Time between fade-out steps.
    */

    fadeInterval: 50,

    /*
        Volume button adjustment.
    */

    volumeStep: 0.05

};


/* ==========================================================
   AUDIO STATE
========================================================== */

const AudioState = {

    musicStarted: false,

    musicPlaying: false,

    currentChapter: null,

    transitioning: false

};


/* ==========================================================
   CHAPTER MUSIC
========================================================== */

const ChapterMusic = {

    1: "assets/music/chapter1.mp3",

    2: "assets/music/chapter2.mp3",

    3: "assets/music/chapter3.mp3",

    /*
        Chapter 4 music.

        Make sure this file exists:

        assets/music/chapter4.mp3
    */

    4: "assets/music/chapter4.mp3"

    /*
        Add later:

        5: "assets/music/chapter5.mp3",
        6: "assets/music/chapter6.mp3",
        7: "assets/music/chapter7.mp3",

        final: "assets/music/final.mp3"
    */

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


/* ==========================================================
   CREATE / GET AUDIO ELEMENT
========================================================== */

function getMusicElement() {

    /*
        Use existing bgMusic element
        if one already exists.
    */

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

        storyMusic.id =
            "bgMusic";

        storyMusic.preload =
            "auto";

        document.body.appendChild(
            storyMusic
        );

    }


    storyMusic.loop =
        true;

    storyMusic.preload =
        "auto";

    storyMusic.volume =
        AudioSettings.musicVolume;


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

        Music will fade in when
        a chapter starts.
    */

    music.volume = 0;


    /*
        Audio error detection.
    */

    music.addEventListener(
        "error",
        () => {

            console.error(
                "🎵 Audio error:",
                music.error
            );

            console.error(
                "🎵 Current audio source:",
                music.src
            );

        }
    );


    /*
        Expose audio functions globally.
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

        transitionToChapterMusic,

        stopChapterMusic,

        increaseVolume,

        decreaseVolume

    };


    /* ======================================================
       CHAPTER 0 → CHAPTER 1
    ====================================================== */

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
        Initialize chapter controls.
    */

    initChapterControls();


    /*
        Make sure all music buttons
        show the correct initial state.
    */

    updateMusicButtons();


    console.log(
        "🎵 Audio initialized."
    );

}


/* ==========================================================
   STORY START
========================================================== */

function handleStoryStart() {

    /*
        Open My Story
        ↓
        Chapter 1
        ↓
        chapter1.mp3
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


    /*
        Check if music exists.
    */

    if (!musicFile) {

        console.warn(
            `No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Do not restart the same
        chapter if already playing.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying
    ) {

        return;

    }


    /*
        Cancel any existing fade.
    */

    clearFade();


    /*
        Stop previous music.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Set new source.
    */

    music.src =
        musicFile;

    music.loop =
        true;

    music.preload =
        "auto";


    AudioState.currentChapter =
        chapter;


    try {

        /*
            Load requested audio file.
        */

        music.load();


        /*
            Wait until audio is ready.
        */

        await waitForAudioReady(
            music
        );


        /*
            Start playback.
        */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        /*
            Fade music in.
        */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 Chapter ${chapter} music started.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;

        AudioState.musicStarted =
            false;


        console.error(
            `🎵 Chapter ${chapter} music could not start:`,
            error
        );


        console.error(
            `🎵 Attempted source: ${musicFile}`
        );

    }

}


/* ==========================================================
   WAIT FOR AUDIO READY
========================================================== */

function waitForAudioReady(
    music
) {

    return new Promise(
        (resolve, reject) => {

            /*
                Already ready.
            */

            if (
                music.readyState >= 3
            ) {

                resolve();

                return;

            }


            /*
                Audio successfully loaded.
            */

            const handleCanPlay =
                () => {

                    cleanup();

                    resolve();

                };


            /*
                Audio loading error.
            */

            const handleError =
                () => {

                    cleanup();

                    reject(
                        new Error(
                            "Audio file could not be loaded."
                        )
                    );

                };


            /*
                Clean listeners.
            */

            const cleanup =
                () => {

                    music.removeEventListener(
                        "canplay",
                        handleCanPlay
                    );

                    music.removeEventListener(
                        "error",
                        handleError
                    );

                };


            music.addEventListener(
                "canplay",
                handleCanPlay,
                {
                    once: true
                }
            );


            music.addEventListener(
                "error",
                handleError,
                {
                    once: true
                }
            );

        }
    );

}


/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */

function transitionToChapterMusic(
    nextChapter
) {

    const music =
        getMusicElement();


    const nextMusicFile =
        ChapterMusic[nextChapter];


    /*
        Make sure next chapter
        actually has music.
    */

    if (!nextMusicFile) {

        console.warn(
            `No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent duplicate clicks.
    */

    if (
        AudioState.transitioning
    ) {

        return;

    }


    AudioState.transitioning =
        true;


    /*
        Cancel previous fade.
    */

    clearFade();


    console.log(
        `🎵 Transitioning from Chapter ${AudioState.currentChapter} to Chapter ${nextChapter}...`
    );


    /*
        Fade CURRENT music first.
    */

    if (
        music.src &&
        !music.paused
    ) {

        fadeOutMusic(() => {

            /*
                Old chapter is now silent.
            */

            music.pause();

            music.currentTime = 0;

            music.volume = 0;


            /*
                Start next chapter.
            */

            startNextChapterMusic(
                nextChapter
            );

        });

    }

    else {

        /*
            If no music is playing,
            start next chapter directly.
        */

        startNextChapterMusic(
            nextChapter
        );

    }

}


/* ==========================================================
   START NEXT CHAPTER MUSIC
========================================================== */

async function startNextChapterMusic(
    chapter
) {

    const music =
        getMusicElement();


    const musicFile =
        ChapterMusic[chapter];


    /*
        Check requested chapter.
    */

    if (!musicFile) {

        AudioState.transitioning =
            false;

        console.warn(
            `No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Cancel previous fade.
    */

    clearFade();


    /*
        Completely stop previous audio.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Remove previous audio source.
    */

    music.removeAttribute(
        "src"
    );


    /*
        Force browser to release
        previous source.
    */

    music.load();


    /*
        Set NEW chapter source.
    */

    music.src =
        musicFile;

    music.loop =
        true;

    music.preload =
        "auto";


    AudioState.currentChapter =
        chapter;


    console.log(
        `🎵 Loading Chapter ${chapter} music: ${musicFile}`
    );


    try {

        /*
            Force browser to load
            the new chapter.
        */

        music.load();


        /*
            Wait for new audio.
        */

        await waitForAudioReady(
            music
        );


        /*
            Start new music.
        */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;

        AudioState.transitioning =
            false;


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        /*
            Fade new chapter in.
        */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 Successfully transitioned to Chapter ${chapter}.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;

        AudioState.musicStarted =
            false;

        AudioState.transitioning =
            false;


        console.error(
            `🎵 Could not play Chapter ${chapter}:`,
            error
        );


        console.error(
            `🎵 Attempted audio file: ${musicFile}`
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
        If there is no current song,
        start Chapter 1.
    */

    if (!music.src) {

        playChapterMusic(1);

        return;

    }


    try {

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            Restore selected volume.

            Do not restore if the user
            intentionally selected 0.
        */

        if (
            music.volume === 0 &&
            AudioSettings.musicVolume > 0
        ) {

            music.volume =
                AudioSettings.musicVolume;

        }


        updateMusicButtons();


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


    music.pause();


    AudioState.musicPlaying =
        false;


    updateMusicButtons();


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


    clearFade();


    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    AudioState.musicStarted =
        false;

    AudioState.musicPlaying =
        false;

    AudioState.currentChapter =
        null;

    AudioState.transitioning =
        false;


    updateMusicButtons();


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
   STOP CHAPTER MUSIC
========================================================== */

function stopChapterMusic(
    callback = null
) {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    clearFade();


    fadeOutMusic(() => {

        music.pause();

        music.currentTime = 0;

        music.volume = 0;


        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;

        AudioState.currentChapter =
            null;


        updateMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(false);

        }


        console.log(
            "⏹️ Chapter music stopped."
        );


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


    clearFade();


    const targetVolume =
        AudioSettings.musicVolume;


    /*
        Start completely silent.
    */

    music.volume = 0;


    /*
        If target volume is 0,
        there is nothing to fade.
    */

    if (
        targetVolume <= 0
    ) {

        return;

    }


    const steps =
        Math.ceil(
            targetVolume /
            AudioSettings.fadeStep
        );


    const intervalTime =
        AudioSettings.fadeDuration /
        steps;


    fadeTimer =
        setInterval(() => {

            /*
                Stop if there is
                no audio source.
            */

            if (
                !music.src
            ) {

                clearFade();

                return;

            }


            /*
                Fade finished.
            */

            if (
                music.volume >=
                targetVolume
            ) {

                music.volume =
                    targetVolume;

                clearFade();

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

        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

        return;

    }


    clearFade();


    /*
        If already silent,
        immediately continue.
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


    /*
        Fade down gradually.
    */

    fadeTimer =
        setInterval(() => {

            if (
                music.volume <= 0.01
            ) {

                music.volume = 0;

                clearFade();


                /*
                    Callback happens only
                    after volume reaches zero.
                */

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
   CLEAR FADE
========================================================== */

function clearFade() {

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );

        fadeTimer = null;

    }

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


    updateMusicButtons();


    console.log(
        `🔊 Music volume: ${Math.round(safeVolume * 100)}%`
    );

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
   CHAPTER CONTROLS
========================================================== */

function initChapterControls() {

    /*
        Prevent duplicate listeners.
    */

    if (
        chapterControlsBound
    ) {

        return;

    }


    chapterControlsBound =
        true;


    /*
        One global click listener.

        This allows the same audio system
        to work even when chapters are
        dynamically shown/hidden.
    */

    document.addEventListener(
        "click",
        (event) => {


            /* ==================================================
               CHAPTER 1
            ================================================== */


            /*
                Play / Pause
            */

            if (
                event.target.closest(
                    "#chapter1MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /*
                Volume Down
            */

            if (
                event.target.closest(
                    "#chapter1VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /*
                Volume Up
            */

            if (
                event.target.closest(
                    "#chapter1VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                Chapter 1 → Chapter 2
            */

            if (
                event.target.closest(
                    "#chapter1Continue"
                )
            ) {

                transitionToChapterMusic(
                    2
                );

                return;

            }


            /* ==================================================
               CHAPTER 2
            ================================================== */


            /*
                Play / Pause
            */

            if (
                event.target.closest(
                    "#chapter2MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /*
                Volume Down
            */

            if (
                event.target.closest(
                    "#chapter2VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /*
                Volume Up
            */

            if (
                event.target.closest(
                    "#chapter2VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                Chapter 2 → Chapter 3
            */

            if (
                event.target.closest(
                    "#chapter2Continue"
                )
            ) {

                transitionToChapterMusic(
                    3
                );

                return;

            }


            /* ==================================================
               CHAPTER 3
            ================================================== */


            /*
                Play / Pause
            */

            if (
                event.target.closest(
                    "#chapter3MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /*
                Volume Down
            */

            if (
                event.target.closest(
                    "#chapter3VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /*
                Volume Up
            */

            if (
                event.target.closest(
                    "#chapter3VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                Chapter 3 → Chapter 4
            */

            if (
                event.target.closest(
                    "#chapter3Continue"
                )
            ) {

                transitionToChapterMusic(
                    4
                );

                return;

            }


            /* ==================================================
               CHAPTER 4
            ================================================== */


            /*
                Play / Pause

                Expected HTML ID:

                #chapter4MusicToggle
            */

            if (
                event.target.closest(
                    "#chapter4MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /*
                Volume Down

                Expected HTML ID:

                #chapter4VolumeDown
            */

            if (
                event.target.closest(
                    "#chapter4VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /*
                Volume Up

                Expected HTML ID:

                #chapter4VolumeUp
            */

            if (
                event.target.closest(
                    "#chapter4VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                Chapter 4 → Chapter 5

                Expected HTML ID:

                #chapter4Continue
            */

            if (
                event.target.closest(
                    "#chapter4Continue"
                )
            ) {

                transitionToChapterMusic(
                    5
                );

                return;

            }


            /* ==================================================
               CHAPTER 5 → 6
            ================================================== */

            if (
                event.target.closest(
                    "#chapter5Continue"
                )
            ) {

                transitionToChapterMusic(
                    6
                );

                return;

            }


            /* ==================================================
               CHAPTER 6 → 7
            ================================================== */

            if (
                event.target.closest(
                    "#chapter6Continue"
                )
            ) {

                transitionToChapterMusic(
                    7
                );

                return;

            }


            /* ==================================================
               CHAPTER 7 → FINAL
            ================================================== */

            if (
                event.target.closest(
                    "#chapter7Continue"
                )
            ) {

                transitionToChapterMusic(
                    "final"
                );

                return;

            }

        }
    );

}


/* ==========================================================
   UPDATE MUSIC BUTTONS
========================================================== */

function updateMusicButtons() {

    /*
        Current state of the music.

        Every chapter's play/pause button
        receives the same state because
        there is only ONE background music
        element for the entire story.
    */


    const musicButtonIds = [

        "chapter1MusicToggle",

        "chapter2MusicToggle",

        "chapter3MusicToggle",

        "chapter4MusicToggle"

    ];


    musicButtonIds.forEach(
        (buttonId) => {

            const button =
                document.getElementById(
                    buttonId
                );


            if (!button) {

                return;

            }


            /*
                Music is playing.
            */

            if (
                AudioState.musicPlaying
            ) {

                button.textContent =
                    "❚❚";

                button.setAttribute(
                    "aria-label",
                    "Pause current music"
                );

                button.setAttribute(
                    "title",
                    "Pause music"
                );

            }

            /*
                Music is paused.
            */

            else {

                button.textContent =
                    "▶";

                button.setAttribute(
                    "aria-label",
                    "Play current music"
                );

                button.setAttribute(
                    "title",
                    "Play music"
                );

            }

        }
    );

}


/* ==========================================================
   BACKWARD COMPATIBILITY
========================================================== */

function updateChapterMusicButton() {

    updateMusicButtons();

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
