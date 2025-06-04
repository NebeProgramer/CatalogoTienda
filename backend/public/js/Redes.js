async function cargarRedesSociales() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
    try {
        const respuesta = await fetch('/api/redes-sociales');
        if (!respuesta.ok) {
            throw new Error('Error al cargar las redes sociales.');
        }
        const redes = await respuesta.json();
        const listaRedes = document.querySelector('.redes-sociales');
        if (!listaRedes) return;
        listaRedes.innerHTML = '';
        redes.forEach(red => {
            const li = document.createElement('li');
            let enlaceCompleto = red.enlace;
            if (!/^https?:\/\//i.test(enlaceCompleto)) {
                if (!enlaceCompleto.startsWith('www.')) {
                    enlaceCompleto = `www.${enlaceCompleto}`;
                }
                enlaceCompleto = `https://${enlaceCompleto}`;
            } else if (enlaceCompleto.startsWith('www.')) {
                enlaceCompleto = `https://${enlaceCompleto}`;
            } else if (!enlaceCompleto.startsWith('http://') && !enlaceCompleto.startsWith('https://')) {
                enlaceCompleto = `https://${enlaceCompleto}`;
            }
            li.innerHTML = `
                <a href="${enlaceCompleto}" target="_blank">
                <img src="https://cdn.simpleicons.org/${red.nombre}" alt="${red.nombre}" width="24" height="24">
                </a>
            `;
            listaRedes.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar las redes sociales:', error);
    } finally {
        if (loader) loader.style.display = 'none';
    }
}