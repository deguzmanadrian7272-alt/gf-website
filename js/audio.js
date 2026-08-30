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


    /*
        Always begin silent.
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
                music.currentSrc ||
                music.src
            );

        }
    );


    /*
        Detect when audio naturally stops.
    */

    music.addEventListener(
        "pause",
        () => {

            /*
                Do not overwrite state while
                a chapter transition is happening.
            */

            if (
                !AudioState.transitioning
            ) {

                AudioState.musicPlaying =
                    false;

                updateMusicButtons();

            }

        }
    );


    music.addEventListener(
        "play",
        () => {

            AudioState.musicPlaying =
                true;

            updateMusicButtons();

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
        Update button states.
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
        Do not restart the same chapter.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying &&
        !music.paused
    ) {

        return;

    }


    /*
        Cancel all existing fades.
    */

    clearFade();


    /*
        Completely stop current audio.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Remove previous source.
    */

    music.removeAttribute(
        "src"
    );

    music.load();


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

        music.load();


        await waitForAudioReady(
            music
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
                Audio is already ready.
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
                        "canplaythrough",
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
                "canplaythrough",
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


    /*
        Make sure next chapter exists.
    */

    if (!nextMusicFile) {

        console.error(
            `🎵 No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent duplicate transitions.
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
        `🎵 Starting transition: Chapter ${oldChapter} → Chapter ${nextChapter}`
    );


    /* ======================================================
       STEP 1
       FORCE FADE OUT
    ====================================================== */

    console.log(
        `🎵 Fading out Chapter ${oldChapter}...`
    );


    /*
        IMPORTANT:

        We no longer depend on AudioState.musicPlaying
        or music.paused to decide whether the fade
        should happen.

        We inspect the ACTUAL audio volume.
    */

    await fadeOutMusic();


    console.log(
        `🎵 Chapter ${oldChapter} fade-out complete.`
    );


    /* ======================================================
       STEP 2
       FORCE HARD STOP
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
            "🎵 Could not reset audio position:",
            error
        );

    }


    /*
        Force silence.
    */

    music.volume = 0;


    /*
        Update state.
    */

    AudioState.musicPlaying =
        false;

    AudioState.musicStarted =
        false;


    updateMusicButtons();


    console.log(
        `⏹️ Chapter ${oldChapter} completely stopped.`
    );


    /* ======================================================
       STEP 3
       REMOVE OLD SOURCE
    ====================================================== */

    music.removeAttribute(
        "src"
    );

    music.load();


    console.log(
        "🎵 Previous audio source removed."
    );


    /* ======================================================
       STEP 4
       LOAD NEXT CHAPTER
    ====================================================== */

    AudioState.currentChapter =
        nextChapter;


    music.src =
        nextMusicFile;

    music.loop =
        true;

    music.preload =
        "auto";

    music.volume =
        0;


    console.log(
        `🎵 Loading Chapter ${nextChapter}: ${nextMusicFile}`
    );


    try {

        music.load();


        await waitForAudioReady(
            music
        );


        console.log(
            `🎵 Chapter ${nextChapter} audio is ready.`
        );


        /* ==================================================
           STEP 5
           PLAY NEXT CHAPTER
        ================================================== */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        console.log(
            `▶️ Chapter ${nextChapter} playback started.`
        );


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        /* ==================================================
           STEP 6
           FADE IN NEXT CHAPTER
        ================================================== */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 Chapter ${nextChapter} successfully started.`
        );

    }

    catch (error) {

        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;


        console.error(
            `❌ Chapter ${nextChapter} could not play.`,
            error
        );


        console.error(
            `❌ Attempted audio file: ${nextMusicFile}`
        );

    }


    /*
        Transition is finished.
    */

    AudioState.transitioning =
        false;


    updateMusicButtons();


    console.log(
        `🎵 Transition complete: Chapter ${oldChapter} → Chapter ${nextChapter}`
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
        No chapter yet.
    */

    if (
        AudioState.currentChapter === null
    ) {

        await playChapterMusic(1);

        return;

    }


    /*
        Source is missing.
    */

    if (
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
            Restore volume.
        */

        if (
            music.volume <= 0 &&
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


    try {

        music.currentTime = 0;

    }

    catch (error) {

        console.warn(
            "🎵 Could not reset audio position:",
            error
        );

    }


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
        Start from silence.
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
                    If there is no source,
                    stop fade.
                */

                if (
                    !music.src
                ) {

                    clearFade();

                    return;

                }


                /*
                    If playback stopped,
                    stop fade.
                */

                if (
                    music.paused
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
        IMPORTANT:

        This function checks the ACTUAL audio
        element instead of AudioState.
    */

    return new Promise(
        (resolve) => {

            /*
                If the audio is already silent,
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


            const startingVolume =
                music.volume;


            const fadeStartTime =
                Date.now();


            /*
                Calculate fade duration based
                on the actual starting volume.
            */

            const fadeDuration =
                AudioSettings.fadeDuration;


            fadeTimer =
                setInterval(
                    () => {

                        /*
                            Calculate elapsed time.
                        */

                        const elapsed =
                            Date.now() -
                            fadeStartTime;


                        /*
                            Calculate progress.
                        */

                        const progress =
                            Math.min(
                                elapsed /
                                fadeDuration,
                                1
                            );


                        /*
                            Smooth fade.
                        */

                        const newVolume =
                            startingVolume *
                            (1 - progress);


                        music.volume =
                            Math.max(
                                newVolume,
                                0
                            );


                        /*
                            Fade complete.
                        */

                        if (
                            progress >= 1 ||
                            music.volume <= 0.001
                        ) {

                            music.volume =
                                0;


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

        fadeTimer =
            null;

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

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    if (
        !music.paused &&
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

    if (
        chapterControlsBound
    ) {

        return;

    }


    chapterControlsBound =
        true;


    /*
        Use ONE global click listener.

        Event delegation means this still works
        if chapters are dynamically displayed.
    */

    document.addEventListener(
        "click",
        (event) => {

            const target =
                event.target;


            /* ==================================================
               CHAPTER 1
            ================================================== */

            if (
                target.closest(
                    "#chapter1MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                target.closest(
                    "#chapter1VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter1VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            if (
                target.closest(
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
                target.closest(
                    "#chapter2MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                target.closest(
                    "#chapter2VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter2VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            if (
                target.closest(
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

                transitionToChapterMusic(
                    4
                );

                return;

            }


            /* ==================================================
               CHAPTER 4
            ================================================== */

            if (
                target.closest(
                    "#chapter4MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                target.closest(
                    "#chapter4VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter4VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            if (
                target.closest(
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
                target.closest(
                    "#chapter5MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                target.closest(
                    "#chapter5VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter5VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            if (
                target.closest(
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
                target.closest(
                    "#chapter6MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                target.closest(
                    "#chapter6VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter6VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                ==================================================
                CHAPTER 6 → CHAPTER 7
                ==================================================

                This is intentionally handled directly.

                Chapter 6
                     ↓
                FORCE FADE OUT
                     ↓
                HARD STOP
                     ↓
                REMOVE chapter6.mp3
                     ↓
                LOAD chapter7.mp3
                     ↓
                PLAY
                     ↓
                FADE IN
            */

            if (
                target.closest(
                    "#chapter6Continue"
                )
            ) {

                console.log(
                    "🎵 Chapter 6 Continue clicked."
                );


                transitionToChapterMusic(
                    7
                );


                return;

            }


            /* ==================================================
               CHAPTER 7
            ================================================== */

            if (
                target.closest(
                    "#chapter7MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            if (
                target.closest(
                    "#chapter7VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            if (
                target.closest(
                    "#chapter7VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /*
                ==================================================
                CHAPTER 7 → FINAL
                ==================================================
            */

            if (
                target.closest(
                    "#chapter7Continue"
                )
            ) {

                console.log(
                    "🎵 Chapter 7 Continue clicked."
                );


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
