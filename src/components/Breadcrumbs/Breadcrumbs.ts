import styles from "./Breadcrumbs.module.css";
import { getEl, getEls } from "@utils/getData";

const labelContainer = getEl<HTMLDivElement>({className: styles.labels});
const RADIUS = labelContainer.offsetHeight/2;
const LOWERRANGE = 10;
const UPPERRANGE = 170;

function set_rotated_styles(items : HTMLElement[], radius : number, lowerRange : number, upperRange : number) {
    for (let i = 0; i < items.length; i++) {
        const angle = lowerRange + i / (items.length - 1) * (upperRange - lowerRange);
        items[i].style.top = `${radius - radius * Math.cos(angle * Math.PI / 180)}px`;
        items[i].style.left = `${radius + radius * Math.sin(angle * Math.PI / 180)}px`;
        items[i].style.transform = `rotate(${angle}deg)`;
    }
}

const labels = getEls<HTMLDivElement>({className: styles.label});
set_rotated_styles(labels, RADIUS, LOWERRANGE, UPPERRANGE);

const dividerContainer = getEl<HTMLDivElement>({className: styles.dividers});
const dividers = [];
for (let i = 0; i < labels.length ; i++) {
    const divider = document.createElement("div");
    divider.classList.add(styles.divider);
    dividerContainer.appendChild(divider);
    dividers.push(divider)
}
// const angleDifference = (LOWERRANGE - UPPERRANGE) / labels.length;
set_rotated_styles(dividers, RADIUS, LOWERRANGE, UPPERRANGE);
