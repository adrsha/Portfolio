import styles from "./Hero.module.css"
const words = ["Rust", "coffee", "curiosity", "deadlines"];
const LETTER_DURATION = 250;
const STAGGER = 60; 

let index = 0;
const container = document.getElementById("slot-word");

const renderLetters = (word: string, animClass: string, baseDelay: number = 0): Promise<void> => {
    if (!container) return Promise.resolve();

    container.innerHTML = word
        .split("")
        .map((char, i) => {
            const delay = baseDelay + i * STAGGER;
            return `<span class="${animClass}" style="display:inline-block; animation-delay:${delay}ms">${char}</span>`;
        })
        .join("");

    const totalTime = baseDelay + (word.length - 1) * STAGGER + LETTER_DURATION;
    return new Promise(resolve => setTimeout(resolve, totalTime));
};

const init = async () => {
    if (!container) return;

    container.innerHTML = words[0]
    .split("")
    .map(char => `<span style="display:inline-block">${char}</span>`)
    .join("");
};

const cycle = async () => {
    if (!container) return;

    const currentWord = words[index];
    index = (index + 1) % words.length;
    const nextWord = words[index];

    await renderLetters(currentWord, styles.slotExit);

    await renderLetters(nextWord, styles.slotEnter);
};

init();
setInterval(cycle, 3000);
