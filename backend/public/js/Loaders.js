// ===== SISTEMA DE LOADERS MEJORADO Y SIMPLE =====

function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'flex';
        // Usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
            loader.classList.add('show');
        });
    }
}

function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('show');
        // Ocultar después de la transición
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
}

// ===== FUNCIONES PARA TRANSICIONES SUAVES SIMPLES =====

/**
 * Navega a una URL con efecto de loading suave
 * @param {string} url - URL de destino
 * @param {number} delay - Delay antes de navegar (opcional)
 */
function navegarSuave(url, delay = 400) {
    // Mostrar loader
    mostrarLoader();
    
    // Aplicar efecto de fade al body
    document.body.classList.add('page-loading');
    
    // Navegar después del delay
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}

/**
 * Manejo automático del loader al cargar la página
 */
function manejarCargaPagina() {
    // Mostrar loader inmediatamente si la página está cargando
    if (document.readyState === 'loading') {
        mostrarLoader();
    }
    
    // Función para ocultar loader cuando esté todo listo
    function ocultarLoaderCuandoListo() {
        // Esperar un poco para que se vea el efecto
        setTimeout(() => {
            ocultarLoader();
            document.body.classList.remove('page-loading');
        }, 200);
    }
    
    // Ocultar loader cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Esperar un poco más para que las imágenes carguen
            if (document.images.length > 0) {
                let imagenesRestantes = document.images.length;
                let tiempoMaximo = setTimeout(ocultarLoaderCuandoListo, 2000); // Máximo 2 segundos
                
                for (let img of document.images) {
                    if (img.complete) {
                        imagenesRestantes--;
                    } else {
                        img.onload = img.onerror = () => {
                            imagenesRestantes--;
                            if (imagenesRestantes === 0) {
                                clearTimeout(tiempoMaximo);
                                ocultarLoaderCuandoListo();
                            }
                        };
                    }
                }
                
                if (imagenesRestantes === 0) {
                    clearTimeout(tiempoMaximo);
                    ocultarLoaderCuandoListo();
                }
            } else {
                ocultarLoaderCuandoListo();
            }
        });
    } else {
        // Si ya está cargado, ocultar inmediatamente
        ocultarLoaderCuandoListo();
    }
}

// ===== FUNCIONES GLOBALES PARA USO EXTERNO =====

/**
 * Función global para navegación suave (disponible en window)
 */
window.irASuave = function(url, delay) {
    navegarSuave(url, delay);
};

/**
 * Funciones globales para control manual del loader
 */
window.mostrarLoaderManual = mostrarLoader;
window.ocultarLoaderManual = ocultarLoader;

// ===== INICIALIZACIÓN AUTOMÁTICA =====

// Manejar carga inicial de la página
manejarCargaPagina();

// Opcional: Añadir interceptor muy simple para enlaces (sin interferir)
document.addEventListener('click', function(e) {
    const enlace = e.target.closest('a[href]');
    
    // Solo aplicar a enlaces internos específicos con clase especial
    if (enlace && enlace.classList.contains('nav-suave')) {
        e.preventDefault();
        navegarSuave(enlace.href, 300);
    }
}, true);