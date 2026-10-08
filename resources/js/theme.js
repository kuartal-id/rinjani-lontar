/**
 * Light/dark mode, same behaviour and storage key as rinjanilombok.org
 * ("rinjani-theme"), so the choice carries over between the two sites'
 * subdomains only when they share an origin; otherwise it follows the
 * visitor's system preference on first visit.
 * Any element with [data-theme-toggle] flips the theme.
 */
const KEY = 'rinjani-theme';

function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false'));
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

function current() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
        btn.addEventListener('click', () => {
            const next = current() === 'dark' ? 'light' : 'dark';
            apply(next);
            try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
        });
    });
});
