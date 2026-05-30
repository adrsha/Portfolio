import styles from "./Hero.module.css";

const words = ["Rust.", "coffee.", "curiosity.", "deadlines."];

const EXIT_DURATION = 400;
const ENTER_DURATION = 900;
const MIN_STAGGER = 40;
const MAX_STAGGER = 120;

const SPAN_BASE_STYLE = [
    "display:inline-block",
    "transform-origin:50% 50% -60px",
    "backface-visibility:hidden",
].join(";");

let index = 0;
const container = document.getElementById("slot-word");

const randomStagger = (): number => {
    return Math.floor(Math.random() * (MAX_STAGGER - MIN_STAGGER)) + MIN_STAGGER;
};

const randomInterval = (): number => {
    return 3200 + Math.floor(Math.random() * 1800);
};

const renderLetters = (word: string, animClass: string, duration: number): Promise<void> => {
    if (!container) return Promise.resolve();

    const delays: number[] = [];
    let accumulated = 0;

    for (let i = 0; i < word.length; i++) {
        delays.push(accumulated);
        accumulated += randomStagger();
    };

    container.innerHTML = word
        .split("")
        .map((char, i) => {
            return `<span class="${animClass}" style="${SPAN_BASE_STYLE};animation-delay:${delays[i]}ms">${char}</span>`;
        })
        .join("");

    const totalTime = delays[delays.length - 1] + duration;
    return new Promise(resolve => setTimeout(resolve, totalTime));
};

const init = (): void => {
    if (!container) return;

    container.innerHTML = words[0]
        .split("")
        .map(char => `<span style="${SPAN_BASE_STYLE}">${char}</span>`)
        .join("");
};

const cycle = async (): Promise<void> => {
    if (!container) return;

    const currentWord = words[index];
    index = (index + 1) % words.length;
    const nextWord = words[index];

    await renderLetters(currentWord, styles.slotExit, EXIT_DURATION);
    await renderLetters(nextWord, styles.slotEnter, ENTER_DURATION);
};

const scheduleNext = (): void => {
    setTimeout(async () => {
        await cycle();
        scheduleNext();
    }, randomInterval());
};

init();
scheduleNext();
