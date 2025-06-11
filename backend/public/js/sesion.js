// Funciones de sesión reutilizables
function showModal(container, modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer) {
    modal.style.display = 'block';
    formSesionContainer.style.display = 'none';
    olvidoContainer.style.display = 'none';
    if (formPreferenciasContainer) {
    formPreferenciasContainer.style.display = 'none';
    }
    if (formPagoContainer) {
        formPagoContainer.style.display = 'none';
    }
    container.style.display = 'block';
}

function hideModal(modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer) {
    modal.style.display = 'none';
    formSesionContainer.style.display = 'none';
    olvidoContainer.style.display = 'none';
    if (formPreferenciasContainer) {
        formPreferenciasContainer.style.display = 'none';
    }
    if (formPagoContainer) {
        formPagoContainer.style.display = 'none';
    }
    document.getElementById('emailSesion').value = '';
    document.getElementById('passwordSesion').value = '';
    document.getElementById('emailSesionC').value = '';
    document.getElementById('passwordSesionC').value = '';
}

//color de req rojo
function resetRequisitos(reqLength, reqMayus, reqMinus, reqNum, reqEspecial) {
    
    reqLength.style.color = 'red';
    reqMayus.style.color = 'red';
    reqMinus.style.color = 'red';
    reqNum.style.color = 'red';
    reqEspecial.style.color = 'red';
}

function setupLoginForm({
    opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
}) {
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
    reqLength.style.display = 'none';
    reqMayus.style.display = 'none';
    reqMinus.style.display = 'none';
    reqNum.style.display = 'none';
    reqEspecial.style.display = 'none';
}

function setupRegisterForm({
    opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
}) {
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
    reqLength.style.display = 'block';
    reqMayus.style.display = 'block';
    reqMinus.style.display = 'block';
    reqNum.style.display = 'block';
    reqEspecial.style.display = 'block';
    resetRequisitos(reqLength, reqMayus, reqMinus, reqNum, reqEspecial);
}

function validarRequisitos(password, reqLength, reqMayus, reqMinus, reqNum, reqEspecial) {
    let validos = 0;
    if (password.length >= 8) { reqLength.style.color = 'green'; validos++; } else reqLength.style.color = 'red';
    if (/[A-Z]/.test(password)) { reqMayus.style.color = 'green'; validos++; } else reqMayus.style.color = 'red';
    if (/[a-z]/.test(password)) { reqMinus.style.color = 'green'; validos++; } else reqMinus.style.color = 'red';
    if (/\d/.test(password)) { reqNum.style.color = 'green'; validos++; } else reqNum.style.color = 'red';
    if (/[^A-Za-z0-9]/.test(password)) { reqEspecial.style.color = 'green'; validos++; } else reqEspecial.style.color = 'red';
    return validos === 5;
}

