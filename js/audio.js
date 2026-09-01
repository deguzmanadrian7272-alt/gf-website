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
    3: "assets/music/chapter3.mp3",
    4: "assets/music/chapter4.mp3",
    5: "assets/music/chapter5.mp3",
    6: "assets/music/chapter6.mp3",
    7: "assets/music/chapter7.mp3",
    final: "assets/music/final.mp3"
};

/* ==========================================================
   AUDIO ELEMENT & STATE
========================================================== */
let storyMusic = null;
let fadeTimer = null;
let chapterControlsBound = false;

/* ==========================================================
   CREATE / GET AUDIO ELEMENT
========================================================== */
function getMusicElement() {
    if (storyMusic) {
        return storyMusic;
    }

    storyMusic = document.getElementById("bgMusic");

    if (!storyMusic) {
        storyMusic = document.createElement("audio");
        storyMusic.id = "bgMusic";
        document.body.appendChild(storyMusic);
    }

    storyMusic.loop = true;
    storyMusic.preload = "auto";
    storyMusic.volume = AudioSettings.musicVolume;

    return storyMusic;
}

/* ==========================================================
   AUDIO INITIALIZATION
========================================================== */
function initAudio() {
    const music = getMusicElement();

    if (!music) {
        console.warn("Audio element could not be initialized.");
        return;
    }

    music.volume = 0;

    music.addEventListener("error", () => {
        console.error("🎵 Audio error:", music.error);
        console.error("🎵 Current audio source:", music.currentSrc || music.src);
    });

    // Expose audio functions globally
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

    // Story Start Button (Chapter 0 -> Chapter 1)
    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
        startBtn.addEventListener("click", handleStoryStart);
    }

    initChapterControls();
    detectAndAutoPlayChapter();
    updateMusicButtons();

    console.log("🎵 Audio initialized.");
}

