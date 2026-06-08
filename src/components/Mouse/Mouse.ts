import styles from "./Mouse.module.css";
import { getEl } from "@utils/getData";

const mouse             = getEl<HTMLDivElement>({ className: styles.mouse });
const root              = document.body;

let mouse_x             = 0;
let mouse_y             = 0;
let raf_pending         = false;
let last_cursor_type    = "";
let is_held             = false;
let time_out: ReturnType<typeof setTimeout>;

function update_position() {
    mouse.style.left = `${mouse_x}px`;
    mouse.style.top  = `${mouse_y}px`;
    raf_pending = false;
}

window.addEventListener("mousemove", (event) => {
    mouse_x = event.clientX;
    mouse_y = event.clientY;

    if (!raf_pending) {
        raf_pending = true;
        requestAnimationFrame(update_position);
    }

    const el = event.target as HTMLElement | null;
    if (!el) return;

    const cursor_attr = (typeof el.getAttribute == "function") ?  el.getAttribute("data-cursor-type") : "default";
    const cursor_type = cursor_attr ?? (el.tagName === "A" ? "pointer" : "default");

    if (cursor_type === last_cursor_type) return;
    last_cursor_type = cursor_type;

    switch (cursor_type) {
        case "pointer":
            root.style.setProperty("--mouse-size", "5rem");
            break;
        default:
            root.style.setProperty("--mouse-size", "1rem");
    }
});

window.addEventListener("mousedown", () => {
    clearTimeout(time_out);
    mouse.classList.remove(styles.mouseHover);
    void mouse.offsetWidth;
    is_held = true;
    loop();
});

window.addEventListener("mouseup", () => {
    is_held = false;
});

function loop() {
    if (is_held) {
        mouse.classList.add(styles.mouseHover);
        requestAnimationFrame(loop);
    } else {
        time_out = setTimeout(() => {
            mouse.classList.remove(styles.mouseHover);
        }, 1500);
    }
}
