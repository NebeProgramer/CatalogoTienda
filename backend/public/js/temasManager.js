// ===== GESTIÓN DE TEMAS DINÁMICOS =====
class TemasManager {
    constructor() {
        this.temaActual = localStorage.getItem('tema') || 'light';
        this.init();
    }

    init() {
        // Aplicar tema inicial
        this.aplicarTema(this.temaActual);
        
        // Configurar event listeners para temas cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.configurarEventListenersTemas();
                this.inicializarIndicadorTema();
            });
        } else {
            this.configurarEventListenersTemas();
            this.inicializarIndicadorTema();
        }
    }
    
    inicializarIndicadorTema() {
        // Verificar si el usuario ha optado por ocultar el indicador
        const indicadorOculto = localStorage.getItem('indicadorTemaOculto') === 'true';
        
        if (!indicadorOculto) {
            this.crearIndicadorTema();
        }
    }

    aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        this.temaActual = tema;
        localStorage.setItem('tema', tema);
        
        // Actualizar indicador si ya existe
        this.actualizarIndicadorTema();
    }

    // Función para ocultar el indicador de tema
    ocultarIndicadorTema() {
        const indicador = document.getElementById('theme-indicator');
        if (indicador) {
            indicador.style.display = 'none';
        }
    }
    
    // Función para mostrar el indicador de tema
    mostrarIndicadorTema() {
        const indicador = document.getElementById('theme-indicator');
        if (indicador) {
            indicador.style.display = 'block';
        } else {
            this.crearIndicadorTema();
        }
    }
    
    // Función para crear el indicador si no existe
    crearIndicadorTema() {
        let indicador = document.getElementById('theme-indicator');
        if (!indicador) {
            indicador = document.createElement('div');
            indicador.id = 'theme-indicator';
            indicador.className = 'theme-indicator';
            document.body.appendChild(indicador);
        }
        
        this.actualizarIndicadorTema();
    }

    actualizarIndicadorTema() {
        const indicador = document.getElementById('theme-indicator');
        if (!indicador) return;

        // Primero intentar obtener el tema dinámico actual
        let nombreTema = '';
        let iconoTema = '🎨';
        
        if (typeof window.obtenerTemaActual === 'function') {
            const temaActual = window.obtenerTemaActual();
            if (temaActual && temaActual.nombre) {
                nombreTema = temaActual.nombre;
                iconoTema = temaActual.icono || '🎨';
            }
        }
        
        // Si no hay tema dinámico, usar los temas estáticos como fallback
        if (!nombreTema) {
            const temaIconos = {
                'light': '🌞',
                'dark': '🌙',
                'blue': '🌊',
                'green': '🌿'
            };
            
            iconoTema = temaIconos[this.temaActual] || '🎨';
            nombreTema = this.temaActual.charAt(0).toUpperCase() + this.temaActual.slice(1);
        }
        
        indicador.textContent = `${iconoTema} ${nombreTema}`;
        
        // Hacer clickeable el indicador para abrir preferencias
        indicador.style.cursor = 'pointer';
        indicador.onclick = () => {
            const btnPreferencias = document.getElementById('btnPreferencias');
            if (btnPreferencias) {
                btnPreferencias.click();
            }
        };
    }

    configurarEventListenersTemas() {
        // Event listener para cambios en tiempo real del selector de tema
        const temaSelect = document.getElementById('temaPreferido');
        if (temaSelect) {
            // Remover listener previo si existe
            temaSelect.removeEventListener('change', this.handleTemaChange);
            // Agregar nuevo listener
            this.handleTemaChange = (e) => {
                this.aplicarTema(e.target.value);
            };
            temaSelect.addEventListener('change', this.handleTemaChange);
        }        // Configurar el formulario de preferencias si existe
        const formPreferencias = document.getElementById('formPreferencias');
        if (formPreferencias) {
            formPreferencias.addEventListener('submit', (event) => {
                const temaPreferido = document.getElementById('temaPreferido').value;
                if (temaPreferido) {
                    this.aplicarTema(temaPreferido);
                }
            });
        }

        // Configurar también el formulario de tema específico de admin
        const formTema = document.getElementById('formTema');
        if (formTema) {
            formTema.addEventListener('submit', (event) => {
                event.preventDefault();
                const temaPreferido = document.getElementById('temaPreferido').value;
                if (temaPreferido) {
                    this.aplicarTema(temaPreferido);
                }
                
                // Mostrar mensaje de confirmación
                if (window.Swal) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Preferencias guardadas',
                        text: 'El tema se ha aplicado correctamente.',
                        toast: true,
                        position: 'top-end'
                    });
                }
            });
        }// Configurar el botón de preferencias si existe
        const btnPreferencias = document.getElementById('btnPreferencias');
        if (btnPreferencias) {
            btnPreferencias.addEventListener('click', () => {
                // Buscar modales tanto para páginas normales como admin
                const modalNormal = document.getElementById('modal');
                const modalAdmin = document.getElementById('modal-preferencias');
                
                if (modalNormal) {
                    modalNormal.style.display = 'flex';
                    const formPreferencias = document.getElementById('form-preferencias');
                    if (formPreferencias) {
                        formPreferencias.style.display = 'block';
                    }
                } else if (modalAdmin) {
                    modalAdmin.style.display = 'block';
                }
                
                // Pequeño delay para asegurar que el modal se haya cargado
                setTimeout(() => {
                    this.establecerTemaEnSelector();
                }, 100);
            });
        }
    }

    establecerTemaEnSelector() {
        const temaSelect = document.getElementById('temaPreferido');
        if (temaSelect) {
            // Primero intentar con el ID del tema guardado directamente
            const temaGuardadoId = localStorage.getItem('temaSeleccionado');
            if (temaGuardadoId && temaSelect.querySelector(`option[value="${temaGuardadoId}"]`)) {
                temaSelect.value = temaGuardadoId;
                return;
            }
            
            // Intentar usar la función global para obtener el tema actual
            if (typeof window.obtenerTemaActual === 'function') {
                const temaActual = window.obtenerTemaActual();
                if (temaActual && temaActual.id && temaSelect.querySelector(`option[value="${temaActual.id}"]`)) {
                    temaSelect.value = temaActual.id;
                    return;
                }
            }
            
            // Fallback al tema tradicional
            if (temaSelect.querySelector(`option[value="${this.temaActual}"]`)) {
                temaSelect.value = this.temaActual;
            }
        }
    }

    getTema() {
        return this.temaActual;
    }
}

// Inicializar el gestor de temas globalmente
window.temasManager = new TemasManager();

// Exponer la clase globalmente por si se necesita crear instancias adicionales
window.TemasManager = TemasManager;

// Funciones globales para controlar el indicador de tema
window.ocultarIndicadorTema = function() {
    if (window.temasManager && typeof window.temasManager.ocultarIndicadorTema === 'function') {
        window.temasManager.ocultarIndicadorTema();
        localStorage.setItem('indicadorTemaOculto', 'true');
    }
};

window.mostrarIndicadorTema = function() {
    if (window.temasManager && typeof window.temasManager.mostrarIndicadorTema === 'function') {
        window.temasManager.mostrarIndicadorTema();
        localStorage.removeItem('indicadorTemaOculto');
    }
};

window.toggleIndicadorTema = function() {
    const indicador = document.getElementById('theme-indicator');
    const estaOculto = !indicador || indicador.style.display === 'none';
    
    if (estaOculto) {
        window.mostrarIndicadorTema();
    } else {
        window.ocultarIndicadorTema();
    }
};
