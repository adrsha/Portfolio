import { getEls, getEl } from "@utils/getData";
import style from "./ScrollController.module.css"

const scrollContainer = document.scrollingElement as HTMLElement;
export let currScrollPosY = 0;
let targetScrollY = 0;
let isScrolling = false;

const LERP = 3;

// Cache DOM measurements
const SCREENHEIGHT = scrollContainer.offsetHeight;
let TOTALHEIGHT = scrollContainer.scrollHeight;
let FINALTOPPOS = TOTALHEIGHT - SCREENHEIGHT;

// Cache DOM elements and their initial measurements
const animatables = getEls<HTMLElement>({ prop: '[data-scroll]' });
const scrollBar = getEl<HTMLElement>({ className: style.scrollbar });
const scrollBarThumb = getEl<HTMLElement>({ className: style.scrollbarThumb });

// Pre-calculate element data to avoid repeated DOM queries
interface ElementData {
    element: HTMLElement;
    direction: string;
    speed: number;
    centerY: number;
}

let elementCache: ElementData[] = [];

// Throttle scroll updates
let scrollUpdateQueued = false;

function cacheElementData() {
    elementCache = animatables.map(el => ({
        element: el,
        direction: el.getAttribute('data-scroll-dir') || '',
        speed: parseFloat(el.getAttribute('data-scroll-speed') || "0"),
        centerY: el.offsetTop + el.offsetHeight / 2
    }));
}

function updateCachedDimensions() {
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

// Use passive scroll listener and throttle updates
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


function animateScroll() {
    isScrolling = true;

    const distance = targetScrollY - currScrollPosY;

    if (Math.abs(distance) < 0.5) {
        currScrollPosY = targetScrollY;
        scrollContainer.scrollTop = currScrollPosY;
        isScrolling = false;
        return;
    }

    const localLerp = LERP * 0.01;
    currScrollPosY += distance * localLerp;
    scrollContainer.scrollTop = currScrollPosY;

    updateElements();
    updateScrollBar();
    requestAnimationFrame(animateScroll);
}

function clampScroll(scrollPos: number): number {
    return Math.max(0, Math.min(scrollPos, FINALTOPPOS));
}

function setupElements(screenCenter: number, init?: boolean) {
    elementCache.forEach(({ element, direction, speed, centerY }) => {
        const scrollDistance = centerY - screenCenter;
        if (!init) {
            const isVisible = element.dataset.visible === "true";
            if (speed === 0 || !isVisible) return;
        }
        const offset = scrollDistance * 0.1 * speed;
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

function initializeElements() {
    const screenCenter = currScrollPosY + SCREENHEIGHT / 2;
    setupElements(screenCenter, true);
}

// Optimized element updates using cached data
function updateElements() {
    const screenCenter = currScrollPosY + SCREENHEIGHT / 2;
    setupElements(screenCenter, false);
}

function initializeScrollBar() {
    const thumbHeight = (SCREENHEIGHT / TOTALHEIGHT) * 100;
    scrollBarThumb.style.height = `${thumbHeight}%`;

    scrollBar.addEventListener("mousedown", (e) => {
        const initThumbPos = scrollBarThumb.offsetTop;
        const initMouseY = e.clientY;
        const maxThumbPos = SCREENHEIGHT - scrollBarThumb.offsetHeight;

        e.preventDefault();
        scrollBarThumb.classList.add(style.selectedScrollbar);

        const onMouseMove = (event: MouseEvent) => {
            const newThumbPos = Math.max(0,
                Math.min(initThumbPos + (event.clientY - initMouseY), maxThumbPos)
            );
            const scrollPercent = newThumbPos / maxThumbPos;
            targetScrollY = scrollPercent * FINALTOPPOS;

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

function updateScrollBar() {
    const scrollPercent = (currScrollPosY / (FINALTOPPOS + SCREENHEIGHT)) * 100;
    scrollBarThumb.style.top = `${Math.max(0, Math.min(scrollPercent, 100))}%`;
}

// Recalculate cache when window resizes
window.addEventListener("resize", updateCachedDimensions);

// Optional: Intersection Observer for better performance on large lists
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // entry {
            //     target: HTMLElement,           // The element being watched
            //     isIntersecting: boolean,       // Is it visible?
            //     intersectionRatio: number,     // How much is visible (0-1)
            //     boundingClientRect: DOMRect,   // Element's position
            //     rootBounds: DOMRect,          // Viewport bounds
            //     time: number                   // When intersection changed
            // }
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting) {
                element.dataset.visible = "true";
            } else {
                element.dataset.visible = "false";
            }
        });
    }, {
        root: null,
        rootMargin: "50px",
        threshold: 0
    });

    animatables.forEach(el => observer.observe(el));
}

