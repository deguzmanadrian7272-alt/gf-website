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
   Chapter 2 controls work
        ↓
   Same pattern later for Chapter 3 → Final
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

    2: "assets/music/chapter2.mp3"

    // Later:

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
   FADE STATE
========================================================== */

let fadeTimer = null;


/* ==========================================================
   INITIALIZATION STATE
========================================================== */

let audioInitialized = false;


/* ==========================================================
   GET AUDIO ELEMENT
========================================================== */

function getMusicElement() {

    /*
        Reuse the existing audio element
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
   INITIALIZE AUDIO
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
            "🎵 Audio element could not be initialized."
        );

        return;

    }


    /*
        Music starts silent.

        Chapter 1 begins when
        Open My Story is clicked.
    */

    music.volume = 0;


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

        increaseVolume,

        decreaseVolume,

        toggleMusic,

        playChapterMusic,

        transitionToChapterMusic,

        stopChapterMusic

    };


    /*
        Connect Open My Story.
    */

    const startButton =
        document.getElementById(
            "startBtn"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            handleStoryStart
        );

    }


    /*
        IMPORTANT:

        All chapter controls are handled
        using ONE document click listener.

        This means Chapter II controls
        work even if Chapter II is hidden,
        revealed, or dynamically inserted.
    */

    initChapterControls();


    console.log(
        "🎵 Audio initialized."
    );

}


/* ==========================================================
   CHAPTER 0 → CHAPTER 1
========================================================== */

function handleStoryStart() {

    console.log(
        "🎵 Starting Chapter 1 music..."
    );


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
        Make sure the chapter has music.
    */

    if (!musicFile) {

        console.warn(
            `🎵 No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Do not restart the same music.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying
    ) {

        console.log(
            `🎵 Chapter ${chapter} is already playing.`
        );

        return;

    }


    /*
        Cancel previous fade.
    */

    clearFade();


    /*
        Stop current audio.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load requested chapter.
    */

    music.src =
        musicFile;

    music.loop = true;


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


        /*
            Fade in new chapter.
        */

        fadeInMusic();


        updateMusicButtons();


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

        AudioState.musicPlaying =
            false;


        AudioState.transitioning =
            false;


        console.warn(
            `🎵 Chapter ${chapter} music could not start:`,
            error
        );

    }

}


/* ==========================================================
   CHAPTER → NEXT CHAPTER
========================================================== */

function transitionToChapterMusic(
    nextChapter
) {

    const music =
        getMusicElement();


    const nextMusicFile =
        ChapterMusic[nextChapter];


    /*
        Check if next chapter has music.
    */

    if (!nextMusicFile) {

        console.warn(
            `🎵 No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent double-clicking
        from starting multiple transitions.
    */

    if (
        AudioState.transitioning
    ) {

        console.log(
            "🎵 Music transition already running."
        );

        return;

    }


    AudioState.transitioning =
        true;


    /*
        Cancel current fade.
    */

    clearFade();


    console.log(
        `🎵 Transitioning to Chapter ${nextChapter}...`
    );


    /*
        If music is currently playing,
        fade it out first.
    */

    if (
        AudioState.musicPlaying &&
        music.src
    ) {

        fadeOutMusic(() => {

            startNextChapterMusic(
                nextChapter
            );

        });

    }

    else {

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
        Make sure all previous
        fade operations are gone.
    */

    clearFade();


    /*
        Reset audio element.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load next chapter music.
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

        AudioState.transitioning =
            false;


        /*
            Fade new chapter in.
        */

        fadeInMusic();


        updateMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        console.log(
            `🎵 Chapter ${chapter} music is now playing.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;

        AudioState.transitioning =
            false;


        console.warn(
            `🎵 Chapter ${chapter} music failed:`,
            error
        );

    }

}


/* ==========================================================
   PLAY / RESUME MUSIC
========================================================== */

async function playMusic() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        If nothing has been selected,
        start Chapter 1.
    */

    if (
        !music.src
    ) {

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
            Restore selected volume
            if currently silent.
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
            "▶ Music resumed."
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
        "⏹️ All music stopped."
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
   FADE IN
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
                Stop if there is no source.
            */

            if (
                !music.src
            ) {

                clearFade();

                return;

            }


            /*
                Fade complete.
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
   FADE OUT
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
   SET VOLUME
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


    updateMusicButtons();


    console.log(
        `🔊 Music volume: ${Math.round(safeVolume * 100)}%`
    );

}


/* ==========================================================
   VOLUME UP
========================================================== */

function increaseVolume() {

    setMusicVolume(
        AudioSettings.musicVolume +
        AudioSettings.volumeStep
    );

}


/* ==========================================================
   VOLUME DOWN
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
    IMPORTANT:

    We use EVENT DELEGATION.

    This means Chapter I and Chapter II
    controls do NOT need to exist when
    audio.js first loads.

    They can appear later and will
    still work.
*/

function initChapterControls() {

    document.addEventListener(
        "click",
        (event) => {


            const target =
                event.target;


            /* ==================================================
               CHAPTER 1 PLAY / PAUSE
            ================================================== */

            if (
                target.closest(
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
                target.closest(
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
                target.closest(
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
                target.closest(
                    "#chapter1Continue"
                )
            ) {

                transitionToChapterMusic(2);

                return;

            }


            /* ==================================================
               CHAPTER 2 PLAY / PAUSE
            ================================================== */

            if (
                target.closest(
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
                target.closest(
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
                target.closest(
                    "#chapter2VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /* ==================================================
               CHAPTER 2 → CHAPTER 3
            ================================================== */

            if (
                target.closest(
                    "#chapter2Continue"
                )
            ) {

                /*
                    Chapter 3 music will work
                    once this is added:

                    3: "assets/music/chapter3.mp3"

                    to ChapterMusic.
                */

                transitionToChapterMusic(3);

                return;

            }


            /* ==================================================
               FUTURE CHAPTER 3
            ==================================================

            if (
                target.closest(
                    "#chapter3MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                target.closest(
                    "#chapter3VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter3VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter3Continue"
                )
            ) {

                transitionToChapterMusic(4);

                return;

            }

            */


        }
    );

}


/* ==========================================================
   UPDATE ALL MUSIC BUTTONS
========================================================== */

function updateMusicButtons() {


    /* ==================================================
       CHAPTER 1 BUTTON
    ================================================== */

    const chapter1Button =
        document.getElementById(
            "chapter1MusicToggle"
        );


    if (chapter1Button) {

        if (
            AudioState.musicPlaying &&
            AudioState.currentChapter === 1
        ) {

            chapter1Button.textContent =
                "❚❚";

            chapter1Button.setAttribute(
                "aria-label",
                "Pause Chapter I music"
            );

        }

        else {

            chapter1Button.textContent =
                "▶";

            chapter1Button.setAttribute(
                "aria-label",
                "Play Chapter I music"
            );

        }

    }


    /* ==================================================
       CHAPTER 2 BUTTON
    ================================================== */

    const chapter2Button =
        document.getElementById(
            "chapter2MusicToggle"
        );


    if (chapter2Button) {

        if (
            AudioState.musicPlaying &&
            AudioState.currentChapter === 2
        ) {

            chapter2Button.textContent =
                "❚❚";

            chapter2Button.setAttribute(
                "aria-label",
                "Pause Chapter II music"
            );

        }

        else {

            chapter2Button.textContent =
                "▶";

            chapter2Button.setAttribute(
                "aria-label",
                "Play Chapter II music"
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
