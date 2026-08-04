/* ==========================================================
   PARTICLES.JS
   Project : Our Story
   Purpose : Background Stars & Particles
   Chapter : 0
========================================================== */


/* ==========================================================
   PARTICLE SETTINGS
========================================================== */

const ParticleSettings = {

    count: 75,

    minSize: 1,

    maxSize: 3,

    minOpacity: 0.15,

    maxOpacity: 0.7,

    minSpeed: 0.05,

    maxSpeed: 0.25,

    glowChance: 0.18

};


/* ==========================================================
   PARTICLE STATE
========================================================== */

const ParticleState = {

    container: null,

    particles: [],

    animationFrame: null,

    initialized: false

};


/* ==========================================================
   INITIALIZE PARTICLES
========================================================== */

function initParticles() {

    const container =
        document.getElementById("stars");


    /*
        Safety check.
    */

    if (!container) {

        console.warn(
            "Stars container was not found."
        );

        return;

    }


    ParticleState.container = container;


    /*
        Clear any existing particles.

        This prevents duplicates if the function
        is accidentally initialized more than once.
    */

    container.innerHTML = "";

    ParticleState.particles = [];


    /*
        Create the stars.
    */

    createParticles();


    /*
        Begin animation.
    */

    animateParticles();


    ParticleState.initialized = true;


    console.log("✨ Background particles initialized.");

}


/* ==========================================================
   CREATE PARTICLES
========================================================== */

function createParticles() {

    const container =
        ParticleState.container;


    for (
        let i = 0;
        i < ParticleSettings.count;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.classList.add(
            "particle"
        );


        /*
            Random size.
        */

        const size =
            randomNumber(
                ParticleSettings.minSize,
                ParticleSettings.maxSize
            );


        /*
            Random position.
        */

        const x =
            Math.random() * 100;

        const y =
            Math.random() * 100;


        /*
            Random opacity.
        */

        const opacity =
            randomNumber(
                ParticleSettings.minOpacity,
                ParticleSettings.maxOpacity
            );


        /*
            Random movement speed.
        */

        const speed =
            randomNumber(
                ParticleSettings.minSpeed,
                ParticleSettings.maxSpeed
            );


        /*
            Some stars get a stronger glow.
        */

        const shouldGlow =
            Math.random() <
            ParticleSettings.glowChance;


        /*
            Apply initial styles.
        */

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.left =
            `${x}%`;

        particle.style.top =
            `${y}%`;

        particle.style.opacity =
            opacity;


        if (shouldGlow) {

            particle.classList.add(
                "particle-glow"
            );

        }


        /*
            Store particle information.
        */

        ParticleState.particles.push({

            element: particle,

            x: x,

            y: y,

            opacity: opacity,

            speed: speed,

            phase: Math.random() *
                Math.PI * 2,

            drift: randomNumber(
                0.05,
                0.2
            )

        });


        container.appendChild(
            particle
        );

    }

}


/* ==========================================================
   ANIMATE PARTICLES
========================================================== */

function animateParticles() {

    const time =
        performance.now() * 0.001;


    ParticleState.particles.forEach(
        (particle) => {

            /*
                Very subtle horizontal movement.
            */

            const movement =
                Math.sin(
                    time * particle.speed +
                    particle.phase
                ) *
                particle.drift;


            /*
                Very subtle vertical movement.
            */

            const verticalMovement =
                Math.cos(
                    time *
                    particle.speed *
                    0.7 +
                    particle.phase
                ) *
                particle.drift;


            particle.element.style.transform =
                `translate(
                    ${movement}px,
                    ${verticalMovement}px
                )`;


            /*
                Gentle twinkling effect.
            */

            const twinkle =
                Math.sin(
                    time *
                    particle.speed *
                    2 +
                    particle.phase
                );


            const opacity =
                particle.opacity +
                twinkle * 0.12;


            particle.element.style.opacity =
                Math.max(
                    0.05,
                    Math.min(
                        opacity,
                        1
                    )
                );

        }
    );


    ParticleState.animationFrame =
        requestAnimationFrame(
            animateParticles
        );

}


/* ==========================================================
   RANDOM NUMBER HELPER
========================================================== */

function randomNumber(
    min,
    max
) {

    return (
        Math.random() *
        (max - min)
    ) + min;

}


/* ==========================================================
   STOP PARTICLES
========================================================== */

function stopParticles() {

    if (
        ParticleState.animationFrame
    ) {

        cancelAnimationFrame(
            ParticleState.animationFrame
        );

        ParticleState.animationFrame =
            null;

    }

}


/* ==========================================================
   START PARTICLES
========================================================== */

function startParticles() {

    if (
        !ParticleState.animationFrame
    ) {

        animateParticles();

    }

}


/* ==========================================================
   CLEAR PARTICLES
========================================================== */

function clearParticles() {

    stopParticles();


    if (
        ParticleState.container
    ) {

        ParticleState.container.innerHTML =
            "";

    }


    ParticleState.particles = [];

}


/* ==========================================================
   RESIZE HANDLING
========================================================== */

window.addEventListener(
    "resize",
    () => {

        /*
            The particles use percentages,
            so no complete recreation is necessary.

            This listener exists for future expansion
            if we decide to add responsive particle density.
        */

        if (
            !ParticleState.initialized
        ) {

            return;

        }

    }
);