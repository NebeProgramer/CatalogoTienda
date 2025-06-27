document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const modal = document.getElementById('modal');
    const olvidoContainer = document.getElementById('formOlvidoContainer');
    const olvidoContainerbtn = document.getElementById('olvidoContrasena');
    const formSesionContainer = document.getElementById('formSesionContainer');
    const formImagenContainer = document.getElementById('formImagenContainer');
    const formPreferenciasContainer = document.getElementById('form-preferencias');
    const iniciarSesionBtn = document.getElementById('iniciarSesion');
    const crearCuentaBtn = document.getElementById('crearCuenta');
    const btnCrear = document.getElementById('btnCrear');
    const btnActualizar = document.getElementById('btnActualizar');
    const btnEliminar = document.getElementById('btnEliminar');
    const divBusqueda = document.querySelector('divBusqueda');
    const closeModal = document.getElementById('closeModal');
    const tco = document.getElementById('TCo');
    const tca = document.getElementById('TCa');
    const emailSesionC = document.getElementById('emailSesionC');
    const passwordSesionC = document.getElementById('passwordSesionC');
    const emailSesion = document.getElementById('emailSesion');
    const passwordSesion = document.getElementById('passwordSesion');
    const opcionTitulo = document.getElementById('opcion');
    const btnSesion = document.getElementById('btnSesion');
    const crudSection = document.getElementById('CRUD');
    const form = {
        imagen: document.getElementById('formImagen'),
        sesion: document.getElementById('formSesion'),
        olvido: document.getElementById('formOlvidoContainer'),
        preferencias: document.getElementById('formPreferencias')
    }
    const terminos = document.getElementById('terminos');
    const privacidad = document.getElementById('privacidad');
    const imputTerminos = document.getElementById('imputTerminos');
    const imputPrivacidad = document.getElementById('imputPrivacidad');
    const carrito = document.getElementById('carrito');
    let Actualizar = false
    let eliminar = false;
    const usuario = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;
    if (usuario) {
        // Obtener el ul donde se agregarán los elementos
        const listaSesion = document.querySelector('.iniciosesion');
        // Crear el elemento <li> para "Perfil"
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = 'Bienvenido ' + usuario.nombre;
        } else {
            perfilLink.textContent = 'Bienvenido Administrador';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLink.addEventListener('click', () => mostrarPerfil(usuario));
        perfilLi.appendChild(perfilLink);
        // Agregar ambos elementos al <ul>
        listaSesion.innerHTML = '';
        listaSesion.appendChild(perfilLi);
    } else {
        }
    // Loader functions
    function mostrarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex';
    }
    function ocultarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }
    // Función para cargar mensajes en formato de lista con opción de responder
    const cargarMensajes = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/mensajes');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los mensajes.');
            }
            const mensajes = await respuesta.json();
            const listaMensajes = document.querySelector('.faq-container');
            listaMensajes.innerHTML = '';
            if (mensajes.length === 0) {
                const mensajeVacio = document.createElement('p');
                mensajeVacio.textContent = 'No hay mensajes aún.';
                mensajeVacio.classList.add('mensaje-vacio');
                listaMensajes.appendChild(mensajeVacio);
            } else {
                mensajes.forEach((mensaje) => {
                    const item = document.createElement('div');
                    item.classList.add('faq-item');
                    item.innerHTML = `
                        <div class="faq-author">${mensaje.Nombre}</div>
                        <div class="faq-email">${mensaje.Correo}</div>
                        <div class="faq-question">${mensaje.Mensaje}</div>
                        <div class="faq-answer"><strong>Respuesta:</strong> ${mensaje.Respuesta || 'Sin respuesta aún.'}</div>
                        <button class="responder-btn">Responder</button>
                        <div class="respuesta-container" style="display: none;">
                            <input type="text" class="respuesta-input" placeholder="Escribe tu respuesta aquí..." />
                            <button class="guardar-respuesta-btn">Guardar</button>
                        </div>
                    `;
                    const responderBtn = item.querySelector('.responder-btn');
                    const respuestaContainer = item.querySelector('.respuesta-container');
                    const guardarRespuestaBtn = item.querySelector('.guardar-respuesta-btn');
                    const respuestaInput = item.querySelector('.respuesta-input');
                    responderBtn.addEventListener('click', () => {
                        respuestaContainer.style.display = 'block';
                    });
                    guardarRespuestaBtn.addEventListener('click', async () => {
                        const respuestaTexto = respuestaInput.value;
                        if (!respuestaTexto.trim()) {
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'warning',
                                title: 'Campo vacío',
                                text: 'Por favor, escribe una respuesta.',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            return;
                        }
                        try {
                            const guardarRespuesta = await fetch(`/api/mensajes/${mensaje._id}/responder`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ respuesta: respuestaTexto })
                            });
                            if (!guardarRespuesta.ok) {
                                throw new Error('Error al guardar la respuesta.');
                            }
                            Swal.fire({
                                icon: 'success',
                                title: 'Respuesta guardada',
                                text: 'Respuesta guardada exitosamente.',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            cargarMensajes(); // Recargar la lista de mensajes
                        } catch (error) {
                            console.error('Error al guardar la respuesta:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un error al guardar la respuesta.',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000
                            });
                        }
                    });
                    listaMensajes.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Error al cargar los mensajes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cargar los mensajes.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    };
    // Llamar a la función para cargar los mensajes al iniciar
    cargarMensajes();
});
