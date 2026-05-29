import styles from "./FullScreenImage.module.css"

const wrappers = document.querySelectorAll<HTMLElement>(`.${styles.fullscreenImgWrapper}`);

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
