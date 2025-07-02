// Script para verificación de cuenta y restablecimiento de contraseña

document.addEventListener('DOMContentLoaded', async function() {
    // Variables globales
    let currentTab = 'verificar';
    
    // Función para cambiar pestañas
    function showTab(tab) {
        // Actualizar botones
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
        
        // Mostrar/ocultar secciones
        document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
        document.getElementById(tab + '-section').classList.add('active');
        
        currentTab = tab;
        
        // Cambiar título de la página y header dinámicamente
        const pageTitle = document.querySelector('title');
        const headerTitle = document.getElementById('page-title');
        
        if (tab === 'verificar') {
            pageTitle.textContent = 'PawMarket - Verificar Cuenta';
            headerTitle.textContent = 'PawMarket - Verificar Cuenta';
        } else if (tab === 'restablecer') {
            pageTitle.textContent = 'PawMarket - Restablecer Contraseña';
            headerTitle.textContent = 'PawMarket - Restablecer Contraseña';
        }
        
        // Limpiar mensajes
        const mensajeVerificar = document.getElementById('mensaje-verificar');
        const mensajeRestablecer = document.getElementById('mensaje-restablecer');
        if (mensajeVerificar) mensajeVerificar.style.display = 'none';
        if (mensajeRestablecer) mensajeRestablecer.style.display = 'none';
    }
    
    // Hacer la función global para que funcione con onclick
    window.showTab = showTab;

    // Detectar si estamos en modo verificación o restablecimiento
    const urlPathParts = window.location.pathname.split('/');
    const urlToken = urlPathParts[urlPathParts.length - 1];
    
    // Si hay un token en la URL, mostrar formulario de restablecer
    if (window.location.pathname.includes('/restablecer-contrasena/') && 
        urlToken && urlToken !== 'restablecer-contrasena') {
        showTab('restablecer');
    }
    // Si la URL es /verificar-cuenta/, mostrar formulario de verificar
    else if (window.location.pathname.includes('/verificar-cuenta/')) {
        showTab('verificar');
    }
    // Por defecto, mostrar verificar (ya está activo en el HTML, solo actualizamos título)
    else {
        showTab('verificar');
    }

    // ===== FUNCIONALIDAD DE VERIFICACIÓN =====
    
    // Formulario de verificación
    const formVerificar = document.getElementById('formVerificar');
    if (formVerificar) {
        formVerificar.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const correo = document.getElementById('correoVerificar').value;
            const codigo = document.getElementById('codigoVerificacion').value;
            const mensajeDiv = document.getElementById('mensaje-verificar');
            
            if (!correo || !codigo) {
                mensajeDiv.textContent = 'Por favor completa todos los campos.';
                mensajeDiv.style.display = 'block';
                return;
            }
            
            if (codigo.length !== 6 || !/^\d{6}$/.test(codigo)) {
                mensajeDiv.textContent = 'El código debe tener exactamente 6 dígitos.';
                mensajeDiv.style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('/api/verificar-codigo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo, codigo })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Cuenta verificada!',
                        text: data.message,
                        confirmButtonColor: '#e6a300'
                    }).then(() => {
                        window.location.href = '/';
                    });
                } else {
                    mensajeDiv.textContent = data.error;
                    mensajeDiv.style.display = 'block';
                }
            } catch (error) {
                mensajeDiv.textContent = 'Error de conexión. Inténtalo más tarde.';
                mensajeDiv.style.display = 'block';
            }
        });
    }

    // Función para reenviar código
    window.reenviarCodigo = async function() {
        const correo = document.getElementById('correoVerificar').value;
        
        if (!correo) {
            Swal.fire({
                icon: 'warning',
                title: 'Correo requerido',
                text: 'Por favor ingresa tu correo electrónico primero.',
                confirmButtonColor: '#e6a300'
            });
            return;
        }
        
        try {
            const response = await fetch('/api/reenviar-verificacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Código reenviado',
                    text: data.message,
                    confirmButtonColor: '#e6a300'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error,
                    confirmButtonColor: '#e6a300'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión. Inténtalo más tarde.',
                confirmButtonColor: '#e6a300'
            });
        }
    };

    // Solo autocompletar código si es numérico
    const codigoInput = document.getElementById('codigoVerificacion');
    if (codigoInput) {
        codigoInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // ===== FUNCIONALIDAD DE RESTABLECIMIENTO =====

    const form = document.getElementById('formRestablecer');
    const mensaje = document.getElementById('mensaje-restablecer');
    
    // Solo validar token si estamos en una URL de restablecimiento con token
    if (window.location.pathname.includes('/restablecer-contrasena/') && 
        urlToken && urlToken !== 'restablecer-contrasena') {
        
        try {
            const resp = await fetch(`/api/usuarios/token/${urlToken}`);
            const data = await resp.json();
            if (!resp.ok || !data.usuario) {
                Swal.fire({
                    title: 'Error',
                    text: 'El enlace de recuperación ya fue utilizado o ha expirado.',
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
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        mensaje.textContent = '';
        
        const nuevaContrasena = document.getElementById('nuevaContrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;
        
        if (!nuevaContrasena || !confirmarContrasena) {
            mensaje.textContent = 'Completa ambos campos.';
            mensaje.style.display = 'block';
            return;
        }
        
        if (nuevaContrasena !== confirmarContrasena) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                icon: 'error',
                confirmButtonColor: '#e6a300'
            });
            return;
        }
        
        // Validar requisitos antes de enviar
        if (!validarRequisitos(nuevaContrasena)) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña no cumple con los requisitos de seguridad.',
                icon: 'error',
                confirmButtonColor: '#e6a300'
            });
            return;
        }
        
        // Obtener token de la URL
        const resetPathParts = window.location.pathname.split('/');
        const resetToken = resetPathParts[resetPathParts.length - 1];
        
        if (!resetToken || resetToken === 'restablecer-contrasena') {
            Swal.fire({
                title: 'Error',
                text: 'Token no válido. Por favor, utiliza el enlace del correo.',
                icon: 'error',
                confirmButtonColor: '#e6a300'
            });
            return;
        }
        
        try {
            const resp = await fetch('/api/restablecer-contrasena', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken, nuevaContrasena })
            });
            
            const data = await resp.json();
            
            if (resp.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Contraseña restablecida correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#e6a300'
                }).then(() => {
                    window.location.href = '/'; // Redirigir al login
                });
                form.reset();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.error || 'Error al restablecer la contraseña.',
                    icon: 'error',
                    confirmButtonColor: '#e6a300'
                });
            }
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Error de red o servidor.',
                icon: 'error',
                confirmButtonColor: '#e6a300'
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
            reqLength.classList.add('valid');
            reqLength.classList.remove('invalid');
            validos++;
        } else {
            reqLength.classList.add('invalid');
            reqLength.classList.remove('valid');
        }
        
        // Mayúscula
        if (/[A-Z]/.test(password)) {
            reqMayus.classList.add('valid');
            reqMayus.classList.remove('invalid');
            validos++;
        } else {
            reqMayus.classList.add('invalid');
            reqMayus.classList.remove('valid');
        }
        
        // Minúscula
        if (/[a-z]/.test(password)) {
            reqMinus.classList.add('valid');
            reqMinus.classList.remove('invalid');
            validos++;
        } else {
            reqMinus.classList.add('invalid');
            reqMinus.classList.remove('valid');
        }
        
        // Número
        if (/\d/.test(password)) {
            reqNum.classList.add('valid');
            reqNum.classList.remove('invalid');
            validos++;
        } else {
            reqNum.classList.add('invalid');
            reqNum.classList.remove('valid');
        }
        
        // Especial
        if (/[^A-Za-z0-9]/.test(password)) {
            reqEspecial.classList.add('valid');
            reqEspecial.classList.remove('invalid');
            validos++;
        } else {
            reqEspecial.classList.add('invalid');
            reqEspecial.classList.remove('valid');
        }
        
        return validos === 5;
    }

    function validarCoincidencia() {
        if (nuevaContrasenaInput.value && confirmarContrasenaInput.value) {
            if (nuevaContrasenaInput.value === confirmarContrasenaInput.value) {
                confirmarContrasenaInput.style.borderColor = 'var(--color-success)';
                matchMsg.textContent = 'Las contraseñas coinciden';
                matchMsg.className = 'success-message';
            } else {
                confirmarContrasenaInput.style.borderColor = 'var(--color-error)';
                matchMsg.textContent = 'Las contraseñas no coinciden';
                matchMsg.className = 'error-message';
            }
        } else {
            confirmarContrasenaInput.style.borderColor = '';
            matchMsg.textContent = '';
            matchMsg.className = '';
        }
    }

    nuevaContrasenaInput.addEventListener('input', function() {
        validarRequisitos(nuevaContrasenaInput.value);
    });
    confirmarContrasenaInput.addEventListener('input', validarCoincidencia);

    validarRequisitos('');
});