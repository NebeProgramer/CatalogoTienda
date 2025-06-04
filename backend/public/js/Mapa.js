// Función para renderizar el mapa en el footer
export function renderMapaFooter() {
    const footerMapa = document.getElementById('footer-mapa');
    if (!footerMapa) return;
    let mapaHTML = '';
    fetch('/api/ubicacion-mapa')
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            mapaHTML = data.html || '';
            if (mapaHTML) localStorage.setItem('footerMapaURL', mapaHTML);
            footerMapa.innerHTML = mapaHTML;
        })
        .catch(() => {
            mapaHTML = localStorage.getItem('footerMapaURL') || '';
            footerMapa.innerHTML = mapaHTML;
        });
}
