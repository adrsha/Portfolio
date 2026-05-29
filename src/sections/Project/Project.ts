const EDGE_MARGIN = 8;

const clamp_card = (card: HTMLElement): void => {
    card.style.transform = 'translateX(-50%)';

    const { left, right } = card.getBoundingClientRect();
    const vw = window.innerWidth;

    if (right > vw - EDGE_MARGIN) {
        card.style.transform = `translateX(calc(-50% - ${right - (vw - EDGE_MARGIN)}px))`;
    } else if (left < EDGE_MARGIN) {
        card.style.transform = `translateX(calc(-50% + ${EDGE_MARGIN - left}px))`;
    }
};

const reset_card = (card: HTMLElement): void => {
    card.style.transform = 'translateX(-50%)';
};

document.querySelectorAll<HTMLElement>('[data-node-wrap]').forEach(wrap => {
    const card = wrap.querySelector<HTMLElement>('[data-node-card]');
    if (!card) return;

    wrap.addEventListener('mouseenter', () => clamp_card(card));
    wrap.addEventListener('mouseleave', () => reset_card(card));
});
