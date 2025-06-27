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
    const mensajeContainer = document.getElementById('mensaje');
    const reqLength = document.getElementById('req-length');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEspecial = document.getElementById('req-especial');


    // --- Sesión reutilizable ---
    olvidoContainerbtn.addEventListener('click', function (e) {
        e.preventDefault();
        formSesionContainer.style.display = 'none';
        showModal(olvidoContainer, modal, formSesionContainer, olvidoContainer,null, null);
    });

    iniciarSesionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setupLoginForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer,null, null);
    });

    crearCuentaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setupRegisterForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer,null, null);
    });

    closeModal.addEventListener('click', () => hideModal(modal, formSesionContainer, olvidoContainer,null, null));

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal(modal, formSesionContainer, olvidoContainer,null, null);
        }
    });



    // Validación de requisitos de contraseña y coincidencia
    passwordSesion.addEventListener('input', () => {
        validarRequisitos(passwordSesion.value, reqLength, reqMayus, reqMinus, reqNum, reqEspecial);
        validarCoincidencias(passwordSesion.value, passwordSesionC.value, passwordSesion, passwordSesionC);
    });
    passwordSesionC.addEventListener('input', () => {
        validarCoincidencias(passwordSesion.value, passwordSesionC.value, passwordSesion, passwordSesionC);
    });
    emailSesionC.addEventListener('input', () => {
        validarCorreos(emailSesion.value, emailSesionC.value, emailSesion, emailSesionC);
    });
    emailSesion.addEventListener('input', () => {
        if(emailSesionC.style.display !== 'none') {
            validarCorreos(emailSesion.value, emailSesionC.value, emailSesion, emailSesionC);
        }
    });

    // Lógica para recuperación de contraseña
    const formOlvido = document.getElementById('formOlvidoContrasena');
    if (formOlvido) {
        formOlvido.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correoRecuperar = document.getElementById('emailOlvido').value.trim();
            await recuperarContraseña(correoRecuperar, Swal, () => hideModal(modal, formSesionContainer, olvidoContainer, null, null));
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
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer, null, null),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD: null,
                perfiles: null,
                carrito:null,
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
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer,null, null),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD: null,
                perfiles: null,
                carrito:null
            });
        }
        // Actualizar campos de contacto tras iniciar sesión
        const usuarioStr = localStorage.getItem('usuario');
        let usuario = null;
        try {
            usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
        } catch (e) {
            usuario = null;
        }
        const emailContact = document.getElementById('email-contact');
        const nombreContact = document.getElementById('nombre-contact');
        if(nombreContact && emailContact && usuario) {
            emailContact.value = usuario.correo || '';
            nombreContact.value = usuario.nombre || '';
        }
    });

    usuarioActivo(Swal, mostrarLoader, ocultarLoader);
    // Actualizar campos de contacto tras usuarioActivo
    const usuarioStr = localStorage.getItem('usuario');
    let usuario = null;
    try {
        usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    } catch (e) {
        usuario = null;
    }
    const emailContact = document.getElementById('email-contact');
    const nombreContact = document.getElementById('nombre-contact');
    if(nombreContact && emailContact && usuario) {
        emailContact.value = usuario.correo || '';
        nombreContact.value = usuario.nombre || '';
    }
    const formulario = document.querySelector('form');    

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();
        mostrarLoader();

        const nombre = document.getElementById('nombre-contact').value.trim();
        const correo = document.getElementById('email-contact').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !correo || !mensaje) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            ocultarLoader();
            return;
        }

        try {
            const respuesta = await fetch('/api/mensajes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Nombre: nombre, Correo: correo, Mensaje: mensaje })
            });

            if (respuesta.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje enviado!',
                    text: 'Mensaje enviado exitosamente.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                mensajeContainer.innerHTML = ''; // Limpiar el mensaje
            } else {
                const error = await respuesta.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error || 'Hubo un problema al enviar el mensaje.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al enviar el mensaje. Intenta nuevamente.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            ocultarLoader();
        }
    });


    // Loader, Mapa y Redes globales
    cargarRedesSociales(); // Usar función global
    renderMapaFooter(); // Usar función global
});