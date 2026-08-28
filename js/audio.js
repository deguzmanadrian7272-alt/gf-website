/* ==========================================================
   AUDIO.JS
   Project : Our Story
   Purpose : Background Music & Sound Effects
   Chapters: 0 → Final

   AUDIO FLOW:

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

   IMPORTANT:
   This file ONLY controls AUDIO.
   It does NOT control chapter navigation.
========================================================== */


/* ==========================================================
   AUDIO SETTINGS
========================================================== */

const AudioSettings = {

    musicVolume: 0.35,

    fadeDuration: 1200,

    fadeInterval: 40,

    volumeStep: 0.05

};


/* ==========================================================
   AUDIO STATE
========================================================== */

const AudioState = {

    currentChapter: null,

    musicPlaying: false,

    transitioning: false

};


/* ==========================================================
   CHAPTER MUSIC FILES
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

    // final: "assets/music/final.mp3"

};


/* ==========================================================
   AUDIO ELEMENT
========================================================== */

let storyMusic = null;


/* ==========================================================
   FADE CONTROL
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
        If we already have the audio element,
        return it.
    */

    if (storyMusic) {

        return storyMusic;

    }


    /*
        Try to find the existing audio element.
    */

    storyMusic =
        document.getElementById("bgMusic");


    /*
        If it doesn't exist,
        create it.
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
            "🎵 Audio element could not be created."
        );

        return;

    }


    /*
        Start silent.
    */

    music.volume = 0;


    /*
        Expose controls globally.
    */

    window.OurStoryAudio = {

        playMusic,

        pauseMusic,

        stopMusic,

        playChapterMusic,

        transitionToChapterMusic,

        fadeInMusic,

        fadeOutMusic,

        setMusicVolume,

        increaseVolume,

        decreaseVolume,

        toggleMusic

    };


    /*
        Start My Story button.
    */

    document.addEventListener(
        "click",
        handleAudioClick
    );


    console.log(
        "🎵 Our Story Audio initialized."
    );

}


/* ==========================================================
   GLOBAL AUDIO CLICK HANDLER
========================================================== */

/*
    Instead of attaching events directly to
    buttons during initialization, we listen
    to the document.

    This is important because all chapters
    already exist inside index.html.
*/

