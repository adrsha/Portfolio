import styles from "./Mouse.module.css";
import { getEl } from "@utils/getData";

const mouse = getEl<HTMLDivElement>({ className: styles.mouse });
const root  = document.body as HTMLBodyElement;

let mouseX         = 0;
let mouseY         = 0;
let reqAnimFramePending     = false;
let lastCursorType = "default";
let isHeld         = false;
let timeOut: ReturnType<typeof setTimeout>;

function updatePosition() {
    mouse.style.left = `${mouseX}px`;
    mouse.style.top  = `${mouseY}px`;
    reqAnimFramePending = false;
}

window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!reqAnimFramePending) {
        reqAnimFramePending = true;
        requestAnimationFrame(updatePosition);
    }

    const el = event.target as HTMLElement | null;
    if (!el) return;

    const cursorTypeAttr = (typeof el.getAttribute == "function")
        ? el.getAttribute("data-cursor-type")
        : "no cursor type";

    if (el.tagName !== "A" && cursorTypeAttr == "no cursor type") return;

    const cursorType: string = cursorTypeAttr ??
        (el.tagName.toLocaleLowerCase() === "a" ? "pointer" : "default");

    if (cursorType === lastCursorType) return;
    lastCursorType = cursorType;

    switch (cursorType) {
        case "pointer":
            root.style.setProperty("--mouse-size", "5rem");
            break;
        default:
            root.style.setProperty("--mouse-size", "1rem");
    }
});

window.addEventListener("mousedown", () => {
    clearTimeout(timeOut);
    mouse.classList.remove(styles.mouseClick);
    void mouse.offsetWidth;
    isHeld = true;
    loop();
});

window.addEventListener("mouseup", () => {
    isHeld = false;
});

function loop() {
    if (isHeld) {
        mouse.classList.add(styles.mouseClick);
        requestAnimationFrame(loop);
    } else {
        timeOut = setTimeout(() => {
            mouse.classList.remove(styles.mouseClick);
        }, 1500);
    }
}
