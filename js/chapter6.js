/* ==========================================================
   CHAPTER VI — 100 REASONS
   Project : Our Story
   File    : chapter6.js
   Purpose : Interactive Constellation / 100 Reasons
   ========================================================== */


function initChapter6() {

    /* ======================================================
       CHAPTER 6 ELEMENTS
       ====================================================== */

    const chapter6 =
        document.getElementById("chapter6");


    if (!chapter6) {

        console.warn(
            "Chapter 6 element not found."
        );

        return;

    }


    /* ======================================================
       STAR FIELD
       ====================================================== */

    let starField =
        document.getElementById(
            "chapter6StarField"
        );


    /*
        If the HTML does not contain the
        star field, create it automatically.
    */

    if (!starField) {

        const constellation =
            chapter6.querySelector(
                ".chapter6-constellation"
            );


        if (constellation) {

            starField =
                document.createElement(
                    "div"
                );


            starField.id =
                "chapter6StarField";


            constellation.appendChild(
                starField
            );


            console.log(
                "Chapter 6 star field created automatically."
            );

        }

    }


    const discoveryCount =
        document.getElementById(
            "chapter6DiscoveryCount"
        );


    const messageBox =
        document.getElementById(
            "chapter6Message"
        );


    const messageText =
        document.getElementById(
            "chapter6MessageText"
        );


    const messageNumber =
        document.getElementById(
            "chapter6MessageNumber"
        );


    const completion =
        document.getElementById(
            "chapter6Completion"
        );


    const continueButton =
        document.getElementById(
            "chapter6Continue"
        );


    /* ======================================================
       SAFETY CHECK
       ====================================================== */

    if (!starField) {

        console.warn(
            "Chapter 6 star field not found or could not be created."
        );

        return;

    }


    /* ======================================================
       CHAPTER 6 SETTINGS
       ====================================================== */

    const TOTAL_STARS = 20;

    const REASONS_PER_STAR = 5;

    const TOTAL_DISCOVERIES =
        TOTAL_STARS *
        REASONS_PER_STAR;

    const MESSAGE_DURATION = 7000;


    /* ======================================================
       CHAPTER 6 STATE
       ====================================================== */

    const state = {

        totalDiscoveries: 0,

        activeStar: null,

        messageTimer: null,

        messageVisible: false,

        completed: false

    };


    /* ======================================================
       100 REASONS

       20 STARS × 5 REASONS
       ====================================================== */

    const reasons = [

        /* ==================================================
           STAR 1
           ================================================== */

        [
            "I love the way your smile can make an ordinary moment feel special.",

            "I love how your presence can make everything feel a little lighter.",

            "I love how simply being around you can make my day better.",

            "I love the little happiness you bring without even trying.",

            "I love that somehow, you became one of my favorite parts of every day."
        ],


        /* ==================================================
           STAR 2
           ================================================== */

        [
            "I love listening to you talk, even when the topic is something completely random.",

            "I love the little stories you tell me.",

            "I love hearing about the things that make you excited.",

            "I love the way your personality shows through the smallest conversations.",

            "I love that I could probably listen to you for hours and still want to hear more."
        ],


        /* ==================================================
           STAR 3
           ================================================== */

        [
            "I love the way you make ordinary conversations memorable.",

            "I love our random conversations that somehow become my favorite moments.",

            "I love the silly things we can laugh about together.",

            "I love how comfortable our conversations can feel.",

            "I love all the little conversations that slowly became memories."
        ],


        /* ==================================================
           STAR 4
           ================================================== */

        [
            "I love the little things you do that you probably don't even realize I notice.",

            "I love the tiny details about you that somehow stay in my mind.",

            "I love noticing the things that make you uniquely you.",

            "I love the habits and little mannerisms that make you familiar to me.",

            "I love that there are so many little pieces of you worth remembering."
        ],


        /* ==================================================
           STAR 5
           ================================================== */

        [
            "I love how you can make a normal day feel different.",

            "I love how one message from you can instantly make me smile.",

            "I love the feeling of seeing your name appear on my screen.",

            "I love how even a short conversation with you can stay with me.",

            "I love that you have a way of making small moments matter."
        ],


        /* ==================================================
           STAR 6
           ================================================== */

        [
            "I love how genuine you can be.",

            "I love the way you express yourself.",

            "I love that you don't have to pretend to be someone else around me.",

            "I love the little pieces of your personality that make you different from everyone else.",

            "I love you for being you, not for trying to be perfect."
        ],


        /* ==================================================
           STAR 7
           ================================================== */

        [
            "I love the way you can make me laugh.",

            "I love our little jokes.",

            "I love those moments when we laugh at something that probably wouldn't make sense to anyone else.",

            "I love how easily happiness can appear when we're having fun together.",

            "I love the memories we've made from things that were never supposed to be important."
        ],


        /* ==================================================
           STAR 8
           ================================================== */

        [
            "I love how you make me want to appreciate the little moments more.",

            "I love how being with you makes time feel different.",

            "I love the quiet moments just as much as the exciting ones.",

            "I love that even doing nothing can feel meaningful with you.",

            "I love how you taught me that the smallest moments can become the biggest memories."
        ],


        /* ==================================================
           STAR 9
           ================================================== */

        [
            "I love how you can make me feel understood.",

            "I love when we understand each other without needing many words.",

            "I love the comfort that comes from knowing I can talk to you.",

            "I love how our conversations can feel honest and natural.",

            "I love having someone like you that I can genuinely share things with."
        ],


        /* ==================================================
           STAR 10
           ================================================== */

        [
            "I love the way you make me look forward to tomorrow.",

            "I love having little things to look forward to with you.",

            "I love imagining all the memories we haven't made yet.",

            "I love thinking about the places and moments we could experience together.",

            "I love that when I think about the future, I sometimes find you somewhere in it."
        ],


        /* ==================================================
           STAR 11
           ================================================== */

        [
            "I love how much personality you have.",

            "I love the little expressions you make.",

            "I love the way your reactions can sometimes be more adorable than the actual situation.",

            "I love the little details that make you unmistakably you.",

            "I love that there is nobody else quite like you."
        ],


        /* ==================================================
           STAR 12
           ================================================== */

        [
            "I love the kindness you show in little ways.",

            "I love the way you can care about people around you.",

            "I love the moments when you show how thoughtful you are.",

            "I love the warmth you can bring into someone's day.",

            "I love the good heart behind the person you are."
        ],


        /* ==================================================
           STAR 13
           ================================================== */

        [
            "I love how you can make me forget about everything else for a while.",

            "I love how talking to you can become the best part of my day.",

            "I love how quickly a boring moment can become something memorable with you.",

            "I love the little escapes from the world that our conversations sometimes become.",

            "I love how being with you can make everything else feel a little less important."
        ],


        /* ==================================================
           STAR 14
           ================================================== */

        [
            "I love the memories we've already created.",

            "I love remembering the moments that started our story.",

            "I love thinking about how much has happened since we first met.",

            "I love how every chapter has added another little memory to us.",

            "I love that our story is made from so many small moments."
        ],


        /* ==================================================
           STAR 15
           ================================================== */

        [
            "I love the way you make me want to become a better version of myself.",

            "I love that knowing you inspires me in little ways.",

            "I love how you remind me that caring about someone can change the way you see things.",

            "I love that you make me want to give more meaning to the moments we share.",

            "I love how meeting you has become part of my own growth."
        ],


        /* ==================================================
           STAR 16
           ================================================== */

        [
            "I love the comfort of knowing you're there.",

            "I love the feeling of having someone I genuinely care about.",

            "I love how familiar you have become to my heart.",

            "I love that your presence can feel comforting even from far away.",

            "I love how naturally you became someone important to me."
        ],


        /* ==================================================
           STAR 17
           ================================================== */

        [
            "I love the excitement that comes from making new memories with you.",

            "I love wondering what our next funny story will be.",

            "I love having more little moments with you waiting somewhere ahead.",

            "I love that our story still has so many unwritten pages.",

            "I love the possibility of everything we could still experience together."
        ],


        /* ==================================================
           STAR 18
           ================================================== */

        [
            "I love that you became someone I genuinely look forward to.",

            "I love how easily you can cross my mind during the day.",

            "I love that little things can remind me of you.",

            "I love how many ordinary moments somehow have a connection to you now.",

            "I love that you have quietly become part of so many thoughts and memories."
        ],


        /* ==================================================
           STAR 19
           ================================================== */

        [
            "I love the way our story has grown naturally.",

            "I love that we didn't need to force every moment to make it meaningful.",

            "I love the little steps that brought us closer.",

            "I love everything we've discovered about each other along the way.",

            "I love that our story is still being written one moment at a time."
        ],


        /* ==================================================
           STAR 20
           ================================================== */

        [
            "I love you for all the little things I could never fit into one message.",

            "I love you for the moments we've shared and the memories still waiting for us.",

            "I love you for the person you are when nobody is asking you to be anything else.",

            "I love you for becoming such a beautiful part of my story.",

            "And most of all, I love you simply because you're you. ♡"
        ]

    ];


    /* ======================================================
       VALIDATE REASONS
       ====================================================== */

    if (
        reasons.length !==
        TOTAL_STARS
    ) {

        console.error(
            "Chapter 6 requires exactly 20 stars."
        );

        return;

    }


    for (
        let i = 0;
        i < reasons.length;
        i++
    ) {

        if (
            reasons[i].length !==
            REASONS_PER_STAR
        ) {

            console.error(
                `Chapter 6 Star ${i + 1} must contain exactly 5 reasons.`
            );

            return;

        }

    }


    /* ======================================================
       STAR DATA
       ====================================================== */

    const stars = [];


    for (
        let i = 0;
        i < TOTAL_STARS;
        i++
    ) {

        stars.push({

            element: null,

            reasons:
                reasons[i],

            discovered:
                [],

            completed:
                false

        });

    }


    /* ======================================================
       UPDATE DISCOVERY COUNTER
       ====================================================== */

    function updateDiscoveryCount() {

        if (!discoveryCount) {
            return;
        }


        discoveryCount.textContent =
            `${state.totalDiscoveries} / ${TOTAL_DISCOVERIES}`;

    }


    /* ======================================================
       CREATE STAR
       ====================================================== */

    function createStar(
        starIndex
    ) {

        const star =
            document.createElement(
                "button"
            );


        star.type =
            "button";


        star.className =
            "chapter6-star";


        star.dataset.star =
            starIndex + 1;


        star.setAttribute(
            "aria-label",
            `Constellation star ${starIndex + 1}`
        );


        star.innerHTML =
            `
                <span class="chapter6-star-glow"></span>

                <span class="chapter6-star-symbol">
                    ✦
                </span>
            `;


        /*
            Random but controlled position.
        */

        const left =
            Math.floor(
                Math.random() * 84
            ) + 8;


        const top =
            Math.floor(
                Math.random() * 72
            ) + 10;


        star.style.left =
            `${left}%`;


        star.style.top =
            `${top}%`;


        /*
            Slightly different animation delay.
        */

        star.style.animationDelay =
            `${Math.random() * 2}s`;


        /*
            Click event.
        */

        star.addEventListener(
            "click",
            () => {

                revealReason(
                    starIndex
                );

            }
        );


        starField.appendChild(
            star
        );


        stars[starIndex].element =
            star;

    }


    /* ======================================================
       CREATE ALL STARS
       ====================================================== */

    function createStars() {

        starField.innerHTML =
            "";


        for (
            let i = 0;
            i < TOTAL_STARS;
            i++
        ) {

            createStar(i);

        }


        console.log(
            `Chapter 6 created ${TOTAL_STARS} interactive stars.`
        );

    }


    /* ======================================================
       GET NEXT UNDISCOVERED REASON
       ====================================================== */

    function getNextReason(
        starIndex
    ) {

        const star =
            stars[starIndex];


        if (!star) {
            return null;
        }


        for (
            let i = 0;
            i < REASONS_PER_STAR;
            i++
        ) {

            if (
                !star.discovered.includes(i)
            ) {

                return i;

            }

        }


        return null;

    }


    /* ======================================================
       REVEAL REASON
       ====================================================== */

    function revealReason(
        starIndex
    ) {

        if (
            state.messageVisible
        ) {
            return;
        }


        if (
            state.completed
        ) {
            return;
        }


        const star =
            stars[starIndex];


        if (!star) {
            return;
        }


        if (
            star.completed
        ) {
            return;
        }


        const reasonIndex =
            getNextReason(
                starIndex
            );


        if (
            reasonIndex === null
        ) {
            return;
        }


        /*
            Mark reason as discovered.
        */

        star.discovered.push(
            reasonIndex
        );


        state.totalDiscoveries++;


        updateDiscoveryCount();


        state.activeStar =
            starIndex;


        state.messageVisible =
            true;


        /*
            Add active visual state.
        */

        if (star.element) {

            star.element.classList.add(
                "revealing"
            );

        }


        /*
            Show message.
        */

        showReasonMessage(
            starIndex,
            reasonIndex
        );


        /*
            Start exact 7-second timer.
        */

        clearTimeout(
            state.messageTimer
        );


        state.messageTimer =
            setTimeout(
                () => {

                    finishReasonDisplay(
                        starIndex
                    );

                },

                MESSAGE_DURATION
            );

    }


    /* ======================================================
       SHOW REASON MESSAGE
       ====================================================== */

    function showReasonMessage(
        starIndex,
        reasonIndex
    ) {

        if (!messageBox) {
            return;
        }


        const starNumber =
            starIndex + 1;


        const reasonNumber =
            reasonIndex + 1;


        const reason =
            stars[starIndex]
                .reasons[reasonIndex];


        if (messageNumber) {

            messageNumber.textContent =
                `Star ${starNumber} · Discovery ${reasonNumber} / ${REASONS_PER_STAR}`;

        }


        if (messageText) {

            messageText.textContent =
                reason;

        }


        messageBox.hidden =
            false;


        requestAnimationFrame(
            () => {

                messageBox.classList.add(
                    "show"
                );

            }
        );

    }


    /* ======================================================
       FINISH REASON DISPLAY
       ====================================================== */

    function finishReasonDisplay(
        starIndex
    ) {

        state.messageVisible =
            false;


        state.activeStar =
            null;


        if (messageBox) {

            messageBox.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    if (
                        !messageBox.classList.contains(
                            "show"
                        )
                    ) {

                        messageBox.hidden =
                            true;

                    }

                },

                350
            );

        }


        const star =
            stars[starIndex];


        if (!star) {
            return;
        }


        if (star.element) {

            star.element.classList.remove(
                "revealing"
            );

        }


        /*
            Check whether this star
            has revealed all 5 reasons.
        */

        if (
            star.discovered.length >=
            REASONS_PER_STAR
        ) {

            completeStar(
                starIndex
            );

        }


        /*
            Check whether every star
            has been completed.
        */

        checkChapterCompletion();

    }


    /* ======================================================
       COMPLETE STAR
       ====================================================== */

    function completeStar(
        starIndex
    ) {

        const star =
            stars[starIndex];


        if (!star) {
            return;
        }


        if (
            star.completed
        ) {
            return;
        }


        star.completed =
            true;


        if (star.element) {

            star.element.classList.add(
                "completed"
            );


            setTimeout(
                () => {

                    if (
                        star.element
                    ) {

                        star.element.remove();

                    }

                },

                650
            );

        }

    }


    /* ======================================================
       CHECK CHAPTER COMPLETION
       ====================================================== */

    function checkChapterCompletion() {

        if (
            state.totalDiscoveries !==
            TOTAL_DISCOVERIES
        ) {

            return;

        }


        const everyStarComplete =
            stars.every(
                star =>
                    star.completed
            );


        if (
            !everyStarComplete
        ) {

            return;

        }


        if (
            state.completed
        ) {

            return;

        }


        state.completed =
            true;


        setTimeout(
            () => {

                showCompletion();

            },

            700
        );

    }


    /* ======================================================
       SHOW COMPLETION
       ====================================================== */

    function showCompletion() {

        if (!completion) {
            return;
        }


        completion.hidden =
            false;


        requestAnimationFrame(
            () => {

                completion.classList.add(
                    "show"
                );

            }
        );


        if (discoveryCount) {

            discoveryCount.textContent =
                `${TOTAL_DISCOVERIES} / ${TOTAL_DISCOVERIES}`;

        }


        setTimeout(
            () => {

                completion.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            },

            400
        );

    }


    /* ======================================================
       CHAPTER VI → CHAPTER VII
       ====================================================== */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            () => {

                /*
                    Existing navigation systems
                    are always checked first.
                */

                if (
                    typeof window.goToChapter ===
                    "function"
                ) {

                    window.goToChapter(7);

                    return;

                }


                if (
                    typeof window.showChapter ===
                    "function"
                ) {

                    window.showChapter(7);

                    return;

                }


                /*
                    Direct fallback.
                */

                const chapter7 =
                    document.getElementById(
                        "chapter7"
                    );


                if (chapter7) {

                    document
                        .querySelectorAll(
                            "main[id^='chapter']"
                        )
                        .forEach(
                            chapter => {

                                chapter.classList.remove(
                                    "active"
                                );

                            }
                        );


                    chapter7.classList.add(
                        "active"
                    );


                    window.scrollTo({

                        top: 0,

                        behavior:
                            "smooth"

                    });


                    return;

                }


                console.info(
                    "Chapter VII has not been added yet."
                );

            }
        );

    }


    /* ======================================================
       INITIALIZE CHAPTER VI
       ====================================================== */

    updateDiscoveryCount();


    createStars();


    /*
        Hide message initially.
    */

    if (messageBox) {

        messageBox.hidden =
            true;

        messageBox.classList.remove(
            "show"
        );

    }


    /*
        Hide completion initially.
    */

    if (completion) {

        completion.hidden =
            true;

        completion.classList.remove(
            "show"
        );

    }


    console.log(
        "Chapter VI — 100 Reasons initialized ♡"
    );

}


/* ==========================================================
   CHAPTER VI INITIALIZATION
   ========================================================== */

/*
    If the script loads before the DOM is ready,
    wait for DOMContentLoaded.

    If the script loads after DOMContentLoaded has
    already fired, initialize immediately.
*/

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initChapter6
    );

}

else {

    initChapter6();

}
