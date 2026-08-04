/* ==========================================================
   CURSOR.JS
   Project : Our Story
   Purpose : Custom Cursor
   Chapter : 0
========================================================== */


/* ==========================================================
   INITIALIZE CUSTOM CURSOR
========================================================== */

function initCursor() {

    const cursor = document.getElementById("cursor");

    /*
        If the cursor element doesn't exist,
        stop safely instead of causing an error.
    */

    if (!cursor) {

        console.warn("Custom cursor element not found.");

        return;

    }


    /*
        Custom cursors don't make much sense
        on touch-only devices.

        We keep the normal cursor there instead.
    */

    if (window.matchMedia("(pointer: coarse)").matches) {

        cursor.style.display = "none";

        return;

    }


    setupCursorMovement(cursor);

    setupCursorHoverEffects(cursor);

    console.log("🖱️ Custom cursor initialized.");

}


/* ==========================================================
   CURSOR MOVEMENT
========================================================== */

function setupCursorMovement(cursor) {

    let mouseX = window.innerWidth / 2;

    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;

    let currentY = mouseY;


    /*
        Track the actual mouse position.
    */

    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;

        mouseY = event.clientY;

    });


    /*
        Smoothly follow the mouse.

        Instead of instantly jumping to the cursor,
        the custom cursor gently follows it.
    */

    function animateCursor() {

        currentX += (mouseX - currentX) * 0.18;

        currentY += (mouseY - currentY) * 0.18;


        cursor.style.left = `${currentX}px`;

        cursor.style.top = `${currentY}px`;


        requestAnimationFrame(animateCursor);

    }


    animateCursor();

}


/* ==========================================================
   HOVER EFFECTS
========================================================== */

function setupCursorHoverEffects(cursor) {

    /*
        Elements that should react to the cursor.
    */

    const interactiveElements = document.querySelectorAll(
        "button, a, input, textarea, select, [role='button']"
    );


    interactiveElements.forEach((element) => {

        element.addEventListener("mouseenter", () => {

            cursor.classList.add("cursor-hover");

        });


        element.addEventListener("mouseleave", () => {

            cursor.classList.remove("cursor-hover");

        });

    });

}


/* ==========================================================
   CURSOR VISIBILITY
========================================================== */

document.addEventListener("mouseleave", () => {

    const cursor = document.getElementById("cursor");

    if (!cursor) {
        return;
    }

    cursor.style.opacity = "0";

});


document.addEventListener("mouseenter", () => {

    const cursor = document.getElementById("cursor");

    if (!cursor) {
        return;
    }

    cursor.style.opacity = "1";

});