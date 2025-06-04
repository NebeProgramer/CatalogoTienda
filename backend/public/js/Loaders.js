function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}

function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}