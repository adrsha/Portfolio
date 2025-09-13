import styles from "./Nav.module.css";
import { getEl } from "@utils/getData";

const navLogo = getEl<HTMLDivElement>({className: styles.navLogo});
const navMenu = getEl<HTMLDivElement>({className: styles.navMenu});

navLogo.addEventListener("click", () => {
    navMenu.classList.toggle(styles.navMenuOpen);
    navMenu.classList.toggle(styles.navMenuClosed);
});