function validarCoincidencias(password1, password2, passwordSesion, passwordSesionC) {
    if (password1 && password2) {
        if (password1 === password2) {
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

function validarCorreos(correo1, correo2, emailSesion, emailSesionC) {
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

function validarContraseña(password1, password2) {
    return password1 && password2 && password1 === password2;
}

async function recuperarContraseña(correoRecuperar, Swal, hideModal) {
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
}

async function crearCuenta({ emailSesion, passwordSesion, mostrarLoader, ocultarLoader, Swal, iniciarSesionBtn, crearCuentaBtn, hideModal, formSesion, btnSesion, mostrarPerfil, cerrarSesion, openCRUD, closeCRUD, perfiles, carrito, emailSesionC, passwordSesionC, validarRequisitos, validarCorreos, reqLength, reqMayus, reqMinus, reqNum, reqEspecial }) {
    mostrarLoader();
    const correo = emailSesionC.value;
    const confirmCo = emailSesion.value;
    const contrasena = passwordSesionC.value;
    const confirmCon = passwordSesion.value;

    if (!correo || !contrasena || !confirmCo || !confirmCon) {
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
    if (!validarRequisitos(contrasena, reqLength, reqMayus, reqMinus, reqNum, reqEspecial, )) {
        Swal.fire({ icon: 'error', title: 'Contraseña insegura', text: 'La contraseña no cumple los requisitos.', toast: true, position: 'top-end' });
        return;
    }
    if (contrasena !== confirmCon) {
        Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden', text: 'Las contraseñas no son iguales.', toast: true, position: 'top-end' });
        return;
    }
    if (!validarCorreos(correo, confirmCo, emailSesion, emailSesionC)) {
        Swal.fire({
            icon: 'error',
            title: 'Correos no coinciden',
            text: 'Por favor, verifica que los correos sean iguales.',
            toast: true,
            position: 'top-end'
        });
        ocultarLoader();
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
            Swal.fire({
                icon: 'success',
                title: 'Cuenta creada',
                text: 'Tu cuenta ha sido creada exitosamente.',
                toast: true,
                position: 'top-end'
            });
            iniciarSesion({ emailSesion, passwordSesion, mostrarLoader, ocultarLoader, Swal, iniciarSesionBtn, crearCuentaBtn, hideModal, formSesion, btnSesion, mostrarPerfil, cerrarSesion, openCRUD, perfiles, carrito});
            hideModal();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error,
                toast: true,
                position: 'top-end'
            });
            ocultarLoader();
        }
    } catch (error) {
        console.error('Error al crear la cuenta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear la cuenta. Intenta nuevamente.',
            toast: true,
            position: 'top-end'
        });
        ocultarLoader();
    } finally {
        ocultarLoader();
    }
    hideModal();
    formSesion.reset();
}

async function iniciarSesion({ emailSesion, passwordSesion, mostrarLoader, ocultarLoader, Swal, iniciarSesionBtn, crearCuentaBtn, hideModal, formSesion, btnSesion, mostrarPerfil, cerrarSesion, openCRUD, perfiles, carrito }) {
    mostrarLoader();
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
        ocultarLoader();
        return;
    }

    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip;
    try {
        const respuesta = await fetch('/api/iniciar-sesion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena, ip })
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            localStorage.setItem('usuario', JSON.stringify(data.user));
            // Si es admin y la función openCRUD existe, ejecutarla
            if (data.user && data.user.rol === 'admin' && window.location.pathname.endsWith('index.html')) {
                if (typeof openCRUD === 'function') {
                    openCRUD();
                } else {
                    console.warn('openCRUD no está definida o no es una función.');
                }
                // Verificación de IP para admin (puedes personalizar la IP permitida)
                const ipAdminPermitida = await fetch('/api/ips'); // Cambia esto por la IP real permitida
                if (ip === ipAdminPermitida && data.user.rol === 'admin') {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido, administrador!',
                        text: 'Has iniciado sesión como administrador.',
                        toast: true,
                        position: 'top-end'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso restringido',
                        text: 'No tienes permiso para iniciar sesión como administrador desde esta IP.',
                        toast: true,
                        position: 'top-end'
                    });
                    ocultarLoader();
                    return;
                }
                
            }
            if(data.user.rol === 'usuario') {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: 'Has iniciado sesión correctamente.',
                        toast: true,
                        position: 'top-end'
                    });
                }
            if (iniciarSesionBtn) iniciarSesionBtn.style.display = 'none';
            if (crearCuentaBtn) crearCuentaBtn.style.display = 'none';
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
            perfilLink.addEventListener('click', () => mostrarPerfil(data.user, Swal, mostrarLoader, ocultarLoader));
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
            if (carrito) carrito.style.display = 'block';
            hideModal();
            if (formSesion) formSesion.reset();
            if (typeof perfiles === 'function') perfiles();
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
    } finally {
        ocultarLoader();
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    location.reload();
}

async function mostrarPerfil(user, Swal, mostrarLoader, ocultarLoader) {
    mostrarLoader();
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
    } finally {
        ocultarLoader();
    }
}

function usuarioActivo(Swal, mostrarLoader, ocultarLoader) {
    const usuario = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;
    if (usuario) {
        console.log('Sesión activa:', usuario);
        document.getElementById('crearCuenta').style.display = 'none';
        document.getElementById('iniciarSesion').style.display = 'none';
        const listaSesion = document.querySelector('.iniciosesion');
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = usuario.nombre;
        } else {
            perfilLink.textContent = 'Editar Perfil';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLink.addEventListener('click', () => mostrarPerfil(usuario, Swal, mostrarLoader, ocultarLoader));
        perfilLi.appendChild(perfilLink);
        const cerrarSesionLi = document.createElement('li');
        const cerrarSesionLink = document.createElement('a');
        cerrarSesionLink.textContent = 'Cerrar Sesión';
        cerrarSesionLink.id = 'cerrarSesionBtn';
        cerrarSesionLink.href = '#';
        cerrarSesionLink.addEventListener('click', cerrarSesion);
        cerrarSesionLi.appendChild(cerrarSesionLink);
        listaSesion.innerHTML = '';
        listaSesion.appendChild(perfilLi);
        listaSesion.appendChild(cerrarSesionLi);
    } else {
        console.log('No hay sesión activa.');
    }
}
