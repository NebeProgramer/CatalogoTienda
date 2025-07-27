// Funciones de sesión reutilizables
// SweetAlert2 is already globally available from HTML script tag
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
    document.getElementById('emailSesion').style.borderColor = '';
    //resetear requisitos y borde de contraseña y correo
    document.getElementById('emailSesion').style.borderColor = '';    
    document.getElementById('emailSesionC').style.borderColor = '';
    document.getElementById('passwordSesion').style.borderColor = '';
    document.getElementById('passwordSesionC').style.borderColor = '';
    const reqLength = document.getElementById('reqLength');
    const reqMayus = document.getElementById('reqMayus');
    const reqMinus = document.getElementById('reqMinus');
    const reqNum = document.getElementById('reqNum');
    const reqEspecial = document.getElementById('reqEspecial');
    if (reqLength) reqLength.style.color = 'red';
    if (reqMayus) reqMayus.style.color = 'red';
    if (reqMinus) reqMinus.style.color = 'red';
    if (reqNum) reqNum.style.color = 'red';
    if (reqEspecial) reqEspecial.style.color = 'red';
}
//color de req rojo
function resetRequisitos(reqLength, reqMayus, reqMinus, reqNum, reqEspecial) {
    reqLength.style.color = 'red';
    reqMayus.style.color = 'red';
    reqMinus.style.color = 'red';
    reqNum.style.color = 'red';
    reqEspecial.style.color = 'red';
}

