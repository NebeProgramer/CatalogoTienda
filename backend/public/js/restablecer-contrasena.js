// Script para restablecer contraseña usando el token de la URL

const { default: Swal } = require("sweetalert2");

document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('formRestablecer');
    const mensaje = document.getElementById('mensaje');
    // Obtener token de la URL
    const token = window.location.pathname.split('/').pop();

    // Verificar si el token existe en algún usuario
    if (!token) {
        Swal.fire({
            title: 'Error',
            text: 'Token no válido o no proporcionado.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = '/';
        });
        return;
    }
    try {
        const resp = await fetch(`/api/usuarios/token/${token}`);
        const data = await resp.json();
        if (!resp.ok || !data.usuario) {
            Swal.fire({
                title: 'Error',
                text: 'El enlace de recuperación no es válido o ya fue utilizado.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = '/';
            });
            return;
        }
    } catch (err) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo verificar el enlace de recuperación.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = '/';
        });
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        mensaje.textContent = '';
        const nuevaContrasena = document.getElementById('nuevaContrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;
        if (!nuevaContrasena || !confirmarContrasena) {
            mensaje.textContent = 'Completa ambos campos.';
            return;
        }
        if (nuevaContrasena !== confirmarContrasena) {
            swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        if (!token) {
            Swal.fire({
                title: 'Error',
                text: 'Token no válido o no proporcionado.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        try {
            const resp = await fetch('/api/restablecer-contrasena', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, nuevaContrasena })
            });
            const data = await resp.json();
            if (resp.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Contraseña restablecida correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = '/login'; // Redirigir al login
                });
                form.reset();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error || 'Error al restablecer la contraseña.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Error de red o servidor.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });

    // Elementos de requisitos y coincidencia
    const nuevaContrasenaInput = document.getElementById('nuevaContrasena');
    const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
    const reqLength = document.getElementById('req-length');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEspecial = document.getElementById('req-especial');
    const matchMsg = document.getElementById('match-msg');

    function validarRequisitos(password) {
        let validos = 0;
        // Longitud
        if (password.length >= 8) {
            reqLength.style.color = 'green'; validos++;
        } else reqLength.style.color = 'red';
        // Mayúscula
        if (/[A-Z]/.test(password)) {
            reqMayus.style.color = 'green'; validos++;
        } else reqMayus.style.color = 'red';
        // Minúscula
        if (/[a-z]/.test(password)) {
            reqMinus.style.color = 'green'; validos++;
        } else reqMinus.style.color = 'red';
        // Número
        if (/\d/.test(password)) {
            reqNum.style.color = 'green'; validos++;
        } else reqNum.style.color = 'red';
        // Especial
        if (/[^A-Za-z0-9]/.test(password)) {
            reqEspecial.style.color = 'green'; validos++;
        } else reqEspecial.style.color = 'red';
        return validos === 5;
    }

    function validarCoincidencia() {
        if (nuevaContrasenaInput.value && confirmarContrasenaInput.value) {
            if (nuevaContrasenaInput.value === confirmarContrasenaInput.value) {
                confirmarContrasenaInput.style.borderColor = 'green';
                matchMsg.textContent = 'Las contraseñas coinciden';
                matchMsg.style.color = 'green';
            } else {
                confirmarContrasenaInput.style.borderColor = 'red';
                matchMsg.textContent = 'Las contraseñas no coinciden';
                matchMsg.style.color = 'red';
            }
        } else {
            confirmarContrasenaInput.style.borderColor = '';
            matchMsg.textContent = '';
        }
    }

    nuevaContrasenaInput.addEventListener('input', function() {
        validarRequisitos(nuevaContrasenaInput.value);
    });
    confirmarContrasenaInput.addEventListener('input', validarCoincidencia);

    validarRequisitos('');
});