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
    }
}

