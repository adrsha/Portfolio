import { getEls, getEl } from "@utils/getData";
import style from "./ScrollController.module.css";

const scroll_container = document.scrollingElement as HTMLElement;
export let curr_scroll_y = 0;
let target_scroll_y      = 0;
let is_scrolling         = false;

const LERP         = 3.5;
const SCREEN_H     = scroll_container.offsetHeight;
let total_h        = scroll_container.scrollHeight;
let max_scroll     = total_h - SCREEN_H;

const animatables     = getEls<HTMLElement>({ prop: '[data-scroll]' });
const scroll_bar      = getEl<HTMLElement>({ className: style.scrollbar });
const scroll_bar_thumb = getEl<HTMLElement>({ className: style.scrollbarThumb });

interface ElementData {
    element:   HTMLElement;
    direction: string;
    speed:     number;
    center_y:  number;
}

let element_cache: ElementData[]  = [];
let scroll_update_queued          = false;

// --- Parallax ---

function compute_offset(center_y: number, speed: number, scroll_y: number): number {
    const viewport_center = scroll_y + SCREEN_H / 2;
    return (center_y - viewport_center) * 0.06 * speed;
}

function cache_element_data(): void {
    element_cache = animatables.map(el => ({
        element:   el,
        direction: el.getAttribute('data-scroll-dir') || '',
        speed:     parseFloat(el.getAttribute('data-scroll-speed') || '0'),
        center_y:  el.getBoundingClientRect().top + curr_scroll_y + el.offsetHeight / 2,
    }));
}

function update_elements(init?: boolean): void {
    element_cache.forEach(({ element, direction, speed, center_y }) => {
        if (!init) {
            if (speed === 0 || element.dataset.visible !== 'true') return;
        }

        const offset = compute_offset(center_y, speed, curr_scroll_y);

        switch (direction) {
            case 'bottom': element.style.transform = `translateY(${-offset}px)`;                     break;
            case 'top':    element.style.transform = `translateY(${offset}px)`;                      break;
            case 'left':   element.style.transform = `translateX(calc(-50% + ${offset}px))`;         break;
            case 'right':  element.style.transform = `translateX(calc(-50% + ${-offset}px))`;        break;
        }
    });
}

// --- Scroll animation ---

function clamp_scroll(pos: number): number {
    return Math.max(0, Math.min(pos, max_scroll));
}

function animate_scroll(): void {
    is_scrolling = true;

    const distance = target_scroll_y - curr_scroll_y;

    if (Math.abs(distance) < 0.5) {
        curr_scroll_y                  = target_scroll_y;
        scroll_container.scrollTop     = curr_scroll_y;
        is_scrolling                   = false;
        return;
    }

    curr_scroll_y              += distance * (LERP * 0.01);
    scroll_container.scrollTop  = curr_scroll_y;

    update_elements();
    update_scroll_bar();
    requestAnimationFrame(animate_scroll);
}

/**
 * Smoothly scrolls to an absolute Y position using the controller's
 * lerp animation — consistent with wheel and scrollbar behaviour.
 */
export function scrollTo(y: number): void {
    target_scroll_y = clamp_scroll(y);
    if (!is_scrolling) {
        animate_scroll();
    }
}

// --- Scrollbar ---

function init_scroll_bar(): void {
    const thumb_h = (SCREEN_H / total_h) * 100;
    scroll_bar_thumb.style.height = `${thumb_h}%`;

    scroll_bar.addEventListener('mousedown', (e) => {
        const init_thumb_pos = scroll_bar_thumb.offsetTop;
        const init_mouse_y   = e.clientY;
        const max_thumb_pos  = SCREEN_H - scroll_bar_thumb.offsetHeight;

        e.preventDefault();
        scroll_bar_thumb.classList.add(style.selectedScrollbar);

        const on_mouse_move = (event: MouseEvent) => {
            const new_thumb_pos  = Math.max(0, Math.min(init_thumb_pos + (event.clientY - init_mouse_y), max_thumb_pos));
            const scroll_percent = new_thumb_pos / max_thumb_pos;
            target_scroll_y      = scroll_percent * max_scroll;

            if (!is_scrolling) animate_scroll();
        };

        const on_mouse_up = () => {
            scroll_bar_thumb.classList.remove(style.selectedScrollbar);
            document.removeEventListener('mousemove', on_mouse_move);
            document.removeEventListener('mouseup', on_mouse_up);
        };

        document.addEventListener('mousemove', on_mouse_move);
        document.addEventListener('mouseup', on_mouse_up);
    });
}

function update_scroll_bar(): void {
    const scroll_percent          = (curr_scroll_y / (max_scroll + SCREEN_H)) * 100;
    scroll_bar_thumb.style.top    = `${Math.max(0, Math.min(scroll_percent, 100))}%`;
}

// --- Intersection observer ---

function setup_intersection_observer(): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            (entry.target as HTMLElement).dataset.visible =
                entry.isIntersecting ? 'true' : 'false';
        });
    }, {
        root:       null,
        rootMargin: '50px',
        threshold:  0,
    });

    animatables.forEach(el => observer.observe(el));
}

// --- Resize ---

function on_resize(): void {
    total_h   = scroll_container.scrollHeight;
    max_scroll = total_h - SCREEN_H;
    cache_element_data();
}

// --- Event listeners ---

window.addEventListener('load', () => {
    scrollTo(0);
    cache_element_data();
    setup_intersection_observer();
    update_elements(true);
    init_scroll_bar();
});

window.addEventListener('scroll', () => {
    if (scroll_update_queued) return;
    scroll_update_queued = true;
    requestAnimationFrame(() => {
        curr_scroll_y = scroll_container.scrollTop;
        update_elements();
        update_scroll_bar();
        scroll_update_queued = false;
    });
}, { passive: true });

window.addEventListener('wheel', (event) => {
    event.preventDefault();
    target_scroll_y = clamp_scroll(target_scroll_y + event.deltaY);
    if (!is_scrolling) animate_scroll();
}, { passive: false });

window.addEventListener('resize', on_resize);
