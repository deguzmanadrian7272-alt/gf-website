/* ==========================================================
   AUDIO.JS — TESTER VERSION
   Project : Our Story

   PURPOSE:
   ----------------------------------------------------------
   TEST ONLY

   Open My Story
        ↓
   Chapter 1 music starts
        ↓
   Click Continue
        ↓
   Chapter 1 music stops
        ↓
   Chapter 2 music starts

   IMPORTANT:
   ----------------------------------------------------------
   This tester does NOT depend on chapter1.js.

   Do not modify:
        chapter1.js
        transition.js
        app.js

   This file handles the audio test by itself.
========================================================== */


/* ==========================================================
   AUDIO FILES
========================================================== */

const TEST_MUSIC = {

    chapter1:
        "assets/music/chapter1.mp3",

    chapter2:
        "assets/music/chapter2.mp3"

};


/* ==========================================================
   AUDIO SETTINGS
========================================================== */

const TEST_AUDIO_SETTINGS = {

    volume:
        0.35,

    fadeDuration:
        1000

};


/* ==========================================================
   AUDIO STATE
========================================================== */

const TestAudioState = {

    currentChapter:
        null,

    playing:
        false,

    changing:
        false

};


/* ==========================================================
   AUDIO ELEMENT
========================================================== */

/*
    We create ONE completely new audio element.

    We are intentionally NOT using the existing
    <audio id="bgMusic"> for this test.

    This removes possible problems caused by
    the original <source> element.
*/

let testMusic = null;


/* ==========================================================
   INITIALIZE AUDIO
========================================================== */

function initAudioTester() {

    console.log(
        "=========================================="
    );

    console.log(
        "🎵 OUR STORY AUDIO TESTER"
    );

    console.log(
        "=========================================="
    );


    /*
        ------------------------------------------------------
        CREATE AUDIO ELEMENT
        ------------------------------------------------------
    */

    testMusic =
        document.createElement("audio");


    testMusic.id =
        "ourStoryTestMusic";


    testMusic.preload =
        "auto";


    testMusic.loop =
        true;


    testMusic.volume =
        TEST_AUDIO_SETTINGS.volume;


    /*
        Hide audio element.
    */

    testMusic.style.display =
        "none";


    document.body.appendChild(
        testMusic
    );


    /*
        ------------------------------------------------------
        AUDIO EVENTS
        ------------------------------------------------------
    */

    testMusic.addEventListener(
        "loadstart",
        () => {

            console.log(
                "🎵 Audio load started:",
                testMusic.src
            );

        }
    );


    testMusic.addEventListener(
        "loadedmetadata",
        () => {

            console.log(
                "🎵 Audio metadata loaded."
            );

            console.log(
                "Duration:",
                testMusic.duration,
                "seconds"
            );

        }
    );


    testMusic.addEventListener(
        "canplay",
        () => {

            console.log(
                "🎵 Audio can play:"
            );

            console.log(
                testMusic.src
            );

        }
    );


    testMusic.addEventListener(
        "playing",
        () => {

            console.log(
                "▶️ AUDIO IS ACTUALLY PLAYING"
            );

            console.log(
                "Current chapter:",
                TestAudioState.currentChapter
            );

        }
    );


    testMusic.addEventListener(
        "pause",
        () => {

            console.log(
                "⏸️ Audio paused."
            );

        }
    );


    testMusic.addEventListener(
        "error",
        () => {

            console.error(
                "❌ AUDIO ERROR"
            );

            console.error(
                testMusic.error
            );

            console.error(
                "Audio source:",
                testMusic.src
            );

        }
    );


    /*
        ------------------------------------------------------
        FIND BUTTONS
        ------------------------------------------------------
    */

    const startButton =
        document.getElementById(
            "startBtn"
        );


    const chapter1Continue =
        document.getElementById(
            "chapter1Continue"
        );


    console.log(
        "🔎 Looking for buttons..."
    );


    console.log(
        "startBtn:",
        startButton
    );


    console.log(
        "chapter1Continue:",
        chapter1Continue
    );


    /*
        ------------------------------------------------------
        START BUTTON
        ------------------------------------------------------
    */

    if (
        startButton
    ) {

        startButton.addEventListener(
            "click",
            startChapter1Test
        );


        console.log(
            "✅ Open My Story listener attached."
        );

    }

    else {

        console.error(
            "❌ Could not find #startBtn"
        );

    }


    /*
        ------------------------------------------------------
        CHAPTER 1 CONTINUE BUTTON
        ------------------------------------------------------
    */

    if (
        chapter1Continue
    ) {

        chapter1Continue.addEventListener(
            "click",
            startChapter2Test
        );


        console.log(
            "✅ Chapter 1 Continue listener attached."
        );

    }

    else {

        console.error(
            "❌ Could not find #chapter1Continue"
        );

    }


    console.log(
        "=========================================="
    );

    console.log(
        "🎵 AUDIO TESTER READY"
    );

    console.log(
        "=========================================="
    );

}


