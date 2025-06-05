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
    const reqLength = document.getElementById('req-length');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEspecial = document.getElementById('req-especial');


    olvidoContainerbtn.addEventListener('click', function (e) {
        e.preventDefault();
        formSesionContainer.style.display = 'none';
        showModal(olvidoContainer, modal, formSesionContainer, olvidoContainer);
    })

    iniciarSesionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer);
        setupLoginForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
    });

    crearCuentaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer);
        setupRegisterForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
    });

    closeModal.addEventListener('click', hideModal);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal();
        }
    });



    // Validación de requisitos de contraseña y coincidencia
    
    

    passwordSesion.addEventListener('input', () => {
        validarCoincidencias();
    });
    passwordSesionC.addEventListener('input', validarCoincidencias);
    emailSesionC.addEventListener('input', validarCorreos);
    emailSesion.addEventListener('input', () => {
        if(emailSesionC.style.display !== 'none') {
            validarCorreos();
        }
    });

    // Lógica para recuperación de contraseña
    const formOlvido = document.getElementById('formOlvidoContrasena');
    if (formOlvido) {
        formOlvido.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correoRecuperar = document.getElementById('emailOlvido').value.trim();
            await recuperarContraseña(correoRecuperar, Swal, () => hideModal(modal, formSesionContainer, olvidoContainer));
        });
    }

    btnSesion.addEventListener('click', async (e) => {
        e.preventDefault();
        if (btnSesion.textContent === 'Crear Cuenta') {
            await crearCuenta({
                emailSesion,
                passwordSesion,
                mostrarLoader,
                ocultarLoader,
                Swal,
                iniciarSesionBtn,
                crearCuentaBtn,
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD: null,
                perfiles: null,
                carrito: null,
                emailSesionC,
                passwordSesionC,
                validarRequisitos,
                validarCorreos,
                reqLength,
                reqMayus,
                reqMinus,
                reqNum,
                reqEspecial
            });
        } else if (btnSesion.textContent === 'Iniciar Sesión') {
            await iniciarSesion({
                emailSesion,
                passwordSesion,
                mostrarLoader,
                ocultarLoader,
                Swal,
                iniciarSesionBtn,
                crearCuentaBtn,
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD: null,
                perfiles: null,
                carrito: null
            });
        }
    });

    usuarioActivo();

    // Función para cargar mensajes en formato de lista con opción de responder
    const cargarMensajes = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/mensajes');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los mensajes.');
            }
            const mensajes = await respuesta.json();
            let listaMensajes = document.querySelector('.faq-container');
            if (!listaMensajes) {
                listaMensajes = document.createElement('div');
                listaMensajes.className = 'faq-container';
                document.body.appendChild(listaMensajes);
            }
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
                        <div class="faq-answer"><strong>Respuesta:</strong> ${mensaje.Respuesta || 'Sin responder.'}</div>
                    `;
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

    // Llamar a la función para cargar redes sociales al iniciar
    cargarRedesSociales();
    // Llamar a la función para renderizar el mapa en el footer al iniciar
    renderMapaFooter();
});