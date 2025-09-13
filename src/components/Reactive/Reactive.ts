type WatcherFn<T> = (value: T) => void;
type State = Record<string, any>;

class Reactive {
    private state: State = {};
    private watchers: Record<string, WatcherFn<any>[]> = {};

    constructor() {
        this.init();
    }

    private init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    private setup() {
        this.bindElements();
        this.bindEvents();
    }

    state$<T = any>(key: string, value: T): this {
        this.state[key] = value;
        this.watchers[key] = [];
        this.updateElements(key);
        return this;
    }

    get<T = any>(key: string): T {
        return this.state[key];
    }

    set<T = any>(key: string, value: T | ((prev: T) => T)): this {
        if (typeof value === 'function') {
            value = (value as (prev: T) => T)(this.state[key]);
        }
        this.state[key] = value;
        this.updateElements(key);
        this.watchers[key]?.forEach(fn => fn(value));
        return this;
    }

    watch<T = any>(key: string, fn: WatcherFn<T>): this {
        if (!this.watchers[key]) this.watchers[key] = [];
        this.watchers[key].push(fn);
        return this;
    }

    action(name: string, fn: (event?: Event) => void): this {
        (this as any)[name] = fn.bind(this);
        return this;
    }

    private updateElements(key: string) {
        document.querySelectorAll<HTMLElement>(`[r-text="${key}"]`).forEach(el => {
            el.textContent = this.state[key];
        });

        document.querySelectorAll<HTMLElement>(`[r-html="${key}"]`).forEach(el => {
            el.innerHTML = this.state[key];
        });

        document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[r-model="${key}"]`).forEach(el => {
            if (el.value !== this.state[key]) {
                el.value = this.state[key];
            }
        });

        document.querySelectorAll<HTMLElement>(`[r-attr]`).forEach(el => {
            const attr = el.getAttribute('r-attr');
            if (attr?.includes(key)) {
                const [attrName, stateKey] = attr.split(':');
                if (stateKey === key) {
                    el.setAttribute(attrName, this.state[key]);
                }
            }
        });

        document.querySelectorAll<HTMLElement>(`[r-class]`).forEach(el => {
            const classRule = el.getAttribute('r-class');
            if (classRule?.includes(key)) {
                const [className, condition] = classRule.split(':');
                const shouldHaveClass = this.evaluateCondition(condition);
                el.classList.toggle(className, shouldHaveClass);
            }
        });

        document.querySelectorAll<HTMLElement>(`[r-show="${key}"]`).forEach(el => {
            el.style.display = this.state[key] ? '' : 'none';
        });

        document.querySelectorAll<HTMLElement>(`[r-hide="${key}"]`).forEach(el => {
            el.style.display = this.state[key] ? 'none' : '';
        });
    }

    private bindElements() {
        document.querySelectorAll<HTMLInputElement | HTMLFormElement>('[r-model]').forEach(el => {
            const key = el.getAttribute('r-model');
            if (!key) return;

            if (this.state[key] !== undefined) {
                el.value = this.state[key];
            }

            const event = el.type === 'checkbox' ? 'change' : 'input';
            el.addEventListener(event, e => {
                const target = e.target as HTMLInputElement | HTMLFormElement;
                const value = target.type === 'checkbox' ? target.checked : target.value;
                this.set(key, value);
            });
        });
    }

    private bindEvents() {
        document.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('r-click');
            if (action && (this as any)[action]) {
                e.preventDefault();
                (this as any)[action](e);
            }
        });

        document.addEventListener('submit', e => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('r-submit');
            if (action && (this as any)[action]) {
                e.preventDefault();
                (this as any)[action](e);
            }
        });
    }

    private evaluateCondition(condition: string | null): boolean {
        if (!condition) return false;
        try {
            return new Function('state', `with(state) { return ${condition}; }`)(this.state);
        } catch {
            return !!this.state[condition];
        }
    }
}

(window as any).r = new Reactive();
(window as any).setup = (fn: () => void) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
};
