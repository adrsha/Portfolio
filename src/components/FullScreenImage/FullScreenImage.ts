import { getEl } from "@utils/getData.ts";
import styles from "./FullScreenImage.module.css";

const wrappers = getEl<HTMLElement>({ className: styles.fullscreenImgWrapper });

for (const wrapper_el of wrappers) {
    wrapper_el.addEventListener("click", async () => {
        if (!document.fullscreenEnabled) { return; };

        if (document.fullscreenElement === wrapper_el) {
            await document.exitFullscreen().catch(console.error);
        } else {
            await wrapper_el.requestFullscreen().catch(console.error);
        };
    });
};
