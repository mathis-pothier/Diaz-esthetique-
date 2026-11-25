document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".cardsWrapper");
    const cards = [
        document.querySelector(".softening"),
        document.querySelector(".skin"),
        document.querySelector(".light")
    ];

    if (!wrapper || cards.includes(null)) return;

    const headerHeight = 72; 
    let stages = [];
    let totalScrollDistance = 0;

    function updateLayout() {
        const viewportHeight = window.innerHeight - headerHeight;
        stages = [];
        let currentScroll = 0;

        cards.forEach((card, index) => {
            card.style.position = "relative";
            card.style.top = "0px";
            card.style.transform = "none";

            const realHeight = Math.max(card.offsetHeight, viewportHeight);
            const internalScroll = Math.max(0, realHeight - viewportHeight);

            const enterStart = currentScroll;
            const enterDuration = index === 0 ? 0 : viewportHeight;
            const enterEnd = enterStart + enterDuration;

            const readEnd = enterEnd + internalScroll;

            stages.push({
                card,
                realHeight,
                internalScroll,
                enterStart,
                enterEnd,
                readEnd
            });

            currentScroll = readEnd;
        });

        totalScrollDistance = currentScroll;
        wrapper.style.height = `${totalScrollDistance + viewportHeight}px`;
    }

    function onScroll() {
        const rect = wrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight - headerHeight;

        if (rect.top > headerHeight) {
            stages.forEach((stage, index) => {
                stage.card.style.position = "absolute";
                stage.card.style.top = "0px";
                stage.card.style.left = "0px";
                stage.card.style.transform = index === 0
                    ? "translateY(0px)"
                    : `translateY(${viewportHeight}px)`;
            });
        }
        else if (rect.top <= headerHeight && rect.top >= headerHeight - totalScrollDistance) {
            const scrolled = headerHeight - rect.top;

            stages.forEach((stage, index) => {
                stage.card.style.position = "fixed";
                stage.card.style.top = `${headerHeight}px`;
                stage.card.style.left = "0px";

                let y = 0;

                if (index === 0) {
                    const readProgress = Math.min(Math.max(scrolled, 0), stage.internalScroll);
                    y = -readProgress;
                } else {
                    if (scrolled < stage.enterStart) {
                        y = viewportHeight;
                    } else if (scrolled <= stage.enterEnd) {
                        const enterProgress = scrolled - stage.enterStart;
                        y = viewportHeight - enterProgress;
                    } else {
                        const readProgress = Math.min(
                            Math.max(scrolled - stage.enterEnd, 0),
                            stage.internalScroll
                        );
                        y = -readProgress;
                    }
                }

                stage.card.style.transform = `translateY(${y}px)`;
            });
        }
        else {
            const lastStage = stages[stages.length - 1];
            stages.forEach((stage) => {
                stage.card.style.position = "absolute";
                stage.card.style.top = `${totalScrollDistance - stage.internalScroll}px`;
                stage.card.style.left = "0px";
                stage.card.style.transform = "translateY(0px)";
            });
        }
    }

    window.addEventListener("load", () => {
        updateLayout();
        onScroll();
    });

    window.addEventListener("resize", () => {
        updateLayout();
        onScroll();
    });

    window.addEventListener("scroll", onScroll, { passive: true });

    updateLayout();
    onScroll();
});