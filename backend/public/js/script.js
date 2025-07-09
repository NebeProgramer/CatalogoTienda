// Inicializar gestor de temas (ya no es necesario porque se hace automáticamente en temasManager.js)
// Solo guardamos la referencia global
let temasManager;

document.addEventListener('DOMContentLoaded', () => {

    // Usar el gestor de temas global
    temasManager = window.temasManager;

    const contenedorProductos = document.getElementById('contenedor-productos');
    const modal = document.getElementById('modal');
    const olvidoContainer = document.getElementById('formOlvidoContainer');
    const olvidoContainerbtn = document.getElementById('olvidoContrasena');
    const formSesionContainer = document.getElementById('formSesionContainer');
    const formImagenContainer = document.getElementById('formImagenContainer');
    const formPagoContainer = document.getElementById('formPagoContainer');
    const formPreferenciasContainer = document.getElementById('form-preferencias');
    const iniciarSesionBtn = document.getElementById('iniciarSesion');
    const crearCuentaBtn = document.getElementById('crearCuenta');
    const btnCrear = document.getElementById('btnCrear');
    const divBusqueda = document.querySelector('divBusqueda');
    const closeModal = document.getElementById('closeModal');
    const tco = document.getElementById('TCo');
    const tca = document.getElementById('TCa');
    const emailSesionC = document.getElementById('emailSesionC');
    const passwordSesionC = document.getElementById('passwordSesionC');
    const emailSesion = document.getElementById('emailSesion');
    const passwordSesion = document.getElementById('passwordSesion');
    const opcionTitulo = document.getElementById('opcion');
    const btnSesion = document.getElementById('btnSesion');
    const crudSection = document.getElementById('CRUD');
    const form = {
        imagen: document.getElementById('formImagen'),
        sesion: document.getElementById('formSesion'),
        olvido: document.getElementById('formOlvidoContainer'),
        preferencias: document.getElementById('formPreferencias')
    }; 
    const terminos = document.getElementById('terminos');
    const privacidad = document.getElementById('privacidad');
    const imputTerminos = document.getElementById('imputTerminos');
    const imputPrivacidad = document.getElementById('imputPrivacidad');
    const carrito = document.getElementById('carrito');
    const reqLength = document.getElementById('req-length');
const reqMayus = document.getElementById('req-mayus');
const reqMinus = document.getElementById('req-minus');
const reqNum = document.getElementById('req-num');
const reqEspecial = document.getElementById('req-especial');

    const cargarMonedas = async () => {
        try {
            const respuesta = await fetch('/api/monedas');
            if (!respuesta.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las monedas.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
    
            const monedas = await respuesta.json();
            

            const selectorMonedas = document.getElementById('monedaPreferida');
            selectorMonedas.innerHTML = '<option value="">Seleccione una moneda</option>';
    
            monedas.forEach((moneda) => {
                if (moneda.moneda && moneda.nombre) {
                    const opcion = document.createElement('option');
                    opcion.value = moneda.moneda;
                    opcion.textContent = `${moneda.nombre} <${moneda.moneda}>`;
                    selectorMonedas.appendChild(opcion);
                } else {
                    console.warn('Moneda con datos incompletos:', moneda);
                }
            });
            //seleccionar la moneda preferida del localStorage
            const monedaPreferida = localStorage.getItem('monedaPreferida');
            if (monedaPreferida) {
                selectorMonedas.value = monedaPreferida;
            }
        } catch (error) {
            console.error('Error al cargar las monedas:', error);
            alert('Hubo un error al cargar las monedas. Intenta nuevamente.');
        }
    };
    
    // Llamar a la función para cargar las monedas al iniciar
    cargarMonedas();

    // Función para cargar temas dinámicos en el modal de preferencias
    const cargarTemasEnPreferencias = async () => {
        try {
            const selectorTemas = document.getElementById('temaPreferido');
            if (!selectorTemas) {
                console.warn('⚠️ Selector de temas no encontrado');
                return;
            }

            // Mostrar estado de carga
            selectorTemas.innerHTML = '<option value="">Cargando temas...</option>';
            
            // Usar la función global para cargar temas
            if (typeof window.cargarListaTemas === 'function') {
                const temas = await window.cargarListaTemas();
                
                if (temas && temas.length > 0) {
                    // Limpiar y cargar nuevas opciones
                    selectorTemas.innerHTML = '';
                    
                    // Agregar temas de la base de datos
                    temas.forEach(tema => {
                        const opcion = document.createElement('option');
                        opcion.value = tema._id;
                        // Mostrar nombre completo con emoji
                        opcion.textContent = `${tema.emoji || '🎨'} ${tema.nombre}`;
                        opcion.dataset.tema = JSON.stringify(tema); // Guardar datos completos del tema
                        selectorTemas.appendChild(opcion);
                    });
                    
                    // Establecer el tema actual seleccionado
                    const temaActualId = localStorage.getItem('temaSeleccionadoId');
                    if (temaActualId) {
                        selectorTemas.value = temaActualId;
                    } else if (temas.length > 0) {
                        // Si no hay tema seleccionado, usar el primero
                        selectorTemas.value = temas[0]._id;
                    }
                    
                    // Agregar event listener para cambios en tiempo real (solo una vez)
                    if (!selectorTemas.dataset.listenerAdded) {
                        selectorTemas.addEventListener('change', async (e) => {
                            const temaSeleccionado = e.target.value;
                            if (temaSeleccionado && typeof window.aplicarTemaById === 'function') {
                                try {
                                    await window.aplicarTemaById(temaSeleccionado);
                                    
                                } catch (error) {
                                    // Error silencioso, el usuario será notificado por la función aplicarTemaById
                                }
                            }
                        });
                        selectorTemas.dataset.listenerAdded = 'true';
                    }
                    
                } else {
                    cargarTemasFallback(selectorTemas);
                }
            } else {
                cargarTemasFallback(selectorTemas);
            }
        } catch (error) {
            const selectorTemas = document.getElementById('temaPreferido');
            if (selectorTemas) {
                cargarTemasFallback(selectorTemas);
            }
        }
    };

    // Función de fallback para temas estáticos
    const cargarTemasFallback = (selectorTemas) => {
        selectorTemas.innerHTML = `
            <option value="light">🌞 Claro</option>
            <option value="dark">🌙 Oscuro</option>
            <option value="blue">🌊 Azul</option>
            <option value="green">🌿 Verde</option>
        `;
    };

    const convertirPrecio = async (precio, monedaOriginal, monedaDestino) => {
        if (monedaOriginal === monedaDestino) {
            return precio; // No es necesario convertir si es la misma moneda
        }

        try {
            const respuesta = await fetch('/api/monedas');
            if (!respuesta.ok) {
                throw new Error('Error al cargar las tasas de cambio.');
            }

            const monedas = await respuesta.json();
            const monedaOriginalData = monedas.find((m) => m.moneda === monedaOriginal);
            const monedaDestinoData = monedas.find((m) => m.moneda === monedaDestino);

            if (!monedaOriginalData || !monedaDestinoData) {
                console.warn(`Moneda no encontrada: ${monedaOriginal} o ${monedaDestino}`);
                return precio; // Devolver el precio original si no se encuentra la moneda
            }

            // Convertir el precio a USD y luego a la moneda destino
            const precioEnUSD = precio * monedaOriginalData.valor_en_usd;
            const precioConvertido = precioEnUSD / monedaDestinoData.valor_en_usd;

            return precioConvertido.toFixed(2); // Redondear a 2 decimales
        } catch (error) {
            console.error('Error al convertir el precio:', error);
            return precio; // Devolver el precio original en caso de error
        }
    };
    
   

    // Modificar la función cargarProductos para ocultar el botón "Comprar todo" al aplicar filtros
    const cargarProductos = async (categoria = 'Todos') => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/productos');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos.');
            }
    
            const productos = await respuesta.json();
            const carruselItems = document.querySelector('.carrusel-items');
            const btnComprarTodo = document.querySelector('.btnComprarTodo');
            carruselItems.innerHTML = ''; // Limpiar el carrusel
    
            if (btnComprarTodo) {
                btnComprarTodo.style.display = 'none'; // Ocultar el botón "Comprar todo"
            }
    
            const monedaPreferida = localStorage.getItem('monedaPreferida') || 'USD';
    
            // Filtrar los productos si se selecciona una categoría específica
            const productosFiltrados = categoria === 'Todos'
                ? productos
                : productos.filter(producto => producto.categoria === categoria);
    
            if (productosFiltrados.length === 0) {
                const mensajeVacio = document.createElement('p');
                mensajeVacio.textContent = 'No se encontraron productos.';
                mensajeVacio.classList.add('mensaje-vacio');
                carruselItems.appendChild(mensajeVacio);
            } else {
                for (const producto of productosFiltrados) {
                    if (producto.estado === 'disponible' && producto.stock > 0) {
                    // Solo mostrar productos disponibles y con stock
                    const precioConvertido = await convertirPrecio(producto.precio, producto.moneda, monedaPreferida);
    
                    const divProducto = document.createElement('div');
                    divProducto.classList.add('producto');
                    divProducto.dataset.id = producto.id;
    
                    
    
                    // Mostrar solo la primera imagen del producto
                    const primeraImagen = producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.jpg';
    
                    divProducto.innerHTML = `
                        <div class="producto-frontal">
                            <img src="${primeraImagen}" alt="${producto.nombre}" class="producto-imagen">
                            <h3 class="producto-nombre">${producto.nombre}</h3>
                            <p class="producto-precio">💰 ${monedaPreferida} ${precioConvertido}</p>
                            <p class="producto-stock">📦 Stock: ${producto.stock}</p>
                            <div class="producto-acciones">
                                <button class="btnMasInfo" data-id="${producto.id}">ℹ️ Más información</button>
                                <button class="btnCarrito" data-id="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>🛒 Añadir al carrito</button>
                            </div>
                        </div>
                    `;
    
                    // Agregar eventos a los botones
                    const btnMasInfo = divProducto.querySelector('.btnMasInfo');
                    btnMasInfo.addEventListener('click', () => {
                        if (typeof window.irASuave === 'function') {
                            window.irASuave(`/producto/${producto.id}`, 400);
                        } else {
                            window.location.href = `/producto/${producto.id}`;
                        }
                    });

                    const btnCarrito = divProducto.querySelector('.btnCarrito');
                    if (producto.stock > 0) {
                        btnCarrito.addEventListener('click', async () => {
                            agregarAlCarrito(producto.id);
                        });
                    }

                    carruselItems.appendChild(divProducto);
                }
                }
            }
        } catch (error) {
            
        } finally {
            ocultarLoader();
        }
    };
    // Asignar eventos a las opciones de categoría


    function perfiles() {
        const crudSection = document.getElementById('CRUD');
        const usuarioSesion = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Invitado'};

    // Mostrar mensaje de bienvenida si hay un usuario
    if (usuarioSesion && usuarioSesion.nombre) {
        const bienvenida = document.querySelector('.bienvenida');
        if (bienvenida) {
            bienvenida.textContent = usuarioSesion.nombre ? `Bienvenido ${usuarioSesion.nombre} a nuestra tienda!` : `Bienvenido Invitado a nuestra tienda!`;
        } else {

            // Crear y mostrar el mensaje de bienvenida
            const bienvenida = document.createElement('h3');
            bienvenida.classList.add('bienvenida');
            bienvenida.textContent = usuarioSesion.nombre ? `Bienvenido ${usuarioSesion.nombre} a nuestra tienda!` : `Bienvenido Invitado a nuestra tienda!`;
            bienvenida.style.textAlign = 'center';
            bienvenida.style.marginBottom = '20px';
            crudSection.insertAdjacentElement('beforebegin', bienvenida);
        }
    }
    }
    perfiles();
    cargarProductos();
    // --- Sesión reutilizable (llamadas a funciones globales) ---
    olvidoContainerbtn.addEventListener('click', function (e) {
        e.preventDefault();
        formSesionContainer.style.display = 'none';
        showModal(olvidoContainer, modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
    });

    iniciarSesionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setupLoginForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
    });

    crearCuentaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setupRegisterForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
    });

    closeModal.addEventListener('click', () => hideModal(modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer));

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal(modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
        }
    });

    passwordSesion.addEventListener('input', () => {
        validarRequisitos(passwordSesion.value, reqLength, reqMayus, reqMinus, reqNum, reqEspecial);
        validarCoincidencias(passwordSesion.value, passwordSesionC.value, passwordSesion, passwordSesionC);
    });
    passwordSesionC.addEventListener('input', () => {
        validarCoincidencias(passwordSesion.value, passwordSesionC.value, passwordSesion, passwordSesionC);
    });
    emailSesionC.addEventListener('input', () => {
        validarCorreos(emailSesion.value, emailSesionC.value, emailSesion, emailSesionC);
    });
    emailSesion.addEventListener('input', () => {
        if(emailSesionC.style.display !== 'none') {
            validarCorreos(emailSesion.value, emailSesionC.value, emailSesion, emailSesionC);
        }
    });

