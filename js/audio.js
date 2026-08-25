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

    // We will add these later:
    // 2: "assets/music/chapter2.mp3",
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
        Connect Chapter 1's
        Continue button.

        This stops Chapter 1 music
        before moving to Chapter 2.
    */

    const chapter1Continue =
        document.getElementById(
            "chapter1Continue"
        );


    if (chapter1Continue) {

        chapter1Continue.addEventListener(
            "click",
            () => {

                stopChapterMusic();

            }
        );

    }


    /*
        Connect Chapter 1 music controls.
    */

    initChapter1Controls();


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
        Stop the previous song first.
    */

    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    /*
        Load the new chapter song.
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


        fadeInMusic();


        updateChapterMusicButton();


        console.log(
            `🎵 Chapter ${chapter} music started.`
        );

    }

    catch (error) {

        console.warn(
            `Chapter ${chapter} music could not start:`,
            error
        );

    }

}


/* ==========================================================
   PLAY CURRENT MUSIC
========================================================== */

async function playMusic() {

    const music =
        getMusicElement();


    if (!music.src) {

        /*
            If no song has been selected yet,
            start Chapter 1.
        */

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


        fadeInMusic();

        updateChapterMusicButton();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }

    }

    catch (error) {

        console.warn(
            "Music could not start:",
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


    updateChapterMusicButton();


    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(false);

    }

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


    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    AudioState.musicStarted =
        false;

    AudioState.musicPlaying =
        false;

    AudioState.currentChapter =
        null;


    updateChapterMusicButton();


    if (
        typeof setMusicState ===
        "function"
    ) {

        setMusicState(false);

    }

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
        Fade out before stopping.
    */

    fadeOutMusic(() => {

        music.pause();

        music.currentTime = 0;

        AudioState.musicStarted =
            false;

        AudioState.musicPlaying =
            false;

        AudioState.currentChapter =
            null;


        updateChapterMusicButton();


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(false);

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


    const targetVolume =
        AudioSettings.musicVolume;


    music.volume = 0;


    const steps =
        targetVolume /
        AudioSettings.fadeStep;


    const intervalTime =
        AudioSettings.fadeDuration /
        steps;


    const fade =
        setInterval(() => {

            if (
                music.volume >=
                targetVolume
            ) {

                music.volume =
                    targetVolume;

                clearInterval(fade);

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


    const fade =
        setInterval(() => {

            if (
                music.volume <= 0.01
            ) {

                music.volume = 0;

                clearInterval(fade);


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


    updateChapterMusicButton();

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
   CHAPTER 1 MUSIC CONTROLS
========================================================== */

function initChapter1Controls() {

    const toggleButton =
        document.getElementById(
            "chapter1MusicToggle"
        );


    const volumeDown =
        document.getElementById(
            "chapter1VolumeDown"
        );


    const volumeUp =
        document.getElementById(
            "chapter1VolumeUp"
        );


    /*
        PLAY / PAUSE
    */

    if (toggleButton) {

        toggleButton.addEventListener(
            "click",
            () => {

                toggleMusic();

            }
        );

    }


    /*
        VOLUME DOWN
    */

    if (volumeDown) {

        volumeDown.addEventListener(
            "click",
            () => {

                decreaseVolume();

            }
        );

    }


    /*
        VOLUME UP
    */

    if (volumeUp) {

        volumeUp.addEventListener(
            "click",
            () => {

                increaseVolume();

            }
        );

    }

}


/* ==========================================================
   UPDATE CHAPTER 1 PLAY BUTTON
========================================================== */

function updateChapterMusicButton() {

    const button =
        document.getElementById(
            "chapter1MusicToggle"
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
            "Pause Chapter I music"
        );

    }

    else {

        button.textContent =
            "▶";

        button.setAttribute(
            "aria-label",
            "Play Chapter I music"
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
