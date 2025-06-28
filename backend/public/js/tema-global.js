/**
 * TEMA GLOBAL - Script ligero para aplicar temas guardados en todas las páginas
 * Este archivo debe incluirse en el <head> de todas las páginas HTML
 * Se ejecuta inmediatamente para aplicar el tema antes de que se renderice la página
 */

(function() {
    'use strict';
    
    /**
     * Limpia claves obsoletas de localStorage
     */
    function limpiarClavesObsoletas() {
        try {
            // Remover la clave antigua 'tema' que podía causar conflictos
            if (localStorage.getItem('tema')) {
                localStorage.removeItem('tema');
            }
            
            // Remover la clave antigua 'temaSeleccionado' y migrar a 'temaSeleccionadoId'
            if (localStorage.getItem('temaSeleccionado') && !localStorage.getItem('temaSeleccionadoId')) {
                const temaIdAntiguo = localStorage.getItem('temaSeleccionado');
                localStorage.setItem('temaSeleccionadoId', temaIdAntiguo);
                localStorage.removeItem('temaSeleccionado');
            } else if (localStorage.getItem('temaSeleccionado')) {
                localStorage.removeItem('temaSeleccionado');
            }
        } catch (error) {
            console.warn('[TemaGlobal] Error al limpiar claves obsoletas:', error);
        }
    }
    
    /**
     * Aplica los colores guardados en localStorage inmediatamente
     */
    function aplicarTemaInmediato() {
        try {
            const coloresGuardados = localStorage.getItem('coloresTema');
            
            if (coloresGuardados) {
                const colores = JSON.parse(coloresGuardados);
                const root = document.documentElement;
                
                // Mapeo de nombres de la base de datos a variables CSS
                const mapeoVariables = {
                    bgPrimary: 'bg-primary',
                    bgSecondary: 'bg-secondary',
                    bgTertiary: 'bg-tertiary',
                    textPrimary: 'text-primary',
                    textSecondary: 'text-secondary',
                    textAccent: 'text-accent',
                    borderPrimary: 'border-primary',
                    borderSecondary: 'border-secondary',
                    shadowLight: 'shadow-light',
                    shadowMedium: 'shadow-medium',
                    success: 'success',
                    warning: 'warning',
                    error: 'error',
                    info: 'info',
                    modalBg: 'modal-bg',
                    hoverOverlay: 'hover-overlay'
                };
                
                // Aplicar cada color guardado
                Object.entries(colores).forEach(([clave, valor]) => {
                    const cssVar = mapeoVariables[clave] || clave.replace(/([A-Z])/g, '-$1').toLowerCase();
                    const propiedadCSS = '--' + cssVar;
                    
                    root.style.setProperty(propiedadCSS, valor);
                });
                
                const nombreTema = localStorage.getItem('nombreTemaSeleccionado');
                
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Crear indicador visual del tema actual - DESHABILITADO
     * (Comentado para evitar conflictos visuales)
     */
    function mostrarIndicadorTema() {
        // Función deshabilitada - los cambios se manejan desde preferencias
        return;
    }
    
    /**
     * Inicializa tema por defecto si localStorage está vacío
     */
    async function inicializarTemaDefecto() {
        try {
            const temaGuardado = localStorage.getItem('nombreTemaSeleccionado');
            const temaIdGuardado = localStorage.getItem('temaSeleccionadoId');
            
            // Si no hay tema guardado, cargar el tema "Claro" por defecto
            if (!temaGuardado && !temaIdGuardado) {
                try {
                    const response = await fetch('/api/temas');
                    if (response.ok) {
                        const temas = await response.json();
                        const temaClaro = temas.find(tema => 
                            tema.nombre.toLowerCase() === 'claro' || 
                            tema.nombre.toLowerCase() === 'light'
                        );
                        
                        if (temaClaro) {
                            localStorage.setItem('temaSeleccionadoId', temaClaro._id);
                            localStorage.setItem('nombreTemaSeleccionado', temaClaro.nombre);
                            localStorage.setItem('coloresTema', JSON.stringify(temaClaro.colores));
                            localStorage.setItem('iconicoTema', temaClaro.icono || '🌞');
                            
                            // Aplicar el tema inmediatamente
                            aplicarTemaInmediato();
                        }
                    }
                } catch (error) {
                    console.warn('[TemaGlobal] No se pudo cargar tema por defecto:', error);
                }
            }
        } catch (error) {
            console.warn('[TemaGlobal] Error al inicializar tema por defecto:', error);
        }
    }
    
    // Limpiar claves obsoletas al iniciar
    limpiarClavesObsoletas();
    
    // Limpiar claves obsoletas antes de aplicar el tema
    limpiarClavesObsoletas();
    
    // Inicializar tema por defecto si es necesario
    inicializarTemaDefecto();
    
    // Aplicar tema inmediatamente
    aplicarTemaInmediato();
    
    // Indicador deshabilitado para evitar conflictos
    // mostrarIndicadorTema();
    
    // Exponer función globalmente para uso en otras páginas
    window.aplicarTemaGuardado = aplicarTemaInmediato;
    window.aplicarTemaInmediato = aplicarTemaInmediato;
    
    // Escuchar cambios en localStorage para aplicar automáticamente
    window.addEventListener('storage', function(e) {
        if (e.key === 'coloresTema' || e.key === 'nombreTemaSeleccionado' || e.key === 'temaSeleccionadoId') {
            aplicarTemaInmediato();
        }
    });
    
    // Aplicar tema cuando el DOM esté listo (por si localStorage cambia)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await inicializarTemaDefecto();
            aplicarTemaInmediato();
        });
    } else {
        // Si el DOM ya está listo, ejecutar inmediatamente
        inicializarTemaDefecto().then(() => aplicarTemaInmediato());
    }
    
})();