function openCRUD() {
    const crudSection = document.getElementById('CRUD');
        crudSection.style.display = "block";
        btnCrear.style.display = "block";
    }

    function closeCRUD() {
        const crudSection = document.getElementById('CRUD');
        crudSection.style.display = "none";
        btnCrear.style.display = "none";
    }

    btnSesion.addEventListener('click', async (e) => {
        e.preventDefault();
        if (btnSesion.textContent === 'Crear Cuenta') {
            await crearCuenta({
                emailSesion,
                passwordSesion,
                mostrarLoader,
                ocultarLoader,
                Swal,
                iniciarSesionBtn,
                crearCuentaBtn,
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD,
                perfiles,
                carrito,
                emailSesionC,
                passwordSesionC,
                validarRequisitos,
                validarCorreos,
                reqLength,
                reqMayus,
                reqMinus,
                reqNum,
                reqEspecial
            });
        } else if (btnSesion.textContent === 'Iniciar Sesión') {
            await iniciarSesion({
                emailSesion,
                passwordSesion,
                mostrarLoader,
                ocultarLoader,
                Swal,
                iniciarSesionBtn,
                crearCuentaBtn,
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD,
                perfiles,
                carrito
            });
            const usuarioLS = localStorage.getItem('usuario');
            if (usuarioLS) {
                const usuario = JSON.parse(usuarioLS);
                if (usuario.rol === 'admin') {
                    openCRUD();
                } else {
                    closeCRUD();
                }
            } else {
                closeCRUD();
            }
        }
    });

    usuarioActivo(Swal, mostrarLoader, ocultarLoader);
    // Mostrar u ocultar CRUD solo si el usuario es admin
    const usuarioLS = localStorage.getItem('usuario');
    if (usuarioLS) {
        const usuario = JSON.parse(usuarioLS);
        if (usuario.rol === 'admin') {
            openCRUD();
        } else {
            closeCRUD();
        }
    } else {
        closeCRUD();
    }

    // === FUNCIONALIDAD DE BÚSQUEDA MEJORADA ===
    const campoBusqueda = document.getElementById('buscar');
    const btnLupa = document.querySelector('.btn-lupa');
    
    // Búsqueda en tiempo real (debounced)
    let timeoutBusqueda = null;
    campoBusqueda?.addEventListener('input', () => {
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(() => {
            const termino = campoBusqueda.value.trim();
            if (termino.length >= 2) {
                realizarBusqueda(termino);
            } else if (termino.length === 0) {
                restablecerVista();
            }
        }, 300); // Esperar 300ms después de que el usuario deje de escribir
    });

    // Búsqueda al hacer clic en el botón lupa
    btnLupa?.addEventListener('click', async (event) => {
        event.preventDefault();
        
        if (btnLupa.textContent === '🔍') {
            const termino = campoBusqueda.value.trim();
            if (termino.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Búsqueda vacía',
                    text: 'Por favor, ingresa un término de búsqueda.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }
            await realizarBusqueda(termino);
        } else {
            restablecerVista();
        }
    });

    // Función para realizar la búsqueda
    async function realizarBusqueda(terminoBusqueda) {
        if (!terminoBusqueda || terminoBusqueda.length < 1) return;
        
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/productos');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos.');
            }

            const productos = await respuesta.json();
            const carruselItems = document.querySelector('.carrusel-items');
            const monedaPreferida = localStorage.getItem('monedaPreferida') || 'USD';

            // Filtrar productos por coincidencia (nombre, descripción, categoría)
            const productosFiltrados = productos.filter((producto) => {
                const nombre = producto.nombre?.toLowerCase() || '';
                const descripcion = producto.descripcion?.toLowerCase() || '';
                const categoria = producto.categoria?.toLowerCase() || '';
                const busqueda = terminoBusqueda.toLowerCase();
                
                return nombre.includes(busqueda) || 
                       descripcion.includes(busqueda) || 
                       categoria.includes(busqueda);
            });

            carruselItems.innerHTML = ''; // Limpiar el carrusel

            if (productosFiltrados.length === 0) {
                const mensajeVacio = document.createElement('div');
                mensajeVacio.className = 'mensaje-vacio';
                mensajeVacio.innerHTML = `
                    <h3>🔍 No se encontraron productos</h3>
                    <p>No hay productos que coincidan con "${terminoBusqueda}"</p>
                    <button onclick="restablecerVista()" class="btn-secondary">Ver todos los productos</button>
                `;
                carruselItems.appendChild(mensajeVacio);
            } else {
                // Mostrar resultados de búsqueda
                const resultadosHeader = document.createElement('div');
                resultadosHeader.className = 'resultados-header';
                resultadosHeader.innerHTML = `
                    <h3>🔍 Resultados de búsqueda para "${terminoBusqueda}"</h3>
                    <p>Se encontraron ${productosFiltrados.length} producto(s)</p>
                `;
                carruselItems.appendChild(resultadosHeader);

                for (const producto of productosFiltrados) {
                    const precioConvertido = await convertirPrecio(producto.precio, producto.moneda, monedaPreferida);

                    const divProducto = document.createElement('div');
                    divProducto.classList.add('carrusel-item');
                    divProducto.dataset.id = producto.id;

                    // Mostrar solo la primera imagen del producto
                    const primeraImagen = producto.imagenes?.length > 0 ? producto.imagenes[0] : '/img/placeholder.jpg';

                    divProducto.innerHTML = `
                        <img src="${primeraImagen}" alt="${producto.nombre}" class="producto-imagen">
                        <h3 class="producto-nombre">${producto.nombre}</h3>
                        <p class="producto-precio">💰 ${monedaPreferida} ${precioConvertido}</p>
                        <p class="producto-stock">📦 Stock: ${producto.stock}</p>
                        <div class="producto-acciones">
                            <button class="btnMasInfo" data-id="${producto.id}">ℹ️ Más información</button>
                            <button class="btnCarrito" data-id="${producto.id}">🛒 Añadir al carrito</button>
                        </div>
                    `;

                    // Agregar eventos a los botones
                    const btnMasInfo = divProducto.querySelector('.btnMasInfo');
                    btnMasInfo.addEventListener('click', () => {
                        window.location.href = `/producto/${producto.id}`;
                    });

                    const btnCarrito = divProducto.querySelector('.btnCarrito');
                    btnCarrito.addEventListener('click', async () => {
                        agregarAlCarrito(producto.id);
                    });

                    carruselItems.appendChild(divProducto);
                }
            }

            btnLupa.textContent = '↩️'; // Cambiar el texto del botón a "volver"
            
        } catch (error) {
            console.error('Error al buscar productos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de búsqueda',
                text: 'Hubo un error al buscar los productos. Inténtalo de nuevo.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
        } finally {
            ocultarLoader();
        }
    }

    // Función para restablecer la vista normal
    function restablecerVista() {
        if (campoBusqueda) campoBusqueda.value = '';
        if (btnLupa) btnLupa.textContent = '🔍';
        cargarProductos(); // Recargar todos los productos
    }

    // Hacer la función global para poder usarla desde el HTML
    window.restablecerVista = restablecerVista;

    // --- Carrusel normal (16 productos por página, paginación con botones) ---
    let paginaActual = 0;
    const productosPorPagina = 16;
    let productosFiltradosGlobal = [];

    // Renderizar carrusel normal con paginación
    function renderizarCarrusel(productos) {
        const carruselItems = document.querySelector('.carrusel-items');
        carruselItems.innerHTML = '';
        const inicio = paginaActual * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosPagina = productos.slice(inicio, fin);
        for (const producto of productosPagina) {
            if (producto.estado === 'disponible' && producto.stock > 0) {
                const precioConvertido = producto.precio; // Usa tu lógica de conversión si es necesario
                const divProducto = document.createElement('div');
                divProducto.classList.add('producto');
                divProducto.dataset.id = producto.id;
                const primeraImagen = producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.jpg';
                divProducto.innerHTML = `
                    <div class="producto-frontal">
                        <img src="${primeraImagen}" alt="${producto.nombre}" class="producto-imagen">
                        <h3 class="producto-nombre">${producto.nombre}</h3>
                        <p class="producto-precio">💰 ${producto.moneda} ${precioConvertido}</p>
                        <p class="producto-stock">📦 Stock: ${producto.stock}</p>
                        <div class="producto-acciones">
                            <button class="btnMasInfo" data-id="${producto.id}">ℹ️ Más información</button>
                            <button class="btnCarrito" data-id="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>🛒 Añadir al carrito</button>
                        </div>
                    </div>
                `;
                // ...agrega listeners si es necesario...
                carruselItems.appendChild(divProducto);
            }
        }
        // Actualizar botones de paginación
        const btnPrev = document.querySelector('.carrusel-prev');
        const btnNext = document.querySelector('.carrusel-next');
        const totalPaginas = Math.ceil(productos.length / productosPorPagina);
        if (btnPrev && btnNext) {
            if (totalPaginas <= 1) {
                btnPrev.disabled = true;
                btnNext.disabled = true;
                btnPrev.classList.add('disabled');
                btnNext.classList.add('disabled');
            } else {
                btnPrev.disabled = paginaActual === 0;
                btnNext.disabled = paginaActual === totalPaginas - 1;
                btnPrev.classList.toggle('disabled', paginaActual === 0);
                btnNext.classList.toggle('disabled', paginaActual === totalPaginas - 1);
            }
        }
    }

    // Botones de paginación para el carrusel normal
    const btnPrev = document.querySelector('.carrusel-prev');
    const btnNext = document.querySelector('.carrusel-next');
    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            console.log('Botón < presionado');
            if (paginaActual > 0) {
                paginaActual--;
                renderizarCarrusel(productosFiltradosGlobal);
                console.log(`Carrusel movido a la página ${paginaActual + 1}`);
            }
        });
        btnNext.addEventListener('click', () => {
            console.log('Botón > presionado');
            const totalPaginas = Math.ceil(productosFiltradosGlobal.length / productosPorPagina);
            if (paginaActual < totalPaginas - 1) {
                paginaActual++;
                renderizarCarrusel(productosFiltradosGlobal);
                console.log(`Carrusel movido a la página ${paginaActual + 1}`);
            }
        });
    }

    // Modificar renderizarCarrusel para deshabilitar visualmente los botones
    function renderizarCarrusel(productos) {
        const carruselItems = document.querySelector('.carrusel-items');
        carruselItems.innerHTML = '';
        const inicio = paginaActual * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosPagina = productos.slice(inicio, fin);
        for (const producto of productosPagina) {
            if (producto.estado === 'disponible' && producto.stock > 0) {
                const precioConvertido = producto.precio; // Usa tu lógica de conversión si es necesario
                const divProducto = document.createElement('div');
                divProducto.classList.add('producto');
                divProducto.dataset.id = producto.id;
                const primeraImagen = producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.jpg';
                divProducto.innerHTML = `
                    <div class="producto-frontal">
                        <img src="${primeraImagen}" alt="${producto.nombre}" class="producto-imagen">
                        <h3 class="producto-nombre">${producto.nombre}</h3>
                        <p class="producto-precio">💰 ${producto.moneda} ${precioConvertido}</p>
                        <p class="producto-stock">📦 Stock: ${producto.stock}</p>
                        <div class="producto-acciones">
                            <button class="btnMasInfo" data-id="${producto.id}">ℹ️ Más información</button>
                            <button class="btnCarrito" data-id="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>🛒 Añadir al carrito</button>
                        </div>
                    </div>
                `;
                // ...agrega listeners si es necesario...
                carruselItems.appendChild(divProducto);
            }
        }
        // Actualizar botones de paginación
        const btnPrev = document.querySelector('.carrusel-prev');
        const btnNext = document.querySelector('.carrusel-next');
        const totalPaginas = Math.ceil(productos.length / productosPorPagina);
        if (btnPrev && btnNext) {
            if (totalPaginas <= 1) {
                btnPrev.disabled = true;
                btnNext.disabled = true;
                btnPrev.classList.add('disabled');
                btnNext.classList.add('disabled');
            } else {
                btnPrev.disabled = paginaActual === 0;
                btnNext.disabled = paginaActual === totalPaginas - 1;
                btnPrev.classList.toggle('disabled', paginaActual === 0);
                btnNext.classList.toggle('disabled', paginaActual === totalPaginas - 1);
            }
        }
    }

    // --- Carrusel recomendados (3 productos, mueve de 1 en 1, automático) ---
    const inicializarCarruselRecomendados = () => {
        const carruselItems = document.querySelector('.carrusel-items-recomendados');
        const prevButton = document.querySelector('.carrusel-prev-recomendados');
        const nextButton = document.querySelector('.carrusel-next-recomendados');
        const productos = carruselItems.querySelectorAll('.producto-recomendado');
        const productosPorVista = 3;
        let currentIndex = 0;
        let intervalId = null;
        let isPaused = false;

        const actualizarCarrusel = () => {
            productos.forEach((producto, index) => {
                if (index >= currentIndex && index < currentIndex + productosPorVista) {
                    producto.style.display = 'block';
                } else {
                    producto.style.display = 'none';
                }
            });
            // Deshabilitar visualmente los botones si hay menos de 4 productos
            if (productos.length <= productosPorVista) {
                prevButton.disabled = true;
                nextButton.disabled = true;
                prevButton.classList.add('disabled');
                nextButton.classList.add('disabled');
            } else {
                prevButton.disabled = false;
                nextButton.disabled = false;
                prevButton.classList.remove('disabled');
                nextButton.classList.remove('disabled');
            }
        };

        const moverCarrusel = (direccion) => {
            const totalProductos = productos.length;
            currentIndex += direccion;
            if (currentIndex < 0) {
                currentIndex = totalProductos - productosPorVista;
            } else if (currentIndex > totalProductos - productosPorVista) {
                currentIndex = 0;
            }
            actualizarCarrusel();
        };

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => { moverCarrusel(-1); console.log('Botón < presionado'); });
            nextButton.addEventListener('click', () => { moverCarrusel(1); console.log('Botón > presionado'); });
        }

        // Pausar y reanudar el carrusel al hacer hover
        productos.forEach(producto => {
            producto.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            producto.addEventListener('mouseleave', () => {
                isPaused = false;
            });
        });

        function startAuto() {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(() => {
                if (!isPaused) moverCarrusel(1);
            }, 5000);
        }
        startAuto();
        actualizarCarrusel();
    };
    
    const cargarProductosRecomendados = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/productos');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos recomendados.');
            }
            const productos = await respuesta.json();
            const productosRecomendados = productos
                .filter(producto => producto.calificacion >= 4.0 && producto.estado === 'disponible' && producto.stock > 0)
                .sort((a, b) => b.calificacion - a.calificacion);
            const monedaPreferida = localStorage.getItem('monedaPreferida') || 'USD';
            const carruselItemsRecomendados = document.querySelector('.carrusel-items-recomendados');
            carruselItemsRecomendados.innerHTML = '';
            for (const producto of productosRecomendados) {
                const precioConvertido = await convertirPrecio(producto.precio, producto.moneda, monedaPreferida);
                const primeraImagen = producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.jpg';
                const divProducto = document.createElement('div');
                divProducto.classList.add('producto-recomendado');
                divProducto.innerHTML = `
                    <div class="producto-recomendado-inner">
                        <div class="producto-recomendado-front">
                            <img src="${primeraImagen}" alt="${producto.nombre}">
                        </div>
                        <div class="producto-recomendado-back">
                            <h3>${producto.nombre}</h3>
                            <p>Precio: ${monedaPreferida} ${precioConvertido}</p>
                            <p>Stock: ${producto.stock}</p>
                            <div class="botones">
                                <button class="btnVerMas">Ver más</button>
                                <button class="btnCarrito">Añadir al carrito</button>
                            </div>
                        </div>
                    </div>
                `;
                divProducto.querySelector('.btnVerMas').addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.href = `/producto/${producto.id}`;
                });
                divProducto.querySelector('.btnCarrito').addEventListener('click', (e) => {
                    e.stopPropagation();
                    agregarAlCarrito(producto.id);
                });
                carruselItemsRecomendados.appendChild(divProducto);
            }
            inicializarCarruselRecomendados();
        } catch (error) {
            console.error('Error al cargar los productos recomendados:', error);
            alert('Hubo un error al cargar los productos recomendados.');
        } finally {
            ocultarLoader();
        }
    };
    
    // Llamar a la función para cargar los productos recomendados al cargar la página
    cargarProductosRecomendados();
    
    const agregarAlCarrito = async (idProducto) => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión requerida',
                text: 'Por favor, inicia sesión para agregar productos al carrito.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
    
        try {
            const respuesta = await fetch(`/api/productos/${idProducto}`);
            if (!respuesta.ok) {
                throw new Error('Error al obtener los datos del producto.');
            }
    
            const producto = await respuesta.json();
    
            // Verificar el stock del producto
            const productoEnCarrito = usuario.carrito.find(item => String(item.id) === String(idProducto));
            if (productoEnCarrito) {
                if (productoEnCarrito.cantidad + 1 > producto.stock) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Stock insuficiente',
                        text: 'No hay suficiente stock disponible para este producto.',
                        toast: true,
                        position: 'top-end',
                        timer: 3000
                    });
                    return;
                }
                // Incrementar la cantidad si ya existe en el carrito
                productoEnCarrito.cantidad += 1;
            } else {
                if (producto.stock < 1) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Stock insuficiente',
                        text: 'No hay suficiente stock disponible para este producto.',
                        toast: true,
                        position: 'top-end',
                        timer: 3000
                    });
                    return;
                }
                // Agregar el producto al carrito con cantidad inicial de 1
                usuario.carrito.push({ id: idProducto, cantidad: 1 });
            }
    
            // Enviar los cambios al servidor
            const respuestaCarrito = await fetch(`/api/usuarios/${usuario.correo}/carrito`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carrito: usuario.carrito }),
            });
    
            if (!respuestaCarrito.ok) {
                throw new Error('Error al actualizar el carrito en el servidor.');
            }
    
            // Actualizar el carrito en el localStorage
            localStorage.setItem('usuario', JSON.stringify(usuario));
    
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                text: 'Producto agregado al carrito.',
                toast: true,
                position: 'top-end',
                timer: 3000
            });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el carrito. Intenta nuevamente.',
                toast: true,
                position: 'top-end',
                timer: 3000
            });
        }
    };
    
    const eliminarDelCarrito = async (idProducto) => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.carrito) return;
    
        // Filtrar el carrito para eliminar el producto
        usuario.carrito = usuario.carrito.filter(item => String(item.id) !== String(idProducto));

        try {
            // Enviar los cambios al servidor
            const respuesta = await fetch(`api/usuarios/${usuario.correo}/carrito`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carrito: usuario.carrito }),
            });
    
            if (!respuesta.ok) {
                throw new Error('Error al actualizar el carrito en el servidor.');
            }
    
            // Actualizar el carrito en el localStorage
            localStorage.setItem('usuario', JSON.stringify(usuario));
    
            if (usuario.carrito.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Carrito vacío',
                    text: 'Tu carrito está vacío.',
                    toast: true,
                    position: 'top-end'
                });
                window.location.href = 'index.html';
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado',
                    text: 'Producto eliminado del carrito.',
                    toast: true,
                    position: 'top-end'
                });
                cargarCarrito(); // Recargar el carrito
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al eliminar el producto del carrito. Intenta nuevamente.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };
    
    const cargarFormularioPago = (productos, usuario) => {
        const informacionPago = document.getElementById('información-del-pago');
        const tarjetaCredito = document.getElementById('tarjetaCredito');
        const direccionEnvio = document.getElementById('DireccionEnvio');
    
        // Limpiar contenido previo
        informacionPago.innerHTML = '';
        tarjetaCredito.innerHTML = '';
        direccionEnvio.innerHTML = '';
    
        // Mostrar productos en formato 1x4
        productos.forEach(producto => {
            const divProducto = document.createElement('div');
            divProducto.classList.add('producto-pago');
            divProducto.innerHTML = `
                <input type="hidden" name="productoId" value="${producto.id}">
                <img src="${producto.imagenes[0] || '/placeholder.jpg'}" alt="${producto.nombre}" class="producto-imagen">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-precio">💰 ${producto.moneda} ${producto.precio}</p>
                <p class="producto-cantidad">🛒 Cantidad: ${producto.cantidad}</p>
            `;
            informacionPago.appendChild(divProducto);
        });
    
        // Mostrar tarjetas del usuario
        if (usuario.tarjeta && usuario.tarjeta.length > 0) {
            const tablaTarjetas = document.createElement('table');
            tablaTarjetas.classList.add('tabla-tarjetas');
            tablaTarjetas.innerHTML = `
                <thead>
                    <tr>
                        <th>Tarjeta</th>
                        <th>Titular</th>
                        <th>Seleccionar</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuario.tarjeta.map(tarjeta => `
                        <tr>
                            <td>${tarjeta.Numero}</td>
                            <td>${tarjeta.Titular}</td>
                            <td><input type="radio" name="tarjetaSeleccionada" value="${tarjeta.id}"></td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            tarjetaCredito.appendChild(tablaTarjetas);
        } else {
            tarjetaCredito.innerHTML = '<p>No tienes tarjetas registradas.</p>';
        }
    
        // Mostrar direcciones del usuario
        if (usuario.direccion && usuario.direccion.length > 0) {
            const tablaDirecciones = document.createElement('table');
            tablaDirecciones.classList.add('tabla-direcciones');
            tablaDirecciones.innerHTML = `
                <thead>
                    <tr>
                        <th>Dirección</th>
                        <th>Seleccionar</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuario.direccion.map(direccion => `
                        <tr>
                            <td>${direccion.Calle} ${direccion.Carrera} ${direccion.Casa}, ${direccion.Departamento}-${direccion.Ciudad}-${direccion.Pais}, ${direccion.CodigoPostal}</td>
                            <td><input type="radio" name="direccionSeleccionada" value="${direccion.id}"></td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            direccionEnvio.appendChild(tablaDirecciones);
        } else {
            direccionEnvio.innerHTML = '<p>No tienes direcciones registradas.</p>';
        }
    };
    
    // Actualizar eventos de los botones "Comprar"
    const cargarCarrito = async () => {
        mostrarLoader();
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.carrito || usuario.carrito.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Carrito vacío',
                text: 'Tu carrito está vacío.',
                toast: true,
                position: 'top-end'
            });
            ocultarLoader();
            return;

        }
    
        try {
            const respuesta = await fetch('/api/productos');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos.');
            }
    
            const productos = await respuesta.json();
            const productosEnCarrito = usuario.carrito.map(item => {
                const producto = productos.find(p => String(p.id) === String(item.id));
                if (producto) {
                    return { ...producto, cantidad: item.cantidad };
                }
                return null;
            }).filter(producto => producto !== null);
    
            const carruselItems = document.querySelector('.carrusel-items');
            const carrusel = document.querySelector('.carrusel');
            carruselItems.innerHTML = '';
    
            if (productosEnCarrito.length === 0) {
                const mensajeVacio = document.createElement('p');
                mensajeVacio.textContent = 'Tu carrito está vacío.';
                mensajeVacio.classList.add('mensaje-vacio');
                carruselItems.appendChild(mensajeVacio);
            } else {
                for (const producto of productosEnCarrito) {
                    const divProducto = document.createElement('div');
                    divProducto.classList.add('producto');
                    divProducto.dataset.id = producto.id;
    
                    divProducto.innerHTML = `
                        <img src="${producto.imagenes[0] || '/placeholder.jpg'}" alt="${producto.nombre}" class="producto-imagen">
                        <h3 class="producto-nombre">${producto.nombre}</h3>
                        <p class="producto-precio">💰 ${producto.moneda} ${producto.precio}</p>
                        <p class="producto-cantidad">🛒 Cantidad: ${producto.cantidad}</p>
                        <button class="btnEliminarCarrito" data-id="${producto.id}">❌ Eliminar</button>
                        <button class="btnComprar" data-id="${producto.id}">🛒 Comprar</button>
                    `;
    
                    const btnEliminarCarrito = divProducto.querySelector('.btnEliminarCarrito');
                    btnEliminarCarrito.addEventListener('click', () => {
                        eliminarDelCarrito(producto.id);
                    });
    
                    const btnComprar = divProducto.querySelector('.btnComprar');
                    btnComprar.addEventListener('click', () => {
                        cargarFormularioPago([producto], usuario);
                        showModal(formPagoContainer, modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
                    });
    
                    carruselItems.appendChild(divProducto);
                }
    
                const btnComprarTodo = document.createElement('button');
                btnComprarTodo.textContent = 'Comprar todo';
                btnComprarTodo.classList.add('btnComprarTodo');
                btnComprarTodo.addEventListener('click', () => {
                    cargarFormularioPago(productosEnCarrito, usuario);
                    showModal(formPagoContainer, modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
                });
    
                carrusel.appendChild(btnComprarTodo);
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            alert('Hubo un error al cargar el carrito.');
        } finally {
            ocultarLoader();
        }
    };

    const btnCarrito = document.getElementById('carrito');
    const carruselRecomendados = document.querySelector('.carrusel-recomendados');
    let mostrandoCarrito = false;
    btnCarrito.addEventListener('click', () => {
        
    const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!mostrandoCarrito) {
            mostrarLoader();
            cargarCarrito();
            if (carruselRecomendados) carruselRecomendados.style.display = 'none';
            if (usuario.carrito && usuario.carrito.length > 0) {
                btnCarrito.innerHTML = '<a href="">Todos</a>';
            }
            mostrandoCarrito = true;
            ocultarLoader();
        } else {
            mostrarLoader();
            cargarProductos();
            if (carruselRecomendados) carruselRecomendados.style.display = '';
            btnCarrito.innerHTML = '<a href="#carrito">Mi carrito</a>';
            mostrandoCarrito = false;
            ocultarLoader();
        }
    });    document.getElementById('btnPreferencias').addEventListener('click', async () => {
        showModal(formPreferenciasContainer, modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
        cargarMonedas();
        
        // Cargar temas dinámicos desde la base de datos
        await cargarTemasEnPreferencias();
        
        // Establecer el tema actual en el selector cuando se abre el modal
        if (temasManager) {
            temasManager.establecerTemaEnSelector();
        }
    });    // Función para guardar las preferencias del usuario (temas y monedas)
    document.getElementById('formPreferencias').addEventListener('submit', async (event) => {
        event.preventDefault();
        mostrarLoader();
        try {
            // Guardar tema usando la función global
            const temaSeleccionado = document.getElementById('temaPreferido').value;
            if (temaSeleccionado) {
                if (typeof window.aplicarTemaById === 'function') {
                    // Usar la función global para aplicar tema por ID
                    try {
                        await window.aplicarTemaById(temaSeleccionado);
                    } catch (temaError) {
                        // Fallback al gestor tradicional si falla
                        if (temasManager) {
                            temasManager.aplicarTema(temaSeleccionado);
                        }
                    }
                } else if (temasManager) {
                    // Fallback al gestor tradicional
                    temasManager.aplicarTema(temaSeleccionado);
                }
            }

            // Guardar moneda
            const monedaPreferida = document.getElementById('monedaPreferida').value;
            if (!monedaPreferida) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Moneda requerida',
                    text: 'Por favor, selecciona una moneda.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }

            // Guardar la moneda preferida en el localStorage
            localStorage.setItem('monedaPreferida', monedaPreferida);
            
            Swal.fire({
                icon: 'success',
                title: 'Preferencias guardadas',
                text: 'Temas y preferencias guardadas exitosamente.',
                toast: true,
                position: 'top-end' 
            });
            
            hideModal(modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer);
            cargarProductos(); // Recargar los productos con la moneda seleccionada
            cargarProductosRecomendados(); // Recargar los productos recomendados
        } finally {
            ocultarLoader();
        }
    });


    const burguerButton = document.getElementById('Burguer');
    const menuHamburguesa = document.querySelector('.menuHamburguesa');

    // Abrir el menú
    burguerButton.addEventListener('click', () => {
        menuHamburguesa.classList.toggle('activo');
        burguerButton.classList.toggle('activo');
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        if (!menuHamburguesa.contains(event.target) && event.target !== burguerButton) {
            menuHamburguesa.classList.remove('activo');
            burguerButton.classList.remove('activo');
        }
    });

    btnCrear.addEventListener('click', () => {
        // Usar navegación suave si está disponible
        if (typeof window.irASuave === 'function') {
            window.irASuave('/admin', 500);
        } else {
            window.location.href = '/admin';
        }
    });

    // Cargar categorías dinámicamente
    const cargarCategorias = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/categorias');
            if (!respuesta.ok) {
                throw new Error('Error al cargar las categorías.');
            }

            const categorias = await respuesta.json();
            const filtroLista = document.getElementById('filtro-lista');
            filtroLista.innerHTML = '<li><a id="todos" style="cursor:pointer;">Todos</a></li>'; // Reiniciar lista

            categorias.forEach(categoria => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = categoria.nombre;
                a.style.cursor = 'pointer';
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    cargarProductos(categoria.nombre);
                    history.pushState(null, '', `?categoria=${encodeURIComponent(categoria.nombre)}`);
                });
                li.appendChild(a);
                filtroLista.appendChild(li);
            });

            // Asignar evento al filtro "Todos"
            document.getElementById('todos').addEventListener('click', (e) => {
                e.preventDefault();
                cargarProductos('Todos');
                history.pushState(null, '', '/');
            });
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        } finally {
            ocultarLoader();
        }
    };

    // Llamar a la función para cargar las categorías al iniciar
    cargarCategorias();


    const procesarPago = async () => {
        mostrarLoader();
        try {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            const tarjetaSeleccionada = document.querySelector('input[name="tarjetaSeleccionada"]:checked');
            const direccionSeleccionada = document.querySelector('input[name="direccionSeleccionada"]:checked');

            if (!tarjetaSeleccionada || !direccionSeleccionada) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, selecciona una tarjeta y una dirección.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }

            const tarjeta = tarjetaSeleccionada.closest('tr').cells[0].textContent;
            const direccion = direccionSeleccionada.closest('tr').cells[0].textContent;

            // Obtener los ids de los productos a comprar del formulario de pago
            const ids = Array.from(document.querySelectorAll('input[name="productoId"]')).map(input => input.value);
            // Filtrar el carrito del usuario para solo incluir los productos seleccionados
            const carritoFiltrado = usuario.carrito.filter(item => ids.includes(String(item.id)));

            if (!usuario || !carritoFiltrado || carritoFiltrado.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Carrito vacío',
                    text: 'Tu carrito está vacío.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }

            const respuesta = await fetch('/api/pagar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: usuario.correo, carrito: carritoFiltrado, tarjeta, direccion}),
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error al procesar el pago: ${resultado.error}`,
                    toast: true,
                    position: 'top-end'
                });
                return;
            }

            // Actualizar el usuario en el localStorage con los datos del servidor
            usuario.carrito = resultado.carrito || [];
            usuario.RegistroCompra = resultado.registroCompras || [];
            localStorage.setItem('usuario', JSON.stringify(usuario));

            Swal.fire({
                icon: 'success',
                title: 'Pago exitoso',
                text: 'Pago procesado con éxito. Gracias por tu compra.',
                toast: true,
                position: 'top-end'
            });
            window.location.href = `/factura/${resultado.factura}`; // Redirigir con el código de factura
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al procesar el pago. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    };

    // Evento para el botón de procesar pago
    document.getElementById('btnPagar').addEventListener('click', (event) => {
        event.preventDefault();
        procesarPago();
    });

    // Inicializar tema guardado al cargar la página
    const inicializarTemaGuardado = async () => {
        try {
            // Intentar aplicar tema desde localStorage primero (más rápido)
            if (typeof window.aplicarTemaGuardado === 'function') {
                const temaAplicado = window.aplicarTemaGuardado();
                if (temaAplicado) {
                    return;
                }
            }
            
            // Si no hay tema en localStorage, intentar aplicar desde la base de datos
            const temaGuardadoId = localStorage.getItem('temaSeleccionadoId');
            if (temaGuardadoId && typeof window.aplicarTemaById === 'function') {
                await window.aplicarTemaById(temaGuardadoId);
            }
        } catch (error) {
            // Error silencioso en la inicialización
        }
    };

    // Aplicar tema guardado inmediatamente (sin delay)
    inicializarTemaGuardado();
    
    // Función para cargar redes sociales desde el servidor
    

    cargarRedesSociales(); // Llamar a la función para cargar redes sociales al iniciar

    document.addEventListener('keydown', async (e) => {
        // Ctrl+Alt+I para evitar conflicto con el navegador
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            const { value: formValues } = await Swal.fire({
                title: 'Registrar IP de administrador',
                html:
                    '<input id="swal-input-correo" class="swal2-input" placeholder="Correo de administrador">' +
                    '<input id="swal-input-clave" type="password" class="swal2-input" placeholder="Clave de administrador">' +
                    '<input id="swal-input-desc" class="swal2-input" placeholder="Descripción de la IP (opcional)">',
                focusConfirm: false,
                preConfirm: () => {
                    const correo = document.getElementById('swal-input-correo').value;
                    const clave = document.getElementById('swal-input-clave').value;
                    const descripcion = document.getElementById('swal-input-desc').value;
                    if (!correo || !clave) {
                        Swal.showValidationMessage('Debes ingresar ambos campos.');
                        return false;
                    }
                    return { correo, clave, descripcion };
                }
            });
            if (!formValues) return;
            const { correo, clave, descripcion } = formValues;

            // Obtener IP pública
            let ip = '';
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                
                const data = await res.json();
                ip = data.ip;
                const dir = await fetch('/api/ips');
                for (const ipc of ip) {
                    if (ipc.direccionIP === ip) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'La IP ya está registrada.',
                            toast: true,
                            position: 'top-end'
                        });
                        return;
                    }
                }
            } catch {
                return Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener la IP.',
                    toast: true,
                    position: 'top-end'
                });
            }

            // Enviar a la API
            const respuesta = await fetch('/api/ips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, clave, direccionIP: ip, descripcion })
            });
            const result = await respuesta.json();
            if (respuesta.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'IP registrada',
                    text: 'IP registrada correctamente.\nDescripción: ' + (descripcion || 'Ninguna'),
                    toast: true,
                    position: 'top-end'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error || 'Error al registrar la IP.',
                    toast: true,
                    position: 'top-end'
                });
            }
        }
    });

    renderMapaFooter(); // Llamar a la función para renderizar el mapa en el footer
    ocultarLoader(); // Ocultar loader al finalizar la carga inicial

    // Lógica para recuperación de contraseña
    const formOlvido = document.getElementById('formOlvidoContrasena');
    if (formOlvido) {
        formOlvido.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correoRecuperar = document.getElementById('emailOlvido').value.trim();
            await recuperarContraseña(correoRecuperar, Swal, () => hideModal(modal, formSesionContainer, olvidoContainer, formPreferenciasContainer, formPagoContainer));
        });
    };
});
