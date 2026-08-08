/* ==========================================================
   CHAPTER III — POETRY
   Project : Our Story
   Purpose : Romantic Poetry Chapter
   ========================================================== */


/* ==========================================================
   CHAPTER 3 BASE
   ========================================================== */

#chapter3 {

    position: relative;

    width: 100%;
    min-height: 100vh;

    /*
        IMPORTANT:
        Chapter 3 needs to scroll because
        the poetry content is taller than
        the viewport.
    */

    overflow-x: hidden;
    overflow-y: auto;

    display: none;

    box-sizing: border-box;

    background:
        radial-gradient(
            circle at 50% 10%,
            rgba(255, 185, 220, 0.15),
            transparent 28%
        ),
        radial-gradient(
            circle at 10% 55%,
            rgba(190, 135, 230, 0.13),
            transparent 30%
        ),
        radial-gradient(
            circle at 90% 75%,
            rgba(255, 170, 215, 0.10),
            transparent 28%
        ),
        linear-gradient(
            180deg,
            #160d1d 0%,
            #211124 35%,
            #2a1428 65%,
            #100912 100%
        );

    color: #fff;

    /*
        Makes scrolling smoother.
    */

    scroll-behavior: smooth;

}


/* ==========================================================
   BACKGROUND
   ========================================================== */

.chapter3-background {

    position: absolute;

    inset: 0;

    width: 100%;
    min-height: 100%;

    overflow: hidden;

    pointer-events: none;

    z-index: 0;

}


/* ==========================================================
   GLOWING ORBS
   ========================================================== */

.chapter3-glow {

    position: absolute;

    border-radius: 50%;

    filter: blur(75px);

    opacity: 0.45;

    animation:
        chapter3GlowFloat
        9s
        ease-in-out
        infinite
        alternate;

}


.chapter3-glow-1 {

    width: 360px;
    height: 360px;

    top: 4%;
    left: -120px;

    background:
        rgba(
            255,
            145,
            205,
            0.35
        );

}


.chapter3-glow-2 {

    width: 420px;
    height: 420px;

    right: -150px;
    top: 40%;

    background:
        rgba(
            160,
            110,
            220,
            0.30
        );

    animation-delay: -4s;

}


.chapter3-glow-3 {

    width: 300px;
    height: 300px;

    left: 35%;
    bottom: 5%;

    background:
        rgba(
            255,
            170,
            215,
            0.18
        );

    animation-delay: -7s;

}


@keyframes chapter3GlowFloat {

    from {

        transform:
            translate3d(0, 0, 0)
            scale(1);

    }

    to {

        transform:
            translate3d(35px, -25px, 0)
            scale(1.12);

    }

}


/* ==========================================================
   FLOATING HEARTS
   ========================================================== */

.chapter3-heart {

    position: absolute;

    font-family:
        "Cormorant Garamond",
        serif;

    color:
        rgba(
            255,
            190,
            225,
            0.65
        );

    opacity: 0;

    animation:
        chapter3HeartFloat
        9s
        ease-in-out
        infinite;

    text-shadow:
        0 0 15px
        rgba(
            255,
            170,
            220,
            0.35
        );

}


.chapter3-heart-1 {

    left: 7%;
    top: 18%;

    font-size: 2rem;

}


.chapter3-heart-2 {

    right: 10%;
    top: 32%;

    font-size: 1.5rem;

    animation-delay: -3s;

}


.chapter3-heart-3 {

    left: 15%;
    bottom: 20%;

    font-size: 1.4rem;

    animation-delay: -6s;

}


.chapter3-heart-4 {

    right: 18%;
    bottom: 30%;

    font-size: 2.2rem;

    animation-delay: -1.5s;

}


@keyframes chapter3HeartFloat {

    0% {

        opacity: 0;

        transform:
            translateY(30px)
            rotate(-10deg);

    }

    20% {

        opacity: 0.55;

    }

    50% {

        opacity: 0.85;

        transform:
            translateY(-15px)
            rotate(8deg);

    }

    80% {

        opacity: 0.45;

    }

    100% {

        opacity: 0;

        transform:
            translateY(-60px)
            rotate(-5deg);

    }

}


/* ==========================================================
   MAIN WRAPPER
   ========================================================== */

.chapter3-wrapper {

    position: relative;

    z-index: 2;

    width:
        min(
            900px,
            calc(100% - 40px)
        );

    margin:
        0 auto;

    padding:
        110px
        0
        150px;

    box-sizing: border-box;

}


