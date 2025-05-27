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

    function showModal(container) {
        modal.style.display = 'block';
        formSesionContainer.style.display = 'none';
        olvidoContainer.style.display = 'none';
        container.style.display = 'block';
    }

    function hideModal() {
        modal.style.display = 'none';
        formSesionContainer.style.display = 'none';
        olvidoContainer.style.display = 'none';
        document.getElementById('emailSesion').value = '';
        document.getElementById('passwordSesion').value = '';
        document.getElementById('emailSesionC').value = '';
        document.getElementById('passwordSesionC').value = '';
    }

    function setupLoginForm() {
        opcionTitulo.textContent = 'Iniciar Sesión';
        tco.style.display = 'none';
        tca.style.display = 'none';
        emailSesionC.style.display = 'none';
        passwordSesionC.style.display = 'none';
        emailSesionC.required = false;
        passwordSesionC.required = false;
        btnSesion.textContent = 'Iniciar Sesión';
        olvidoContainer.style.display = 'none';
        terminos.style.display = 'none';
        privacidad.style.display = 'none';
        imputTerminos.style.display = 'none';
        imputPrivacidad.style.display = 'none';
        imputPrivacidad.required = false;
        imputTerminos.required = false;

    }

    function setupRegisterForm() {
        opcionTitulo.textContent = 'Crear Cuenta';
        tco.style.display = 'block';
        tca.style.display = 'block';
        emailSesionC.style.display = 'block';
        passwordSesionC.style.display = 'block';
        emailSesionC.required = true;
        passwordSesionC.required = true;
        btnSesion.textContent = 'Crear Cuenta';
        olvidoContainer.style.display = 'none';
        terminos.style.display = 'block';
        privacidad.style.display = 'block';
        imputTerminos.style.display = 'block';
        imputPrivacidad.style.display = 'block';
        imputPrivacidad.required = true;
        imputTerminos.required = true;
    }

    olvidoContainerbtn.addEventListener('click', function (e) {
        e.preventDefault();
        formSesionContainer.style.display = 'none';
        showModal(olvidoContainer);
    })

    iniciarSesionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(formSesionContainer);
        setupLoginForm();
    });

    crearCuentaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(formSesionContainer);
        setupRegisterForm();
    });

    closeModal.addEventListener('click', hideModal);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal();
        }
    });



    // Función para manejar la creación de cuenta
    const crearCuenta = async () => {
        const correo = emailSesionC.value;
        const confirmCo = emailSesion.value;
        const contrasena = passwordSesionC.value;
        const confirmCon = passwordSesion.value;

        if (!correo || !contrasena || !confirmCo || !confirmCon) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.'
            });
            return;
        }
        if (!validarRequisitos(contrasena)) {
        Swal.fire({ icon: 'error', title: 'Contraseña insegura', text: 'La contraseña no cumple los requisitos.', toast: true, position: 'top-end' });
        return;
    }
    if (contrasena !== confirmCon) {
        Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden', text: 'Las contraseñas no son iguales.', toast: true, position: 'top-end' });
        return;
    }

    if (!validarCorreos()) {
        Swal.fire({
            icon: 'error',
            title: 'Correos no coinciden',
            text: 'Por favor, verifica que los correos sean iguales.',
            toast: true,
            position: 'top-end'
        });
        return;
    }

        try {
            const respuesta = await fetch('/api/crear-cuenta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                hideModal();
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error',
                    text: data.error
                });
            }
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al crear la cuenta. Intenta nuevamente.'
            });
        }
        hideModal();
        form.sesion.reset();
    };

    // Función para manejar el inicio de sesión
    const iniciarSesion = async () => {
        const correo = emailSesion.value;
        const contrasena = passwordSesion.value;

        if (!correo || !contrasena) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        try {
            const respuesta = await fetch('/api/iniciar-sesion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem('usuario', JSON.stringify(data.user));

                iniciarSesionBtn.style.display = 'none';
                crearCuentaBtn.style.display = 'none';

                const listaSesion = document.querySelector('.iniciosesion');

                const perfilLi = document.createElement('li');
                const perfilLink = document.createElement('a');
                if (data.user && data.user.nombre && data.user.nombre.trim() !== "") {
                    perfilLink.textContent = data.user.nombre;
                } else {
                    perfilLink.textContent = 'Editar Perfil';
                }
                perfilLink.id = 'perfilBtn';
                perfilLink.href = '#';
                perfilLink.addEventListener('click', () => mostrarPerfil(data.user));
                perfilLi.appendChild(perfilLink);

                const cerrarSesionLi = document.createElement('li');
                const cerrarSesionLink = document.createElement('a');
                cerrarSesionLink.textContent = 'Cerrar Sesión';
                cerrarSesionLink.id = 'cerrarSesionBtn';
                cerrarSesionLink.href = '#';
                cerrarSesionLink.addEventListener('click', cerrarSesion);
                cerrarSesionLi.appendChild(cerrarSesionLink);

                listaSesion.appendChild(perfilLi);
                listaSesion.appendChild(cerrarSesionLi);

                // Llenar automáticamente los campos del formulario de contacto
                const nombreContact = document.getElementById('nombre-contact');
                const emailContact = document.getElementById('email-contact');
                if (nombreContact && emailContact) {
                    nombreContact.value = data.user.nombre || '';
                    emailContact.value = data.user.correo || '';
                }

                hideModal();
                form.sesion.reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al iniciar sesión. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
            });
        }
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        location.reload();
    };

    // Función para mostrar el perfil del usuario
    const mostrarPerfil = async (user) => {
        try {
            const respuesta = await fetch(`/api/perfil?correo=${user.correo}`);
            const perfil = await respuesta.json();

            if (respuesta.ok) {
                window.location.href = 'datos-perfil.html';
                localStorage.setItem('usuario', JSON.stringify(perfil));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: perfil.error,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cargar el perfil. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
            });
        }
    };

    btnSesion.addEventListener('click', (e) => {
        e.preventDefault();
        if (btnSesion.textContent === 'Crear Cuenta') {
            crearCuenta();
        } else if (btnSesion.textContent === 'Iniciar Sesión') {
            iniciarSesion();
        }
    });

    const usuario = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;

    if (usuario) {
        console.log('Sesión activa:', usuario);

        // Mostrar funciones relacionadas con el usuario
        document.getElementById('crearCuenta').style.display = 'none';
        document.getElementById('iniciarSesion').style.display = 'none';

        // Obtener el ul donde se agregarán los elementos
        const listaSesion = document.querySelector('.iniciosesion');

        // Crear el elemento <li> para "Perfil"
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = usuario.nombre;
        } else {
            perfilLink.textContent = 'Editar Perfil';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLink.addEventListener('click', () => mostrarPerfil(usuario));
        perfilLi.appendChild(perfilLink);

        // Crear el elemento <li> para "Cerrar Sesión"
        const cerrarSesionLi = document.createElement('li');
        const cerrarSesionLink = document.createElement('a');
        cerrarSesionLink.textContent = 'Cerrar Sesión';
        cerrarSesionLink.id = 'cerrarSesionBtn';
        cerrarSesionLink.href = '#';
        cerrarSesionLink.addEventListener('click', cerrarSesion);
        cerrarSesionLi.appendChild(cerrarSesionLink);

        // Agregar ambos elementos al <ul>
        listaSesion.innerHTML = '';
        listaSesion.appendChild(perfilLi);
        listaSesion.appendChild(cerrarSesionLi);

        // Llenar automáticamente los campos del formulario de contacto
        const nombreContact = document.getElementById('nombre-contact');
        const emailContact = document.getElementById('email-contact');
        if (nombreContact && emailContact) {
            nombreContact.value = usuario.nombre || '';
            emailContact.value = usuario.correo || '';
        }
    } else {
        console.log('No hay sesión activa.');
    }

    const formulario = document.querySelector('form');

    // Loader functions
    function mostrarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex';
    }
    function ocultarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }

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
                position: 'top-end'
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
                    position: 'top-end'
                });
                formulario.reset();
                cargarMensajes(); // Recargar los mensajes después de enviar
            } else {
                const error = await respuesta.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error || 'Hubo un problema al enviar el mensaje.',
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al enviar el mensaje. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    });

    // Eliminar la funcionalidad del carrusel y mover los mensajes a formato de lista
    // Función para cargar redes sociales desde el servidor
    async function cargarRedesSociales() {
        try {
            const respuesta = await fetch('/api/redes-sociales');
            if (!respuesta.ok) {
                throw new Error('Error al cargar las redes sociales.');
            }

            const redes = await respuesta.json();
            const listaRedes = document.querySelector('.redes-sociales');
            listaRedes.innerHTML = '';

            redes.forEach(red => {
                const li = document.createElement('li');

                // Verificar si el enlace tiene un esquema completo
                let enlaceCompleto = red.enlace;
                if (!/^https?:\/\//i.test(enlaceCompleto)) {
                    if (!enlaceCompleto.startsWith('www.')) {
                        enlaceCompleto = `www.${enlaceCompleto}`;
                    }
                    enlaceCompleto = `https://${enlaceCompleto}`;
                } else if (enlaceCompleto.startsWith('www.')) {
                    enlaceCompleto = `https://${enlaceCompleto}`;

                } else if (!enlaceCompleto.startsWith('http://') && !enlaceCompleto.startsWith('https://')) {
                    enlaceCompleto = `https://${enlaceCompleto}`; // Corregido para usar https  
                }

                li.innerHTML = `
                    <a href="${enlaceCompleto}" target="_blank">
                    <img src="https://cdn.simpleicons.org/${red.nombre}" alt="${red.nombre}" width="24" height="24">
                    ${red.nombre}
                    </a>
                `;
                listaRedes.appendChild(li);
            });
        } catch (error) {
            console.error('Error al cargar las redes sociales:', error);
        }
    }

    cargarRedesSociales(); // Llamar a la función para cargar redes sociales al iniciar

    // Mostrar el minimapa en el footer si existe
    function renderMapaFooter() {
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
    renderMapaFooter();

    // Validación de requisitos de contraseña y coincidencia
    const reqLength = document.getElementById('req-length');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEspecial = document.getElementById('req-especial');
    
    function validarRequisitos(password) {
        let validos = 0;
        if (password.length >= 8) { reqLength.style.color = 'green'; validos++; } else reqLength.style.color = 'red';
        if (/[A-Z]/.test(password)) { reqMayus.style.color = 'green'; validos++; } else reqMayus.style.color = 'red';
        if (/[a-z]/.test(password)) { reqMinus.style.color = 'green'; validos++; } else reqMinus.style.color = 'red';
        if (/\d/.test(password)) { reqNum.style.color = 'green'; validos++; } else reqNum.style.color = 'red';
        if (/[^A-Za-z0-9]/.test(password)) { reqEspecial.style.color = 'green'; validos++; } else reqEspecial.style.color = 'red';
        return validos === 5;
    }

    function validarCoincidencia() {
        if (passwordSesionC.value && passwordSesion.value) {
            if (passwordSesionC.value === passwordSesion.value) {
                passwordSesion.style.borderColor = 'green';
                passwordSesionC.style.borderColor = 'green';
            } else {
                passwordSesion.style.borderColor = 'red';
                passwordSesionC.style.borderColor = 'red';
            }
        } else {
            passwordSesion.style.borderColor = '';
            passwordSesionC.style.borderColor = '';
        }
    }

    function validarCorreos() {
        const correo1 = emailSesionC.value.trim();
        const correo2 = emailSesion.value.trim();
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo1) || !regexCorreo.test(correo2)) {
            emailSesionC.style.borderColor = 'red';
            emailSesion.style.borderColor = 'red';
            return false;
        }
        if (correo1 !== correo2) {
            emailSesionC.style.borderColor = 'red';
            emailSesion.style.borderColor = 'red';
            return false;
        }
        emailSesionC.style.borderColor = 'green';
        emailSesion.style.borderColor = 'green';
        return true;
    }

    passwordSesion.addEventListener('input', () => {
        validarRequisitos(passwordSesionC.value);
        validarCoincidencia();
    });
    passwordSesionC.addEventListener('input', validarCoincidencia);
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
            if (!correoRecuperar) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Por favor, ingresa tu correo.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }
            try {
                const resp = await fetch('/api/recuperar-contrasena', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo: correoRecuperar })
                });
                const data = await resp.json();
                if (resp.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Revisa tu correo',
                        text: data.message,
                        toast: true,
                        position: 'top-end'
                    });
                    hideModal();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'No se pudo enviar el correo de recuperación.',
                        toast: true,
                        position: 'top-end'
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red',
                    text: 'No se pudo conectar con el servidor.',
                    toast: true,
                    position: 'top-end'
                });
            }
        });
    }

});