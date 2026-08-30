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
        If we already have the audio element,
        return it.
    */

    if (storyMusic) {

        return storyMusic;

    }


    /*
        Try to find an existing bgMusic
        element in the HTML.
    */

    storyMusic =
        document.getElementById("bgMusic");


    /*
        If it does not exist,
        create it automatically.
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
            `🎵 No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Do not restart the same chapter
        if it is already playing.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying
    ) {

        return;

    }


    /*
        Cancel any fade.
    */

    clearFade();


    /*
        Completely stop whatever
        was previously playing.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Remove old source.
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

        /*
            Load requested chapter.
        */

        music.load();


        /*
            Wait for audio to become
            playable.
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
            Fade in.
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
        Make sure next chapter has music.
    */

    if (!nextMusicFile) {

        console.warn(
            `🎵 No music assigned to Chapter ${nextChapter}.`
        );

        return;

    }


    /*
        Prevent multiple transition
        requests at the same time.
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
        Stop any previous fade timer.
    */

    clearFade();


    console.log(
        `🎵 Transitioning from Chapter ${AudioState.currentChapter} to Chapter ${nextChapter}...`
    );


    /*
        ======================================================
        FADE OUT CURRENT MUSIC
        ======================================================

        The current chapter completely
        fades out before the next chapter
        begins.
    */

    const hasCurrentMusic =
        AudioState.musicPlaying &&
        !music.paused;


    if (hasCurrentMusic) {

        const oldChapter =
            AudioState.currentChapter;


        console.log(
            `🎵 Fading out Chapter ${oldChapter}...`
        );


        /*
            WAIT for fade-out to completely finish.
        */

        await fadeOutMusic();


        console.log(
            `🎵 Chapter ${oldChapter} fade-out complete.`
        );

    }


    /*
        ======================================================
        HARD STOP CURRENT AUDIO
        ======================================================

        Guarantees that the previous
        chapter music cannot continue.
    */

    clearFade();


    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Reset playback state before
        loading the next chapter.
    */

    AudioState.musicPlaying =
        false;

    AudioState.musicStarted =
        false;


    updateMusicButtons();


    /*
        ======================================================
        REMOVE OLD SOURCE
        ======================================================
    */

    music.removeAttribute(
        "src"
    );

    music.load();


    /*
        ======================================================
        START NEXT CHAPTER MUSIC
        ======================================================
    */

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
        Check requested chapter.
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
        Make sure no fade is still running.
    */

    clearFade();


    /*
        Completely stop audio element.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


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
            Load new chapter.
        */

        music.load();


        /*
            Wait until new audio is ready.
        */

        await waitForAudioReady(
            music
        );


        console.log(
            `🎵 Chapter ${chapter} audio is ready.`
        );


        /*
            Start new chapter music.
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
        If there is no current chapter,
        start Chapter 1.
    */

    if (
        !music.currentSrc &&
        AudioState.currentChapter === null
    ) {

        await playChapterMusic(1);

        return;

    }


    /*
        If a chapter exists but the source
        is missing, reload that chapter.
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
            Restore selected volume.
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
        Remove source completely.
    */

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


    fadeOutMusic(
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


    /*
        Nothing to fade if volume is zero.
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
        setInterval(
            () => {

                /*
                    If audio source disappeared,
                    cancel fade.
                */

                if (
                    !music.currentSrc
                ) {

                    clearFade();

                    return;

                }


                /*
                    If playback has stopped,
                    do not continue fading.
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
        Return a Promise so chapter
        transitions can WAIT until
        the fade is completely finished.
    */

    return new Promise(
        (resolve) => {

            /*
                If there is no music playing,
                there is nothing to fade.
            */

            if (
                music.paused ||
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
                Fade down gradually.
            */

            fadeTimer =
                setInterval(
                    () => {

                        /*
                            Continue reducing volume.
                        */

                        music.volume =
                            Math.max(
                                music.volume -
                                AudioSettings.fadeStep,
                                0
                            );


                        /*
                            Fade finished.
                        */

                        if (
                            music.volume <= 0.001
                        ) {

                            music.volume = 0;


                            clearFade();


                            /*
                                Callback ONLY after
                                volume reaches zero.
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

        This works even when chapters
        are dynamically shown/hidden.
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


            /*
                Chapter 4 → Chapter 5
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


            /*
                Chapter 5 → Chapter 6
            */

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
                Chapter 6 hard stops
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

                transitionToChapterMusic(
                    7
                );

                return;

            }


            /* ==================================================
               CHAPTER 7
            ================================================== */

            /*
                Play / Pause
            */

            if (
                event.target.closest(
                    "#chapter7MusicToggle"
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
                    "#chapter7VolumeDown"
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
                Chapter 7 hard stops
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
        All chapters use the same
        background audio element.

        Therefore every music toggle
        receives the same state.
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
