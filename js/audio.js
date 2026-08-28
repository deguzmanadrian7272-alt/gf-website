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
   Chapter 2 fades in
        ↓
   Chapter 2 music

   FUTURE:

   Chapter 2 → 3
   Chapter 3 → 4
   Chapter 4 → 5
   Chapter 5 → 6
   Chapter 6 → 7
   Chapter 7 → Final

   IMPORTANT:
   This version uses TWO audio elements.

   This allows the next chapter's music to begin
   immediately during the user's click, avoiding
   browser autoplay restrictions caused by waiting
   for a fade-out to finish.
========================================================== */


/* ==========================================================
   AUDIO SETTINGS
========================================================== */

const AudioSettings = {

    musicVolume: 0.35,

    fadeDuration: 1800,

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

    // "final":
    // "assets/music/final.mp3"

};


/* ==========================================================
   AUDIO ELEMENTS
========================================================== */

/*
    Instead of using only ONE audio element,
    we use TWO.

    currentMusic
        = music currently being heard

    nextMusic
        = music that is fading in
*/

let currentMusic = null;

let nextMusic = null;


/* ==========================================================
   AUDIO FADE ANIMATION
========================================================== */

let fadeAnimation = null;


/* ==========================================================
   CHAPTER CONTROLS STATE
========================================================== */

let chapterControlsBound = false;


/* ==========================================================
   GET ORIGINAL AUDIO ELEMENT
========================================================== */

function getOriginalMusicElement() {

    /*
        The HTML already contains:

        <audio id="bgMusic">

        We keep using it as the first
        Chapter 1 audio element.
    */

    let music =
        document.getElementById("bgMusic");


    /*
        If it does not exist,
        create it.
    */

    if (!music) {

        music =
            document.createElement("audio");

        music.id =
            "bgMusic";

        music.preload =
            "auto";

        music.loop =
            true;

        document.body.appendChild(
            music
        );

    }


    return music;

}


/* ==========================================================
   CREATE SECOND AUDIO ELEMENT
========================================================== */

function createAudioElement() {

    const audio =
        document.createElement("audio");


    audio.preload =
        "auto";


    audio.loop =
        true;


    /*
        Do not allow the audio element
        to appear visually.
    */

    audio.style.display =
        "none";


    document.body.appendChild(
        audio
    );


    return audio;

}


/* ==========================================================
   INITIALIZE AUDIO
========================================================== */

