// ===== CONFIGURACIÓN AUTOMÁTICA DE SWEETALERT2 PARA TEMAS DINÁMICOS =====
/**
 * Script que configura automáticamente SweetAlert2 para seguir el tema actual
 * Se debe incluir en todas las páginas donde se use SweetAlert2
 */

(function() {
    'use strict';

    /**
     * Configura SweetAlert2 con los estilos del tema actual
     */
    function configurarSweetAlert2() {
        // Verificar si SweetAlert2 está disponible
        if (typeof Swal === 'undefined') {
            console.warn('⚠️ SweetAlert2 no está disponible. Asegúrate de incluir la librería.');
            return;
        }

        // Configuración base para todos los SweetAlert
        const configuracionBase = {
            customClass: {
                popup: 'swal2-tema-dinamico',
                title: 'swal2-title-tema',
                htmlContainer: 'swal2-html-tema',
                confirmButton: 'swal2-confirm-tema',
                cancelButton: 'swal2-cancel-tema',
                denyButton: 'swal2-deny-tema'
            },
            buttonsStyling: false, // Usar nuestros estilos CSS
            reverseButtons: true,  // Botón cancelar a la izquierda
            allowOutsideClick: false,
            allowEscapeKey: true,
            heightAuto: false,
            backdrop: true
        };

        // Crear mixins globales para diferentes tipos de alertas
        
        // Mixin para toast notifications
        window.SwalToast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            width: '350px',
            padding: '1rem',
            customClass: {
                popup: 'swal2-tema-dinamico swal2-toast',
                title: 'swal2-title-tema',
                htmlContainer: 'swal2-html-tema'
            },
            buttonsStyling: false,
            backdrop: false,
            allowOutsideClick: true,
            allowEscapeKey: true,
            showClass: {
                popup: 'swal2-show swal2-toast-show'
            },
            hideClass: {
                popup: 'swal2-hide swal2-toast-hide'
            },
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        // Mixin para modales de confirmación
        window.SwalConfirm = Swal.mixin({
            ...configuracionBase,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            focusCancel: false
        });

        // Mixin para alertas simples
        window.SwalAlert = Swal.mixin({
            ...configuracionBase,
            confirmButtonText: 'Entendido'
        });

        // Mixin para alertas de éxito
        window.SwalSuccess = Swal.mixin({
            ...configuracionBase,
            icon: 'success',
            confirmButtonText: 'Continuar'
        });

        // Mixin para alertas de error
        window.SwalError = Swal.mixin({
            ...configuracionBase,
            icon: 'error',
            confirmButtonText: 'Entendido'
        });

        // Mixin para alertas de advertencia
        window.SwalWarning = Swal.mixin({
            ...configuracionBase,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar'
        });

        console.log('✅ SweetAlert2 configurado con tema dinámico');
    }

    /**
     * Inicializa la configuración cuando el DOM esté listo
     */
    function inicializar() {
        // Configurar SweetAlert2 inicialmente
        configurarSweetAlert2();

        // Reconfigurar cuando se aplique un nuevo tema
        document.addEventListener('temaAplicado', () => {
            setTimeout(() => configurarSweetAlert2(), 100);
        });

        // Reconfigurar cuando se actualice un tema
        document.addEventListener('temaActualizado', () => {
            setTimeout(() => configurarSweetAlert2(), 100);
        });

        // Reconfigurar cuando el sistema de temas dinámicos esté listo
        document.addEventListener('temaDinamicoListo', () => {
            setTimeout(() => configurarSweetAlert2(), 100);
        });
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

    // También ejecutar cuando se carga la ventana (por si SweetAlert2 se carga después)
    window.addEventListener('load', () => {
        setTimeout(() => configurarSweetAlert2(), 500);
    });

})();

// ===== FUNCIONES DE UTILIDAD PARA SWEETALERT2 =====

/**
 * Muestra una notificación toast con el tema actual
 * @param {string} tipo - Tipo de notificación: 'success', 'error', 'warning', 'info'
 * @param {string} titulo - Título de la notificación
 * @param {string} texto - Texto de la notificación (opcional)
 */
window.mostrarToast = function(tipo, titulo, texto = '') {
    if (typeof Swal === 'undefined') {
        console.warn('SweetAlert2 no está disponible');
        return;
    }
    
    // Usar configuración específica para toast
    Swal.fire({
        icon: tipo,
        title: titulo,
        text: texto,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '350px',
        padding: '1rem',
        customClass: {
            popup: 'swal2-tema-dinamico swal2-toast',
            title: 'swal2-title-tema',
            htmlContainer: 'swal2-html-tema'
        },
        buttonsStyling: false,
        backdrop: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
        showClass: {
            popup: 'swal2-show swal2-toast-show'
        },
        hideClass: {
            popup: 'swal2-hide swal2-toast-hide'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
};

/**
 * Muestra un modal de confirmación con el tema actual
 * @param {string} titulo - Título del modal
 * @param {string} texto - Texto del modal
 * @param {string} textoConfirmar - Texto del botón confirmar (opcional)
 * @param {string} textoCancelar - Texto del botón cancelar (opcional)
 * @returns {Promise} Promise que resuelve con el resultado
 */
window.mostrarConfirmacion = function(titulo, texto, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar') {
    const swalConfirm = window.SwalConfirm || Swal;
    return swalConfirm.fire({
        title: titulo,
        text: texto,
        confirmButtonText: textoConfirmar,
        cancelButtonText: textoCancelar
    });
};

/**
 * Muestra una alerta simple con el tema actual
 * @param {string} tipo - Tipo de alerta: 'success', 'error', 'warning', 'info'
 * @param {string} titulo - Título de la alerta
 * @param {string} texto - Texto de la alerta
 * @returns {Promise} Promise que resuelve cuando se cierra la alerta
 */
window.mostrarAlerta = function(tipo, titulo, texto) {
    const swalAlert = window.SwalAlert || Swal;
    return swalAlert.fire({
        icon: tipo,
        title: titulo,
        text: texto
    });
};

/**
 * Función específica para mostrar notificación de tema aplicado
 * @param {Object} tema - Objeto del tema aplicado
 */
window.mostrarNotificacionTema = function(tema) {
    if (typeof Swal === 'undefined') {
        console.warn('SweetAlert2 no está disponible');
        return;
    }
    
    // Preparar el título y contenido
    const tituloTema = tema.nombre || 'Tema aplicado';
    const iconoTema = tema.icono || '🎨';
    
    Swal.fire({
        // Quitar el icono predeterminado que se ve mal
        icon: undefined,
        iconHtml: `<div style="
            width: 40px; 
            height: 40px; 
            background: var(--success); 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 20px;
            color: white;
        ">✓</div>`,
        title: `${iconoTema} ${tituloTema}`,
        text: 'Tema aplicado correctamente',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '380px',
        padding: '1rem',
        customClass: {
            popup: 'swal2-tema-dinamico swal2-toast',
            title: 'swal2-title-tema',
            htmlContainer: 'swal2-html-tema',
            icon: 'swal2-icon-custom'
        },
        buttonsStyling: false,
        backdrop: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
        showClass: {
            popup: 'swal2-show swal2-toast-show'
        },
        hideClass: {
            popup: 'swal2-hide swal2-toast-hide'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
};

/**
 * Versión alternativa simple para mostrar notificación de tema (sin icono predeterminado)
 * @param {Object} tema - Objeto del tema aplicado
 */
window.mostrarNotificacionTemaSimple = function(tema) {
    if (typeof Swal === 'undefined') {
        console.warn('SweetAlert2 no está disponible');
        return;
    }
    
    const tituloTema = tema.nombre || 'Tema aplicado';
    const iconoTema = tema.icono || '🎨';
    
    Swal.fire({
        // Sin icono predeterminado
        title: `${iconoTema} ${tituloTema}`,
        text: 'Tema aplicado correctamente',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '350px',
        padding: '1rem',
        customClass: {
            popup: 'swal2-tema-dinamico swal2-toast swal2-no-icon',
            title: 'swal2-title-tema',
            htmlContainer: 'swal2-html-tema'
        },
        buttonsStyling: false,
        backdrop: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
        showClass: {
            popup: 'swal2-show swal2-toast-show'
        },
        hideClass: {
            popup: 'swal2-hide swal2-toast-hide'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
};
