// ===== EJEMPLO DE MEJORA PARA THEME INDICATOR CON NOMBRES REALES =====

// Si quieres mantener el indicador pero con nombres reales, puedes usar este código:

class TemasManagerMejorado {
    constructor() {
        this.temaActual = localStorage.getItem('tema') || 'light';
        this.temas = {}; // Cache de temas desde la API
        this.init();
    }

    async cargarTemasDesdeAPI() {
        try {
            const response = await fetch('/api/temas');
            const temas = await response.json();
            
            // Crear un mapa de ID a nombre de tema
            this.temas = {};
            temas.forEach(tema => {
                this.temas[tema._id] = {
                    nombre: tema.nombre,
                    icono: tema.icono || '🎨'
                };
            });

            // También obtener el tema activo actual
            const responseActivo = await fetch('/api/tema-activo');
            const temaActivo = await responseActivo.json();
            
            if (temaActivo && temaActivo._id) {
                this.temaActual = temaActivo._id;
                this.temaActivoNombre = temaActivo.nombre;
                this.temaActivoIcono = temaActivo.icono || '🎨';
            }
        } catch (error) {
            console.warn('Error al cargar temas desde API, usando fallback:', error);
            // Fallback a temas predeterminados
            this.temas = {
                'light': { nombre: 'Claro', icono: '🌞' },
                'dark': { nombre: 'Oscuro', icono: '🌙' },
                'blue': { nombre: 'Azul', icono: '🌊' },
                'green': { nombre: 'Verde', icono: '🌿' }
            };
        }
    }

    async init() {
        // Cargar temas desde la API
        await this.cargarTemasDesdeAPI();
        
        // Aplicar tema inicial
        this.aplicarTema(this.temaActual);
        
        // Configurar event listeners cuando el DOM esté listo
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

    actualizarIndicadorTema() {
        const indicador = document.getElementById('theme-indicator');
        if (!indicador) return;

        // Usar el nombre real del tema en lugar del ID
        let nombreTema = 'Tema Desconocido';
        let iconoTema = '🎨';
        
        if (this.temaActivoNombre && this.temaActivoIcono) {
            // Si tenemos info del tema activo desde la API
            nombreTema = this.temaActivoNombre;
            iconoTema = this.temaActivoIcono;
        } else if (this.temas[this.temaActual]) {
            // Si tenemos info del tema en nuestro cache
            nombreTema = this.temas[this.temaActual].nombre;
            iconoTema = this.temas[this.temaActual].icono;
        } else {
            // Fallback para temas hardcodeados
            const temasDefault = {
                'light': { nombre: 'Claro', icono: '🌞' },
                'dark': { nombre: 'Oscuro', icono: '🌙' },
                'blue': { nombre: 'Azul', icono: '🌊' },
                'green': { nombre: 'Verde', icono: '🌿' }
            };
            
            if (temasDefault[this.temaActual]) {
                nombreTema = temasDefault[this.temaActual].nombre;
                iconoTema = temasDefault[this.temaActual].icono;
            }
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

    // ... resto del código igual ...
}

// Para usar esta versión mejorada, simplemente reemplaza:
// const temasManager = new TemasManager();
// por:
// const temasManager = new TemasManagerMejorado();
