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

let chapterControlsBound = false;


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
        Start completely silent.

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

        transitionToChapterMusic,

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
        Initialize chapter music controls.

        Event delegation is used so the controls
        continue working even when chapters are
        shown dynamically.
    */

    initChapterMusicControls();


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
        do not restart the song.
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

    cancelFade();


    /*
        Stop the previous song.
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

        AudioState.transitioning =
            false;


        if (
            typeof setMusicState ===
            "function"
        ) {

            setMusicState(true);

        }


        /*
            Smoothly fade the new chapter music in.
        */

        fadeInMusic();


        updateChapterMusicButton();


        console.log(
            `🎵 Chapter ${chapter} music started.`
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
   TRANSITION TO ANOTHER CHAPTER
========================================================== */

function transitionToChapterMusic(
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
        Prevent the same transition
        from happening multiple times.
    */

    if (AudioState.transitioning) {

        return;

    }


    AudioState.transitioning =
        true;


    /*
        Cancel any existing fade.
    */

    cancelFade();


    /*
        Fade out the current song first.
    */

    fadeOutMusic(() => {

        /*
            Stop the current song.
        */

        music.pause();

        music.currentTime = 0;

        music.volume = 0;


        /*
            Load the next chapter's music.
        */

        music.src =
            musicFile;

        music.loop = true;


        AudioState.currentChapter =
            chapter;


        /*
            Start the new chapter music.
        */

        music.play()
            .then(() => {

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
                    Fade Chapter 2 music in.
                */

                fadeInMusic();


                updateChapterMusicButton();


                console.log(
                    `🎵 Chapter ${chapter} music started.`
                );

            })

            .catch((error) => {

                AudioState.musicPlaying =
                    false;

                AudioState.transitioning =
                    false;


                console.warn(
                    `Chapter ${chapter} music could not start:`,
                    error
                );

            });

    });

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
        If a chapter transition is currently
        happening, don't interfere with it.
    */

    if (AudioState.transitioning) {

        return;

    }


    /*
        If no song is selected yet,
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
            IMPORTANT:

            Do NOT reset currentTime.

            This resumes the song from the
            exact position where it was paused.
        */

        await music.play();


        AudioState.musicStarted =
            true;

        AudioState.musicPlaying =
            true;


        /*
            Restore the selected volume.
        */

        if (
            music.volume === 0
        ) {

            music.volume =
                AudioSettings.musicVolume;

        }


        updateChapterMusicButton();


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


    cancelFade();


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


    cancelFade();


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


    updateChapterMusicButton();


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


    cancelFade();


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


        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }


        updateChapterMusicButton();


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
   CANCEL FADE
========================================================== */

function cancelFade() {

    if (fadeTimer) {

        clearInterval(
            fadeTimer
        );

        fadeTimer =
            null;

    }

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


    cancelFade();


    const targetVolume =
        AudioSettings.musicVolume;


    /*
        Start from zero.
    */

    music.volume = 0;


    /*
        Calculate fade timing.
    */

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

                cancelFade();

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

        if (
            typeof callback ===
            "function"
        ) {

            callback();

        }

        return;

    }


    cancelFade();


    /*
        If music is already silent,
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

                cancelFade();


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

    /*
        If music is currently playing,
        pause it.

        If music is paused,
        resume it.
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
   CHAPTER MUSIC CONTROLS
========================================================== */

function initChapterMusicControls() {

    /*
        Prevent duplicate event listeners.
    */

    if (chapterControlsBound) {

        return;

    }


    chapterControlsBound =
        true;


    /*
        EVENT DELEGATION

        This allows the music controls
        to work even if chapters are
        shown dynamically.
    */

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
                    IMPORTANT:

                    Chapter 1.js remains responsible
                    for changing the actual chapter.

                    audio.js only handles the music.

                    Fade Chapter 1 music out,
                    then start Chapter 2 music.
                */

                transitionToChapterMusic(2);

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


            /* ==================================================
               CHAPTER 2 → CHAPTER 3
            ================================================== */

            if (
                event.target.closest(
                    "#chapter2Continue"
                )
            ) {

                /*
                    Chapter 3 music will be added
                    later.

                    For now, this safely stops
                    Chapter 2 music.
                */

                if (
                    ChapterMusic[3]
                ) {

                    transitionToChapterMusic(3);

                }

                else {

                    stopChapterMusic();

                }

                return;

            }

        }
    );

}


/* ==========================================================
   UPDATE CHAPTER MUSIC BUTTON
========================================================== */

function updateChapterMusicButton() {

    /*
        Chapter 1 button
    */

    const chapter1Button =
        document.getElementById(
            "chapter1MusicToggle"
        );


    if (chapter1Button) {

        if (
            AudioState.musicPlaying &&
            AudioState.currentChapter === 1
        ) {

            chapter1Button.textContent =
                "❚❚";

            chapter1Button.setAttribute(
                "aria-label",
                "Pause Chapter I music"
            );

        }

        else {

            chapter1Button.textContent =
                "▶";

            chapter1Button.setAttribute(
                "aria-label",
                "Play Chapter I music"
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
                "Pause Chapter II music"
            );

        }

        else {

            chapter2Button.textContent =
                "▶";

            chapter2Button.setAttribute(
                "aria-label",
                "Play Chapter II music"
            );

        }

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
