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
        ↓
   Chapter 5 fades in
        ↓
   Chapter 5 Continue
        ↓
   Chapter 5 fades out
        ↓
   Chapter 6 music starts
        ↓
   Chapter 6 fades in
        ↓
   Chapter 6 Continue
        ↓
   Chapter 6 fades out
        ↓
   Chapter 7 music starts
        ↓
   Chapter 7 fades in
        ↓
   Chapter 7 Continue
        ↓
   Chapter 7 fades out
        ↓
   Final music starts
        ↓
   Final music fades in

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

    3: "assets/music/chapter3.mp3",

    4: "assets/music/chapter4.mp3",

    5: "assets/music/chapter5.mp3",

    6: "assets/music/chapter6.mp3",

    7: "assets/music/chapter7.mp3",

    final: "assets/music/final.mp3"

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

    if (storyMusic) {

        return storyMusic;

    }


    storyMusic =
        document.getElementById("bgMusic");


    if (!storyMusic) {

        storyMusic =
            document.createElement("audio");

        storyMusic.id =
            "bgMusic";

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


    music.volume = 0;


    /*
        AUDIO ERROR DETECTION
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
                music.currentSrc ||
                music.src
            );

        }
    );


    /*
        AUDIO ENDED DETECTION
    */

    music.addEventListener(
        "pause",
        () => {

            if (
                !AudioState.transitioning &&
                AudioState.musicPlaying
            ) {

                AudioState.musicPlaying =
                    false;

                updateMusicButtons();

            }

        }
    );


    /*
        EXPOSE AUDIO FUNCTIONS
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


    initChapterControls();

    updateMusicButtons();


    console.log(
        "🎵 Audio initialized."
    );

}


/* ==========================================================
   STORY START
========================================================== */

function handleStoryStart() {

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
            `🎵 No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        DO NOT RESTART SAME MUSIC
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying &&
        !music.paused
    ) {

        return;

    }


    /*
        CANCEL ANY EXISTING FADE
    */

    clearFade();


    /*
        HARD STOP CURRENT AUDIO
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        REMOVE OLD SOURCE
    */

    music.removeAttribute(
        "src"
    );

    music.load();


    /*
        SET NEW SOURCE
    */

    music.src =
        musicFile;

    music.loop =
        true;

    music.preload =
        "auto";


    AudioState.currentChapter =
        chapter;


    AudioState.musicStarted =
        false;

    AudioState.musicPlaying =
        false;


    try {

        music.load();


        await waitForAudioReady(
            music
        );


        console.log(
            `🎵 Chapter ${chapter} audio is ready.`
        );


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
            FADE IN
        */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 Chapter ${chapter} music started.`
        );

    }

    catch (error) {

        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
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


            let finished =
                false;


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


            const handleCanPlay =
                () => {

                    if (finished) {

                        return;

                    }

                    finished =
                        true;

                    cleanup();

                    resolve();

                };


            const handleError =
                () => {

                    if (finished) {

                        return;

                    }

                    finished =
                        true;

                    cleanup();

                    reject(
                        new Error(
                            "Audio file could not be loaded."
                        )
                    );

                };


            music.addEventListener(
                "canplay",
                handleCanPlay
            );


            music.addEventListener(
                "error",
                handleError
            );

        }
    );

}


/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */

