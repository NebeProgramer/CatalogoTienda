// ===== EJEMPLOS DE USO: TRANSICIONES SUAVES =====

// Ejemplo 1: Añadir navegación suave a un botón existente
document.addEventListener('DOMContentLoaded', () => {
    
    // Ejemplo para botón de admin/devtools
    const btnDevTools = document.getElementById('btnCrear');
    if (btnDevTools) {
        // El botón ya está configurado en script.js para usar window.irASuave
        console.log('✅ Botón DevTools configurado con navegación suave');
    }
    
    // Ejemplo 2: Añadir navegación suave a enlaces personalizados
    const enlacesPersonalizados = document.querySelectorAll('.mi-enlace-personalizado');
    enlacesPersonalizados.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            window.irASuave(enlace.href, 400);
        });
    });
    
    // Ejemplo 3: Usar loader manual en operaciones async
    async function operacionLarga() {
        window.mostrarLoaderManual();
        
        try {
            // Simular operación async
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Tu código aquí...
            console.log('Operación completada');
            
        } finally {
            window.ocultarLoaderManual();
        }
    }
    
    // Ejemplo 4: Formulario con loader
    const formulario = document.getElementById('miFormulario');
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            window.mostrarLoaderManual();
            
            try {
                // Procesar formulario
                const formData = new FormData(formulario);
                
                // Simular envío
                await fetch('/api/endpoint', {
                    method: 'POST',
                    body: formData
                });
                
                // Navegar al éxito
                window.irASuave('/exito', 300);
                
            } catch (error) {
                window.ocultarLoaderManual();
                console.error('Error:', error);
            }
        });
    }
    
});

// Función de ejemplo para uso externo
function navegarAContacto() {
    window.irASuave('/contacto', 500);
}

function navegarASobreNosotros() {
    window.irASuave('/sobre-nosotros', 500);
}