function handleAudioClick(event) {

    const clickedElement =
        event.target.closest("button");


    if (!clickedElement) {

        return;

    }


    /* ======================================================
       OPEN MY STORY
    ====================================================== */

    if (
        clickedElement.id === "startBtn"
    ) {

        console.log(
            "🎵 Open My Story clicked → Chapter 1 music"
        );

        playChapterMusic(1);

        return;

    }


    /* ======================================================
       CHAPTER 1 → CHAPTER 2
    ====================================================== */

    if (
        clickedElement.id === "chapter1Continue"
    ) {

        console.log(
            "🎵 Chapter 1 Continue clicked → Chapter 2 music"
        );

        transitionToChapterMusic(2);

        return;

    }


    /* ======================================================
       CHAPTER 2 → CHAPTER 3
    ====================================================== */

    if (
        clickedElement.id === "chapter2Continue"
    ) {

        console.log(
            "🎵 Chapter 2 Continue clicked → Chapter 3 music"
        );

        transitionToChapterMusic(3);

        return;

    }


    /* ======================================================
       CHAPTER 3 → CHAPTER 4
    ====================================================== */

    if (
        clickedElement.id === "chapter3Continue"
    ) {

        console.log(
            "🎵 Chapter 3 Continue clicked → Chapter 4 music"
        );

        transitionToChapterMusic(4);

        return;

    }


    /* ======================================================
       CHAPTER 4 → CHAPTER 5
    ====================================================== */

    if (
        clickedElement.id === "chapter4Continue"
    ) {

        console.log(
            "🎵 Chapter 4 Continue clicked → Chapter 5 music"
        );

        transitionToChapterMusic(5);

        return;

    }


    /* ======================================================
       CHAPTER 5 → CHAPTER 6
    ====================================================== */

    if (
        clickedElement.id === "chapter5Continue"
    ) {

        console.log(
            "🎵 Chapter 5 Continue clicked → Chapter 6 music"
        );

        transitionToChapterMusic(6);

        return;

    }


    /* ======================================================
       CHAPTER 6 → CHAPTER 7
    ====================================================== */

    if (
        clickedElement.id === "chapter6Continue"
    ) {

        console.log(
            "🎵 Chapter 6 Continue clicked → Chapter 7 music"
        );

        transitionToChapterMusic(7);

        return;

    }


    /* ======================================================
       CHAPTER 7 → FINAL
    ====================================================== */

    if (
        clickedElement.id === "chapter7Continue"
    ) {

        console.log(
            "🎵 Chapter 7 Continue clicked → Final music"
        );

        transitionToChapterMusic("final");

        return;

    }


    /* ======================================================
       CHAPTER 1 MUSIC TOGGLE
    ====================================================== */

    if (
        clickedElement.id === "chapter1MusicToggle"
    ) {

        toggleMusic();

        return;

    }


    /* ======================================================
       CHAPTER 1 VOLUME DOWN
    ====================================================== */

    if (
        clickedElement.id === "chapter1VolumeDown"
    ) {

        decreaseVolume();

        return;

    }


    /* ======================================================
       CHAPTER 1 VOLUME UP
    ====================================================== */

    if (
        clickedElement.id === "chapter1VolumeUp"
    ) {

        increaseVolume();

        return;

    }

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
        Check whether the music exists
        in our ChapterMusic object.
    */

    if (!musicFile) {

        console.warn(
            `🎵 No music file assigned to Chapter ${chapter}.`
        );

        return;

    }


    /*
        Don't restart the same song.
    */

    if (
        AudioState.currentChapter === chapter &&
        AudioState.musicPlaying
    ) {

        console.log(
            `🎵 Chapter ${chapter} music is already playing.`
        );

        return;

    }


    /*
        Cancel any previous fade.
    */

    clearFade();


    /*
        Stop whatever is currently playing.
    */

    music.pause();


    /*
        Reset playback position.
    */

    music.currentTime = 0;


    /*
        Start new music silently.
    */

    music.volume = 0;


    /*
        Change the audio source.
    */

    music.src = musicFile;


    /*
        Tell browser to load
        the new file.
    */

    music.load();


    /*
        Update state.
    */

    AudioState.currentChapter =
        chapter;


    try {

        /*
            Start playback.

            IMPORTANT:
            This happens after the user
            clicked a button, so browser
            autoplay restrictions should
            not block it.
        */

        await music.play();


        AudioState.musicPlaying =
            true;


        /*
            Fade new song in.
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

        console.error(
            `❌ Could not play Chapter ${chapter} music.`,
            error
        );

    }

}


/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */

/*
    THIS is the main function we need.

    Example:

        transitionToChapterMusic(2);

    Result:

        chapter1.mp3
              ↓
           fade out
              ↓
           stop
              ↓
        chapter2.mp3
              ↓
           play
              ↓
           fade in
*/

function transitionToChapterMusic(
    nextChapter
) {

    const music =
        getMusicElement();


    const nextMusic =
        ChapterMusic[nextChapter];


    /*
        Make sure the next chapter
        has a music file.
    */

    if (!nextMusic) {

        console.warn(
            `🎵 Chapter ${nextChapter} has no assigned music yet.`
        );

        return;

    }


    /*
        Prevent accidental double clicks.
    */

    if (
        AudioState.transitioning
    ) {

        console.log(
            "🎵 Audio transition already running."
        );

        return;

    }


    AudioState.transitioning =
        true;


    /*
        Cancel any existing fade.
    */

    clearFade();


    console.log(
        `🎵 Preparing transition to Chapter ${nextChapter}...`
    );


    /*
        If music is currently playing,
        fade it out first.
    */

    if (
        !music.paused &&
        music.src
    ) {

        fadeOutMusic(
            () => {

                finishChapterTransition(
                    nextChapter
                );

            }
        );

    }

    else {

        /*
            Nothing currently playing.
            Start the new chapter immediately.
        */

        finishChapterTransition(
            nextChapter
        );

    }

}


/* ==========================================================
   FINISH CHAPTER TRANSITION
========================================================== */

async function finishChapterTransition(
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
        Make sure old audio is completely stopped.
    */

    music.pause();

    music.currentTime = 0;


    /*
        Start the new song at zero volume.
    */

    music.volume = 0;


    /*
        Replace the source.
    */

    music.src =
        musicFile;


    music.loop =
        true;


    /*
        IMPORTANT:
        Force browser to load the
        new MP3.
    */

    music.load();


    /*
        Update chapter state BEFORE playback.
    */

    AudioState.currentChapter =
        chapter;


    try {

        /*
            Play the new chapter.

            This is still part of the
            original user click chain.
        */

        await music.play();


        AudioState.musicPlaying =
            true;

        AudioState.transitioning =
            false;


        /*
            Fade new song in.
        */

        fadeInMusic();


        updateMusicButtons();


        console.log(
            `🎵 SUCCESS → Chapter ${chapter} music is now playing.`
        );

    }

    catch (error) {

        AudioState.musicPlaying =
            false;

        AudioState.transitioning =
            false;


        console.error(
            `❌ FAILED → Chapter ${chapter} music could not play.`,
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


    /*
        If there is no current chapter,
        start Chapter 1.
    */

    if (
        !AudioState.currentChapter
    ) {

        playChapterMusic(1);

        return;

    }


    try {

        await music.play();


        AudioState.musicPlaying =
            true;


        if (
            music.volume === 0
        ) {

            music.volume =
                AudioSettings.musicVolume;

        }


        updateMusicButtons();


        console.log(
            "🎵 Music resumed."
        );

    }

    catch (error) {

        console.error(
            "❌ Music could not resume.",
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


    music.pause();


    AudioState.musicPlaying =
        false;


    updateMusicButtons();


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


    clearFade();


    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    AudioState.currentChapter =
        null;

    AudioState.musicPlaying =
        false;

    AudioState.transitioning =
        false;


    updateMusicButtons();


    console.log(
        "⏹️ Music stopped."
    );

}


/* ==========================================================
   FADE IN
========================================================== */

function fadeInMusic() {

    const music =
        getMusicElement();


    clearFade();


    const target =
        AudioSettings.musicVolume;


    music.volume = 0;


    const startTime =
        Date.now();


    fadeTimer =
        setInterval(
            () => {

                const elapsed =
                    Date.now() -
                    startTime;


                const progress =
                    Math.min(
                        elapsed /
                        AudioSettings.fadeDuration,
                        1
                    );


                music.volume =
                    target *
                    progress;


                if (
                    progress >= 1
                ) {

                    music.volume =
                        target;

                    clearFade();

                }

            },
            AudioSettings.fadeInterval
        );

}


/* ==========================================================
   FADE OUT
========================================================== */

function fadeOutMusic(
    callback = null
) {

    const music =
        getMusicElement();


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


    const startingVolume =
        music.volume;


    const startTime =
        Date.now();


    fadeTimer =
        setInterval(
            () => {

                const elapsed =
                    Date.now() -
                    startTime;


                const progress =
                    Math.min(
                        elapsed /
                        AudioSettings.fadeDuration,
                        1
                    );


                music.volume =
                    startingVolume *
                    (1 - progress);


                if (
                    progress >= 1
                ) {

                    music.volume = 0;


                    clearFade();


                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback();

                    }

                }

            },
            AudioSettings.fadeInterval
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
   SET VOLUME
========================================================== */

function setMusicVolume(
    volume
) {

    const music =
        getMusicElement();


    const safeVolume =
        Math.max(
            0,
            Math.min(
                Number(volume),
                1
            )
        );


    AudioSettings.musicVolume =
        safeVolume;


    /*
        Only change the actual
        audio volume if music exists.
    */

    if (
        AudioState.musicPlaying
    ) {

        music.volume =
            safeVolume;

    }


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
   UPDATE MUSIC BUTTONS
========================================================== */

function updateMusicButtons() {

    /*
        Chapter 1 button.
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
        If Chapter 2 later gets
        its own music control,
        we can update it here.
    */

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
