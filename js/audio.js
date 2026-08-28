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

   This same pattern will later be used for:
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

    // Add these later:

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
   AUDIO CONTROL STATE
========================================================== */

let fadeTimer = null;

let chapterControlsBound = false;


/* ==========================================================
   CREATE / GET AUDIO ELEMENT
========================================================== */

function getMusicElement() {

    /*
        Use the existing bgMusic element
        if the project already has one.
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

        storyMusic.id = "bgMusic";

        storyMusic.preload = "auto";

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
        Start completely silent.

        Music begins only after
        "Open My Story".
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
        Initialize all chapter
        audio controls/navigation.
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
        → Chapter 1
        → chapter1.mp3
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
        Check if the requested
        chapter actually has music.
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
        Stop current song immediately
        before loading the next song.

        This function is also used
        when starting music directly.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load requested chapter music.
    */

    music.src = musicFile;

    music.loop = true;

    AudioState.currentChapter =
        chapter;


    try {

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            Tell Chapter 0 / other UI
            that music is playing.
        */

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
            `🎵 Chapter ${chapter} music started.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;

        console.warn(
            `Chapter ${chapter} music could not start:`,
            error
        );

    }

}


/* ==========================================================
   TRANSITION TO NEXT CHAPTER MUSIC
========================================================== */

/*
    THIS IS THE IMPORTANT NEW FUNCTION.

    Example:

        transitionToChapterMusic(2);

    means:

        Chapter 1
             ↓
        Fade out
             ↓
        Chapter 2
             ↓
        Fade in

    Later:

        transitionToChapterMusic(3);

    will do:

        Chapter 2
             ↓
        Fade out
             ↓
        Chapter 3
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
        Make sure the requested
        chapter has a music file.
    */

    if (!nextMusicFile) {

        console.warn(
            `No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent multiple transitions
        from happening at the same time.
    */

    if (
        AudioState.transitioning
    ) {

        return;

    }


    AudioState.transitioning =
        true;


    /*
        Cancel any existing fade.
    */

    clearFade();


    /*
        If there is currently playing
        music, fade it out first.
    */

    if (
        AudioState.musicPlaying &&
        music.src
    ) {

        fadeOutMusic(() => {

            /*
                Once the old music has
                completely faded out,
                start the new chapter.
            */

            startNextChapterMusic(
                nextChapter
            );

        });

    }

    else {

        /*
            If no music is currently
            playing, simply start
            the requested chapter.
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

        console.warn(
            `No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Make absolutely sure
        previous fade is cancelled.
    */

    clearFade();


    /*
        Stop previous audio state.
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
            Update global music state.
        */

        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        /*
            Fade Chapter 2
            smoothly in.
        */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 Transitioned to Chapter ${chapter} music.`
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
   PLAY / RESUME CURRENT MUSIC
========================================================== */

async function playMusic() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        If no music has been selected,
        default to Chapter 1.
    */

    if (!music.src) {

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
            If volume is zero,
            restore selected volume.
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
            Run optional callback
            after music has stopped.
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
        Start from zero.
    */

    music.volume = 0;


    /*
        Calculate number of fade steps.
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
                Stop if audio is no longer
                the active music element.
            */

            if (
                !music ||
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
    We use ONE event listener for chapter
    navigation and music controls.

    This makes the system reusable for
    every chapter.
*/

function initChapterControls() {

    /*
        Prevent duplicate event listener.
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

                    We DO NOT simply call
                    stopChapterMusic() anymore.

                    Instead:

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

               We are preparing this now.

               Once chapter3.mp3 exists,
               simply uncomment/add:

                    3: "assets/music/chapter3.mp3"

               The transition below will
               automatically use the same pattern.
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
               FUTURE:

               CHAPTER 3 → CHAPTER 4
            ==================================================

            if (
                event.target.closest(
                    "#chapter3Continue"
                )
            ) {

                transitionToChapterMusic(4);

                return;

            }


            ==================================================

               CHAPTER 4 → CHAPTER 5

            ==================================================

            if (
                event.target.closest(
                    "#chapter4Continue"
                )
            ) {

                transitionToChapterMusic(5);

                return;

            }


            ==================================================

               CHAPTER 5 → CHAPTER 6

            ==================================================

            if (
                event.target.closest(
                    "#chapter5Continue"
                )
            ) {

                transitionToChapterMusic(6);

                return;

            }


            ==================================================

               CHAPTER 6 → CHAPTER 7

            ==================================================

            if (
                event.target.closest(
                    "#chapter6Continue"
                )
            ) {

                transitionToChapterMusic(7);

                return;

            }


            ==================================================

               CHAPTER 7 → FINAL

            ==================================================

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
        Later, if Chapter 2 has its
        own music button, we can add:

        #chapter2MusicToggle
    */

}


/* ==========================================================
   BACKWARD COMPATIBILITY
========================================================== */

/*
    Your old code used:

        updateChapterMusicButton()

    Keep this function so nothing else
    in the project breaks.
*/

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