/* ==========================================================
   START CHAPTER 1
========================================================== */

async function startChapter1Test() {

    console.log(
        "------------------------------------------"
    );

    console.log(
        "🎵 TEST: OPEN MY STORY"
    );

    console.log(
        "------------------------------------------"
    );


    console.log(
        "Attempting to load:"
    );

    console.log(
        TEST_MUSIC.chapter1
    );


    /*
        Make sure audio is stopped.
    */

    testMusic.pause();


    /*
        Reset position.
    */

    testMusic.currentTime =
        0;


    /*
        Load Chapter 1.
    */

    testMusic.src =
        TEST_MUSIC.chapter1;


    testMusic.volume =
        TEST_AUDIO_SETTINGS.volume;


    /*
        Update state.
    */

    TestAudioState.currentChapter =
        1;


    TestAudioState.changing =
        false;


    try {

        /*
            IMPORTANT:

            This play() happens directly
            because the function was triggered
            by the user's click.
        */

        const playPromise =
            testMusic.play();


        /*
            Wait for play().
        */

        await playPromise;


        TestAudioState.playing =
            true;


        console.log(
            "=========================================="
        );

        console.log(
            "✅ CHAPTER 1 MUSIC STARTED"
        );

        console.log(
            "=========================================="
        );


        console.log(
            "File:",
            testMusic.src
        );


        console.log(
            "Volume:",
            testMusic.volume
        );

    }

    catch (error) {

        TestAudioState.playing =
            false;


        console.error(
            "=========================================="
        );

        console.error(
            "❌ CHAPTER 1 MUSIC FAILED"
        );

        console.error(
            "=========================================="
        );


        console.error(
            error
        );

    }

}


/* ==========================================================
   START CHAPTER 2
========================================================== */

