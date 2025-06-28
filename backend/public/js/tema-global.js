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
    
    // Limpiar claves obsoletas al iniciar
    limpiarClavesObsoletas();
    
    // Limpiar claves obsoletas antes de aplicar el tema
    limpiarClavesObsoletas();
    
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
        document.addEventListener('DOMContentLoaded', aplicarTemaInmediato);
    }
    
})();
