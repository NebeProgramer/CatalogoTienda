// ===== EDITOR DE TEMAS DINÁMICOS =====
class EditorTemas {
    constructor() {
        this.temaActual = null;
        this.temaEditando = null;
        this.coloresOriginales = {};
        this.coloresTemp = {};
        this.aplicandoPrevio = false;
        this.cambiosPendientes = false;
        this.guardandoAhora = false;
        // Nombres amigables para los colores
        this.nombresColores = {
            bgPrimary: 'Fondo Primario',
            bgSecondary: 'Fondo Secundario', 
            bgTertiary: 'Fondo Terciario',
            textPrimary: 'Texto Primario',
            textSecondary: 'Texto Secundario',
            textAccent: 'Texto de Acento',
            borderPrimary: 'Borde Primario',
            borderSecondary: 'Borde Secundario',
            shadowLight: 'Sombra Clara',
            shadowMedium: 'Sombra Media',
            success: 'Éxito',
            warning: 'Advertencia',
            error: 'Error',
            info: 'Información',
            modalBg: 'Fondo Modal',
            hoverOverlay: 'Overlay Hover'
        };
        this.init();
    }
    init() {
        this.cargarTemas();
        this.setupEventListeners();
        this.configurarSweetAlert2();
    }
    marcarCambiosPendientes() {
        this.cambiosPendientes = true;
        this.actualizarIndicadoresCambios();
    }
    actualizarIndicadoresCambios() {
        const cambiosIndicator = document.getElementById('cambiosIndicator');
        const btnGuardarTemas = document.getElementById('btnGuardarTemas');
        const btnGuardarEditor = document.getElementById('btnGuardarEditor');
        if (this.cambiosPendientes && this.temaEditando) {
            // Mostrar indicador de cambios
            if (cambiosIndicator) {
                cambiosIndicator.classList.add('visible');
            }
            // Habilitar botones de guardar
            if (btnGuardarTemas) {
                btnGuardarTemas.disabled = false;
                btnGuardarTemas.classList.remove('guardado');
            }
            if (btnGuardarEditor) {
                btnGuardarEditor.disabled = false;
                btnGuardarEditor.classList.remove('guardado');
            }
        } else {
            // Ocultar indicador de cambios
            if (cambiosIndicator) {
                cambiosIndicator.classList.remove('visible');
            }
            // Deshabilitar botones si no hay cambios
            if (!this.temaEditando) {
                if (btnGuardarTemas) btnGuardarTemas.disabled = true;
                if (btnGuardarEditor) btnGuardarEditor.disabled = true;
            }
        }
    }
    setupEventListeners() {
        // Crear nuevo tema
        document.getElementById('nuevoTemaCard').addEventListener('click', () => {
            this.mostrarFormularioNuevoTema();
        });
        document.getElementById('formNuevoTema').addEventListener('submit', (e) => {
            e.preventDefault();
            this.crearNuevoTema();
        });
        document.getElementById('cancelarNuevoTema').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.ocultarFormularioNuevoTema();
        });
        // Acciones del editor - botón principal de guardar
        document.getElementById('btnGuardarTemas').addEventListener('click', () => {
            this.guardarCambios();
        });
        document.getElementById('btnCancelarTemas').addEventListener('click', () => {
            this.cancelarCambios();
        });
        // Botón de guardar en el editor
        const btnGuardarEditor = document.getElementById('btnGuardarEditor');
        if (btnGuardarEditor) {
            btnGuardarEditor.addEventListener('click', () => {
                this.guardarCambios();
            });
        }
        document.getElementById('btnAplicarPrevio').addEventListener('click', () => {
            this.aplicarPrevio();
        });
        document.getElementById('btnCerrarEditor').addEventListener('click', () => {
            this.cerrarEditor();
        });
        // Detectar cambios en inputs de color para marcar cambios pendientes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('color-picker') || 
                e.target.classList.contains('color-slider') || 
                e.target.classList.contains('hex-input')) {
                this.marcarCambiosPendientes();
            }
        });
    }
    async cargarTemas() {
        try {
            const response = await fetch('/api/temas');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const temas = await response.json();
            this.renderizarTemas(temas);
            // Obtener tema activo
            const temaActivo = temas.find(t => t.activo);
            if (temaActivo) {
                this.temaActual = temaActivo;
            }
            // Notificar al sistema de temas dinámicos si está disponible
            if (window.temaDinamicoManager && window.temaDinamicoManager.iniciado) {
                await window.temaDinamicoManager.cargarTemas();
            }
        } catch (error) {
            console.error('❌ [EditorTemas] Error al cargar temas:', error);
            // Usar SwalToast si está disponible, sino SweetAlert normal
            const swalToUse = window.SwalToast || Swal;
            swalToUse.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los temas'
            });
        }
    }
    renderizarTemas(temas) {
        const container = document.getElementById('temasLista');
        const nuevoTemaCard = document.getElementById('nuevoTemaCard');
        if (!container) {
            console.error('❌ [EditorTemas] Container #temasLista no encontrado!');
            return;
        }
        if (!nuevoTemaCard) {
            console.error('❌ [EditorTemas] Card #nuevoTemaCard no encontrado!');
            return;
        }
        // Limpiar temas existentes (mantener el card de nuevo tema)
        const temasExistentes = container.querySelectorAll('.tema-card');
        temasExistentes.forEach(card => card.remove());
        // Renderizar cada tema
        temas.forEach((tema, index) => {
            const temaCard = this.crearTemaCard(tema);
            container.insertBefore(temaCard, nuevoTemaCard);
        });
        // Verificar que los eventos estén funcionando
        setTimeout(() => this.verificarEventosBotones(), 100);
    }
    crearTemaCard(tema) {
        const card = document.createElement('div');
        card.className = `tema-card ${tema.activo ? 'activo' : ''}`;
        card.dataset.temaId = tema._id;
        // Crear preview de colores
        const coloresPreview = Object.values(tema.colores)
            .slice(0, 6) // Mostrar solo los primeros 6 colores
            .map(color => `<div class="color-muestra" style="background: ${color}"></div>`)
            .join('');
        card.innerHTML = `
            <div class="tema-nombre">${tema.nombre}</div>
            <div class="tema-preview">${coloresPreview}</div>
            <div class="tema-acciones">
                <button class="btn-tema btn-editar" data-accion="editar" data-tema-id="${tema._id}">
                    ✏️ Editar
                </button>
                <button class="btn-tema btn-aplicar" data-accion="aplicar" data-tema-id="${tema._id}"
                        ${tema.activo ? 'disabled' : ''}>
                    ${tema.activo ? '✓ Activo' : '🎨 Aplicar'}
                </button>
                <button class="btn-tema btn-eliminar" data-accion="eliminar" data-tema-id="${tema._id}"
                        ${tema.activo ? 'disabled' : ''}>
                    🗑️
                </button>
            </div>
        `;
        // Agregar eventos a los botones
        const botones = card.querySelectorAll('button[data-accion]');
        botones.forEach(boton => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const accion = boton.dataset.accion;
                const temaId = boton.dataset.temaId;
                switch (accion) {
                    case 'editar':
                        this.editarTema(temaId);
                        break;
                    case 'aplicar':
                        this.aplicarTema(temaId);
                        break;
                    case 'eliminar':
                        this.eliminarTema(temaId);
                        break;
                }
            });
            // Marcar que el botón tiene event listener
            boton._clickListener = true;
        });
        return card;
    }
    mostrarFormularioNuevoTema() {
        const form = document.getElementById('formNuevoTema');
        const card = document.getElementById('nuevoTemaCard');
        const input = document.getElementById('nombreNuevoTema');
        if (form) {
            form.classList.add('visible');
        }
        if (card) {
            card.classList.add('activo');
        }
        if (input) {
            input.focus();
        }
    }
    ocultarFormularioNuevoTema() {
        const form = document.getElementById('formNuevoTema');
        const card = document.getElementById('nuevoTemaCard');
        const input = document.getElementById('nombreNuevoTema');
        if (form) {
            form.classList.remove('visible');
        }
        if (card) {
            card.classList.remove('activo');
        }
        if (input) {
            input.value = '';
        }
    }
    async crearNuevoTema() {
        const nombre = document.getElementById('nombreNuevoTema').value.trim();
        if (!nombre) {
            const swalAlert = window.SwalAlert || Swal;
            swalAlert.fire({
                icon: 'warning',
                title: 'Nombre requerido',
                text: 'Por favor ingresa un nombre para el tema'
            });
            return;
        }
        try {
            // Colores por defecto para un tema nuevo
            const coloresPorDefecto = {
                bgPrimary: '#ffffff',
                bgSecondary: '#f8f9fa',
                bgTertiary: '#e9ecef',
                textPrimary: '#212529',
                textSecondary: '#6c757d',
                textAccent: '#007bff',
                borderPrimary: '#dee2e6',
                borderSecondary: '#e9ecef',
                shadowLight: 'rgba(0,0,0,0.1)',
                shadowMedium: 'rgba(0,0,0,0.2)',
                success: '#28a745',
                warning: '#ffc107',
                error: '#dc3545',
                info: '#17a2b8',
                modalBg: 'rgba(0,0,0,0.5)',
                hoverOverlay: 'rgba(0,0,0,0.05)'
            };
            const response = await fetch('/api/temas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre, 
                    colores: coloresPorDefecto 
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ [EditorTemas] Error del servidor:', errorData);
                throw new Error(errorData.error || errorData.message || 'Error al crear el tema');
            }
            const nuevoTema = await response.json();
            mostrarToast('success', 'Tema creado', `El tema "${nombre}" se ha creado exitosamente`);
            this.ocultarFormularioNuevoTema();
            this.cargarTemas();
            // Abrir editor para el nuevo tema
            setTimeout(() => {
                this.editarTema(nuevoTema._id);
            }, 500);
        } catch (error) {
            console.error('Error al crear tema:', error);
            const swalAlert = window.SwalAlert || Swal;
            swalAlert.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo crear el tema'
            });
        }
    }
    async editarTema(temaId) {
        try {
            const response = await fetch(`/api/temas/${temaId}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const tema = await response.json();
            this.temaEditando = tema;
            
            // Guardar colores actuales como originales (para restaurar la previsualización)
            this.guardarColoresActuales();
            
            // Establecer colores temporales como los del tema
            this.coloresTemp = { ...tema.colores };
            
            this.mostrarEditor(tema);
            this.marcarTemaEditando(temaId);
        } catch (error) {
            console.error('❌ [EditorTemas] Error al cargar tema:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al Cargar Tema',
                text: error.message || 'No se pudo cargar el tema para edición',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
    
    // Método para guardar los colores actuales del CSS
    guardarColoresActuales() {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        // Lista de todas las variables CSS que manejamos
        const variablesCSSATEMAP = [
            'bg-primary', 'bg-secondary', 'bg-tertiary',
            'text-primary', 'text-secondary', 'text-accent',
            'border-primary', 'border-secondary',
            'shadow-light', 'shadow-medium',
            'success', 'warning', 'error', 'info',
            'modal-bg', 'hover-overlay'
        ];
        
        // Mapeo inverso de CSS a nombres de BD
        const mapeoInverso = {
            'bg-primary': 'bgPrimary',
            'bg-secondary': 'bgSecondary',
            'bg-tertiary': 'bgTertiary',
            'text-primary': 'textPrimary',
            'text-secondary': 'textSecondary',
            'text-accent': 'textAccent',
            'border-primary': 'borderPrimary',
            'border-secondary': 'borderSecondary',
            'shadow-light': 'shadowLight',
            'shadow-medium': 'shadowMedium',
            'success': 'success',
            'warning': 'warning',
            'error': 'error',
            'info': 'info',
            'modal-bg': 'modalBg',
            'hover-overlay': 'hoverOverlay'
        };
        
        this.coloresOriginales = {};
        
        // Obtener cada variable CSS actual
        variablesCSSATEMAP.forEach(cssVar => {
            const valor = computedStyle.getPropertyValue(`--${cssVar}`).trim();
            if (valor && mapeoInverso[cssVar]) {
                this.coloresOriginales[mapeoInverso[cssVar]] = valor;
            }
        });
        
        // Si no hay colores originales, usar valores por defecto
        if (Object.keys(this.coloresOriginales).length === 0) {
            this.coloresOriginales = {
                bgPrimary: '#ffffff',
                bgSecondary: '#f8f9fa',
                bgTertiary: '#e9ecef',
                textPrimary: '#212529',
                textSecondary: '#6c757d',
                textAccent: '#007bff',
                borderPrimary: '#dee2e6',
                borderSecondary: '#ced4da',
                shadowLight: 'rgba(0, 0, 0, 0.1)',
                shadowMedium: 'rgba(0, 0, 0, 0.2)',
                success: '#28a745',
                warning: '#ffc107',
                error: '#dc3545',
                info: '#17a2b8',
                modalBg: 'rgba(0, 0, 0, 0.5)',
                hoverOverlay: 'rgba(0, 0, 0, 0.1)'
            };
        }
    }
    mostrarEditor(tema) {
        const editor = document.getElementById('editorColores');
        const titulo = document.getElementById('editorTitulo');
        if (titulo) {
            titulo.textContent = `Editando: ${tema.nombre}`;
        }
        if (editor) {
            editor.style.display = 'block';
        }
        // Resetear estado de cambios
        this.cambiosPendientes = false;
        this.actualizarIndicadoresCambios();
        // Agregar clase al contenedor para ajustar estilos
        const temasContainer = document.querySelector('.temas-container');
        if (temasContainer) {
            temasContainer.classList.add('editor-abierto');
        }
        this.renderizarEditor();
        // Scroll al editor
        setTimeout(() => {
            if (editor) {
                editor.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
    renderizarEditor() {
        const grid = document.getElementById('coloresGrid');
        grid.innerHTML = '';
        Object.entries(this.coloresTemp).forEach(([clave, valor]) => {
            const grupo = this.crearGrupoColor(clave, valor);
            grid.appendChild(grupo);
        });
    }
    crearGrupoColor(clave, valor) {
        const grupo = document.createElement('div');
        grupo.className = 'color-group';
        grupo.dataset.colorKey = clave;
        const rgb = this.hexToRgb(valor) || this.rgbaToRgb(valor) || { r: 255, g: 255, b: 255, a: 1 };
        grupo.innerHTML = `
            <div class="color-label">
                <span class="color-nombre">${this.nombresColores[clave] || clave}</span>
                <span class="color-valor-actual">${valor}</span>
            </div>
            <div class="color-picker-container">
                <div class="color-preview" style="background: ${valor}"></div>
                <div class="rgb-sliders">
                    <div class="slider-group">
                        <span class="slider-label">R</span>
                        <input type="range" class="color-slider slider-red" 
                               min="0" max="255" value="${rgb.r}" data-channel="r">
                        <span class="slider-value">${rgb.r}</span>
                    </div>
                    <div class="slider-group">
                        <span class="slider-label">G</span>
                        <input type="range" class="color-slider slider-green" 
                               min="0" max="255" value="${rgb.g}" data-channel="g">
                        <span class="slider-value">${rgb.g}</span>
                    </div>
                    <div class="slider-group">
                        <span class="slider-label">B</span>
                        <input type="range" class="color-slider slider-blue" 
                               min="0" max="255" value="${rgb.b}" data-channel="b">
                        <span class="slider-value">${rgb.b}</span>
                    </div>
                    <div class="slider-group">
                        <span class="slider-label">A</span>
                        <input type="range" class="color-slider slider-alpha" 
                               min="0" max="1" step="0.01" value="${rgb.a || 1}" data-channel="a">
                        <span class="slider-value">${Math.round((rgb.a || 1) * 100)}%</span>
                    </div>
                </div>
                <div class="hex-input-group">
                    <span class="hex-label">HEX:</span>
                    <input type="text" class="hex-input" value="${this.rgbToHex(rgb.r, rgb.g, rgb.b)}" maxlength="7">
                </div>
            </div>
        `;
        // Event listeners para sliders
        const sliders = grupo.querySelectorAll('.color-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.actualizarColor(clave, grupo);
                this.marcarCambiosPendientes();
            });
        });
        // Event listener para input hex
        const hexInput = grupo.querySelector('.hex-input');
        hexInput.addEventListener('input', (e) => {
            this.actualizarDesdeHex(clave, grupo, e.target.value);
            this.marcarCambiosPendientes();
        });
        return grupo;
    }
    actualizarColor(clave, grupo) {
        const sliders = grupo.querySelectorAll('.color-slider');
        const valores = {};
        sliders.forEach(slider => {
            const channel = slider.dataset.channel;
            valores[channel] = parseFloat(slider.value);
        });
        // Actualizar valores mostrados
        grupo.querySelector('[data-channel="r"]').nextElementSibling.textContent = valores.r;
        grupo.querySelector('[data-channel="g"]').nextElementSibling.textContent = valores.g;
        grupo.querySelector('[data-channel="b"]').nextElementSibling.textContent = valores.b;
        grupo.querySelector('[data-channel="a"]').nextElementSibling.textContent = Math.round(valores.a * 100) + '%';
        // Generar color
        let color;
        if (valores.a < 1) {
            color = `rgba(${valores.r}, ${valores.g}, ${valores.b}, ${valores.a})`;
        } else {
            color = this.rgbToHex(valores.r, valores.g, valores.b);
        }
        // Actualizar preview y valor
        grupo.querySelector('.color-preview').style.background = color;
        grupo.querySelector('.color-valor-actual').textContent = color;
        grupo.querySelector('.hex-input').value = this.rgbToHex(valores.r, valores.g, valores.b);
        // Guardar en temporal
        this.coloresTemp[clave] = color;
        this.marcarCambiosPendientes();
    }
    actualizarDesdeHex(clave, grupo, hex) {
        if (!/^#[0-9A-F]{6}$/i.test(hex)) return;
        const rgb = this.hexToRgb(hex);
        if (!rgb) return;
        // Actualizar sliders
        grupo.querySelector('[data-channel="r"]').value = rgb.r;
        grupo.querySelector('[data-channel="g"]').value = rgb.g;
        grupo.querySelector('[data-channel="b"]').value = rgb.b;
        // Actualizar el color
        this.actualizarColor(clave, grupo);
    }
    async aplicarTema(temaId) {
        try {
            const response = await fetch(`/api/temas/${temaId}/aplicar`, {
                method: 'POST'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al aplicar el tema');
            }
            const resultado = await response.json();
            
            // Actualizar localStorage con los colores del tema aplicado
            if (resultado.tema && resultado.tema.colores) {
                localStorage.setItem('coloresTema', JSON.stringify(resultado.tema.colores));
                localStorage.setItem('nombreTemaSeleccionado', resultado.tema.nombre);
                localStorage.setItem('tema', resultado.tema.nombre.toLowerCase());
                
                // Aplicar inmediatamente el tema al DOM
                this.aplicarColoresAlCSS(resultado.tema.colores);
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Tema aplicado',
                text: `El tema "${resultado.tema.nombre}" se ha aplicado exitosamente`,
                toast: true,
                position: 'top-end',
                timer: 2000
            });
            
            // Notificar al gestor de temas dinámicos para sincronización
            if (window.temaDinamicoManager && window.temaDinamicoManager.iniciado) {
                await window.temaDinamicoManager.cargarTemas();
                await window.temaDinamicoManager.aplicarTemaActivo();
            }
            
            // Emitir evento para otros sistemas
            document.dispatchEvent(new CustomEvent('temaAplicado', {
                detail: { 
                    temaId: temaId,
                    tema: resultado.tema
                }
            }));
            
            // Aplicar tema inmediatamente usando la función global
            if (typeof aplicarTemaInmediato === 'function') {
                aplicarTemaInmediato();
            } else if (window.aplicarTemaInmediato) {
                window.aplicarTemaInmediato();
            }
            
            // Recargar los temas para actualizar la UI
            setTimeout(() => this.cargarTemas(), 100);
            
        } catch (error) {
            console.error('❌ [EditorTemas] Error al aplicar tema:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo aplicar el tema',
                toast: true,
                position: 'top-end'
            });
        }
    }
    aplicarPrevio() {
        if (this.aplicandoPrevio) {
            // Restaurar colores originales
            this.aplicarColoresAlCSS(this.coloresOriginales);
            document.getElementById('btnAplicarPrevio').innerHTML = '👁 Previsualizar';
            this.aplicandoPrevio = false;
        } else {
            // Aplicar colores temporales
            this.aplicarColoresAlCSS(this.coloresTemp);
            document.getElementById('btnAplicarPrevio').innerHTML = '🔄 Restaurar';
            this.aplicandoPrevio = true;
        }
    }
    aplicarColoresAlCSS(colores) {
        const root = document.documentElement;
        // Mapeo de nombres de propiedades de la BD a variables CSS
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
        Object.entries(colores).forEach(([clave, valor]) => {
            // Usar el mapeo si existe, sino convertir directamente
            const cssVar = mapeoVariables[clave] || clave.replace(/([A-Z])/g, '-$1').toLowerCase();
            const propiedadCSS = '--' + cssVar;
            root.style.setProperty(propiedadCSS, valor);
        });
        
        // Actualizar SweetAlert2 con el nuevo tema
        setTimeout(() => this.actualizarSweetAlert2Tema(), 100);
    }
    async guardarCambios() {
        if (!this.temaEditando || this.guardandoAhora) {
            if (!this.temaEditando) {
            } else {
            }
            return;
        }
        this.guardandoAhora = true;
        // Actualizar UI para mostrar estado de guardado
        const btnGuardarTemas = document.getElementById('btnGuardarTemas');
        const btnGuardarEditor = document.getElementById('btnGuardarEditor');
        const botones = [btnGuardarTemas, btnGuardarEditor].filter(btn => btn);
        botones.forEach(btn => {
            btn.classList.add('guardando');
            btn.disabled = true;
            const originalText = btn.innerHTML;
            btn.innerHTML = '⏳ Guardando...';
            btn.dataset.originalText = originalText;
        });
        try {
            const response = await fetch(`/api/temas/${this.temaEditando._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: this.temaEditando.nombre,
                    colores: this.coloresTemp
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            const temaGuardado = await response.json();
            // Actualizar estado interno
            this.temaEditando = temaGuardado;
            this.coloresOriginales = { ...temaGuardado.colores };
            this.cambiosPendientes = false;
            // Aplicar el tema inmediatamente
            this.aplicarColoresAlCSS(temaGuardado.colores);
            // Actualizar UI de éxito
            botones.forEach(btn => {
                btn.classList.remove('guardando');
                btn.classList.add('guardado');
                btn.disabled = false;
                btn.innerHTML = '✅ Guardado';
            });
            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: 'Cambios guardados',
                text: `El tema "${temaGuardado.nombre}" se ha actualizado exitosamente`,
                toast: true,
                position: 'top-end',
                timer: 3000
            });
            // Notificar al sistema de temas dinámicos
            if (window.temaDinamicoManager && window.temaDinamicoManager.iniciado) {
                await window.temaDinamicoManager.cargarTemas();
            }
            // Emitir evento personalizado
            document.dispatchEvent(new CustomEvent('temaActualizado', {
                detail: { tema: temaGuardado }
            }));
            // Actualizar indicadores
            this.actualizarIndicadoresCambios();
            // Recargar lista de temas
            setTimeout(() => {
                this.cargarTemas();
                // Restaurar texto de botones después de un momento
                botones.forEach(btn => {
                    if (btn.dataset.originalText) {
                        setTimeout(() => {
                            btn.classList.remove('guardado');
                            btn.innerHTML = btn.dataset.originalText;
                            delete btn.dataset.originalText;
                        }, 2000);
                    }
                });
            }, 100);
        } catch (error) {
            console.error(`❌ [EditorTemas] Error al guardar:`, error);
            // Restaurar UI en caso de error
            botones.forEach(btn => {
                btn.classList.remove('guardando', 'guardado');
                btn.disabled = false;
                if (btn.dataset.originalText) {
                    btn.innerHTML = btn.dataset.originalText;
                    delete btn.dataset.originalText;
                }
            });
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: error.message || 'No se pudieron guardar los cambios',
                toast: true,
                position: 'top-end'
            });
        } finally {
            this.guardandoAhora = false;
        }
    }
    cancelarCambios() {
        if (this.aplicandoPrevio) {
            this.aplicarColoresAlCSS(this.coloresOriginales);
        }
        this.cerrarEditor();
    }
    cerrarEditor() {
        const editor = document.getElementById('editorColores');
        if (editor) {
            editor.style.display = 'none';
        }
        // Remover clase del contenedor
        const temasContainer = document.querySelector('.temas-container');
        if (temasContainer) {
            temasContainer.classList.remove('editor-abierto');
        }
        // Limpiar estado de edición
        this.temaEditando = null;
        this.coloresOriginales = {};
        this.coloresTemp = {};
        this.cambiosPendientes = false;
        this.aplicandoPrevio = false;
        // Actualizar indicadores
        this.actualizarIndicadoresCambios();
        this.desmarcarTemaEditando();
    }
    marcarTemaEditando(temaId) {
        document.querySelectorAll('.tema-card').forEach(card => {
            card.classList.remove('editando');
        });
        const card = document.querySelector(`[data-tema-id="${temaId}"]`);
        if (card) {
            card.classList.add('editando');
        }
    }
    desmarcarTemaEditando() {
        document.querySelectorAll('.tema-card').forEach(card => {
            card.classList.remove('editando');
        });
    }
    async eliminarTema(temaId) {
        const result = await Swal.fire({
            title: '¿Eliminar tema?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545'
        });
        if (!result.isConfirmed) return;
        try {
            const response = await fetch(`/api/temas/${temaId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el tema');
            }
            Swal.fire({
                icon: 'success',
                title: 'Tema eliminado',
                text: 'El tema se ha eliminado exitosamente',
                toast: true,
                position: 'top-end'
            });
            this.cargarTemas();
        } catch (error) {
            console.error('Error al eliminar tema:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el tema',
                toast: true,
                position: 'top-end'
            });
        }
    }
    // Función para verificar que los botones tengan eventos
    verificarEventosBotones() {
        const botones = document.querySelectorAll('.tema-card button[data-accion]');
        botones.forEach((boton, index) => {
            const accion = boton.dataset.accion;
            const temaId = boton.dataset.temaId;
            const tieneEvento = boton.onclick !== null || boton.getAttribute('onclick') !== null;
        });
        // Verificar si los botones tienen event listeners
        const botonesConEventos = Array.from(botones).filter(boton => {
            return boton.onclick !== null || boton.getAttribute('onclick') !== null;
        });
    }
    // ===== CONFIGURACIÓN DE SWEETALERT2 DINÁMICA =====
    /**
     * Configura SweetAlert2 con los estilos del tema actual
     */
    configurarSweetAlert2() {
        // Configuración por defecto para todos los SweetAlert
        const configuracionBase = {
            customClass: {
                popup: 'swal2-tema-dinamico',
                title: 'swal2-title-tema',
                htmlContainer: 'swal2-html-tema',
                confirmButton: 'swal2-confirm-tema',
                cancelButton: 'swal2-cancel-tema',
                denyButton: 'swal2-deny-tema'
            },
            buttonsStyling: false, // Usar nuestros estilos CSS
            reverseButtons: true,  // Botón cancelar a la izquierda
            allowOutsideClick: false,
            allowEscapeKey: true,
            heightAuto: false,
            backdrop: true
        };

        // Aplicar configuración base a SweetAlert2 si está disponible
        if (typeof Swal !== 'undefined') {
            // Mixin para toast notifications
            window.SwalToast = Swal.mixin({
                ...configuracionBase,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

            // Mixin para modales de confirmación
            window.SwalConfirm = Swal.mixin({
                ...configuracionBase,
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                focusCancel: false
            });

            // Mixin para alertas simples
            window.SwalAlert = Swal.mixin({
                ...configuracionBase,
                confirmButtonText: 'Entendido'
            });
        }
    }
    /**
     * Actualiza la configuración de SweetAlert2 cuando cambia el tema
     */
    actualizarSweetAlert2Tema() {
        // Reconfigurar SweetAlert2 después de cambios de tema
        this.configurarSweetAlert2();
        
        // Emitir evento personalizado para que otros componentes actualicen SweetAlert2
        document.dispatchEvent(new CustomEvent('sweetAlert2Actualizado', {
            detail: { 
                timestamp: Date.now()
            }
        }));
    }

    // Utilidades para conversión de colores
    hexToRgb(hex) {
        if (!hex || !hex.startsWith('#')) return null;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: 1
        } : null;
    }
    rgbaToRgb(rgba) {
        if (!rgba || !rgba.includes('rgba')) return null;
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        return match ? {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
            a: parseFloat(match[4] || 1)
        } : null;
    }
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
}
// Inicializar el editor cuando se carga la página
window.editorTemas = null;
document.addEventListener('DOMContentLoaded', () => {
    window.editorTemas = new EditorTemas();
    // Esperar un poco para que el sistema de temas dinámicos se inicialice
    setTimeout(() => {
        if (window.temaDinamicoManager) {
        } else {
        }
    }, 1000);
});
// ===== FUNCIONES GLOBALES PARA EL MODAL DE PREFERENCIAS =====
/**
 * Carga la lista de temas disponibles
 * @returns {Promise<Array>} Array de temas
 */
window.cargarListaTemas = async function() {
    try {
        const response = await fetch('/api/temas');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const temas = await response.json();
        return temas;
    } catch (error) {
        console.error('❌ [PreferenciasModal] Error al cargar temas:', error);
        return [];
    }
};
/**
 * Aplica un tema específico por su ID
 * @param {string} temaId - ID del tema a aplicar
 * @returns {Promise<boolean>} true si se aplicó correctamente
 */
window.aplicarTemaById = async function(temaId) {
    try {
        const response = await fetch(`/api/temas/${temaId}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const tema = await response.json();
        // Aplicar colores al CSS
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
        Object.entries(tema.colores).forEach(([clave, valor]) => {
            const cssVar = mapeoVariables[clave] || clave.replace(/([A-Z])/g, '-$1').toLowerCase();
            const propiedadCSS = '--' + cssVar;
            root.style.setProperty(propiedadCSS, valor);
        });
        // Guardar en localStorage para persistencia
        localStorage.setItem('temaSeleccionado', temaId);
        localStorage.setItem('nombreTemaSeleccionado', tema.nombre);
        localStorage.setItem('coloresTema', JSON.stringify(tema.colores));
        localStorage.setItem('iconicoTema', tema.icono || '🎨');
        // Sincronizar con el sistema de temas dinámicos si existe
        if (window.temaDinamicoManager && window.temaDinamicoManager.iniciado) {
            window.temaDinamicoManager.temaActual = tema;
        }
        // Emitir evento para notificar el cambio
        document.dispatchEvent(new CustomEvent('temaAplicado', {
            detail: { tema: tema }
        }));
        // Notificar al usuario solo si SweetAlert está disponible
        if (typeof Swal !== 'undefined') {
            // Usar función específica para notificación de tema (versión simple)
            if (typeof mostrarNotificacionTemaSimple === 'function') {
                mostrarNotificacionTemaSimple(tema);
            } else if (typeof mostrarNotificacionTema === 'function') {
                mostrarNotificacionTema(tema);
            } else {
                // Fallback con configuración toast directa sin icono
                Swal.fire({
                    title: `${tema.icono || '🎨'} ${tema.nombre}`,
                    text: 'Tema aplicado correctamente',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    width: '350px',
                    backdrop: false,
                    customClass: {
                        popup: 'swal2-tema-dinamico swal2-toast swal2-no-icon'
                    }
                });
            }
        }
        return true;
    } catch (error) {
        return false;
    }
};
/**
 * Obtiene el tema actualmente seleccionado desde localStorage
 * @returns {Object|null} Información del tema actual
 */
window.obtenerTemaActual = function() {
    const temaId = localStorage.getItem('temaSeleccionado');
    const nombreTema = localStorage.getItem('nombreTemaSeleccionado');
    const iconoTema = localStorage.getItem('iconicoTema');
    const coloresTema = localStorage.getItem('coloresTema');
    if (temaId && nombreTema) {
        return {
            id: temaId,
            nombre: nombreTema,
            icono: iconoTema || '🎨',
            colores: coloresTema ? JSON.parse(coloresTema) : null,
            aplicado: !!coloresTema
        };
    }
    return null;
};
/**
 * Resetea al tema por defecto
 * @returns {Promise<boolean>} true si se resetó correctamente
 */
window.resetearTemaDefecto = async function() {
    try {
        // Buscar el tema por defecto (generalmente el primero o uno marcado como default)
        const temas = await window.cargarListaTemas();
        const temaDefecto = temas.find(t => t.esDefecto) || temas[0];
        if (temaDefecto) {
            const exito = await window.aplicarTemaById(temaDefecto._id);
            if (exito) {
                return true;
            }
        }
        // Si no hay temas o falla, limpiar variables CSS
        const root = document.documentElement;
        const variablesCSS = [
            '--bg-primary', '--bg-secondary', '--bg-tertiary',
            '--text-primary', '--text-secondary', '--text-accent',
            '--border-primary', '--border-secondary',
            '--shadow-light', '--shadow-medium',
            '--success', '--warning', '--error', '--info',
            '--modal-bg', '--hover-overlay'
        ];
        variablesCSS.forEach(variable => {
            root.style.removeProperty(variable);
        });
        // Limpiar localStorage
        localStorage.removeItem('temaSeleccionado');
        localStorage.removeItem('nombreTemaSeleccionado');
        return true;
    } catch (error) {
        console.error('❌ [PreferenciasModal] Error al resetear tema:', error);
        return false;
    }
};
window.aplicarTemaGuardado = function() {
    try {
        const coloresGuardados = localStorage.getItem('coloresTema');
        const nombreTema = localStorage.getItem('nombreTemaSeleccionado');
        const iconoTema = localStorage.getItem('iconicoTema');
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
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('❌ [TemaGuardado] Error al aplicar tema guardado:', error);
        return false;
    }
};
