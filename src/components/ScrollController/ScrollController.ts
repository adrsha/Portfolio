import { getEls, getEl } from "@utils/getData";
import style from "./ScrollController.module.css"

const scrollContainer = document.scrollingElement as HTMLElement;
export let currScrollPosY = 0;
let targetScrollY    = 0;
let isScrolling      = false;

const LERP = 3.5;

const SCREENHEIGHT = scrollContainer.offsetHeight;
let TOTALHEIGHT    = scrollContainer.scrollHeight;
let FINALTOPPOS    = TOTALHEIGHT - SCREENHEIGHT;

const animatables    = getEls<HTMLElement>({ prop: '[data-scroll]' });
const scrollBar      = getEl<HTMLElement>({ className: style.scrollbar });
const scrollBarThumb = getEl<HTMLElement>({ className: style.scrollbarThumb });

interface ElementData {
    element:         HTMLElement;
    direction:       string;
    speed:           number;
    centerY:         number;
    baseline_offset: number;
}

let elementCache: ElementData[] = [];
let scrollUpdateQueued = false;

function compute_offset(centerY: number, speed: number, scrollY: number): number {
    const screen_center   = scrollY + SCREENHEIGHT / 2;
    const scroll_distance = centerY - screen_center;
    return scroll_distance * 0.06 * speed;
}

function cacheElementData(): void {
    elementCache = animatables.map(el => {
        const centerY        = el.offsetTop + el.offsetHeight / 2;
        const speed          = parseFloat(el.getAttribute('data-scroll-speed') || "0");
        const baseline_offset = compute_offset(centerY, speed, 0);

        return {
            element:  el,
            direction: el.getAttribute('data-scroll-dir') || '',
            speed,
            centerY,
            baseline_offset,
        };
    });
}

function updateCachedDimensions(): void {
    TOTALHEIGHT = scrollContainer.scrollHeight;
    FINALTOPPOS = TOTALHEIGHT - SCREENHEIGHT;
    cacheElementData();
}

window.addEventListener("load", () => {
    cacheElementData();
    setupIntersectionObserver();
    initializeElements();
    initializeScrollBar();
});

window.addEventListener("scroll", () => {
    if (!scrollUpdateQueued) {
        scrollUpdateQueued = true;
        requestAnimationFrame(() => {
            currScrollPosY = scrollContainer.scrollTop;
            updateElements();
            updateScrollBar();
            scrollUpdateQueued = false;
        });
    }
}, { passive: true });

window.addEventListener("wheel", (event) => {
    event.preventDefault();
    targetScrollY = clampScroll(targetScrollY + event.deltaY);

    if (!isScrolling) {
        animateScroll();
    }
}, { passive: false });

function animateScroll(): void {
    isScrolling = true;

    const distance = targetScrollY - currScrollPosY;

    if (Math.abs(distance) < 0.5) {
        currScrollPosY            = targetScrollY;
        scrollContainer.scrollTop = currScrollPosY;
        isScrolling               = false;
        return;
    }

    const localLerp        = LERP * 0.01;
    currScrollPosY        += distance * localLerp;
    scrollContainer.scrollTop = currScrollPosY;

    updateElements();
    updateScrollBar();
    requestAnimationFrame(animateScroll);
}

function clampScroll(scrollPos: number): number {
    return Math.max(0, Math.min(scrollPos, FINALTOPPOS));
}

/**
 * Smoothly scrolls to an absolute Y position using the controller's
 * lerp animation — consistent with wheel and scrollbar behaviour.
 */
export function scrollTo(y: number): void {
    targetScrollY = clampScroll(y);
    if (!isScrolling) {
        animateScroll();
    }
}

function setupElements(init?: boolean): void {
    elementCache.forEach(({ element, direction, speed, centerY, baseline_offset }) => {
        if (!init) {
            const isVisible = element.dataset.visible === "true";
            if (speed === 0 || !isVisible) return;
        }

        const raw_offset = compute_offset(centerY, speed, currScrollPosY);
        const offset     = raw_offset - baseline_offset;

        switch (direction) {
            case "bottom":
                element.style.transform = `translateY(${-offset}px)`;
                break;
            case "top":
                element.style.transform = `translateY(${offset}px)`;
                break;
            case "left":
                element.style.transform = `translateX(calc(-50% + ${offset}px))`;
                break;
            case "right":
                element.style.transform = `translateX(calc(-50% + ${-offset}px))`;
                break;
        }
    });
}

function initializeElements(): void {
    setupElements(true);
}

function updateElements(): void {
    setupElements(false);
}

function initializeScrollBar(): void {
    const thumbHeight = (SCREENHEIGHT / TOTALHEIGHT) * 100;
    scrollBarThumb.style.height = `${thumbHeight}%`;

    scrollBar.addEventListener("mousedown", (e) => {
        const initThumbPos = scrollBarThumb.offsetTop;
        const initMouseY   = e.clientY;
        const maxThumbPos  = SCREENHEIGHT - scrollBarThumb.offsetHeight;

        e.preventDefault();
        scrollBarThumb.classList.add(style.selectedScrollbar);

        const onMouseMove = (event: MouseEvent) => {
            const newThumbPos   = Math.max(0,
                Math.min(initThumbPos + (event.clientY - initMouseY), maxThumbPos)
            );
            const scrollPercent = newThumbPos / maxThumbPos;
            targetScrollY       = scrollPercent * FINALTOPPOS;

            if (!isScrolling) {
                animateScroll();
            }
        };

        const onMouseUp = () => {
            scrollBarThumb.classList.remove(style.selectedScrollbar);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

function updateScrollBar(): void {
    const scrollPercent = (currScrollPosY / (FINALTOPPOS + SCREENHEIGHT)) * 100;
    scrollBarThumb.style.top = `${Math.max(0, Math.min(scrollPercent, 100))}%`;
}

window.addEventListener("resize", updateCachedDimensions);

function setupIntersectionObserver(): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            (entry.target as HTMLElement).dataset.visible =
                entry.isIntersecting ? "true" : "false";
        });
    }, {
        root:       null,
        rootMargin: "50px",
        threshold:  0,
    });

    animatables.forEach(el => observer.observe(el));
}
