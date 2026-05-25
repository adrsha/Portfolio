import { currScrollPosY, scrollTo } from '@components/ScrollController/ScrollController';

const CONFIG = {
    DEG_PER_VIEWPORT: 75,
    SNAP_SCROLL_DIST: 15,
    FADE_BAND: 18,
    ACTIVE_BAND: 15
};

export interface Clock_Section {
    id: string;
    title: string;
    el: HTMLElement;
    scroll_y: number;
}

// ── Section Collection ───────────────────────────────────────────────────────
export function collect_clock_sections(): Clock_Section[] {
    const els = Array.from(
        document.querySelectorAll<HTMLElement>('[data-marquee-section]')
    );

    return els
        .map((el, i) => {
            const title =
                el.dataset.clockTitle ||
                el.querySelector('h1, h2')?.textContent?.trim() ||
                '';

            return {
                id: el.id || `clock-section-${i}`,
                title,
                el,
                scroll_y: el.offsetTop
            };
        })
        .filter(section => section.title.length > 0);
}

// ── Scroll_Clock Class ───────────────────────────────────────────────────────
export class Scroll_Clock {
    private sections: Clock_Section[] = [];
    private marker_elements: HTMLElement[] = [];
    private is_running = false;

    constructor(
        private face_el: HTMLElement,
        private minute_el: HTMLElement,
        private markers_el: HTMLElement
    ) {}

    public register_sections(sections: Clock_Section[]): void {
        this.sections = sections;
        this.render_markers();
    }

    public start(): void {
        if (this.is_running) return;

        this.is_running = true;
        this.loop();
    }

    public stop(): void {
        this.is_running = false;
    }

    // ── Main Loop ───────────────────────────────────────────────────────────
    private loop = (): void => {
        if (!this.is_running) return;

        const scroll = currScrollPosY;

        const degrees_per_pixel =
            CONFIG.DEG_PER_VIEWPORT / window.innerHeight;

        // Infinite scroll rotation
        const clock_rot =
            -(scroll * degrees_per_pixel) % 360;

        // Optional mechanical tick offset
        const minute_offset =
            (scroll * degrees_per_pixel) %
            CONFIG.SNAP_SCROLL_DIST;

        // Face
        this.face_el.style.transform =
            `rotate(${clock_rot}deg)`;

        // Minute hand counter-rotation
        this.minute_el.style.transform =
            `translateX(-50%) rotate(${
                90 - clock_rot - minute_offset
            }deg)`;

        this.update_markers(scroll, degrees_per_pixel);

        requestAnimationFrame(this.loop);
    };

    // ── Marker Rendering ───────────────────────────────────────────────────
    private render_markers(): void {
        const fragment = document.createDocumentFragment();

        this.marker_elements = this.sections.map(section => {
            const wrapper = document.createElement('div');

            wrapper.className = 'sc-marker';

            wrapper.innerHTML = `
                <div class="sc-marker__stick"></div>

                <button
                    class="sc-marker__btn"
                    aria-label="Navigate to: ${section.title}"
                >
                    <span class="sc-marker__label">
                        ${section.title}
                    </span>
                </button>
            `;

            wrapper
                .querySelector('button')
                ?.addEventListener('click', () => {
                    scrollTo(section.el.offsetTop);
                });

            fragment.appendChild(wrapper);

            return wrapper;
        });

        this.markers_el.replaceChildren(fragment);
    }

    // ── Marker Updates ─────────────────────────────────────────────────────
    private update_markers(
        current_scroll: number,
        deg_per_px: number
    ): void {
        this.marker_elements.forEach((el, i) => {
            const section = this.sections[i];

            const relative_scroll =
                section.scroll_y - current_scroll;

            // 90deg = horizontal centerline
            const page_rot =
                90 + relative_scroll * deg_per_px;

            // hide when behind clock
            if (page_rot <= 0 || page_rot >= 180) {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                el.classList.remove('sc-marker--active');
                return;
            }

            // Rotate marker around clock center
            el.style.transform =
                `rotate(${page_rot - 90}deg)`;

            // edge fade
            const dist_from_edge =
                Math.min(page_rot, 180 - page_rot);

            const opacity =
                dist_from_edge < CONFIG.FADE_BAND
                    ? dist_from_edge / CONFIG.FADE_BAND
                    : 1;

            el.style.opacity = String(opacity);

            el.style.pointerEvents =
                opacity > 0.15 ? 'auto' : 'none';

            // active zone
            el.classList.toggle(
                'sc-marker--active',
                Math.abs(page_rot - 90) < CONFIG.ACTIVE_BAND
            );
        });
    }
}
