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


    storyMusic.loop = true;

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
        Music starts silent.

        It will begin when
        Open My Story is clicked.
    */

    music.volume = 0;


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


    /*
        Chapter 0
        Open My Story
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
        Initialize ALL chapter
        music controls and navigation.
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
        chapter if it is already playing.
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
        Stop the current audio.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load requested chapter music.
    */

    music.src =
        musicFile;

    music.loop =
        true;


    AudioState.currentChapter =
        chapter;


    try {

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
    This is the main chapter transition system.

    Example:

        transitionToChapterMusic(2);

    Result:

        Chapter 1
             ↓
        Fade Out
             ↓
        Chapter 2
             ↓
        Fade In


    Later:

        transitionToChapterMusic(3);

    Result:

        Chapter 2
             ↓
        Fade Out
             ↓
        Chapter 3
             ↓
        Fade In
*/


function transitionToChapterMusic(
    nextChapter
) {

    const music =
        getMusicElement();


    const nextMusicFile =
        ChapterMusic[nextChapter];


    /*
        Make sure the next chapter
        has music assigned.
    */

    if (!nextMusicFile) {

        console.warn(
            `No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent duplicate transitions.
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


    /*
        If current music exists,
        fade it out first.
    */

    if (
        music.src &&
        !music.paused
    ) {

        fadeOutMusic(() => {

            startNextChapterMusic(
                nextChapter
            );

        });

    }

    else {

        /*
            If no music is playing,
            start the next chapter directly.
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
        Make sure the requested
        chapter has a music file.
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
        Cancel any previous fade.
    */

    clearFade();


    /*
        Completely reset the
        audio element.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        IMPORTANT:

        Set src AFTER stopping
        the previous track.
    */

    music.src =
        musicFile;

    music.loop =
        true;


    AudioState.currentChapter =
        chapter;


    /*
        Force the browser to load
        the new audio source.
    */

    music.load();


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


        console.warn(
            `🎵 Could not play Chapter ${chapter}:`,
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


    /*
        Fade current music out.
    */

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


        /*
            Execute optional callback.
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


    clearFade();


    const targetVolume =
        AudioSettings.musicVolume;


    /*
        Start completely silent.
    */

    music.volume = 0;


    /*
        Calculate fade steps.
    */

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
                Stop if audio has no source.
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
        continue immediately.
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
    ONE global event listener handles:

    Chapter 1:
        - Play/Pause
        - Volume Down
        - Volume Up
        - Continue → Chapter 2

    Chapter 2:
        - Play/Pause
        - Volume Down
        - Volume Up
        - Continue → Chapter 3

    Future chapters use the exact
    same pattern.
*/

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


    document.addEventListener(
        "click",
        (event) => {


            /* ==================================================
               CHAPTER 1
            ================================================== */


            /*
                Chapter 1 Play / Pause
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
                Chapter 1 Volume Down
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
                Chapter 1 Volume Up
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

                transitionToChapterMusic(2);

                return;

            }


            /* ==================================================
               CHAPTER 2
            ================================================== */


            /*
                Chapter 2 Play / Pause
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
                Chapter 2 Volume Down
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
                Chapter 2 Volume Up
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

                transitionToChapterMusic(3);

                return;

            }


            /* ==================================================
               CHAPTER 3 → 4
            ================================================== */

            if (
                event.target.closest(
                    "#chapter3Continue"
                )
            ) {

                transitionToChapterMusic(4);

                return;

            }


            /* ==================================================
               CHAPTER 4 → 5
            ================================================== */

            if (
                event.target.closest(
                    "#chapter4Continue"
                )
            ) {

                transitionToChapterMusic(5);

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

                transitionToChapterMusic(6);

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

                transitionToChapterMusic(7);

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
        ==============================
        CHAPTER 1
        ==============================
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
        ==============================
        CHAPTER 2
        ==============================
    */

    const chapter2Button =
        document.getElementById(
            "chapter2MusicToggle"
        );


    if (chapter2Button) {

        if (
            AudioState.musicPlaying
        ) {

            chapter2Button.textContent =
                "❚❚";

            chapter2Button.setAttribute(
                "aria-label",
                "Pause current music"
            );

        }

        else {

            chapter2Button.textContent =
                "▶";

            chapter2Button.setAttribute(
                "aria-label",
                "Play current music"
            );

        }

    }

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