async function startChapter2Test() {

    console.log(
        "------------------------------------------"
    );

    console.log(
        "🎵 TEST: CHAPTER 1 → CHAPTER 2"
    );

    console.log(
        "------------------------------------------"
    );


    /*
        Prevent double clicks.
    */

    if (
        TestAudioState.changing
    ) {

        console.warn(
            "⚠️ Chapter transition already happening."
        );

        return;

    }


    TestAudioState.changing =
        true;


    /*
        Check current audio.
    */

    console.log(
        "Current audio source:"
    );

    console.log(
        testMusic.src
    );


    console.log(
        "Current chapter:"
    );

    console.log(
        TestAudioState.currentChapter
    );


    console.log(
        "Current volume:"
    );

    console.log(
        testMusic.volume
    );


    /*
        ------------------------------------------------------
        STEP 1
        STOP CHAPTER 1
        ------------------------------------------------------
    */

    console.log(
        "🛑 Stopping Chapter 1..."
    );


    /*
        Instead of using a delayed callback,
        we immediately pause Chapter 1.
    */

    testMusic.pause();


    /*
        Reset Chapter 1.
    */

    testMusic.currentTime =
        0;


    testMusic.volume =
        0;


    TestAudioState.playing =
        false;


    console.log(
        "✅ Chapter 1 stopped."
    );


    /*
        ------------------------------------------------------
        STEP 2
        LOAD CHAPTER 2
        ------------------------------------------------------
    */

    console.log(
        "🎵 Loading Chapter 2..."
    );


    console.log(
        "Chapter 2 file:"
    );

    console.log(
        TEST_MUSIC.chapter2
    );


    /*
        Replace the source.
    */

    testMusic.src =
        TEST_MUSIC.chapter2;


    /*
        Reset position.
    */

    testMusic.currentTime =
        0;


    /*
        Start silent.
    */

    testMusic.volume =
        0;


    /*
        Update chapter state.
    */

    TestAudioState.currentChapter =
        2;


    /*
        ------------------------------------------------------
        STEP 3
        PLAY CHAPTER 2
        ------------------------------------------------------
    */

    console.log(
        "▶️ Attempting to play Chapter 2..."
    );


    try {

        /*
            IMPORTANT:

            This is still inside the click event
            chain.

            No setTimeout.
            No waiting for Chapter 1.
        */

        const playPromise =
            testMusic.play();


        await playPromise;


        TestAudioState.playing =
            true;


        console.log(
            "=========================================="
        );

        console.log(
            "✅ CHAPTER 2 MUSIC STARTED"
        );

        console.log(
            "=========================================="
        );


        console.log(
            "File:",
            testMusic.src
        );


        /*
            --------------------------------------------------
            STEP 4
            FADE CHAPTER 2 IN
            --------------------------------------------------
        */

        fadeChapter2In();


    }

    catch (error) {

        TestAudioState.playing =
            false;


        TestAudioState.changing =
            false;


        console.error(
            "=========================================="
        );

        console.error(
            "❌ CHAPTER 2 MUSIC FAILED"
        );

        console.error(
            "=========================================="
        );


        console.error(
            error
        );


        console.error(
            "File attempted:"
        );


        console.error(
            TEST_MUSIC.chapter2
        );

    }

}


/* ==========================================================
   FADE CHAPTER 2 IN
========================================================== */

function fadeChapter2In() {

    console.log(
        "🎚️ Fading Chapter 2 in..."
    );


    const startTime =
        performance.now();


    const duration =
        TEST_AUDIO_SETTINGS.fadeDuration;


    const targetVolume =
        TEST_AUDIO_SETTINGS.volume;


    function animate(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        /*
            Smooth easing.
        */

        const eased =
            progress *
            progress *
            (
                3 -
                2 *
                progress
            );


        testMusic.volume =
            targetVolume *
            eased;


        if (
            progress <
            1
        ) {

            requestAnimationFrame(
                animate
            );

            return;

        }


        testMusic.volume =
            targetVolume;


        TestAudioState.changing =
            false;


        console.log(
            "🎵 Chapter 2 fade-in complete."
        );


        console.log(
            "🎵 Chapter 2 is now playing at:",
            testMusic.volume
        );

    }


    requestAnimationFrame(
        animate
    );

}


/* ==========================================================
   GLOBAL TEST CONTROLS
========================================================== */

window.OurStoryAudio =
    {

        playChapter1:
            startChapter1Test,

        playChapter2:
            startChapter2Test,

        getState:
            () => {

                return {

                    currentChapter:
                        TestAudioState.currentChapter,

                    playing:
                        TestAudioState.playing,

                    changing:
                        TestAudioState.changing,

                    source:
                        testMusic
                            ? testMusic.src
                            : null,

                    volume:
                        testMusic
                            ? testMusic.volume
                            : null

                };

            },

        stop:
            () => {

                if (
                    testMusic
                ) {

                    testMusic.pause();

                    testMusic.currentTime =
                        0;

                    testMusic.volume =
                        0;

                }


                TestAudioState.currentChapter =
                    null;

                TestAudioState.playing =
                    false;

                TestAudioState.changing =
                    false;


                console.log(
                    "⏹️ Test audio stopped."
                );

            }

    };


/* ==========================================================
   AUTOMATIC INITIALIZATION
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initAudioTester
    );

}

else {

    initAudioTester();

}
