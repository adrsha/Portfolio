import {
    curr_scroll_y,
    scrollTo,
} from "@components/ScrollController/ScrollController";
import { getEls, getEl } from "@utils/getData";

const root = getEl<HTMLElement>({ id: "scroll-clock" });

if (!root) {
    console.warn("[ScrollClock] Root element not found — skipping init.");
} else {
    const DEG_PER_VIEWPORT = Number(root.dataset.degPerViewport) || 45;
    const SNAP_SCROLL_DIST = Number(root.dataset.snapScrollDist) || 15;
    const FADE_BAND = Number(root.dataset.fadeBand) || 15;
    const ACTIVE_BAND = Number(root.dataset.activeBand) || 15;

    const markers_el = getEl({ id: "sc-markers" })!;

    type Marker = { el: HTMLElement; scroll_y: number };

    const markers: Marker[] = getEls<HTMLElement>({
        prop: "[data-marked-section]",
    })
        .map((section) => ({
            section,
            title:
                section.dataset.clockTitle ||
                section.querySelector("h1, h2")?.textContent?.trim() ||
                "",
            scroll_y: section.getBoundingClientRect().top + window.scrollY,
        }))
        .filter((s) => s.title.length > 0)
        .map(({ title, scroll_y }) => {
            const el = document.createElement("div");
            el.className = "sc-marker";
            el.innerHTML = `
                <div class="sc-marker__stick"></div>
                <a class="sc-marker__btn" aria-label="Navigate to: ${title}">
                    <span class="sc-marker__label">${title}</span>
                </a>
            `;

            el.querySelector("a")?.addEventListener("click", () =>
                scrollTo(scroll_y),
            );
            markers_el.appendChild(el);

            return { el, scroll_y };
        });

    // 1. Extract the update calculation into a standalone function
    const updateClockPositions = () => {
        const scroll = curr_scroll_y;
        const deg_per_px = DEG_PER_VIEWPORT / window.innerHeight;
        const scroll_deg = scroll * deg_per_px;

        document.documentElement.style.setProperty(
            "--scroll-deg",
            `${scroll_deg}deg`,
        );
        document.documentElement.style.setProperty(
            "--snap-offset",
            `${scroll_deg % SNAP_SCROLL_DIST}deg`,
        );

        markers.forEach(({ el, scroll_y }) => {
            const page_rot = 90 + (scroll_y - scroll) * deg_per_px;
            const hidden = page_rot <= 0 || page_rot >= 180;
            const dist_from_edge = Math.min(page_rot, 180 - page_rot);
            const opacity = hidden
                ? 0
                : Math.min(dist_from_edge / FADE_BAND, 1);

            el.style.setProperty("--ma", `${page_rot}deg`);
            el.style.setProperty("--ma-opacity", String(opacity));
            el.classList.toggle("sc-marker--hidden", hidden);
            el.classList.toggle(
                "sc-marker--active",
                !hidden && Math.abs(page_rot - 90) < ACTIVE_BAND,
            );
        });
    };

    updateClockPositions();

    window.addEventListener("load", updateClockPositions );

    document.addEventListener("scroll", updateClockPositions, {
        passive: true,
    });
}
