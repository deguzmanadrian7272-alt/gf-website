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

    /*
        Return existing audio element.
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
        Create audio element if necessary.
    */

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
        Start silent.
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
        Update music buttons.
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
        Check music file.
    */

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
        AudioState.musicPlaying
    ) {

        return;

    }


    /*
        Cancel any existing fade.
    */

    clearFade();


    /*
        Stop current audio completely.
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
        Set requested source.
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
            Load audio.
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


        /*
            Update state.
        */

        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;

        AudioState.transitioning =
            false;


        /*
            Update external music state
            if available.
        */

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

        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;

        AudioState.transitioning =
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


            const handleCanPlay =
                () => {

                    cleanup();

                    resolve();

                };


            const handleError =
                () => {

                    cleanup();

                    reject(
                        new Error(
                            "Audio file could not be loaded."
                        )
                    );

                };


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

async function transitionToChapterMusic(
    nextChapter
) {

    const music =
        getMusicElement();


    const nextMusicFile =
        ChapterMusic[nextChapter];


    /*
        Make sure the next chapter exists.
    */

    if (!nextMusicFile) {

        console.warn(
            `🎵 No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent multiple transitions.
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


    /*
        Cancel any existing fade.
    */

    clearFade();


    const oldChapter =
        AudioState.currentChapter;


    console.log(
        `🎵 Transitioning from Chapter ${oldChapter} to Chapter ${nextChapter}...`
    );


    /* ======================================================
       STEP 1
       FADE OUT CURRENT MUSIC
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
       STEP 2
       HARD STOP CURRENT MUSIC
    ====================================================== */

    clearFade();


    /*
        Pause the audio.
    */

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
        Force volume to zero.
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


    /* ======================================================
       STEP 3
       REMOVE OLD AUDIO SOURCE
    ====================================================== */

    music.removeAttribute(
        "src"
    );

    music.load();


    /* ======================================================
       STEP 4
       START NEXT CHAPTER
    ====================================================== */

    await startNextChapterMusic(
        nextChapter
    );

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
        Verify music file.
    */

    if (!musicFile) {

        AudioState.transitioning =
            false;

        console.warn(
            `🎵 No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Cancel previous fade.
    */

    clearFade();


    /*
        Force audio to stop.
    */

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
        Start next music silently.
    */

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


    /*
        Update current chapter
        BEFORE playback.
    */

    AudioState.currentChapter =
        chapter;


    console.log(
        `🎵 Loading Chapter ${chapter} music: ${musicFile}`
    );


    try {

        /*
            Load the new audio.
        */

        music.load();


        /*
            Wait for the new audio.
        */

        await waitForAudioReady(
            music
        );


        console.log(
            `🎵 Chapter ${chapter} audio is ready.`
        );


        /*
            Explicitly start playback.
        */

        await music.play();


        /*
            Verify playback actually started.
        */

        if (
            music.paused
        ) {

            throw new Error(
                `Chapter ${chapter} audio remained paused after play().`
            );

        }


        /*
            Update audio state.
        */

        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;

        AudioState.transitioning =
            false;


        /*
            Update external music state.
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


        /*
            Update buttons.
        */

        updateMusicButtons();


        console.log(
            `🎵 Successfully started Chapter ${chapter} music.`
        );

    }

    catch (error) {

        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;

        AudioState.transitioning =
            false;


        /*
            Make sure failed audio
            cannot continue.
        */

        music.pause();

        music.volume = 0;


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
        No current chapter.
        Start Chapter 1.
    */

    if (
        !music.currentSrc &&
        AudioState.currentChapter === null
    ) {

        await playChapterMusic(1);

        return;

    }


    /*
        Chapter exists but source disappeared.
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
            Restore volume.
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


    /*
        Hard stop.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Remove source.
    */

    music.removeAttribute(
        "src"
    );

    music.load();


    /*
        Reset state.
    */

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

                /*
                    Hard stop.
                */

                music.pause();

                music.currentTime = 0;

                music.volume = 0;


                /*
                    Remove source.
                */

                music.removeAttribute(
                    "src"
                );

                music.load();


                /*
                    Reset state.
                */

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
        Start from zero.
    */

    music.volume = 0;


    /*
        Nothing to fade if volume is zero.
    */

    if (
        targetVolume <= 0
    ) {

        return;

    }


    /*
        Calculate fade timing.
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
        setInterval(
            () => {

                /*
                    Stop fade if source
                    no longer exists.
                */

                if (
                    !music.currentSrc
                ) {

                    clearFade();

                    return;

                }


                /*
                    Stop fade if audio
                    has been paused.
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
        Return Promise so transitions
        can wait for completion.
    */

    return new Promise(
        (resolve) => {

            /*
                If audio has no source,
                stop immediately.
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


                resolve();

                return;

            }


            /*
                If audio is already silent,
                stop immediately.
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
                Fade downward.
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


                            /*
                                Callback happens
                                AFTER fade reaches zero.
                            */

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


    /*
        Save selected volume.
    */

    AudioSettings.musicVolume =
        safeVolume;


    /*
        Apply volume.
    */

    music.volume =
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

        This works with dynamically
        shown/hidden chapters.
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
                Chapter 6 → Chapter 7

                Chapter 6 fades out
                       ↓
                Chapter 6 stops
                       ↓
                chapter7.mp3 loads
                       ↓
                chapter7.mp3 plays
                       ↓
                Chapter 7 fades in
            */

            if (
                event.target.closest(
                    "#chapter6Continue"
                )
            ) {

                console.log(
                    "🎵 Chapter 6 Continue clicked → Chapter 7"
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
                Chapter 7 → Final

                Chapter 7 fades out
                       ↓
                Chapter 7 stops
                       ↓
                final.mp3 loads
                       ↓
                final.mp3 plays
                       ↓
                Final music fades in
            */

            if (
                event.target.closest(
                    "#chapter7Continue"
                )
            ) {

                console.log(
                    "🎵 Chapter 7 Continue clicked → Final"
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

    /*
        All chapters share one audio element.

        Therefore all music buttons
        show the same playback state.
    */

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
