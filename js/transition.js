/* ==========================================================
   TRANSITION.JS
   Project : Our Story
   Purpose : Chapter & Page Transitions (Single Page SPA)
========================================================== */

const TransitionSettings = {
    duration: 1000,
    easing: "power2.inOut"
};

function initTransition() {
    document.body.classList.add("transitions-ready");
    window.scrollTo(0, 0);
    console.log("🌙 Transitions initialized.");
}

/* ==========================================================
   CORE SCREEN SWITCHER
========================================================== */
function switchChapterScreen(chapterTarget) {
    const allChapters = document.querySelectorAll("main[id^='chapter'], #finalChapter");
    
    // Determine the target ID
    let targetId = "";
    if (chapterTarget === "final" || chapterTarget === 8 || chapterTarget === "8") {
        targetId = "finalChapter";
    } else {
        targetId = `chapter${chapterTarget}`;
    }

    const targetElement = document.getElementById(targetId);

    // Hide all chapters
    allChapters.forEach((ch) => {
        ch.classList.remove("active");
        ch.style.display = "none";
        ch.hidden = true;
        ch.setAttribute("aria-hidden", "true");
    });

    // Show target chapter
    if (targetElement) {
        targetElement.hidden = false;
        targetElement.style.display = "block";
        targetElement.classList.add("active");
        targetElement.setAttribute("aria-hidden", "false");

        // Scroll back to top
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        // Initialize target chapter if needed
        if (chapterTarget === 7 && typeof window.initChapter7 === "function") {
            window.initChapter7();
        } else if ((chapterTarget === 8 || chapterTarget === "final") && typeof window.initFinal === "function") {
            window.initFinal();
        }
    } else {
        console.warn(`Target screen #${targetId} not found.`);
    }

    // Restore page scrolling
    document.documentElement.style.height = "auto";
    document.documentElement.style.overflowY = "auto";
    document.body.style.height = "auto";
    document.body.style.overflowY = "auto";
}

/* ==========================================================
   TRANSITION TO NEXT CHAPTER
========================================================== */
function transitionToChapter(chapterNumber) {
    if (typeof gsap === "undefined") {
        fallbackChapterTransition(chapterNumber);
        return;
    }

    const overlay = createTransitionOverlay();

    gsap.to(overlay, {
        opacity: 1,
        duration: TransitionSettings.duration / 1000,
        ease: TransitionSettings.easing,
        onComplete: () => {
            if (typeof setChapter === "function") {
                setChapter(chapterNumber);
            }

            // Switch the active DOM container
            switchChapterScreen(chapterNumber);

            document.dispatchEvent(
                new CustomEvent("chapterChange", {
                    detail: { chapter: chapterNumber }
                })
            );

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.8,
                delay: 0.15,
                ease: TransitionSettings.easing,
                onComplete: () => {
                    overlay.remove();
                }
            });
        }
    });
}

function createTransitionOverlay() {
    const existing = document.getElementById("transition-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "transition-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "9999";
    overlay.style.background = "rgba(18, 12, 20, 1)";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";

    document.body.appendChild(overlay);
    return overlay;
}

function fallbackChapterTransition(chapterNumber) {
    const overlay = createTransitionOverlay();
    overlay.style.transition = `opacity ${TransitionSettings.duration}ms ease`;

    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        setTimeout(() => {
            if (typeof setChapter === "function") setChapter(chapterNumber);
            switchChapterScreen(chapterNumber);

            document.dispatchEvent(
                new CustomEvent("chapterChange", {
                    detail: { chapter: chapterNumber }
                })
            );

            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.remove();
            }, TransitionSettings.duration);
        }, TransitionSettings.duration);
    });
}

// Global hook
window.transitionToChapter = transitionToChapter;
window.switchChapterScreen = switchChapterScreen;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTransition);
} else {
    initTransition();
}