function resetform(emailSesion, emailSesionC, passwordSesion, passwordSesionC) {
    emailSesion.value = '';
    emailSesionC.value = '';
    passwordSesion.value = '';
    passwordSesionC.value = '';
    emailSesion.style.borderColor = '';
    emailSesionC.style.borderColor = '';
    passwordSesion.style.borderColor = '';
    passwordSesionC.style.borderColor = '';
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
            timer: 3000,
            showConfirmButton: false,
            position: 'top-end'
        });
        ocultarLoader();
        return;
    }
    if (!validarRequisitos(contrasena, reqLength, reqMayus, reqMinus, reqNum, reqEspecial, )) {
        Swal.fire({ icon: 'error', title: 'Contraseña insegura', text: 'La contraseña no cumple los requisitos.', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        return;
    }
    if (contrasena !== confirmCon) {
        Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden', text: 'Las contraseñas no son iguales.', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
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
    }    try {
        const respuesta = await fetch('/api/crear-cuenta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            if (data.requiresVerification) {
                Swal.fire({
                    icon: 'info',
                    title: 'Cuenta creada - Verificación requerida',
                    html: `
                        <p>Tu cuenta ha sido creada exitosamente.</p>
                        <p><strong>Se ha enviado un correo de verificación a:</strong></p>
                        <p style="color: #007bff; font-weight: bold;">${correo}</p>
                        <p>Por favor, revisa tu correo y haz clic en el enlace de verificación para activar tu cuenta.</p>
                        <p><small>Si no ves el correo, revisa tu carpeta de spam.</small></p>
                        <button id="reenviar-verificacion" style="margin-top: 10px; padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Reenviar correo de verificación
                        </button>
                    `,
                    showConfirmButton: true,
                    confirmButtonText: 'Entendido',
                    allowOutsideClick: false,
                    didOpen: () => {
                        const btnReenviar = document.getElementById('reenviar-verificacion');
                        btnReenviar.onclick = async () => {
                            btnReenviar.disabled = true;
                            btnReenviar.textContent = 'Enviando...';
                            try {
                                const respuestaReenvio = await fetch('/api/reenviar-verificacion', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ correo })
                                });
                                const dataReenvio = await respuestaReenvio.json();
                                if (respuestaReenvio.ok) {
                                    btnReenviar.textContent = '✓ Enviado';
                                    btnReenviar.style.backgroundColor = '#28a745';
                                } else {
                                    btnReenviar.textContent = 'Error al enviar';
                                    btnReenviar.style.backgroundColor = '#dc3545';
                                }
                            } catch (error) {
                                btnReenviar.textContent = 'Error al enviar';
                                btnReenviar.style.backgroundColor = '#dc3545';
                            }
                            setTimeout(() => {
                                btnReenviar.disabled = false;
                                btnReenviar.textContent = 'Reenviar correo de verificación';
                                btnReenviar.style.backgroundColor = '#28a745';
                            }, 3000);
                        };
                    }
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Cuenta creada',
                    text: 'Tu cuenta ha sido creada exitosamente.',
                    toast: true,
                    timer: 3000,
                    showConfirmButton: false,
                    position: 'top-end'
                });
            }
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
            timer: 3000,
            showConfirmButton: false,
            position: 'top-end'
        });
        ocultarLoader();
    } finally {
        //Restablecer estado del formulario
        resetRequisitos(reqLength, reqMayus, reqMinus, reqNum, reqEspecial);
        resetform(emailSesion, emailSesionC, passwordSesion, passwordSesionC);
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
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false
        });
        ocultarLoader();
        return;
    }
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip;    try {
        const respuesta = await fetch('/api/iniciar-sesion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena, ip })
        });
        const data = await respuesta.json();
        if (respuesta.ok) {
            if (data.isverified === false) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cuenta no verificada',
                    text: 'Por favor, verifica tu cuenta antes de iniciar sesión.',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    showConfirmButton: false
                });
                ocultarLoader();
                return;
            }
            localStorage.setItem('usuario', JSON.stringify(data.user));
            if (data.user && data.user.rol === 'admin') {
                if (typeof openCRUD === 'function') {
                    openCRUD();
                } else {
                }
                // Verificación de IP para admin
                const ipAdminPermitida = await fetch(`/api/ips/${ip}`);
                if (ipAdminPermitida.ok) {
                    const ipPermitidaData = await ipAdminPermitida.json();                    
                    if (ipPermitidaData && !ipPermitidaData.error) {
                        setTimeout(() => {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Bienvenido, administrador!',
                                text: 'Has iniciado sesión como administrador.',
                                toast: true,
                                position: 'top-end',
                                timer: 3000,
                                showConfirmButton: false
                            });
                        }, 100);
                    } else {
                        setTimeout(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Acceso restringido',
                                text: 'No tienes permiso para iniciar sesión como administrador desde esta IP.',
                                toast: true,
                                position: 'top-end',
                                timer: 3000,
                                showConfirmButton: false
                            });
                        }, 100);
                        ocultarLoader();
                        return;
                    }
                } else {
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Acceso restringido',
                            text: 'No tienes permiso para iniciar sesión como administrador desde esta IP.',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            showConfirmButton: false
                        });
                    }, 100);
                    ocultarLoader();
                    return;
                }
            }            if(data.user.rol === 'usuario') {
                // Mostrar mensaje de bienvenida para usuario normal
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: 'Has iniciado sesión correctamente.',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }, 100);
            }
            if (iniciarSesionBtn) iniciarSesionBtn.style.display = 'none';
            if (crearCuentaBtn) crearCuentaBtn.style.display = 'none';            
            const listaSesion = document.querySelector('.iniciosesion');
            const perfilLi = document.createElement('li');
            const perfilLink = document.createElement('a');
            // Crear elemento para avatar
            const avatarImg = document.createElement('img');
            avatarImg.style.width = '25px';
            avatarImg.style.height = '25px';
            avatarImg.style.borderRadius = '50%';
            avatarImg.style.marginRight = '8px';
            avatarImg.style.objectFit = 'cover';
            avatarImg.style.border = '2px solid #ddd';
              // Determinar qué imagen usar
            if (data.user.fotoGoogle && data.user.fotoGoogle.trim() !== "") {
                avatarImg.src = data.user.fotoGoogle;
            } else if (data.user.fotoPerfil && data.user.fotoPerfil.trim() !== "") {
                avatarImg.src = data.user.fotoPerfil;
            } else {
                avatarImg.src = '/img/default-avatar.svg'; // Avatar por defecto
            }
            avatarImg.onerror = function() {
                this.src = '/img/default-avatar.svg'; // Fallback si la imagen no carga
            };
            if (data.user && data.user.nombre && data.user.nombre.trim() !== "") {
                perfilLink.textContent = data.user.nombre;
            } else {
                perfilLink.textContent = 'Editar Perfil';
            }
            perfilLink.id = 'perfilBtn';
            perfilLink.href = '#';
            perfilLink.style.display = 'flex';
            perfilLink.style.alignItems = 'center';
            perfilLink.insertBefore(avatarImg, perfilLink.firstChild);
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
            if (formSesion) formSesion.reset();            if (typeof perfiles === 'function') perfiles();
        } else {
            if (data.requiresVerification) {
                setTimeout(() => {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Cuenta no verificada',
                        html: `
                            <p>Tu cuenta no ha sido verificada aún.</p>
                            <p>Por favor, revisa tu correo electrónico y haz clic en el enlace de verificación.</p>
                            <p><small>Si no ves el correo, revisa tu carpeta de spam.</small></p>
                            <button id="reenviar-verificacion-login" style="margin-top: 10px; padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Reenviar correo de verificación
                            </button>
                        `,
                        showConfirmButton: true,
                        confirmButtonText: 'Entendido',
                        didOpen: () => {
                            const btnReenviar = document.getElementById('reenviar-verificacion-login');
                            btnReenviar.onclick = async () => {
                                btnReenviar.disabled = true;
                                btnReenviar.textContent = 'Enviando...';
                                try {
                                    const respuestaReenvio = await fetch('/api/reenviar-verificacion', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ correo })
                                    });
                                    const dataReenvio = await respuestaReenvio.json();
                                    if (respuestaReenvio.ok) {
                                        btnReenviar.textContent = '✓ Enviado';
                                        btnReenviar.style.backgroundColor = '#28a745';
                                    } else {
                                        btnReenviar.textContent = 'Error al enviar';
                                        btnReenviar.style.backgroundColor = '#dc3545';
                                    }
                                } catch (error) {
                                    btnReenviar.textContent = 'Error al enviar';
                                    btnReenviar.style.backgroundColor = '#dc3545';
                                }
                                setTimeout(() => {
                                    btnReenviar.disabled = false;
                                    btnReenviar.textContent = 'Reenviar correo de verificación';
                                    btnReenviar.style.backgroundColor = '#28a745';
                                }, 3000);
                            };
                        }
                    });
                }, 100);
            } else {
                setTimeout(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error,
                        toast: true,
                        position: 'top-end',
                        timer: 4000,
                        showConfirmButton: false
                    });
                }, 100);
            }
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setTimeout(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al iniciar sesión. Intenta nuevamente.',
                toast: true,
                position: 'top-end',
                timer: 4000,
                showConfirmButton: false
            });
        }, 100);
    } finally {
        ocultarLoader();
    }
}
function cerrarSesion() {
    fetch('/api/auth/logout')
        .then(() => {
            // Limpia localStorage y reinicia UI
            localStorage.removeItem('usuario');

            // Opcional: ocultar botones y actualizar menú
            const bienvenida = document.querySelector('.bienvenida');
            if (bienvenida) bienvenida.remove();

            const listaSesion = document.querySelector('.iniciosesion');
            if (listaSesion) {
                listaSesion.innerHTML = `
                    <li><a href="#" id="iniciarSesion">Iniciar sesión</a></li>
                    <li><a href="#" id="crearCuenta">Crear cuenta</a></li>
                `;
                // Volver a agregar listeners si es necesario
                document.getElementById('iniciarSesion').addEventListener('click', (e) => {
                    e.preventDefault();
                    iniciarSesion.click();
                });
                document.getElementById('crearCuenta').addEventListener('click', (e) => {
                    e.preventDefault();
                    crearCuenta.click();
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Sesión Cerrada',
                text: 'Has cerrado sesión correctamente.',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Redirige a la página de inicio o a donde sea necesario
                window.location.reload();
            });
        })
        .catch((err) => {
            console.error('Error al cerrar sesión:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error al cerrar sesión',
                text: 'No se pudo cerrar la sesión correctamente.',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
            });
        });
}
async function mostrarPerfil(user, Swal, mostrarLoader, ocultarLoader) {
    mostrarLoader();
    try {
        const respuesta = await fetch(`/api/perfil?correo=${user.correo}`);
        const perfil = await respuesta.json();
        if (respuesta.ok) {
            window.location.href = '/perfil';
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
        document.getElementById('crearCuenta').style.display = 'none';
        document.getElementById('iniciarSesion').style.display = 'none';        const listaSesion = document.querySelector('.iniciosesion');
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        // Crear elemento para avatar
        const avatarImg = document.createElement('img');
        avatarImg.style.width = '25px';
        avatarImg.style.height = '25px';
        avatarImg.style.borderRadius = '50%';
        avatarImg.style.marginRight = '8px';
        avatarImg.style.objectFit = 'cover';
        avatarImg.style.border = '2px solid #ddd';
          // Determinar qué imagen usar
        if (usuario.fotoGoogle && usuario.fotoGoogle.trim() !== "") {
            avatarImg.src = usuario.fotoGoogle;
        } else if (usuario.fotoPerfil && usuario.fotoPerfil.trim() !== "") {
            avatarImg.src = usuario.fotoPerfil;
        } else {
            avatarImg.src = '/img/default-avatar.svg'; // Avatar por defecto
        }
        avatarImg.onerror = function() {
            this.src = '/img/default-avatar.svg'; // Fallback si la imagen no carga
        };
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = usuario.nombre;
        } else {
            perfilLink.textContent = 'Editar Perfil';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLink.style.display = 'flex';
        perfilLink.style.alignItems = 'center';
        perfilLink.insertBefore(avatarImg, perfilLink.firstChild);
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
        const carrito = document.getElementById('carrito');
        if (carrito) {
            carrito.style.display = 'block';
        }
    } else {
        }
}
// ===== FUNCIONES DE GOOGLE OAUTH =====
// Función para iniciar el proceso de autenticación con Google
function iniciarSesionGoogle() {
    window.location.href = '/auth/google';
}
// Función para verificar si el usuario se autenticó exitosamente con Google
async function verificarAutenticacionGoogle() {
    try {
        const respuesta = await fetch('/api/auth/user', {
            method: 'GET',
            credentials: 'include' // Importante para incluir cookies de sesión
        });
        if (respuesta.ok) {
            const data = await respuesta.json();
            if (data.user) {
                if (data.user.rol === 'admin') {
                    const ip = data.user.ip || (await (await fetch('https://api.ipify.org?format=json')).json()).ip;
                    // Verificar IP permitida para admin
                    const ipPermitidaResponse = await fetch(`/api/ips/${ip}`);
                    if (!ipPermitidaResponse.ok) {
                        
                        setTimeout(() => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Acceso denegado',
                                text: 'Tu dirección IP no está permitida para acceder a esta área.',
                                toast: true,
                                position: 'top-end',
                                timer: 3000
                            }).then(() => {
                                cerrarSesion();
                            });
                        }, 1000);
                        return;
                    }
                }
                // Usuario autenticado exitosamente con Google
                localStorage.setItem('usuario', JSON.stringify(data.user));
                // Actualizar la interfaz primero para evitar pantalla negra
                actualizarInterfazUsuario(data.user);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error al verificar autenticación con Google:', error);
        // Mostrar error sin bloquear la interfaz
        setTimeout(() => {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo verificar la autenticación. Intenta nuevamente.',
                    toast: true,
                    position: 'top-end',
                    timer: 3000
                });
            }
        }, 100);
        return false;
    }
}
// Función para actualizar la interfaz cuando un usuario se autentica
function actualizarInterfazUsuario(usuario) {
    // Ocultar botones de inicio de sesión y registro
    const iniciarSesionBtn = document.getElementById('iniciarSesion');
    const crearCuentaBtn = document.getElementById('crearCuenta');
    if (iniciarSesionBtn) iniciarSesionBtn.style.display = 'none';
    if (crearCuentaBtn) crearCuentaBtn.style.display = 'none';
    // Crear elementos del perfil
    const listaSesion = document.querySelector('.iniciosesion');
    if (listaSesion) {
        listaSesion.innerHTML = ''; // Limpiar contenido existente
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        // Crear elemento para avatar
        const avatarImg = document.createElement('img');
        avatarImg.style.width = '25px';
        avatarImg.style.height = '25px';
        avatarImg.style.borderRadius = '50%';
        avatarImg.style.marginRight = '8px';
        avatarImg.style.objectFit = 'cover';
        avatarImg.style.border = '2px solid #ddd';
        // Determinar qué imagen usar (priorizar fotoPerfil local sobre fotoGoogle)
        if (usuario.fotoPerfil && usuario.fotoPerfil.trim() !== "") {
            avatarImg.src = usuario.fotoPerfil;
        } else if (usuario.fotoGoogle && usuario.fotoGoogle.trim() !== "") {
            avatarImg.src = usuario.fotoGoogle;
        } else {
            avatarImg.src = '/img/default-avatar.svg'; // Avatar por defecto
        }
        avatarImg.onerror = function() {
            this.src = '/img/default-avatar.svg'; // Fallback si la imagen no carga
        };
        // Mostrar nombre o "Editar Perfil"
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = usuario.nombre;
        } else {
            perfilLink.textContent = 'Editar Perfil';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLink.style.display = 'flex';
        perfilLink.style.alignItems = 'center';
        perfilLink.insertBefore(avatarImg, perfilLink.firstChild);
        perfilLink.addEventListener('click', () => {
            if (typeof mostrarPerfil === 'function') {
                mostrarPerfil(usuario, Swal, mostrarLoader, ocultarLoader);
            } else {
                window.location.href = '/perfil';
            }
        });
        perfilLi.appendChild(perfilLink);
        // Botón de cerrar sesión
        const cerrarSesionLi = document.createElement('li');
        const cerrarSesionLink = document.createElement('a');
        cerrarSesionLink.textContent = 'Cerrar Sesión';
        cerrarSesionLink.id = 'cerrarSesionBtn';
        cerrarSesionLink.href = '#';
        cerrarSesionLink.addEventListener('click', cerrarSesion);
        cerrarSesionLi.appendChild(cerrarSesionLink);
        listaSesion.appendChild(perfilLi);
        listaSesion.appendChild(cerrarSesionLi);
    }
    // Mostrar carrito si existe
    const carrito = document.getElementById('carrito');
    if (carrito) {
        carrito.style.display = 'block';
    }
    // Mostrar mensaje de bienvenida
    if (usuario.rol === 'admin') {
        Swal.fire({
            icon: 'success',
            title: 'Bienvenido de nuevo!',
            text: 'Has iniciado sesión con Google como administrador.',
            toast: true,
            position: 'top-end',
            timer: 3000
        });
    }else{
        Swal.fire({
            icon: 'success',
            title: 'Bienvenido de nuevo!',
            text: 'Has iniciado sesión con Google.',
            toast: true,
            position: 'top-end',
            timer: 3000
        });
    }


}
// Función para verificar autenticación de Google al cargar la página
function verificarParametrosGoogle() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('google_login') === 'success') {
        // Eliminar el parámetro de la URL inmediatamente
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        // Verificar autenticación con un pequeño delay para evitar conflictos
        setTimeout(() => {
            verificarAutenticacionGoogle();
        }, 200);
    }
}
// Función para inicializar el botón de Google OAuth
function inicializarBotonGoogle() {
    const botonGoogle = document.getElementById('googleSignInBtn');
    if (botonGoogle) {
        botonGoogle.addEventListener('click', iniciarSesionGoogle);
    }
}
// Inicializar verificación de Google y eventos al cargar la página
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Dar tiempo para que se cargue completamente la página antes de ejecutar
        setTimeout(() => {
            verificarParametrosGoogle();
            inicializarBotonGoogle();
        }, 100);
    });
}