/* ==========================================================
   INTRO
   ========================================================== */

.chapter3-intro {

    position: relative;

    text-align: center;

    margin-bottom: 90px;

    opacity: 0;

    animation:
        chapter3IntroReveal
        1.5s
        ease
        forwards;

}


@keyframes chapter3IntroReveal {

    from {

        opacity: 0;

        transform:
            translateY(35px);

    }

    to {

        opacity: 1;

        transform:
            translateY(0);

    }

}


/* ==========================================================
   CHAPTER LABEL
   ========================================================== */

.chapter3-label {

    display: inline-block;

    margin-bottom: 18px;

    padding:
        7px
        16px;

    border:
        1px solid
        rgba(
            255,
            200,
            225,
            0.22
        );

    border-radius: 50px;

    background:
        rgba(
            255,
            255,
            255,
            0.035
        );

    font-family:
        "Poppins",
        sans-serif;

    font-size: 0.7rem;

    letter-spacing:
        0.3em;

    text-transform:
        uppercase;

    color:
        rgba(
            255,
            210,
            232,
            0.8
        );

    backdrop-filter:
        blur(8px);

}


/* ==========================================================
   MAIN TITLE
   ========================================================== */

.chapter3-intro h2 {

    margin: 0;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        clamp(
            4rem,
            10vw,
            7rem
        );

    font-weight: 400;

    line-height: 0.9;

    letter-spacing:
        0.02em;

    color: #fff;

    text-shadow:
        0 0 30px
        rgba(
            255,
            180,
            220,
            0.22
        );

}


/* ==========================================================
   SUBTITLE
   ========================================================== */

.chapter3-subtitle {

    max-width: 520px;

    margin:
        28px
        auto
        0;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        1.4rem;

    font-style:
        italic;

    line-height:
        1.7;

    color:
        rgba(
            255,
            230,
            240,
            0.75
        );

}


/* ==========================================================
   DECORATIVE DIVIDER
   ========================================================== */

.chapter3-intro::after {

    content:
        "♡  ✦  ♡";

    display: block;

    margin:
        35px
        auto
        0;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        1.2rem;

    letter-spacing:
        0.4em;

    color:
        rgba(
            255,
            190,
            220,
            0.65
        );

}


/* ==========================================================
   POEM INTRO
   ========================================================== */

.chapter3-poem-intro {

    position: relative;

    max-width: 680px;

    margin:
        0
        auto
        100px;

    padding:
        48px
        55px;

    text-align: center;

    border-top:
        1px solid
        rgba(
            255,
            210,
            230,
            0.18
        );

    border-bottom:
        1px solid
        rgba(
            255,
            210,
            230,
            0.18
        );

    background:
        rgba(
            255,
            255,
            255,
            0.025
        );

    box-shadow:
        0 20px 70px
        rgba(
            0,
            0,
            0,
            0.18
        );

    box-sizing:
        border-box;

}


/* ==========================================================
   QUOTE MARK
   ========================================================== */

.chapter3-poem-intro::before {

    content:
        "“";

    position:
        absolute;

    top:
        -28px;

    left:
        15px;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        6rem;

    line-height:
        1;

    color:
        rgba(
            255,
            185,
            220,
            0.18
        );

}


.chapter3-poem-intro p {

    margin:
        8px
        0;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        1.45rem;

    line-height:
        1.8;

    color:
        rgba(
            255,
            240,
            245,
            0.86
        );

}


.chapter3-poem-intro p:last-child {

    margin-top:
        22px;

    font-style:
        italic;

    color:
        rgba(
            255,
            200,
            225,
            0.92
        );

}


/* ==========================================================
   POEM CONTAINER
   ========================================================== */

.chapter3-poem {

    display:
        flex;

    flex-direction:
        column;

    gap:
        70px;

}


/* ==========================================================
   STANZA
   ========================================================== */

.chapter3-stanza {

    position:
        relative;

    width:
        min(
            680px,
            100%
        );

    margin:
        0
        auto;

    padding:
        58px
        65px;

    box-sizing:
        border-box;

    text-align:
        center;

    background:
        linear-gradient(
            135deg,
            rgba(
                255,
                255,
                255,
                0.07
            ),
            rgba(
                255,
                185,
                225,
                0.025
            )
        );

    border:
        1px solid
        rgba(
            255,
            220,
            235,
            0.14
        );

    border-radius:
        12px;

    box-shadow:
        0 25px 70px
        rgba(
            0,
            0,
            0,
            0.25
        );

    backdrop-filter:
        blur(12px);

    opacity:
        0;

    transform:
        translateY(35px);

    animation:
        chapter3StanzaReveal
        1.1s
        ease
        forwards;

    transition:
        transform 0.5s ease,
        border-color 0.5s ease,
        box-shadow 0.5s ease;

}


