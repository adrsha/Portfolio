import { getEl, getStyle } from "@utils/getData";
import styles from "./Loader.module.css";
const loaderText : HTMLDivElement = getEl<HTMLDivElement>({className: styles.loaderText});
const ANIMATION_DURATION : number = 1500;
let animationCompleted : boolean  = false;

function finishLoading() : void{
    const extraUI1 = document.createElement("div")
    const extraUI2 = document.createElement("div")
 
    const loaderBall = getEl<HTMLDivElement>({className: styles.loaderBall});
    loaderText.classList.add(styles.loaderTextLoaded);
    loaderBall.classList.add(styles.loaderBallLoaded);
    
    const loader : HTMLDivElement = getEl<HTMLDivElement>({className: styles.loader});
    document.body.insertBefore(extraUI1, loader);
    document.body.insertBefore(extraUI2, loader);
    extraUI1.classList.add(styles.loaderExtraUI);
    extraUI1.id = styles.loaderExtraUI1;
    extraUI2.classList.add(styles.loaderExtraUI);
    extraUI2.id = styles.loaderExtraUI2;
    console.log(getStyle(extraUI1).width)
    
}

window.addEventListener("load", () => {
    if (animationCompleted){
        finishLoading();
    } else {
        const checkAnimationCompletion = setInterval(()=>{
            if (animationCompleted){
                finishLoading();
                clearInterval(checkAnimationCompletion);
            }
        }, 500)
    }
});

setTimeout(() => {
    animationCompleted = true;
}, ANIMATION_DURATION);
