import styles from "./Mouse.module.css";
import { getEl } from "@utils/getData";

const mouse = getEl<HTMLDivElement>({ className: styles.mouse });

window.addEventListener("mousemove", (event) => {
    mouse.style.top = `${event.clientY}px`;
    mouse.style.left = `${event.clientX}px`;

    const el = event.target as HTMLElement | null;
    if (!el) return;

    const cursorType = (el.getAttribute instanceof Function) ? el.getAttribute("data-cursor-type") : "default";
    const root = document.documentElement;
    if (cursorType === "pointer") {
        root.style.setProperty('--mouse-size', '5rem');
    } else {
        root.style.setProperty('--mouse-size', '1rem');
    }
});

let isHeld = false;
let timeOut: ReturnType<typeof setTimeout>;;
window.addEventListener("mousedown", () => {
    clearTimeout(timeOut);
    mouse.classList.remove(styles.mouseHover);
    void mouse.offsetWidth;
    isHeld = true;
    loop();
});

window.addEventListener("mouseup", () => {
    isHeld = false;
});

function loop() {
    if (isHeld) {
        mouse.classList.add(styles.mouseHover);
        requestAnimationFrame(loop);
    } else {
        timeOut = setTimeout(() => {
            mouse.classList.remove(styles.mouseHover);
        }, 1500)
    }
}