/* ==========================================================
   STANZA ANIMATION DELAYS
   ========================================================== */

.chapter3-stanza:nth-child(1) {

    animation-delay:
        0.2s;

}


.chapter3-stanza:nth-child(2) {

    animation-delay:
        0.4s;

}


.chapter3-stanza:nth-child(3) {

    animation-delay:
        0.6s;

}


.chapter3-stanza:nth-child(4) {

    animation-delay:
        0.8s;

}


.chapter3-stanza:nth-child(5) {

    animation-delay:
        1s;

}


.chapter3-stanza:nth-child(6) {

    animation-delay:
        1.2s;

}


@keyframes chapter3StanzaReveal {

    to {

        opacity:
            1;

        transform:
            translateY(0);

    }

}


/* ==========================================================
   STANZA HOVER
   ========================================================== */

.chapter3-stanza:hover {

    transform:
        translateY(-7px);

    border-color:
        rgba(
            255,
            190,
            225,
            0.35
        );

    box-shadow:
        0 30px 80px
        rgba(
            0,
            0,
            0,
            0.32
        ),
        0 0 40px
        rgba(
            255,
            175,
            220,
            0.10
        );

}


/* ==========================================================
   STANZA NUMBER
   ========================================================== */

.chapter3-stanza-number {

    margin-bottom:
        25px;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        0.95rem;

    font-style:
        italic;

    letter-spacing:
        0.2em;

    color:
        rgba(
            255,
            195,
            225,
            0.6
        );

}


.chapter3-stanza-number::after {

    content:
        "";

    display:
        block;

    width:
        35px;

    height:
        1px;

    margin:
        12px
        auto
        0;

    background:
        rgba(
            255,
            195,
            225,
            0.3
        );

}


/* ==========================================================
   POEM TEXT
   ========================================================== */

.chapter3-stanza p {

    margin:
        0;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        clamp(
            1.25rem,
            2.5vw,
            1.55rem
        );

    font-weight:
        400;

    line-height:
        2;

    letter-spacing:
        0.015em;

    color:
        rgba(
            255,
            245,
            248,
            0.92
        );

}


/* ==========================================================
   FINAL STANZA
   ========================================================== */

.chapter3-final-stanza {

    margin-top:
        25px;

    padding-top:
        70px;

    padding-bottom:
        70px;

    border-color:
        rgba(
            255,
            190,
            225,
            0.28
        );

    background:
        radial-gradient(
            circle at center,
            rgba(
                255,
                180,
                220,
                0.10
            ),
            transparent 65%
        );

}


/* ==========================================================
   ENDING
   ========================================================== */

.chapter3-ending {

    margin:
        130px
        auto
        0;

    text-align:
        center;

}


.chapter3-divider {

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        1.4rem;

    letter-spacing:
        0.3em;

    color:
        rgba(
            255,
            195,
            225,
            0.7
        );

}


.chapter3-ending-text {

    max-width:
        600px;

    margin:
        35px
        auto
        20px;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        1.45rem;

    font-style:
        italic;

    line-height:
        1.8;

    color:
        rgba(
            255,
            230,
            240,
            0.72
        );

}


.chapter3-ending-highlight {

    max-width:
        650px;

    margin:
        0
        auto
        35px;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        clamp(
            2rem,
            5vw,
            3.2rem
        );

    line-height:
        1.25;

    color:
        #fff;

    text-shadow:
        0 0 25px
        rgba(
            255,
            180,
            220,
            0.25
        );

}


/* ==========================================================
   CONTINUE SECTION
   ========================================================== */

.chapter3-continue-section {

    margin-top:
        120px;

    padding:
        70px
        0
        30px;

    text-align:
        center;

    border-top:
        1px solid
        rgba(
            255,
            210,
            230,
            0.14
        );

}


.chapter3-continue-section p {

    margin-bottom:
        30px;

    font-family:
        "Cormorant Garamond",
        serif;

    font-size:
        1.35rem;

    font-style:
        italic;

    color:
        rgba(
            255,
            225,
            238,
            0.75
        );

}