function initAudio() {

    /*
        Get the original audio element.
    */

    currentMusic =
        getOriginalMusicElement();


    /*
        Create the second audio element.

        This will be used for crossfading.
    */

    nextMusic =
        createAudioElement();


    /*
        Start completely silent.
    */

    currentMusic.volume =
        0;


    nextMusic.volume =
        0;


    /*
        Expose public audio controls.
    */

    window.OurStoryAudio = {

        playMusic,

        pauseMusic,

        stopMusic,

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

        Event delegation means we can support
        all future chapter buttons here.
    */

    initChapterControls();


    console.log(
        "🎵 Audio system initialized."
    );

}


/* ==========================================================
   STORY START
========================================================== */

function handleStoryStart() {

    /*
        User clicked:

        Open My Story

        This starts Chapter 1 directly
        from the user interaction.
    */

    playChapterMusic(1);

}


/* ==========================================================
   PLAY CHAPTER MUSIC
========================================================== */

async function playChapterMusic(
    chapter
) {

    const musicFile =
        ChapterMusic[chapter];


    /*
        Make sure the chapter has music.
    */

    if (!musicFile) {

        console.warn(
            `No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        If this chapter is already playing,
        don't restart it.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying
    ) {

        return;

    }


    /*
        Cancel any current transition.
    */

    cancelFade();


    /*
        If there is no current music,
        use the current audio element.
    */

    if (
        !AudioState.musicPlaying
    ) {

        currentMusic.src =
            musicFile;

        currentMusic.currentTime =
            0;

        currentMusic.volume =
            0;


        AudioState.currentChapter =
            chapter;


        try {

            /*
                IMPORTANT:

                This play() happens directly
                from the user's click when
                Chapter 1 starts.
            */

            await currentMusic.play();


            AudioState.musicStarted =
                true;

            AudioState.musicPlaying =
                true;


            fadeIn(
                currentMusic
            );


            updateMusicButtons();


            notifyMusicState(
                true
            );


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


        return;

    }


    /*
        If music is already playing,
        transition to the requested chapter.
    */

    transitionToChapterMusic(
        chapter
    );

}


/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */

/*
    THIS IS THE MAIN TRANSITION SYSTEM.

    Example:

        transitionToChapterMusic(2);

    does:

        Chapter 1
             ↓
        Chapter 2 starts immediately
             ↓
        Chapter 1 volume ↓
        Chapter 2 volume ↑
             ↓
        Chapter 1 stops
        Chapter 2 continues
*/


function transitionToChapterMusic(
    nextChapter
) {

    const nextFile =
        ChapterMusic[nextChapter];


    /*
        Make sure the next chapter
        has music assigned.
    */

    if (!nextFile) {

        console.warn(
            `No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent accidental double-click
        transitions.
    */

    if (
        AudioState.transitioning
    ) {

        return;

    }


    AudioState.transitioning =
        true;


    /*
        Cancel previous fade animation.
    */

    cancelFade();


    /*
        ------------------------------------------------------
        PREPARE NEXT AUDIO
        ------------------------------------------------------

        The important difference from
        the old system is that we use
        a SECOND audio element.
    */

    nextMusic.pause();

    nextMusic.currentTime =
        0;

    nextMusic.src =
        nextFile;

    nextMusic.loop =
        true;

    nextMusic.volume =
        0;


    /*
        ------------------------------------------------------
        START NEXT AUDIO IMMEDIATELY
        ------------------------------------------------------

        This happens immediately when the
        Continue button is clicked.

        We do NOT wait for Chapter 1
        to finish fading out.
    */

    const playPromise =
        nextMusic.play();


    /*
        If play() returns a Promise,
        monitor it.
    */

    if (playPromise) {

        playPromise
            .then(() => {

                /*
                    Next chapter successfully started.
                */

                console.log(
                    `🎵 Chapter ${nextChapter} audio started.`
                );

            })
            .catch((error) => {

                /*
                    If the browser rejects it,
                    report the actual error.
                */

                console.error(
                    `❌ Chapter ${nextChapter} audio failed to play:`,
                    error
                );


                AudioState.transitioning =
                    false;

            });

    }


    /*
        ------------------------------------------------------
        CROSSFADE
        ------------------------------------------------------

        Chapter 1:
            0.35 → 0

        Chapter 2:
            0 → 0.35
    */

    crossfade(
        currentMusic,
        nextMusic,
        () => {

            /*
                The crossfade is complete.

                Stop old music.
            */

            currentMusic.pause();

            currentMusic.currentTime =
                0;

            currentMusic.volume =
                0;


            /*
                Swap the audio elements.

                The Chapter 2 audio element
                becomes the current one.
            */

            const oldCurrent =
                currentMusic;


            currentMusic =
                nextMusic;


            nextMusic =
                oldCurrent;


            /*
                Make sure the new current
                music is at the user's volume.
            */

            currentMusic.volume =
                AudioSettings.musicVolume;


            /*
                Update state.
            */

            AudioState.currentChapter =
                nextChapter;


            AudioState.musicStarted =
                true;

            AudioState.musicPlaying =
                true;

            AudioState.transitioning =
                false;


            /*
                Update buttons.
            */

            updateMusicButtons();


            /*
                Notify other systems.
            */

            notifyMusicState(
                true
            );


            console.log(
                `🎵 Now playing Chapter ${nextChapter}.`
            );

        }
    );

}


/* ==========================================================
   CROSSFADE
========================================================== */

/*
    This function fades:

        OLD MUSIC:
        current volume → 0

        NEW MUSIC:
        0 → target volume

    at the same time.
*/

function crossfade(
    oldAudio,
    newAudio,
    callback
) {

    cancelFade();


    const startTime =
        performance.now();


    const duration =
        AudioSettings.fadeDuration;


    const targetVolume =
        AudioSettings.musicVolume;


    /*
        Remember starting volume.
    */

    const oldStartVolume =
        oldAudio.volume;


    function animate(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        /*
            Smooth easing.

            This creates a softer
            romantic transition.
        */

        const eased =
            progress *
            progress *
            (
                3 -
                2 *
                progress
            );


        /*
            Fade OLD music out.
        */

        oldAudio.volume =
            Math.max(
                0,
                oldStartVolume *
                (1 - eased)
            );


        /*
            Fade NEW music in.
        */

        newAudio.volume =
            Math.min(
                targetVolume,
                targetVolume *
                eased
            );


        /*
            Continue animation.
        */

        if (
            progress < 1
        ) {

            fadeAnimation =
                requestAnimationFrame(
                    animate
                );

            return;

        }


        /*
            Make sure final volumes
            are exact.
        */

        oldAudio.volume =
            0;

        newAudio.volume =
            targetVolume;


        fadeAnimation =
            null;


        /*
            Tell transition system
            that crossfade is finished.
        */

        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

    }


    fadeAnimation =
        requestAnimationFrame(
            animate
        );

}


/* ==========================================================
   FADE IN
========================================================== */

function fadeIn(
    audio
) {

    cancelFade();


    const startTime =
        performance.now();


    const duration =
        AudioSettings.fadeDuration;


    const targetVolume =
        AudioSettings.musicVolume;


    audio.volume =
        0;


    function animate(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        const eased =
            progress *
            progress *
            (
                3 -
                2 *
                progress
            );


        audio.volume =
            Math.min(
                targetVolume,
                targetVolume *
                eased
            );


        if (
            progress < 1
        ) {

            fadeAnimation =
                requestAnimationFrame(
                    animate
                );

            return;

        }


        audio.volume =
            targetVolume;


        fadeAnimation =
            null;

    }


    fadeAnimation =
        requestAnimationFrame(
            animate
        );

}


/* ==========================================================
   FADE OUT
========================================================== */

function fadeOut(
    audio,
    callback = null
) {

    cancelFade();


    const startVolume =
        audio.volume;


    const startTime =
        performance.now();


    const duration =
        AudioSettings.fadeDuration;


    function animate(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        const eased =
            progress *
            progress *
            (
                3 -
                2 *
                progress
            );


        audio.volume =
            Math.max(
                0,
                startVolume *
                (1 - eased)
            );


        if (
            progress < 1
        ) {

            fadeAnimation =
                requestAnimationFrame(
                    animate
                );

            return;

        }


        audio.volume =
            0;


        fadeAnimation =
            null;


        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

    }


    fadeAnimation =
        requestAnimationFrame(
            animate
        );

}


/* ==========================================================
   PLAY / RESUME CURRENT MUSIC
========================================================== */

async function playMusic() {

    if (
        !currentMusic
    ) {

        return;

    }


    /*
        If there is no selected chapter,
        default to Chapter 1.
    */

    if (
        !currentMusic.src
    ) {

        playChapterMusic(1);

        return;

    }


    try {

        await currentMusic.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            If music was silent,
            restore selected volume.
        */

        if (
            currentMusic.volume === 0
        ) {

            currentMusic.volume =
                AudioSettings.musicVolume;

        }


        updateMusicButtons();


        notifyMusicState(
            true
        );


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

    if (
        !currentMusic
    ) {

        return;

    }


    currentMusic.pause();


    AudioState.musicPlaying =
        false;


    updateMusicButtons();


    notifyMusicState(
        false
    );


    console.log(
        "⏸️ Music paused."
    );

}


/* ==========================================================
   STOP ALL MUSIC
========================================================== */

function stopMusic() {

    cancelFade();


    if (
        currentMusic
    ) {

        currentMusic.pause();

        currentMusic.currentTime =
            0;

        currentMusic.volume =
            0;

    }


    if (
        nextMusic
    ) {

        nextMusic.pause();

        nextMusic.currentTime =
            0;

        nextMusic.volume =
            0;

    }


    AudioState.musicStarted =
        false;

    AudioState.musicPlaying =
        false;

    AudioState.currentChapter =
        null;

    AudioState.transitioning =
        false;


    updateMusicButtons();


    notifyMusicState(
        false
    );


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

    if (
        !currentMusic
    ) {

        return;

    }


    if (
        AudioState.transitioning
    ) {

        return;

    }


    fadeOut(
        currentMusic,
        () => {

            currentMusic.pause();

            currentMusic.currentTime =
                0;

            currentMusic.volume =
                0;


            AudioState.musicStarted =
                false;

            AudioState.musicPlaying =
                false;

            AudioState.currentChapter =
                null;


            updateMusicButtons();


            notifyMusicState(
                false
            );


            console.log(
                "⏹️ Current chapter music stopped."
            );


            if (
                typeof callback ===
                "function"
            ) {

                callback();

            }

        }
    );

}


/* ==========================================================
   SET MUSIC VOLUME
========================================================== */

function setMusicVolume(
    volume
) {

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


    /*
        Only change the current
        music volume if music is playing.
    */

    if (
        currentMusic &&
        AudioState.musicPlaying &&
        !AudioState.transitioning
    ) {

        currentMusic.volume =
            safeVolume;

    }


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
    ONE EVENT LISTENER FOR ALL CHAPTERS.

    This is intentionally centralized here.

    We do NOT need to modify:

        chapter1.js
        chapter2.js
        chapter3.js
        etc.

    Later we only need to add the music
    paths to ChapterMusic.
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
                    DO NOT use stopChapterMusic().

                    Use the crossfade system.
                */

                transitionToChapterMusic(
                    2
                );

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


            /* ==================================================
               CHAPTER 2 → CHAPTER 3
            ================================================== */

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
               FUTURE CHAPTERS
            ==================================================

            CHAPTER 3 → 4

            if (
                event.target.closest(
                    "#chapter3Continue"
                )
            ) {

                transitionToChapterMusic(4);

                return;

            }


            CHAPTER 4 → 5

            if (
                event.target.closest(
                    "#chapter4Continue"
                )
            ) {

                transitionToChapterMusic(5);

                return;

            }


            CHAPTER 5 → 6

            if (
                event.target.closest(
                    "#chapter5Continue"
                )
            ) {

                transitionToChapterMusic(6);

                return;

            }


            CHAPTER 6 → 7

            if (
                event.target.closest(
                    "#chapter6Continue"
                )
            ) {

                transitionToChapterMusic(7);

                return;

            }


            CHAPTER 7 → FINAL

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
        Chapter 1 button
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
        Chapter 2 button
    */

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
   MUSIC STATE NOTIFICATION
========================================================== */

function notifyMusicState(
    playing
) {

    /*
        Keep compatibility with
        the existing project.

        If setMusicState() exists,
        call it.

        We do not require it.
    */

    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(
            playing
        );

    }

}


/* ==========================================================
   CANCEL FADE
========================================================== */

function cancelFade() {

    if (
        fadeAnimation !== null
    ) {

        cancelAnimationFrame(
            fadeAnimation
        );

        fadeAnimation =
            null;

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
