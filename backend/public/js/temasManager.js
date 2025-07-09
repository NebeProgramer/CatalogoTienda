// ===== GESTIÓN DE TEMAS DINÁMICOS =====
class TemasManager {
    constructor() {
        this.temaActual = localStorage.getItem('nombreTemaSeleccionado') || 'light';
        this.init();
    }

    init() {
        // Aplicar tema inicial
        this.aplicarTema(this.temaActual);
    }

    aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        this.temaActual = tema;
        localStorage.setItem('nombreTemaSeleccionado', tema);
        
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
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
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
            const temaGuardadoId = localStorage.getItem('temaSeleccionadoId');
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
