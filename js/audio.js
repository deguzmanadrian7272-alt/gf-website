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
    // final: "assets/music/final.mp3"

};


/* ==========================================================
   AUDIO ELEMENT
========================================================== */

let storyMusic = null;


/* ==========================================================
   AUDIO CONTROL
========================================================== */

let fadeTimer = null;

let audioInitialized = false;

let chapterObserver = null;


/* ==========================================================
   GET MUSIC ELEMENT
========================================================== */

function getMusicElement() {

    if (storyMusic) {

        return storyMusic;

    }


    storyMusic =
        document.getElementById("bgMusic");


    /*
        If bgMusic does not exist in HTML,
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
        Start completely silent.
    */

    music.volume = 0;


    /*
        Listen directly to the audio element.

        This keeps the button state synchronized
        with the REAL music state.
    */

    music.addEventListener(
        "play",
        handleAudioPlay
    );


    music.addEventListener(
        "pause",
        handleAudioPause
    );


    music.addEventListener(
        "ended",
        handleAudioPause
    );


    /*
        Expose global audio controls.
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
        Chapter 0:
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
        Initialize music buttons.
    */

    initMusicControls();


    /*
        Watch which chapter is active.

        This is the important part.

        The navigation system can move from
        Chapter 1 → Chapter 2 independently.

        Once Chapter 2 becomes active,
        this observer automatically starts
        Chapter 2 music.
    */

    initChapterObserver();


    /*
        Check the currently active chapter
        immediately.
    */

    checkActiveChapter();


    console.log(
        "🎵 Audio initialized."
    );

}


/* ==========================================================
   AUDIO PLAY EVENT
========================================================== */

function handleAudioPlay() {

    AudioState.musicPlaying =
        true;


    AudioState.musicStarted =
        true;


    updateAllMusicButtons();


    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(true);

    }

}


/* ==========================================================
   AUDIO PAUSE EVENT
========================================================== */

function handleAudioPause() {

    /*
        Do not change the current chapter here.

        Pausing Chapter 1 should still mean
        that Chapter 1 is selected.

        This allows the music to resume.
    */

    AudioState.musicPlaying =
        false;


    updateAllMusicButtons();


    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(false);

    }

}


/* ==========================================================
   CHAPTER 0 → CHAPTER 1
========================================================== */

function handleStoryStart() {

    /*
        Open My Story starts Chapter 1.
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


    if (!music) {

        return;

    }


    const musicFile =
        ChapterMusic[chapter];


    if (!musicFile) {

        console.warn(
            `🎵 No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        If this chapter's music is already
        playing, do nothing.

        This prevents restarting the song
        when the MutationObserver detects
        the same active chapter again.
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
        If the same chapter is selected
        but currently paused, resume it
        instead of restarting.
    */

    if (
        AudioState.currentChapter === chapter &&
        !AudioState.musicPlaying &&
        music.src
    ) {

        try {

            await music.play();

            /*
                The "play" event will update
                the state and buttons.
            */

            if (
                music.volume <= 0
            ) {

                music.volume =
                    AudioSettings.musicVolume;

            }

            return;

        }

        catch (error) {

            console.warn(
                "🎵 Could not resume music:",
                error
            );

        }

    }


    /*
        A completely different chapter
        is being loaded.

        Stop the previous song.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Set the new music file.
    */

    music.src =
        musicFile;

    music.loop = true;


    AudioState.currentChapter =
        chapter;


    try {

        await music.play();


        /*
            Fade in after playback begins.
        */

        fadeInMusic();


        console.log(
            `🎵 Chapter ${chapter} music started.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;


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

    if (!music.src) {

        playChapterMusic(1);

        return;

    }


    try {

        await music.play();


        /*
            IMPORTANT:

            Do NOT reset currentTime.

            The song resumes exactly where
            it was paused.
        */

        if (
            music.volume <= 0
        ) {

            music.volume =
                AudioSettings.musicVolume;

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


    console.log(
        "⏸️ Music paused."
    );

}


/* ==========================================================
   STOP MUSIC
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
        Prevent multiple chapter transitions
        from starting multiple fades.
    */

    if (
        AudioState.transitioning
    ) {

        return;

    }


    AudioState.transitioning =
        true;


    clearFade();


    /*
        Fade Chapter 1 out.
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
            Clear the current chapter
            because the next active chapter
            will select its own music.
        */

        AudioState.currentChapter =
            null;


        updateAllMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(false);

        }


        AudioState.transitioning =
            false;


        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }


        console.log(
            "⏹️ Chapter music stopped."
        );

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
        If volume is already at the target,
        no fade is necessary.
    */

    if (
        targetVolume <= 0
    ) {

        music.volume = 0;

        return;

    }


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

        return;

    }


    clearFade();


    /*
        If already silent,
        immediately finish.
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
        Only change actual volume if
        music is currently playing.

        This prevents changing the button
        state unexpectedly.
    */

    if (
        AudioState.musicPlaying
    ) {

        music.volume =
            safeVolume;

    }


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
               CHAPTER 1 → CHAPTER 2
            ================================================== */

            if (
                event.target.closest(
                    "#chapter1Continue"
                )
            ) {

                /*
                    ONLY stop Chapter 1 here.

                    We intentionally DO NOT start
                    Chapter 2 here.

                    The chapter navigation system
                    will activate #chapter2.

                    MutationObserver below will detect
                    that Chapter 2 is active and then
                    start chapter2.mp3.
                */

                stopChapterMusic();

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
        Music is REALLY PLAYING.

        Show PAUSE.
    */

    if (
        AudioState.musicPlaying &&
        !storyMusic?.paused
    ) {

        button.textContent =
            "⏸️";

        button.setAttribute(
            "aria-label",
            `Pause ${chapterName} music`
        );

        button.classList.add(
            "chapter-music-pause"
        );

        button.classList.remove(
            "chapter-music-play"
        );

    }

    /*
        Music is paused/stopped.

        Show PLAY.
    */

    else {

        button.textContent =
            "▶";

        button.setAttribute(
            "aria-label",
            `Play ${chapterName} music`
        );

        button.classList.add(
            "chapter-music-play"
        );

        button.classList.remove(
            "chapter-music-pause"
        );

    }

}


/* ==========================================================
   CHAPTER OBSERVER
========================================================== */

function initChapterObserver() {

    /*
        Avoid creating the observer twice.
    */

    if (chapterObserver) {

        return;

    }


    /*
        Observe changes to the class attribute.

        Your navigation system changes:

            #chapter1.active

        into:

            #chapter2.active

        We detect that change here.
    */

    chapterObserver =
        new MutationObserver(
            () => {

                checkActiveChapter();

            }
        );


    /*
        Watch the entire document because
        chapters already exist in the page.
    */

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
   CHECK ACTIVE CHAPTER
========================================================== */

function checkActiveChapter() {

    /*
        Chapter 2 active?
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

        /*
            If Chapter 2 is active,
            Chapter 2 music should be playing.
        */

        if (
            AudioState.currentChapter !== 2 ||
            !AudioState.musicPlaying
        ) {

            playChapterMusic(2);

        }

        return;

    }


    /*
        Chapter 1 active?
    */

    const chapter1 =
        document.getElementById(
            "chapter1"
        );


    if (
        chapter1 &&
        chapter1.classList.contains(
            "active"
        )
    ) {

        /*
            If Chapter 1 is active and no music
            is currently selected, start Chapter 1.
        */

        if (
            AudioState.currentChapter === null
        ) {

            playChapterMusic(1);

        }

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
