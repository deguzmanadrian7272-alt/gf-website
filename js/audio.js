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

    currentChapter: null

};


/* ==========================================================
   CHAPTER MUSIC
========================================================== */

const ChapterMusic = {

    1: "assets/music/chapter1.mp3",

    2: "assets/music/chapter2.mp3",

    // We will add these later:

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
   AUDIO CONTROL STATE
========================================================== */

let fadeTimer = null;

let audioControlsBound = false;


/* ==========================================================
   CREATE / GET AUDIO ELEMENT
========================================================== */

function getMusicElement() {

    /*
        Use the existing bgMusic element if
        the project already has one.

        Otherwise create one automatically.
    */

    if (storyMusic) {

        return storyMusic;

    }


    storyMusic =
        document.getElementById("bgMusic");


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
        Start silent.

        Music will only begin after
        the user clicks Open My Story.
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

        stopChapterMusic,

        increaseVolume,

        decreaseVolume

    };


    /*
        Connect Chapter 0's
        "Open My Story" button.
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
        Initialize music controls.

        Event delegation is used so the controls
        continue working even when chapters are
        displayed dynamically.
    */

    initAudioControls();


    console.log(
        "🎵 Audio initialized."
    );

}


/* ==========================================================
   STORY START
========================================================== */

function handleStoryStart() {

    /*
        Open My Story starts
        Chapter 1 music.
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


    if (!musicFile) {

        console.warn(
            `No music assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        If the same chapter is already playing,
        don't restart the song.
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

    if (fadeTimer) {

        clearInterval(fadeTimer);

        fadeTimer = null;

    }


    /*
        Stop previous music.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load the selected chapter song.
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


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        /*
            Smoothly fade the song in.
        */

        fadeInMusic();


        updateAllMusicButtons();


        console.log(
            `🎵 Chapter ${chapter} music started.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;


        updateAllMusicButtons();


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
        If no song has been selected yet,
        start Chapter 1.
    */

    if (!music.src) {

        if (ChapterMusic[1]) {

            playChapterMusic(1);

        }

        return;

    }


    try {

        /*
            Resume the current song.

            IMPORTANT:
            currentTime is NOT reset.

            The song continues from the
            exact position where it stopped.
        */

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


        updateAllMusicButtons();


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


    /*
        Pause only.

        currentTime is NOT reset.

        This allows the song to continue
        from the same position when played again.
    */

    music.pause();


    AudioState.musicPlaying =
        false;


    updateAllMusicButtons();


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


    /*
        Cancel fade.
    */

    if (fadeTimer) {

        clearInterval(fadeTimer);

        fadeTimer = null;

    }


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
   STOP CHAPTER MUSIC
========================================================== */

function stopChapterMusic() {

    const music =
        getMusicElement();


    if (!music) {

        return;

    }


    /*
        Cancel previous fade.
    */

    if (fadeTimer) {

        clearInterval(fadeTimer);

        fadeTimer = null;

    }


    /*
        Fade out before stopping.
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


        updateAllMusicButtons();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(false);

        }


        console.log(
            "⏹️ Chapter music stopped."
        );

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


    /*
        Cancel existing fade.
    */

    if (fadeTimer) {

        clearInterval(fadeTimer);

        fadeTimer = null;

    }


    const targetVolume =
        AudioSettings.musicVolume;


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

                clearInterval(
                    fadeTimer
                );

                fadeTimer = null;

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

        return;

    }


    /*
        Cancel previous fade.
    */

    if (fadeTimer) {

        clearInterval(fadeTimer);

        fadeTimer = null;

    }


    fadeTimer =
        setInterval(() => {

            if (
                music.volume <= 0.01
            ) {

                music.volume = 0;

                clearInterval(
                    fadeTimer
                );

                fadeTimer = null;


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
        PLAYING → PAUSE
        PAUSED  → RESUME

        The song position is preserved.
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
   AUDIO CONTROLS
========================================================== */

function initAudioControls() {

    /*
        Prevent duplicate event listeners.
    */

    if (audioControlsBound) {

        return;

    }


    audioControlsBound = true;


    /*
        EVENT DELEGATION

        This allows both Chapter 1 and
        Chapter 2 controls to work even
        when the chapters are displayed
        dynamically.
    */

    document.addEventListener(
        "click",
        (event) => {


            /* ==========================================
               CHAPTER 1 PLAY / PAUSE
            ========================================== */

            if (
                event.target.closest(
                    "#chapter1MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /* ==========================================
               CHAPTER 1 VOLUME DOWN
            ========================================== */

            if (
                event.target.closest(
                    "#chapter1VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /* ==========================================
               CHAPTER 1 VOLUME UP
            ========================================== */

            if (
                event.target.closest(
                    "#chapter1VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /* ==========================================
               CHAPTER 1 CONTINUE
            ========================================== */

            if (
                event.target.closest(
                    "#chapter1Continue"
                )
            ) {

                stopChapterMusic();

                return;

            }


            /* ==========================================
               CHAPTER 2 PLAY / PAUSE
            ========================================== */

            if (
                event.target.closest(
                    "#chapter2MusicToggle"
                )
            ) {

                toggleMusic();

                return;

            }


            /* ==========================================
               CHAPTER 2 VOLUME DOWN
            ========================================== */

            if (
                event.target.closest(
                    "#chapter2VolumeDown"
                )
            ) {

                decreaseVolume();

                return;

            }


            /* ==========================================
               CHAPTER 2 VOLUME UP
            ========================================== */

            if (
                event.target.closest(
                    "#chapter2VolumeUp"
                )
            ) {

                increaseVolume();

                return;

            }


            /* ==========================================
               CHAPTER 2 CONTINUE
            ========================================== */

            if (
                event.target.closest(
                    "#chapter2Continue"
                )
            ) {

                stopChapterMusic();

                return;

            }

        }
    );

}


/* ==========================================================
   UPDATE ALL MUSIC BUTTONS
========================================================== */

function updateAllMusicButtons() {

    updateChapter1MusicButton();

    updateChapter2MusicButton();

}


/* ==========================================================
   UPDATE CHAPTER 1 MUSIC BUTTON
========================================================== */

function updateChapter1MusicButton() {

    const button =
        document.getElementById(
            "chapter1MusicToggle"
        );


    if (!button) {

        return;

    }


    if (
        AudioState.musicPlaying &&
        AudioState.currentChapter === 1
    ) {

        button.textContent =
            "❚❚";

        button.setAttribute(
            "aria-label",
            "Pause Chapter I music"
        );

        button.classList.add(
            "chapter1-music-pause"
        );

        button.classList.remove(
            "chapter1-music-play"
        );

    }

    else {

        button.textContent =
            "▶";

        button.setAttribute(
            "aria-label",
            "Play Chapter I music"
        );

        button.classList.add(
            "chapter1-music-play"
        );

        button.classList.remove(
            "chapter1-music-pause"
        );

    }

}


/* ==========================================================
   UPDATE CHAPTER 2 MUSIC BUTTON
========================================================== */

function updateChapter2MusicButton() {

    const button =
        document.getElementById(
            "chapter2MusicToggle"
        );


    if (!button) {

        return;

    }


    if (
        AudioState.musicPlaying &&
        AudioState.currentChapter === 2
    ) {

        button.textContent =
            "❚❚";

        button.setAttribute(
            "aria-label",
            "Pause Chapter II music"
        );

        button.classList.add(
            "chapter2-music-pause"
        );

        button.classList.remove(
            "chapter2-music-play"
        );

    }

    else {

        button.textContent =
            "▶";

        button.setAttribute(
            "aria-label",
            "Play Chapter II music"
        );

        button.classList.add(
            "chapter2-music-play"
        );

        button.classList.remove(
            "chapter2-music-pause"
        );

    }

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