/* ==========================================================
   CONTINUE BUTTON
   ========================================================== */

.chapter3-continue {

    position:
        relative;

    padding:
        15px
        32px;

    border:
        1px solid
        rgba(
            255,
            200,
            225,
            0.4
        );

    border-radius:
        50px;

    background:
        rgba(
            255,
            255,
            255,
            0.04
        );

    color:
        rgba(
            255,
            235,
            245,
            0.95
        );

    font-family:
        "Poppins",
        sans-serif;

    font-size:
        0.85rem;

    letter-spacing:
        0.05em;

    cursor:
        pointer;

    backdrop-filter:
        blur(10px);

    box-shadow:
        0 10px 35px
        rgba(
            255,
            170,
            220,
            0.08
        );

    transition:
        transform 0.4s ease,
        background 0.4s ease,
        border-color 0.4s ease,
        box-shadow 0.4s ease;

}


.chapter3-continue:hover {

    transform:
        translateY(-4px);

    background:
        rgba(
            255,
            190,
            225,
            0.12
        );

    border-color:
        rgba(
            255,
            200,
            225,
            0.7
        );

    box-shadow:
        0 12px 40px
        rgba(
            255,
            170,
            220,
            0.18
        );

}


.chapter3-continue:active {

    transform:
        translateY(0);

}


/* ==========================================================
   SCROLLBAR
   ========================================================== */

#chapter3::-webkit-scrollbar {

    width:
        8px;

}


#chapter3::-webkit-scrollbar-track {

    background:
        rgba(
            255,
            255,
            255,
            0.025
        );

}


#chapter3::-webkit-scrollbar-thumb {

    background:
        linear-gradient(
            180deg,
            rgba(
                255,
                190,
                220,
                0.35
            ),
            rgba(
                190,
                140,
                220,
                0.35
            )
        );

    border-radius:
        10px;

}


#chapter3::-webkit-scrollbar-thumb:hover {

    background:
        linear-gradient(
            180deg,
            rgba(
                255,
                190,
                220,
                0.55
            ),
            rgba(
                190,
                140,
                220,
                0.55
            )
        );

}


/* ==========================================================
   TABLET
   ========================================================== */

@media (max-width: 768px) {

    #chapter3 {

        overflow-x:
            hidden;

        overflow-y:
            auto;

    }


    .chapter3-wrapper {

        width:
            calc(100% - 30px);

        padding:
            80px
            0
            120px;

    }


    .chapter3-intro {

        margin-bottom:
            65px;

    }


    .chapter3-poem-intro {

        padding:
            35px
            25px;

        margin-bottom:
            70px;

    }


    .chapter3-stanza {

        padding:
            45px
            30px;

    }


    .chapter3-poem {

        gap:
            45px;

    }


    .chapter3-ending {

        margin-top:
            90px;

    }


    .chapter3-continue-section {

        margin-top:
            90px;

    }

}


/* ==========================================================
   MOBILE
   ========================================================== */

@media (max-width: 480px) {

    .chapter3-wrapper {

        width:
            calc(100% - 24px);

        padding:
            70px
            0
            100px;

    }


    .chapter3-intro h2 {

        font-size:
            4rem;

    }


    .chapter3-subtitle {

        font-size:
            1.15rem;

    }


    .chapter3-poem-intro {

        padding:
            30px
            18px;

    }


    .chapter3-poem-intro p {

        font-size:
            1.2rem;

    }


    .chapter3-stanza {

        padding:
            38px
            18px;

    }


    .chapter3-stanza p {

        font-size:
            1.2rem;

        line-height:
            1.85;

    }


    .chapter3-stanza-number {

        margin-bottom:
            18px;

    }


    .chapter3-ending-highlight {

        font-size:
            2rem;

    }


    .chapter3-heart-1 {

        left:
            3%;

    }


    .chapter3-heart-2 {

        right:
            4%;

    }


    .chapter3-heart-3 {

        left:
            5%;

    }


    .chapter3-heart-4 {

        right:
            6%;

    }

}


/* ==========================================================
   REDUCED MOTION
   ========================================================== */

@media (prefers-reduced-motion: reduce) {

    .chapter3-glow,
    .chapter3-heart,
    .chapter3-intro,
    .chapter3-stanza {

        animation:
            none;

    }


    .chapter3-stanza {

        opacity:
            1;

        transform:
            none;

    }

}