/* ==========================================================
   URL / PAGE DETECTION HELPER
========================================================== */
function detectAndAutoPlayChapter() {
    const path = window.location.pathname.toLowerCase();
    let currentCh = null;

    if (path.includes("chapter1")) currentCh = 1;
    else if (path.includes("chapter2")) currentCh = 2;
    else if (path.includes("chapter3")) currentCh = 3;
    else if (path.includes("chapter4")) currentCh = 4;
    else if (path.includes("chapter5")) currentCh = 5;
    else if (path.includes("chapter6")) currentCh = 6;
    else if (path.includes("chapter7")) currentCh = 7;
    else if (path.includes("final")) currentCh = "final";

    if (currentCh !== null && currentCh !== 1) {
        // Attempt play or wait for first user gesture if blocked by browser
        const attemptPlay = () => {
            if (!AudioState.musicPlaying) {
                playChapterMusic(currentCh);
            }
        };

        attemptPlay();
        document.addEventListener("click", attemptPlay, { once: true });
        document.addEventListener("keydown", attemptPlay, { once: true });
    }
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
async function playChapterMusic(chapter) {
    const music = getMusicElement();
    const musicFile = ChapterMusic[chapter];

    if (!musicFile) {
        console.warn(`🎵 No music assigned to Chapter ${chapter}.`);
        return;
    }

    if (AudioState.currentChapter === chapter && AudioState.musicPlaying) {
        return;
    }

    clearFade();

    music.pause();
    music.currentTime = 0;
    music.volume = 0;
    music.removeAttribute("src");
    music.load();

    music.src = musicFile;
    music.loop = true;
    music.preload = "auto";

    AudioState.currentChapter = chapter;

    try {
        music.load();
        await waitForAudioReady(music);
        await music.play();

        AudioState.musicStarted = true;
        AudioState.musicPlaying = true;

        if (typeof setMusicState === "function") {
            setMusicState(true);
        }

        fadeInMusic();
        updateMusicButtons();

        console.log(`🎵 Chapter ${chapter} music started.`);
    } catch (error) {
        AudioState.musicStarted = false;
        AudioState.musicPlaying = false;
        console.error(`🎵 Chapter ${chapter} music could not start:`, error);
        console.error(`🎵 Attempted source: ${musicFile}`);
    }
}

/* ==========================================================
   WAIT FOR AUDIO READY
========================================================== */
function waitForAudioReady(music) {
    return new Promise((resolve, reject) => {
        if (music.readyState >= 3) {
            resolve();
            return;
        }

        const handleCanPlay = () => {
            cleanup();
            resolve();
        };

        const handleError = () => {
            cleanup();
            reject(new Error("Audio file could not be loaded."));
        };

        const cleanup = () => {
            music.removeEventListener("canplay", handleCanPlay);
            music.removeEventListener("error", handleError);
        };

        music.addEventListener("canplay", handleCanPlay, { once: true });
        music.addEventListener("error", handleError, { once: true });
    });
}

/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */
async function transitionToChapterMusic(nextChapter) {
    const music = getMusicElement();
    const nextMusicFile = ChapterMusic[nextChapter];

    if (!nextMusicFile) {
        console.warn(`🎵 No music assigned to Chapter ${nextChapter}.`);
        return;
    }

    if (AudioState.transitioning) {
        console.warn("🎵 Audio transition already in progress.");
        return;
    }

    AudioState.transitioning = true;
    clearFade();

    console.log(`🎵 Starting audio transition: Chapter ${AudioState.currentChapter} → Chapter ${nextChapter}`);

    const hasCurrentMusic = AudioState.musicPlaying && !music.paused;

    if (hasCurrentMusic) {
        const oldChapter = AudioState.currentChapter;
        console.log(`🎵 Fading out Chapter ${oldChapter}...`);
        await fadeOutMusic();
        console.log(`🎵 Chapter ${oldChapter} fade-out complete.`);
    }

    clearFade();
    music.pause();
    music.currentTime = 0;
    music.volume = 0;

    AudioState.musicPlaying = false;
    AudioState.musicStarted = false;

    updateMusicButtons();

    music.removeAttribute("src");
    music.load();

    await startNextChapterMusic(nextChapter);
}

/* ==========================================================
   START NEXT CHAPTER MUSIC
========================================================== */
async function startNextChapterMusic(chapter) {
    const music = getMusicElement();
    const musicFile = ChapterMusic[chapter];

    if (!musicFile) {
        AudioState.transitioning = false;
        console.warn(`🎵 No music assigned to Chapter ${chapter}.`);
        return;
    }

    clearFade();
    music.pause();
    music.currentTime = 0;
    music.volume = 0;

    music.src = musicFile;
    music.loop = true;
    music.preload = "auto";

    const prevChapter = AudioState.currentChapter;
    AudioState.currentChapter = chapter;

    console.log(`🎵 Loading Chapter ${chapter}: ${musicFile}`);

    try {
        music.load();
        await waitForAudioReady(music);
        console.log(`🎵 Chapter ${chapter} audio is ready.`);

        await music.play();

        AudioState.musicStarted = true;
        AudioState.musicPlaying = true;

        if (typeof setMusicState === "function") {
            setMusicState(true);
        }

        fadeInMusic();
        updateMusicButtons();

        console.log(`🎵 Chapter ${chapter} playback started.`);
        AudioState.transitioning = false;
        console.log(`🎵 Transition complete: Chapter ${prevChapter} → Chapter ${chapter}`);
    } catch (error) {
        AudioState.musicStarted = false;
        AudioState.musicPlaying = false;
        AudioState.transitioning = false;

        console.error(`🎵 Chapter ${chapter} music could not start:`, error);
        console.error(`🎵 Attempted audio file: ${musicFile}`);
    }
}

/* ==========================================================
   PLAY / RESUME CURRENT MUSIC
========================================================== */
async function playMusic() {
    const music = getMusicElement();
    if (!music) return;

    if (!music.currentSrc && AudioState.currentChapter === null) {
        await playChapterMusic(1);
        return;
    }

    if (AudioState.currentChapter !== null && !music.currentSrc) {
        await playChapterMusic(AudioState.currentChapter);
        return;
    }

    try {
        await music.play();
        AudioState.musicStarted = true;
        AudioState.musicPlaying = true;

        if (music.volume === 0 && AudioSettings.musicVolume > 0) {
            music.volume = AudioSettings.musicVolume;
        }

        updateMusicButtons();

        if (typeof setMusicState === "function") {
            setMusicState(true);
        }

        console.log("🎵 Music resumed.");
    } catch (error) {
        console.warn("🎵 Music could not resume:", error);
    }
}

/* ==========================================================
   PAUSE MUSIC
========================================================== */
function pauseMusic() {
    const music = getMusicElement();
    if (!music) return;

    clearFade();
    music.pause();

    AudioState.musicPlaying = false;
    updateMusicButtons();

    if (typeof setMusicState === "function") {
        setMusicState(false);
    }

    console.log("⏸️ Music paused.");
}

/* ==========================================================
   STOP ALL MUSIC
========================================================== */
function stopMusic() {
    const music = getMusicElement();
    if (!music) return;

    clearFade();
    music.pause();
    music.currentTime = 0;
    music.volume = 0;
    music.removeAttribute("src");
    music.load();

    AudioState.musicStarted = false;
    AudioState.musicPlaying = false;
    AudioState.currentChapter = null;
    AudioState.transitioning = false;

    updateMusicButtons();

    if (typeof setMusicState === "function") {
        setMusicState(false);
    }

    console.log("⏹️ Music stopped.");
}

/* ==========================================================
   STOP CHAPTER MUSIC
========================================================== */
function stopChapterMusic(callback = null) {
    const music = getMusicElement();
    if (!music) {
        if (typeof callback === "function") callback();
        return;
    }

    clearFade();

    fadeOutMusic(() => {
        music.pause();
        music.currentTime = 0;
        music.volume = 0;
        music.removeAttribute("src");
        music.load();

        AudioState.musicStarted = false;
        AudioState.musicPlaying = false;
        AudioState.currentChapter = null;

        updateMusicButtons();

        if (typeof setMusicState === "function") {
            setMusicState(false);
        }

        console.log("⏹️ Chapter music stopped.");
        if (typeof callback === "function") callback();
    });
}

/* ==========================================================
   FADE IN MUSIC
========================================================== */
function fadeInMusic() {
    const music = getMusicElement();
    if (!music) return;

    clearFade();
    const targetVolume = AudioSettings.musicVolume;
    music.volume = 0;

    if (targetVolume <= 0) return;

    const steps = Math.ceil(targetVolume / AudioSettings.fadeStep);
    const intervalTime = AudioSettings.fadeDuration / steps;

    fadeTimer = setInterval(() => {
        if (!music.currentSrc || music.paused) {
            clearFade();
            return;
        }

        if (music.volume >= targetVolume) {
            music.volume = targetVolume;
            clearFade();
            return;
        }

        music.volume = Math.min(music.volume + AudioSettings.fadeStep, targetVolume);
    }, intervalTime);
}

/* ==========================================================
   FADE OUT MUSIC
========================================================== */
function fadeOutMusic(callback = null) {
    const music = getMusicElement();
    if (!music) {
        if (typeof callback === "function") callback();
        return Promise.resolve();
    }

    clearFade();

    return new Promise((resolve) => {
        if (music.paused || music.volume <= 0.001) {
            music.volume = 0;
            if (typeof callback === "function") callback();
            resolve();
            return;
        }

        fadeTimer = setInterval(() => {
            music.volume = Math.max(music.volume - AudioSettings.fadeStep, 0);

            if (music.volume <= 0.001) {
                music.volume = 0;
                clearFade();
                if (typeof callback === "function") callback();
                resolve();
            }
        }, AudioSettings.fadeInterval);
    });
}

/* ==========================================================
   CLEAR FADE
========================================================== */
function clearFade() {
    if (fadeTimer) {
        clearInterval(fadeTimer);
        fadeTimer = null;
    }
}

/* ==========================================================
   SET MUSIC VOLUME
========================================================== */
function setMusicVolume(volume) {
    const music = getMusicElement();
    if (!music) return;

    const safeVolume = Math.max(0, Math.min(volume, 1));
    music.volume = safeVolume;
    AudioSettings.musicVolume = safeVolume;

    updateMusicButtons();
    console.log(`🔊 Music volume: ${Math.round(safeVolume * 100)}%`);
}

/* ==========================================================
   VOLUME SHORTCUTS & TOGGLE
========================================================== */
function increaseVolume() {
    setMusicVolume(AudioSettings.musicVolume + AudioSettings.volumeStep);
}

function decreaseVolume() {
    setMusicVolume(AudioSettings.musicVolume - AudioSettings.volumeStep);
}

function toggleMusic() {
    if (AudioState.musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

/* ==========================================================
   NAVIGATION HELPER
========================================================== */
function navigateToNextChapter(chapterTarget, fallbackUrl) {
    if (typeof window[`openChapter${chapterTarget}`] === "function") {
        window[`openChapter${chapterTarget}`]();
    } else if (typeof window[`goToChapter${chapterTarget}`] === "function") {
        window[`goToChapter${chapterTarget}`]();
    } else if (typeof window.navigateToChapter === "function") {
        window.navigateToChapter(chapterTarget);
    } else {
        window.location.href = fallbackUrl;
    }
}

/* ==========================================================
   CHAPTER CONTROLS
========================================================== */
function initChapterControls() {
    if (chapterControlsBound) return;
    chapterControlsBound = true;

    document.addEventListener("click", (event) => {
        // Universal Music Toggle & Volume Buttons (Chapters 1 - 7)
        for (let ch = 1; ch <= 7; ch++) {
            if (event.target.closest(`#chapter${ch}MusicToggle`)) {
                toggleMusic();
                return;
            }
            if (event.target.closest(`#chapter${ch}VolumeDown`)) {
                decreaseVolume();
                return;
            }
            if (event.target.closest(`#chapter${ch}VolumeUp`)) {
                increaseVolume();
                return;
            }
        }

        // Sequential Continue Interceptions
        for (let ch = 1; ch <= 5; ch++) {
            if (event.target.closest(`#chapter${ch}Continue`)) {
                transitionToChapterMusic(ch + 1);
                return;
            }
        }

        // CHAPTER 6 → CHAPTER 7
        const chapter6Continue = event.target.closest("#chapter6Continue");
        if (chapter6Continue) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (AudioState.transitioning) return;

            fadeOutMusic().then(() => {
                navigateToNextChapter(7, "chapter7.html");
            });
            return;
        }

        // CHAPTER 7 → FINAL
        const chapter7Continue = event.target.closest("#chapter7Continue");
        if (chapter7Continue) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (AudioState.transitioning) return;

            fadeOutMusic().then(() => {
                navigateToNextChapter("Final", "final.html");
            });
            return;
        }
    }, true);
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

    musicButtonIds.forEach((buttonId) => {
        const button = document.getElementById(buttonId);
        if (!button) return;

        if (AudioState.musicPlaying) {
            button.textContent = "❚❚";
            button.setAttribute("aria-label", "Pause current music");
            button.setAttribute("title", "Pause music");
        } else {
            button.textContent = "▶";
            button.setAttribute("aria-label", "Play current music");
            button.setAttribute("title", "Play music");
        }
    });
}

function updateChapterMusicButton() {
    updateMusicButtons();
}

/* ==========================================================
   AUTOMATIC INITIALIZATION
========================================================== */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAudio);
} else {
    initAudio();
}
