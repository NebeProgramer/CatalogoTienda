export function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}

export function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}