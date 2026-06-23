import {
    currScrollY,
    scrollTo,
} from "@components/ScrollController/ScrollController";
import { getEls, getEl } from "@utils/getData";

const root = getEl<HTMLElement>({ id: "scroll-clock" });

if (!root) {
    console.warn("[ScrollClock] Root element not found — skipping init.");
} else {
    const css = getComputedStyle(root);
    const read = (prop: string, fallback: number) =>
        parseFloat(css.getPropertyValue(prop)) || fallback;

    let DEG_PER_VIEWPORT: number;
    let SNAP_SCROLL_DIST: number;
    let FADE_BAND: number;
    let ACTIVE_BAND: number;

    const updateClockVars = () => {
        DEG_PER_VIEWPORT = read('--deg-per-viewport', 45);
        SNAP_SCROLL_DIST = read('--snap-scroll-dist', 7.5);
        FADE_BAND        = read('--fade-band',        15);
        ACTIVE_BAND      = read('--active-band',      15);
    };
    updateClockVars();

    const markersEl = getEl<HTMLElement>({ id: "sc-markers" })!;

    type Marker = { el: HTMLElement; scroll_y: number };

    const markers: Marker[] = getEls<HTMLElement>({ prop: "[data-marked-section]" })
        .map((section, index) => {
            const title = section.querySelector(".header1")?.textContent?.trim() || "Section " + index;
            const scrollY = section.getBoundingClientRect().top + currScrollY;
            const el = document.createElement("div");

            el.className = "sc-marker";
            el.innerHTML = `
                <div class="sc-marker__stick"></div>
                <a class="sc-marker__btn" aria-label="Navigate to: ${title}">
                    <span class="sc-marker__label">${title}</span>
                </a>
            `;

            el.querySelector("a")?.addEventListener("click", () => scrollTo(scrollY));
            markersEl.appendChild(el);

            return { el, scroll_y: scrollY };
        });

    const updateClockPositions = () => {
        const scroll = currScrollY;
        const deg_per_px = DEG_PER_VIEWPORT / window.innerHeight;
        const scroll_deg = scroll * deg_per_px;

        document.documentElement.style.setProperty("--scroll-deg", `${scroll_deg}deg`);
        document.documentElement.style.setProperty("--snap-offset", `${scroll_deg % SNAP_SCROLL_DIST}deg`);

        markers.forEach(({ el, scroll_y }) => {
            const page_rot = 90 + (scroll_y - scroll) * deg_per_px;
            const hidden = page_rot <= 0 || page_rot >= 180;
            const dist_from_edge = Math.min(page_rot, 180 - page_rot);
            const opacity = hidden ? 0 : Math.min(dist_from_edge / FADE_BAND, 1);

            el.style.setProperty("--ma", `${page_rot}deg`);
            el.style.setProperty("--ma-opacity", String(opacity));
            el.classList.toggle("sc-marker--hidden", hidden);
            el.classList.toggle("sc-marker--active", !hidden && Math.abs(page_rot - 90) < ACTIVE_BAND);
        });
    };

    updateClockPositions();

    window.addEventListener("load", updateClockPositions);
    document.addEventListener("scroll", updateClockPositions, { passive: true });

    new MutationObserver(updateClockVars).observe(document.body, { attributeFilter: ["data-theme"] });
}
