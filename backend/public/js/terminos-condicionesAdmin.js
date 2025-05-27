document.addEventListener('DOMContentLoaded', async () => {
    
    
   
    

    // Loader functions
function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

    async function cargarTerminosParaEditar() {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/terminos-condiciones');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los términos y condiciones');
            }
            const terminos = await respuesta.json();
            const terminosLista = document.getElementById('terminos-lista');
            terminosLista.innerHTML = '';

            terminos.forEach((termino, index) => {
                const terminoDiv = document.createElement('div');
                terminoDiv.innerHTML = `
                    <input type="text" class="titulo" id="titulo-${index}" name="titulo" value="${termino.titulo}" placeholder="Título" required />
                    <textarea class="contenido" id="contenido-${index}" name="contenido" placeholder="Contenido" required>${termino.contenido}</textarea>
                    <p style="font-size: small;" id="ultima-modificacion">Última modificación: ${new Date(termino.ultimaModificacion).toLocaleDateString()} | Modificado por: ${termino.modificadoPor}</p>
                    <input type="hidden" id="modificadoPor-${index}" name="modificadoPor" value="${termino.modificadoPor}" />
                    <input type="hidden" id="id-${index}" name="id" value="${termino.id}" />
                    <button type="button" class="eliminar-termino-btn">Eliminar</button>
                `;

                const eliminarBtn = terminoDiv.querySelector('.eliminar-termino-btn');

                // Evento para eliminar el término
                eliminarBtn.addEventListener('click', async () => {
                    try {
                        const terminoId = terminoDiv.querySelector('input[name="id"]').value;
                        if (terminoId) {
                            const response = await fetch(`/api/terminos-condiciones/${terminoId}`, {
                                method: 'DELETE'
                            });

                            if (!response.ok) {
                                throw new Error('Error al eliminar el término.');
                            }
                            Swal.fire({
                                icon: 'success',
                                title: 'Término eliminado',
                                text: 'Término eliminado exitosamente.',
                                toast: true,
                                position: 'top-end'
                            });
                            terminosLista.removeChild(terminoDiv);
                        } else {
                            terminosLista.removeChild(terminoDiv);
                        }
                    } catch (error) {
                        console.error('Error al eliminar el término:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo eliminar el término.',
                            toast: true,
                            position: 'top-end'
                        });
                    }
                });

                terminosLista.appendChild(terminoDiv);
            });
        } catch (error) {
            console.error('Error al cargar los términos y condiciones:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los términos y condiciones.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    }

    function agregarCampoTermino() {
        const terminosLista = document.getElementById('terminos-lista');
        const nuevoIndex = terminosLista.children.length; 
        const nuevoTermino = document.createElement('div');
        nuevoTermino.innerHTML = `
            <input type="text" id="titulo-${nuevoIndex}" name="titulo" placeholder="Título" required />
            <textarea id="contenido-${nuevoIndex}" name="contenido" placeholder="Contenido" required></textarea>
            <p style="font-size: small;">Última modificación: ${new Date().toLocaleDateString()} | Modificado por: admin@admin.com</p>
            <input type="hidden" id="id-${nuevoIndex}" name="id" value="" />
            <button type="button" class="eliminar-termino-btn">Eliminar</button>
        `;

        const eliminarBtn = nuevoTermino.querySelector('.eliminar-termino-btn');

        // Evento para eliminar el término
        eliminarBtn.addEventListener('click', () => {
            terminosLista.removeChild(nuevoTermino);
        });

        terminosLista.appendChild(nuevoTermino);
    }

    // Función corregida para guardar términos
    async function guardarTerminos() {
        mostrarLoader();
        try {
            const terminosLista = document.getElementById('terminos-lista');
            const terminos = [];

            terminosLista.querySelectorAll('div').forEach((terminoDiv, index) => {
                const tituloInput = terminoDiv.querySelector('input[name="titulo"]');
                const contenidoTextarea = terminoDiv.querySelector('textarea[name="contenido"]');
                const idInput = terminoDiv.querySelector('input[name="id"]');

                const titulo = tituloInput ? tituloInput.value.trim() : '';
                const contenido = contenidoTextarea ? contenidoTextarea.value.trim() : '';
                const id = idInput ? idInput.value : null;

                if (titulo && contenido) {
                    terminos.push({
                        id: id,
                        titulo,
                        contenido,
                        modificadoPor: 'admin@admin.com',
                        ultimaModificacion: new Date().toISOString() // Asegurar que se envíe el campo `ultimaModificacion`
                    });
                }
            });

            if (terminos.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin términos válidos',
                    text: 'No hay términos válidos para guardar.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }

            for (const termino of terminos) {
                const respuesta = await fetch('/api/terminos-condiciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(termino)
                });

                if (!respuesta.ok) {
                    throw new Error('Error al guardar los términos y condiciones.');
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Términos guardados',
                text: 'Términos y condiciones guardados exitosamente.'
            });
            location.reload();
        } catch (error) {
            console.error('Error al guardar los términos y condiciones:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron guardar los términos y condiciones.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    }

    document.getElementById('agregar-termino-btn').addEventListener('click', () => {
        agregarCampoTermino();
    });

    document.getElementById('guardar-terminos-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        await guardarTerminos();
    });

    cargarTerminosParaEditar();
});