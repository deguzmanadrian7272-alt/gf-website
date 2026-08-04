/* ==========================================================
   AUDIO.JS
   Project : Our Story
   Purpose : Background Music & Sound Effects
   Chapter : 0
========================================================== */


/* ==========================================================
   AUDIO SETTINGS
========================================================== */

const AudioSettings = {

    musicVolume: 0.35,

    fadeDuration: 1800,

    fadeStep: 0.02,

    fadeInterval: 50

};


/* ==========================================================
   AUDIO STATE
========================================================== */

const AudioState = {

    musicStarted: false,

    musicPlaying: false

};


/* ==========================================================
   AUDIO INITIALIZATION
========================================================== */

function initAudio() {

    const music = document.getElementById("bgMusic");


    /*
        Safety check.
    */

    if (!music) {

        console.warn(
            "Background music element was not found."
        );

        return;

    }


    /*
        Start completely silent.

        The music will only begin after
        the user interacts with the website.
    */

    music.volume = 0;

    music.loop = true;


    /*
        Expose useful controls globally.
    */

    window.OurStoryAudio = {

        playMusic,

        pauseMusic,

        stopMusic,

        fadeInMusic,

        fadeOutMusic,

        setMusicVolume,

        toggleMusic

    };


    console.log("🎵 Audio initialized.");

}


/* ==========================================================
   PLAY MUSIC
========================================================== */

async function playMusic() {

    const music = document.getElementById("bgMusic");


    if (!music) {

        return;

    }


    try {

        /*
            Attempt to play the music.

            This should be called after a user interaction
            such as clicking "Open My Story".
        */

        await music.play();


        AudioState.musicStarted = true;

        AudioState.musicPlaying = true;


        /*
            Tell app.js about the music state.
        */

        if (typeof setMusicState === "function") {

            setMusicState(true);

        }


        /*
            Smoothly increase the volume.
        */

        fadeInMusic();


        console.log("🎵 Music started.");

    }

    catch (error) {

        /*
            Autoplay restrictions or missing audio files
            will end up here.
        */

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

    const music = document.getElementById("bgMusic");


    if (!music) {

        return;

    }


    music.pause();

    AudioState.musicPlaying = false;


    if (typeof setMusicState === "function") {

        setMusicState(false);

    }

}


/* ==========================================================
   STOP MUSIC
========================================================== */

function stopMusic() {

    const music = document.getElementById("bgMusic");


    if (!music) {

        return;

    }


    music.pause();

    music.currentTime = 0;

    music.volume = 0;


    AudioState.musicStarted = false;

    AudioState.musicPlaying = false;


    if (typeof setMusicState === "function") {

        setMusicState(false);

    }

}


/* ==========================================================
   FADE IN
========================================================== */

function fadeInMusic() {

    const music = document.getElementById("bgMusic");


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


    const fade = setInterval(() => {

        if (music.volume >= targetVolume) {

            music.volume = targetVolume;

            clearInterval(fade);

            return;

        }


        music.volume = Math.min(
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

    const music = document.getElementById("bgMusic");


    if (!music) {

        return;

    }


    const fade = setInterval(() => {

        if (music.volume <= 0.01) {

            music.volume = 0;

            clearInterval(fade);


            if (typeof callback === "function") {

                callback();

            }

            return;

        }


        music.volume = Math.max(
            music.volume -
            AudioSettings.fadeStep,

            0
        );

    }, AudioSettings.fadeInterval);

}


/* ==========================================================
   SET MUSIC VOLUME
========================================================== */

function setMusicVolume(volume) {

    const music = document.getElementById("bgMusic");


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


    music.volume = safeVolume;


    AudioSettings.musicVolume =
        safeVolume;

}


/* ==========================================================
   TOGGLE MUSIC
========================================================== */

function toggleMusic() {

    if (AudioState.musicPlaying) {

        pauseMusic();

    }

    else {

        playMusic();

    }

}