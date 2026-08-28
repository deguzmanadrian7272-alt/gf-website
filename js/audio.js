/* ==========================================================
   AUDIO.JS
   Project : Our Story
   Purpose : Background Music & Sound Effects
   Chapters: 0 → Final

   MUSIC FLOW:

   Open My Story
        ↓
   Chapter 1
        ↓
   Chapter 1 Continue
        ↓
   Chapter 1 fades out
        ↓
   Chapter 2
        ↓
   Chapter 2 fades in

   Same pattern will later be used for:

   Chapter 2 → 3
   Chapter 3 → 4
   Chapter 4 → 5
   Chapter 5 → 6
   Chapter 6 → 7
   Chapter 7 → Final
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

    transitioning: false

};


/* ==========================================================
   CHAPTER MUSIC
========================================================== */

const ChapterMusic = {

    1: "assets/music/chapter1.mp3",

    2: "assets/music/chapter2.mp3",

    // Add later:

    // 3: "assets/music/chapter3.mp3",
    // 4: "assets/music/chapter4.mp3",
    // 5: "assets/music/chapter5.mp3",
    // 6: "assets/music/chapter6.mp3",
    // 7: "assets/music/chapter7.mp3",

    // final:
    // "assets/music/final.mp3"

};


/* ==========================================================
   AUDIO ELEMENT
========================================================== */

let storyMusic = null;


/* ==========================================================
   FADE STATE
========================================================== */

let fadeTimer = null;


/* ==========================================================
   CONTROL INITIALIZATION
========================================================== */

