import { getEl } from "@utils/getData";
import styles from "./Loader.module.css";

const loaderText: HTMLDivElement = getEl<HTMLDivElement>({
    className: styles.loaderText,
});

const ANIMATION_DURATION = 1500;
let animationCompleted   = false;

function finishLoading(): void {
    const extraUI1 = document.createElement("div");
    const extraUI2 = document.createElement("div");

    loaderText.classList.add(styles.loaderTextLoaded);

    const loaderBall = getEl<HTMLDivElement>({ className: styles.loaderBall });
    loaderBall.classList.add(styles.loaderBallLoaded);

    const loader: HTMLDivElement = getEl<HTMLDivElement>({
        className: styles.loader,
    });

    document.body.insertBefore(extraUI1, loader);
    document.body.insertBefore(extraUI2, loader);

    extraUI1.classList.add(styles.loaderExtraUI);
    extraUI1.id = styles.loaderExtraUI1;
    extraUI2.classList.add(styles.loaderExtraUI);
    extraUI2.id = styles.loaderExtraUI2;
}

setTimeout(() => {
    animationCompleted = true;
}, ANIMATION_DURATION);

window.addEventListener("load", () => {
    if (animationCompleted) {
        finishLoading();
        return;
    }

    const checkAnimationCompletion = setInterval(() => {
        if (animationCompleted) {
            finishLoading();
            clearInterval(checkAnimationCompletion);
        }
    }, 500);
});
