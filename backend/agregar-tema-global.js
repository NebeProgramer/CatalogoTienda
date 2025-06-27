// Script para agregar tema-global.js a todas las páginas HTML
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..');
const scriptTag = '<script src="/js/tema-global.js"></script>';
const insertAfter = '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';

// Leer todos los archivos HTML en el directorio public
fs.readdir(publicDir, (err, files) => {
    if (err) {
        console.error('Error al leer directorio:', err);
        return;
    }
    
    const htmlFiles = files.filter(file => file.endsWith('.html') && !file.startsWith('test-') && !file.startsWith('debug-'));
    
    console.log(`Procesando ${htmlFiles.length} archivos HTML...`);
    
    htmlFiles.forEach(file => {
        const filePath = path.join(publicDir, file);
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error al leer ${file}:`, err);
                return;
            }
            
            // Verificar si ya tiene el script
            if (data.includes('tema-global.js')) {
                console.log(`✓ ${file} ya tiene el script de tema global`);
                return;
            }
            
            // Verificar si tiene SweetAlert2
            if (data.includes(insertAfter)) {
                const updatedData = data.replace(insertAfter, insertAfter + '\n    ' + scriptTag);
                
                fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error(`Error al escribir ${file}:`, err);
                    } else {
                        console.log(`✅ ${file} actualizado con tema global`);
                    }
                });
            } else {
                console.log(`⚠️ ${file} no tiene SweetAlert2, omitiendo...`);
            }
        });
    });
});