let chapterControlsBound = false;


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
        Create audio element if it
        does not already exist.
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
        "Open My Story" is clicked.
    */

    music.volume = 0;


    /*
        Expose audio system globally.
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


    /*
        Chapter 0
        "Open My Story"
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
        Initialize reusable
        chapter controls.
    */

    initChapterControls();


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
        Make sure this chapter
        has an assigned music file.
    */

    if (!musicFile) {

        console.warn(
            `No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Do not restart the same
        music if it is already playing.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying
    ) {

        return;

    }


    /*
        Cancel any previous fade.
    */

    clearFade();


    /*
        Stop whatever song is
        currently loaded.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load the requested song.
    */

    music.src =
        musicFile;

    music.loop = true;


    /*
        IMPORTANT:

        Force the browser to recognize
        the new audio source.

        This helps when switching
        between chapter MP3 files.
    */

    music.load();


    AudioState.currentChapter =
        chapter;


    try {

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
            Fade the new song in.
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


        AudioState.transitioning =
            false;


        console.warn(
            `Chapter ${chapter} music could not start:`,
            error
        );

    }

}


/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */

/*
    This is the main reusable
    chapter-to-chapter function.

    Example:

        transitionToChapterMusic(2);

    means:

        Chapter 1
             ↓
        Fade out
             ↓
        Stop Chapter 1
             ↓
        Load Chapter 2
             ↓
        Play Chapter 2
             ↓
        Fade in
*/


function transitionToChapterMusic(
    nextChapter
) {

    const music =
        getMusicElement();


    const nextMusicFile =
        ChapterMusic[nextChapter];


    /*
        Check that the next chapter
        actually has music.
    */

    if (!nextMusicFile) {

        console.warn(
            `No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent accidental
        double-click transitions.
    */

    if (
        AudioState.transitioning
    ) {

        console.warn(
            "Audio transition already in progress."
        );

        return;

    }


    AudioState.transitioning =
        true;


    /*
        Cancel any existing fade.
    */

    clearFade();


    /*
        If music is currently playing,
        fade it out first.
    */

    if (
        AudioState.musicPlaying &&
        !music.paused
    ) {

        console.log(
            `🎵 Fading out Chapter ${AudioState.currentChapter}...`
        );


        fadeOutMusic(() => {

            /*
                IMPORTANT:

                Chapter 1 is now completely
                silent before Chapter 2
                begins.
            */

            music.pause();

            music.currentTime = 0;

            music.volume = 0;


            AudioState.musicPlaying =
                false;


            /*
                NOW start the next chapter.
            */

            startNextChapterMusic(
                nextChapter
            );

        });

    }

    else {

        /*
            No current music.

            Start next chapter directly.
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


    if (!musicFile) {

        AudioState.transitioning =
            false;

        return;

    }


    /*
        Make sure no previous fade
        is still running.
    */

    clearFade();


    /*
        Completely reset the audio
        element before changing songs.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load the next chapter song.
    */

    music.src =
        musicFile;

    music.loop = true;


    /*
        IMPORTANT:

        Reload the audio element.

        Without this, some browsers can
        keep the previous media state when
        switching src during a transition.
    */

    music.load();


    AudioState.currentChapter =
        chapter;


    console.log(
        `🎵 Loading Chapter ${chapter} music...`
    );


    try {

        await music.play();


        /*
            New chapter is now playing.
        */

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
            Fade the new chapter in.
        */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 Chapter ${chapter} music started successfully.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;

        AudioState.transitioning =
            false;


        console.error(
            `❌ Chapter ${chapter} music failed to play:`,
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
        If there is no selected music,
        start Chapter 1.
    */

    if (
        !music.src ||
        music.src ===
        window.location.href
    ) {

        if (ChapterMusic[1]) {

            playChapterMusic(1);

        }

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
        */

        if (
            music.volume === 0
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


    music.volume = 0;


    /*
        Number of fade steps.
    */

    const steps =
        Math.ceil(
            targetVolume /
            AudioSettings.fadeStep
        );


    /*
        Prevent invalid interval.
    */

    const intervalTime =
        Math.max(
            10,
            AudioSettings.fadeDuration /
            steps
        );


    fadeTimer =
        setInterval(() => {

            /*
                Stop fade if music
                is no longer active.
            */

            if (
                music.paused ||
                !music.src
            ) {

                clearFade();

                return;

            }


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
        Already silent.

        Continue immediately.
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


    /*
        Keep volume between 0 and 1.
    */

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

/*
    ONE event listener handles
    chapter navigation and music controls.

    This means we don't need to modify
    chapter1.js just to control music.

    Future chapters follow the same pattern.
*/

function initChapterControls() {

    if (
        chapterControlsBound
    ) {

        return;

    }


    chapterControlsBound =
        true;


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
               CHAPTER 1 → CHAPTER 2
            ================================================== */

            if (
                event.target.closest(
                    "#chapter1Continue"
                )
            ) {

                /*
                    DO NOT use:

                        stopChapterMusic()

                    because that only stops Chapter 1.

                    We specifically need:

                        Chapter 1
                            ↓
                        fade out
                            ↓
                        Chapter 2
                            ↓
                        fade in
                */

                transitionToChapterMusic(2);

                return;

            }


            /* ==================================================
               CHAPTER 2 → CHAPTER 3
            ==================================================

               When chapter3.mp3 is ready,
               add it to ChapterMusic:

                    3: "assets/music/chapter3.mp3"

               Then this will automatically work.
            */

            if (
                event.target.closest(
                    "#chapter2Continue"
                )
            ) {

                transitionToChapterMusic(3);

                return;

            }


            /* ==================================================
               CHAPTER 3 → CHAPTER 4
            ================================================== */

            /*
            if (
                event.target.closest(
                    "#chapter3Continue"
                )
            ) {

                transitionToChapterMusic(4);

                return;

            }
            */


            /* ==================================================
               CHAPTER 4 → CHAPTER 5
            ================================================== */

            /*
            if (
                event.target.closest(
                    "#chapter4Continue"
                )
            ) {

                transitionToChapterMusic(5);

                return;

            }
            */


            /* ==================================================
               CHAPTER 5 → CHAPTER 6
            ================================================== */

            /*
            if (
                event.target.closest(
                    "#chapter5Continue"
                )
            ) {

                transitionToChapterMusic(6);

                return;

            }
            */


            /* ==================================================
               CHAPTER 6 → CHAPTER 7
            ================================================== */

            /*
            if (
                event.target.closest(
                    "#chapter6Continue"
                )
            ) {

                transitionToChapterMusic(7);

                return;

            }
            */


            /* ==================================================
               CHAPTER 7 → FINAL
            ================================================== */

            /*
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
            */

        }
    );

}


/* ==========================================================
   UPDATE MUSIC BUTTONS
========================================================== */

function updateMusicButtons() {

    /*
        Chapter 1 music button.
    */

    const chapter1Button =
        document.getElementById(
            "chapter1MusicToggle"
        );


    if (chapter1Button) {

        if (
            AudioState.musicPlaying
        ) {

            chapter1Button.textContent =
                "❚❚";

            chapter1Button.setAttribute(
                "aria-label",
                "Pause current music"
            );

        }

        else {

            chapter1Button.textContent =
                "▶";

            chapter1Button.setAttribute(
                "aria-label",
                "Play current music"
            );

        }

    }


    /*
        Future chapter music buttons
        can be updated here.
    */

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
