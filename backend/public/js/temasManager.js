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
                this.mostrarIndicadorTema();
            });
        } else {
            this.configurarEventListenersTemas();
            this.mostrarIndicadorTema();
        }
    }

    aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        this.temaActual = tema;
        localStorage.setItem('tema', tema);
        
        // Actualizar indicador si ya existe
        this.actualizarIndicadorTema();
    }

    mostrarIndicadorTema() {
        // Crear indicador de tema si no existe
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

        const temaIconos = {
            'light': '🌞',
            'dark': '🌙',
            'blue': '🌊',
            'green': '🌿'
        };
        
        indicador.textContent = `${temaIconos[this.temaActual] || '🎨'} ${this.temaActual.charAt(0).toUpperCase() + this.temaActual.slice(1)}`;
        
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
            temaSelect.value = this.temaActual;
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
