import { getEls } from "@utils/getData.ts";
import styles from "./FullScreenImage.module.css";

const imgFullScreenWrappers: HTMLElement[] = getEls<HTMLElement>({ className: styles.fullscreenImgWrapper });

for (const wrapperEl of imgFullScreenWrappers) {
    wrapperEl.addEventListener("click", async () => {
        if (!document.fullscreenEnabled) { return; };

        if (document.fullscreenElement === wrapperEl) {
            await document.exitFullscreen().catch(console.error);
        } else {
            await wrapperEl.requestFullscreen().catch(console.error);
        };
    });
};