async function transitionToChapterMusic(
    nextChapter
) {

    const music =
        getMusicElement();


    const nextMusicFile =
        ChapterMusic[nextChapter];


    if (!nextMusicFile) {

        console.warn(
            `🎵 No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        PREVENT DOUBLE TRANSITIONS
    */

    if (
        AudioState.transitioning
    ) {

        console.warn(
            "🎵 Audio transition already in progress."
        );

        return;

    }


    AudioState.transitioning =
        true;


    clearFade();


    const oldChapter =
        AudioState.currentChapter;


    console.log(
        `🎵 Transitioning from Chapter ${oldChapter} to Chapter ${nextChapter}...`
    );


    /* ======================================================
       STEP 1 — FADE OUT CURRENT MUSIC
    ====================================================== */

    if (
        !music.paused &&
        music.currentSrc
    ) {

        console.log(
            `🎵 Fading out Chapter ${oldChapter}...`
        );


        await fadeOutMusic();


        console.log(
            `🎵 Chapter ${oldChapter} fade-out complete.`
        );

    }


    /* ======================================================
       STEP 2 — HARD STOP CURRENT MUSIC
    ====================================================== */

    clearFade();


    music.pause();


    /*
        Reset playback position.
    */

    try {

        music.currentTime = 0;

    }

    catch (error) {

        console.warn(
            "🎵 Could not reset audio time:",
            error
        );

    }


    /*
        Force silence.
    */

    music.volume = 0;


    /*
        Reset state.
    */

    AudioState.musicPlaying =
        false;

    AudioState.musicStarted =
        false;


    updateMusicButtons();


    console.log(
        `🎵 Chapter ${oldChapter} hard stopped.`
    );


    /* ======================================================
       STEP 3 — REMOVE OLD AUDIO SOURCE
    ====================================================== */

    music.removeAttribute(
        "src"
    );

    music.load();


    console.log(
        "🎵 Old audio source removed."
    );


    /* ======================================================
       STEP 4 — LOAD NEXT CHAPTER
    ====================================================== */

    music.src =
        nextMusicFile;

    music.loop =
        true;

    music.preload =
        "auto";


    AudioState.currentChapter =
        nextChapter;


    console.log(
        `🎵 Loading Chapter ${nextChapter}: ${nextMusicFile}`
    );


    try {

        /*
            Force browser to load
            the NEW file.
        */

        music.load();


        await waitForAudioReady(
            music
        );


        console.log(
            `🎵 Chapter ${nextChapter} audio is ready.`
        );


        /* ==================================================
           STEP 5 — START NEXT CHAPTER
        ================================================== */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            IMPORTANT:
            Transition state remains true
            until playback has started.
        */

        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        console.log(
            `🎵 Chapter ${nextChapter} music started.`
        );


        /* ==================================================
           STEP 6 — FADE IN NEXT CHAPTER
        ================================================== */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 Chapter ${nextChapter} fading in.`
        );


    }

    catch (error) {

        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;


        console.error(
            `🎵 Could not start Chapter ${nextChapter}:`,
            error
        );


        console.error(
            `🎵 Attempted audio file: ${nextMusicFile}`
        );

    }


    /*
        TRANSITION COMPLETE
    */

    AudioState.transitioning =
        false;


    updateMusicButtons();


    console.log(
        `🎵 Transition to Chapter ${nextChapter} complete.`
    );

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
        NO CURRENT CHAPTER
    */

    if (
        !music.currentSrc &&
        AudioState.currentChapter === null
    ) {

        await playChapterMusic(1);

        return;

    }


    /*
        CHAPTER EXISTS BUT SOURCE IS MISSING
    */

    if (
        AudioState.currentChapter !== null &&
        !music.currentSrc
    ) {

        await playChapterMusic(
            AudioState.currentChapter
        );

        return;

    }


    try {

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            If silent, restore volume.
        */

        if (
            music.volume === 0 &&
            AudioSettings.musicVolume > 0
        ) {

            fadeInMusic();

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


    clearFade();


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


    music.removeAttribute(
        "src"
    );

    music.load();


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

        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

        return;

    }


    clearFade();


    fadeOutMusic()
        .then(
            () => {

                music.pause();

                music.currentTime = 0;

                music.volume = 0;


                music.removeAttribute(
                    "src"
                );

                music.load();


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

            }
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


    clearFade();


    const targetVolume =
        AudioSettings.musicVolume;


    /*
        Start completely silent.
    */

    music.volume = 0;


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
        setInterval(
            () => {

                /*
                    Stop fade if source disappears.
                */

                if (
                    !music.currentSrc
                ) {

                    clearFade();

                    return;

                }


                /*
                    Stop fade if playback stops,
                    unless we are transitioning.
                */

                if (
                    music.paused &&
                    !AudioState.transitioning
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


                /*
                    Increase volume.
                */

                music.volume =
                    Math.min(
                        music.volume +
                        AudioSettings.fadeStep,

                        targetVolume
                    );

            },
            intervalTime
        );

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

        return Promise.resolve();

    }


    clearFade();


    /*
        If there is no source,
        finish immediately.
    */

    if (
        !music.currentSrc
    ) {

        music.volume = 0;


        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }


        return Promise.resolve();

    }


    /*
        Return Promise so transitions
        can WAIT for fade-out.
    */

    return new Promise(
        (resolve) => {

            /*
                If already silent,
                finish immediately.
            */

            if (
                music.volume <= 0.001
            ) {

                music.volume = 0;


                if (
                    typeof callback ===
                    "function"
                ) {

                    callback();

                }


                resolve();

                return;

            }


            /*
                IMPORTANT:

                We do NOT depend on
                AudioState.musicPlaying.

                The actual audio element
                is what matters.
            */

            fadeTimer =
                setInterval(
                    () => {

                        /*
                            Reduce volume.
                        */

                        music.volume =
                            Math.max(
                                music.volume -
                                AudioSettings.fadeStep,
                                0
                            );


                        /*
                            Fade complete.
                        */

                        if (
                            music.volume <= 0.001
                        ) {

                            music.volume = 0;


                            clearFade();


                            if (
                                typeof callback ===
                                "function"
                            ) {

                                callback();

                            }


                            resolve();

                        }

                    },
                    AudioSettings.fadeInterval
                );

        }
    );

}


/* ==========================================================
   CLEAR FADE
========================================================== */

function clearFade() {

    if (fadeTimer !== null) {

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
        AudioState.musicPlaying &&
        !getMusicElement().paused
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

        Works with dynamically
        shown / hidden chapters.
    */

    document.addEventListener(
        "click",
        (event) => {


            /* ==================================================
               CHAPTER 1
            ================================================== */

            if (
                event.target.closest(
                    "#chapter1MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                event.target.closest(
                    "#chapter1VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                event.target.closest(
                    "#chapter1VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


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

            if (
                event.target.closest(
                    "#chapter2MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                event.target.closest(
                    "#chapter2VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                event.target.closest(
                    "#chapter2VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


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

            if (
                event.target.closest(
                    "#chapter3MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                event.target.closest(
                    "#chapter3VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                event.target.closest(
                    "#chapter3VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


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

            if (
                event.target.closest(
                    "#chapter4MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                event.target.closest(
                    "#chapter4VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                event.target.closest(
                    "#chapter4VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


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
               CHAPTER 5
            ================================================== */

            if (
                event.target.closest(
                    "#chapter5MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                event.target.closest(
                    "#chapter5VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                event.target.closest(
                    "#chapter5VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


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
               CHAPTER 6
            ================================================== */

            if (
                event.target.closest(
                    "#chapter6MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                event.target.closest(
                    "#chapter6VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                event.target.closest(
                    "#chapter6VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                ==================================================
                CHAPTER 6 → CHAPTER 7

                Chapter 6 fades out
                       ↓
                Chapter 6 hard stops
                       ↓
                chapter6.mp3 source removed
                       ↓
                chapter7.mp3 loads
                       ↓
                chapter7.mp3 plays
                       ↓
                Chapter 7 fades in
                ==================================================
            */

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
               CHAPTER 7
            ================================================== */

            if (
                event.target.closest(
                    "#chapter7MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                event.target.closest(
                    "#chapter7VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                event.target.closest(
                    "#chapter7VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                ==================================================
                CHAPTER 7 → FINAL

                Chapter 7 fades out
                       ↓
                Chapter 7 hard stops
                       ↓
                chapter7.mp3 source removed
                       ↓
                final.mp3 loads
                       ↓
                final.mp3 plays
                       ↓
                Final music fades in
                ==================================================
            */

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

    const musicButtonIds = [

        "chapter1MusicToggle",

        "chapter2MusicToggle",

        "chapter3MusicToggle",

        "chapter4MusicToggle",

        "chapter5MusicToggle",

        "chapter6MusicToggle",

        "chapter7MusicToggle"

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
