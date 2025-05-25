// Script para restablecer contraseña usando el token de la URL

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formRestablecer');
    const mensaje = document.getElementById('mensaje');
    // Obtener token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

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
            mensaje.textContent = 'Las contraseñas no coinciden.';
            return;
        }
        if (!token) {
            mensaje.textContent = 'Token inválido o expirado.';
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
                mensaje.style.color = 'green';
                mensaje.textContent = 'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.';
                form.reset();
            } else {
                mensaje.textContent = data.error || 'Error al restablecer la contraseña.';
            }
        } catch (err) {
            mensaje.textContent = 'Error de red o servidor.';
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