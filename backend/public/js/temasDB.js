// ===== GESTIÓN DE TEMAS DESDE BASE DE DATOS =====
class TemaDinamicoManager {
    constructor() {
        this.temasDisponibles = [];
        this.temaActivo = null;
        this.cssStyle = null;
        this.iniciado = false;
        this.init();
    }
    async init() {
        try {
            await this.cargarTemas();
            await this.aplicarTemaActivo();
            this.configurarEventListeners();
            this.iniciado = true;
        } catch (error) {
            console.error('❌ Error al inicializar temas dinámicos:', error);
            // Fallback al sistema de temas estático
            this.usarTemaEstatico();
        }
    }
    async cargarTemas() {
        try {
            const response = await fetch('/api/temas');
            if (!response.ok) {
                throw new Error('Error al cargar temas desde la base de datos');
            }
            this.temasDisponibles = await response.json();
            this.temaActivo = this.temasDisponibles.find(tema => tema.activo);
            if (!this.temaActivo && this.temasDisponibles.length > 0) {
                // Si no hay tema activo, usar el primero
                this.temaActivo = this.temasDisponibles[0];
            }
        } catch (error) {
            console.error('Error al cargar temas:', error);
            throw error;
        }
    }
    async aplicarTemaActivo() {
        if (!this.temaActivo) {
            console.warn('No hay tema activo disponible');
            return;
        }
        this.aplicarTemaAlDOM(this.temaActivo);
        // Actualizar localStorage para mantener consistencia
        localStorage.setItem('nombreTemaSeleccionado', this.temaActivo.nombre);
    }
    aplicarTemaAlDOM(tema) {
        if (!tema || !tema.colores) {
            console.warn('⚠️ Tema inválido:', tema);
            return;
        }
        // Crear o actualizar el elemento de estilo dinámico
        if (!this.cssStyle) {
            this.cssStyle = document.createElement('style');
            this.cssStyle.id = 'tema-dinamico';
            this.cssStyle.setAttribute('data-tema', tema.nombre);
            document.head.appendChild(this.cssStyle);
        }
        // Generar CSS con las variables del tema
        const cssVariables = this.generarCSSVariables(tema.colores);
        this.cssStyle.textContent = `:root { ${cssVariables} }`;
        // También aplicar atributo data-theme para compatibilidad
        document.documentElement.setAttribute('data-theme', tema.nombre.toLowerCase());
        // Actualizar localStorage para persistencia
        localStorage.setItem('nombreTemaSeleccionado', tema.nombre);
    }
    generarCSSVariables(colores) {
        const variables = [];
        // Mapeo de nombres de propiedades de la BD a variables CSS
        const mapeoVariables = {
            bgPrimary: '--bg-primary',
            bgSecondary: '--bg-secondary',
            bgTertiary: '--bg-tertiary',
            textPrimary: '--text-primary',
            textSecondary: '--text-secondary',
            textAccent: '--text-accent',
            borderPrimary: '--border-primary',
            borderSecondary: '--border-secondary',
            shadowLight: '--shadow-light',
            shadowMedium: '--shadow-medium',
            success: '--success',
            warning: '--warning',
            error: '--error',
            info: '--info',
            modalBg: '--modal-bg',
            hoverOverlay: '--hover-overlay'
        };
        for (const [propBD, varCSS] of Object.entries(mapeoVariables)) {
            if (colores[propBD]) {
                variables.push(`${varCSS}: ${colores[propBD]}`);
            }
        }
        return variables.join('; ');
    }
    usarTemaEstatico() {
        // Cargar el gestor de temas estático si existe
        if (window.TemasManager) {
            new window.TemasManager();
        } else {
            // Aplicar tema por defecto
            const temaDefecto = localStorage.getItem('nombreTemaSeleccionado') || 'light';
            document.documentElement.setAttribute('data-theme', temaDefecto.toLowerCase());
        }
    }
    configurarEventListeners() {
        // Escuchar eventos de cambio de tema desde el editor
        document.addEventListener('temaActualizado', async (event) => {
            await this.cargarTemas();
            await this.aplicarTemaActivo();
        });
        // Escuchar cambios de tema aplicado
        document.addEventListener('temaAplicado', async (event) => {
            await this.cargarTemas();
            await this.aplicarTemaActivo();
        });
    }
    // Método para obtener el tema actual
    getTemaActual() {
        return this.temaActivo;
    }
    // Método para obtener todos los temas disponibles
    getTemasDisponibles() {
        return this.temasDisponibles;
    }
    // Método para cambiar tema activo (desde el frontend)
    async cambiarTemaActivo(temaId) {
        try {
            const response = await fetch(`/api/temas/${temaId}/aplicar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al aplicar el tema');
            }
            // Recargar y aplicar el nuevo tema
            await this.cargarTemas();
            await this.aplicarTemaActivo();
            return true;
        } catch (error) {
            console.error('Error al cambiar tema activo:', error);
            return false;
        }
    }
}
// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.temaDinamicoManager = new TemaDinamicoManager();
});
// Exponer globalmente para uso desde otros scripts
window.TemaDinamicoManager = TemaDinamicoManager;
// Si el DOM ya está listo (por ejemplo, si este script se carga después)
if (document.readyState === 'loading') {
    // DOM aún se está cargando, esperar al evento
} else {
    // DOM ya está cargado
    window.temaDinamicoManager = new TemaDinamicoManager();
}
