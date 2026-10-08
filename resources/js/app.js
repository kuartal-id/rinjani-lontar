/** Public archive: language/theme chrome + the manuscript leaf viewer. */
import { initI18n, currentLang, TRANSLATIONS } from './i18n';
import './theme'; // side-effect: wires [data-theme-toggle] on DOMContentLoaded

initI18n();

function initLeafViewer() {
    const root = document.querySelector('[data-leaf-viewer]');
    if (!root) return;

    const leaves = [...root.querySelectorAll('[data-leaf]')];
    const texts = [...root.querySelectorAll('[data-leaf-text]')];
    const thumbs = [...root.querySelectorAll('[data-leaf-goto]')];
    let current = 0;

    const show = (i) => {
        current = (i + leaves.length) % leaves.length;
        leaves.forEach((el, k) => el.classList.toggle('viewer-leaf-active', k === current));
        texts.forEach((el, k) => el.classList.toggle('viewer-page-text-active', k === current));
        thumbs.forEach((el, k) => {
            el.classList.toggle('viewer-thumb-active', k === current);
            el.setAttribute('aria-selected', String(k === current));
            if (k === current) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
        // Only keep the active audio element loaded.
        leaves.forEach((_, k) => {
            const audio = texts[k]?.querySelector('audio');
            if (audio) audio.preload = k === current ? 'metadata' : 'none';
        });
    };

    root.querySelector('[data-leaf-prev]')?.addEventListener('click', () => show(current - 1));
    root.querySelector('[data-leaf-next]')?.addEventListener('click', () => show(current + 1));
    thumbs.forEach((el, k) => el.addEventListener('click', () => show(k)));

    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea, select')) return;
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });

    const labels = () => TRANSLATIONS[currentLang()];
    root.querySelector('[data-leaf-prev]')?.setAttribute('aria-label', labels().prevLeaf);
    root.querySelector('[data-leaf-next]')?.setAttribute('aria-label', labels().nextLeaf);
    document.addEventListener('geoLangChanged', () => {
        root.querySelector('[data-leaf-prev]')?.setAttribute('aria-label', labels().prevLeaf);
        root.querySelector('[data-leaf-next]')?.setAttribute('aria-label', labels().nextLeaf);
    });
}

initLeafViewer();
