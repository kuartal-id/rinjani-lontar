/** Admin pages: confirm dialogs on destructive forms + live upload previews. */
document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    const message = form.getAttribute('data-confirm');
    if (message && !window.confirm(message)) e.preventDefault();
});

document.querySelectorAll('input[type="file"][accept^="image"]').forEach((input) => {
    input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (!file) return;
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.cssText = 'height:3rem;border-radius:.35rem;margin-top:.35rem';
        const old = input.parentElement.querySelector('img[data-preview]');
        if (old) old.remove();
        img.dataset.preview = '1';
        input.parentElement.appendChild(img);
    });
});
