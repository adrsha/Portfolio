import styles from "./Nav.module.css";
import { getEl, getEls } from "@utils/getData";

const navLogo = getEl<HTMLDivElement>({ className: styles.navLogo });
const navMenu = getEl<HTMLDivElement>({ className: styles.navMenu });

navLogo.addEventListener("click", () => {
    navMenu.classList.toggle(styles.navMenuOpen);
    navMenu.classList.toggle(styles.navMenuClosed);
});

const navMenuLinks = getEls<HTMLDivElement>({ className: styles.navMenuLink });
navMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
        document.body.setAttribute("data-theme", link.getAttribute("data-theme-name") ?? "classic")
    })
});
