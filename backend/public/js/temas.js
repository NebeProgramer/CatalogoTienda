// ===== GESTIÓN DE TEMAS DINÁMICOS =====
class TemasManager {
    constructor() {
        this.temaActual = localStorage.getItem('nombreTemaSeleccionado') || 'light';
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
        localStorage.setItem('nombreTemaSeleccionado', tema);
        
        // Actualizar indicador si existe
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
            temaSelect.addEventListener('change', (e) => {
                this.aplicarTema(e.target.value);
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

// Inicializar gestor de temas globalmente
window.temasManager = new TemasManager();
