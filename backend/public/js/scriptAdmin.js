document.addEventListener('DOMContentLoaded', () => {

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
    }
    const terminos = document.getElementById('terminos');
    const privacidad = document.getElementById('privacidad');
    const imputTerminos = document.getElementById('imputTerminos');
    const imputPrivacidad = document.getElementById('imputPrivacidad');
    const carrito = document.getElementById('carrito');
    let Actualizar = false
    let eliminar = false;
    const filtroLista = document.getElementById('filtro-lista');
    const btnAgregarFiltro = document.getElementById('btn-agregar-filtro');
    const agregarFiltroContainer = document.getElementById('agregar-filtro-container');
    const nuevoFiltroInput = document.getElementById('nuevo-filtro');
    const guardarFiltroBtn = document.getElementById('guardar-filtro');





    // Loader functions
function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

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
            carruselItems.innerHTML = ''; // Limpiar el carrusel
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

                    const divProducto = document.createElement('div');
                    divProducto.classList.add('producto');
                    divProducto.dataset.id = producto.id;

                    // Mostrar solo la primera imagen del producto
                    const primeraImagen = producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.jpg';

                    divProducto.innerHTML = `
                        <div class="producto-frontal">
                            <img src="${primeraImagen}" alt="${producto.nombre}" class="producto-imagen">
                            <h3 class="producto-nombre">${producto.nombre}</h3>
                            <p class="producto-precio">💰 ${producto.moneda} ${producto.precio}</p>
                            <p class="producto-stock">📦 Stock: ${producto.stock}</p>
                            <div class="producto-acciones">
                                <button class="btnEditar" data-id="${producto.id}">Actualizar</button>
                                <button class="btnEliminar" data-id="${producto.id}">Eliminar</button>
                                
                            </div>
                            <div class="estado-switch">
            <label class="switch">
                <input type="checkbox" id="estado-${producto.id}" ${producto.estado === 'disponible' ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
            <label for="estado-${producto.id}" class="estado-label">${producto.estado}</label>
        </div>
                        </div>
                    `;

                    // Agregar el div del producto al carrusel
                    carruselItems.appendChild(divProducto);

                        document.getElementById(`estado-${producto.id}`).addEventListener('change', async (event) => {
                        const labelEstado = divProducto.querySelector('.estado-label');
                        const nuevoEstado = event.target.checked ? 'disponible' : 'no disponible';
                        try {
                            const respuesta = await fetch(`/api/productos/${producto.id}/disponibilidad`, { // Ajuste en la URL
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ estado: nuevoEstado })
                            });
                            if (!respuesta.ok) {
                                throw new Error('Error al actualizar el estado del producto.');
                            }
                            labelEstado.textContent = nuevoEstado;
                        } catch (error) {
                            console.error('Error al actualizar el estado:', error);
                            alert('Hubo un error al actualizar el estado del producto.');
                        }
                    });
                    // Agregar eventos a los botones
                    const btnEditar = divProducto.querySelector('.btnEditar');
                    btnEditar.addEventListener('click', () => {
                        window.location.href = `productoAdmin.html?id=${producto.id}`;
                    });

                    const btnCarrito = divProducto.querySelector('.btnEliminar');
                    btnCarrito.addEventListener('click', async () => {
                        const confirmar = await Swal.fire({
                            title: '¿Estás seguro de que deseas eliminar este producto?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, eliminar',
                            cancelButtonText: 'Cancelar'
                        });
                        if (confirmar.isConfirmed) {
                            try {
                                const respuesta = await fetch(`/api/productos/${producto.id}`, {
                                    method: 'DELETE',
                                });

                                if (respuesta.ok) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Producto eliminado',
                                        text: 'Producto eliminado exitosamente.',
                                        toast: true,
                                        position: 'top-end'
                                    });
                                    cargarProductos(); // Recargar los productos después de eliminar
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Error al eliminar el producto.',
                                        toast: true,
                                        position: 'top-end'
                                    });
                                }
                            } catch (error) {
                                console.error('Error al eliminar el producto:', error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Hubo un error al eliminar el producto.',
                                    toast: true,
                                    position: 'top-end'
                                });
                            }
                        }
                    });

                }
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            alert('Hubo un error al cargar los productos.');
        } finally {
            ocultarLoader();
        }
    };

    cargarProductos();

    document.getElementById('btnvolver').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    const usuario = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;

    if (usuario) {
        console.log('Sesión activa:', usuario);
        // Obtener el ul donde se agregarán los elementos
        const listaSesion = document.querySelector('.iniciosesion');

        // Crear el elemento <li> para "Perfil"
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = 'Bienvenido ' + usuario.nombre;
        } else {
            perfilLink.textContent = 'Bienvenido, Administrador';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLi.appendChild(perfilLink);


        // Agregar ambos elementos al <ul>
        listaSesion.innerHTML = '';
        listaSesion.appendChild(perfilLi);
    } else {
        console.log('No hay sesión activa.');
    }

    document.querySelector('.btn-lupa').addEventListener('click', async (event) => {
        event.preventDefault();
        const campoBusqueda = document.getElementById('buscar');
        const btnLupa = document.querySelector('.btn-lupa');
        const carruselItems = document.querySelector('.carrusel-items');
        const terminoBusqueda = campoBusqueda.value.trim().toLowerCase();
        const monedaPreferida = localStorage.getItem('monedaPreferida') || 'USD';

        if (btnLupa.textContent === '🔍') {
            // Modo búsqueda
            try {
                const respuesta = await fetch('/api/productos');
                if (!respuesta.ok) {
                    throw new Error('Error al cargar los productos.');
                }

                const productos = await respuesta.json();

                // Filtrar productos por coincidencia
                const productosFiltrados = productos.filter((producto) =>
                    producto.nombre.toLowerCase().includes(terminoBusqueda) ||
                    producto.id.toString().includes(terminoBusqueda)
                );

                carruselItems.innerHTML = ''; // Limpiar el carrusel

                if (productosFiltrados.length === 0) {
                    const mensajeVacio = document.createElement('p');
                    mensajeVacio.textContent = 'No se encontraron productos.';
                    mensajeVacio.classList.add('mensaje-vacio');
                    carruselItems.appendChild(mensajeVacio);
                } else {
                    for (const producto of productosFiltrados) {

                        const divProducto = document.createElement('div');
                        divProducto.classList.add('producto');
                        divProducto.dataset.id = producto.id;

                        // Mostrar solo la primera imagen del producto
                        const primeraImagen = producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.jpg';

                        divProducto.innerHTML = `
                            <img src="${primeraImagen}" alt="${producto.nombre}" class="producto-imagen">
                            <h3 class="producto-nombre">${producto.nombre}</h3>
                            <p class="producto-precio">💰 ${producto.moneda} ${producto.precio}</p>
                            <p class="producto-stock">📦 Stock: ${producto.stock}</p>
                            <div class="producto-acciones">
                                <button class="btnEditar" data-id="${producto.id}">Actualizar</button>
                                <button class="btnEliminar" data-id="${producto.id}">Eliminar</button>
                            </div>
                        `;

                        // Agregar eventos a los botones
                        const btnEditar = divProducto.querySelector('.btnEditar');
                        btnEditar.addEventListener('click', () => {
                            window.location.href = `productoAdmin.html?id=${producto.id}`;
                        });

                        const btnCarrito = divProducto.querySelector('.btnEliminar');
                        btnCarrito.addEventListener('click', async () => {
                            const confirmar = await Swal.fire({
                                title: '¿Estás seguro de que deseas eliminar este producto?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Sí, eliminar',
                                cancelButtonText: 'Cancelar'
                            });
                            if (confirmar.isConfirmed) {
                                try {
                                    const respuesta = await fetch(`/api/productos/${producto.id}`, {
                                        method: 'DELETE',
                                    });

                                    if (respuesta.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Producto eliminado',
                                            text: 'Producto eliminado exitosamente.',
                                            toast: true,
                                            position: 'top-end'
                                        });
                                        cargarProductos(); // Recargar los productos después de eliminar
                                    } else {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'Error al eliminar el producto.',
                                            toast: true,
                                            position: 'top-end'
                                        });
                                    }
                                } catch (error) {
                                    console.error('Error al eliminar el producto:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Hubo un error al eliminar el producto.',
                                        toast: true,
                                        position: 'top-end'
                                    });
                                }
                            }
                        });

                        carruselItems.appendChild(divProducto);
                    }
                }

                btnLupa.textContent = '↩️'; // Cambiar el texto del botón a "volver"
            } catch (error) {
                console.error('Error al buscar productos:', error);
                alert('Hubo un error al buscar los productos.');
            } finally {
                ocultarLoader();
            }
        } else {
            // Modo volver atrás
            campoBusqueda.value = '';
            cargarProductos(); // Recargar todos los productos
            btnLupa.textContent = '🔍'; // Cambiar el texto del botón a "buscar"
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
        window.location.href = 'productoAdmin.html?id=0';
    });

    btnAgregarFiltro.addEventListener('click', () => {
        agregarFiltroContainer.style.display = 'block';
        btnAgregarFiltro.style.display = 'none'; // Ocultar el botón "Agregar Filtro"
    });

    // Guardar un nuevo filtro
    guardarFiltroBtn.addEventListener('click', async () => {
        const filtroNombre = nuevoFiltroInput.value.trim();
        if (filtroNombre) {
            try {
                // Enviar la nueva categoría al servidor
                const respuesta = await fetch('/api/categorias', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre: filtroNombre }),
                });

                if (!respuesta.ok) {
                    throw new Error('Error al guardar la categoría en el servidor.');
                }

                const nuevaCategoria = await respuesta.json();

                // Crear el elemento de la lista
                const li = document.createElement('li');
                li.textContent = nuevaCategoria.nombre;

                // Crear botón de eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = '🗑️';
                btnEliminar.classList.add('btn-eliminar');
                btnEliminar.style.display = 'none';

                // Mostrar el botón al pasar el mouse
                li.addEventListener('mouseenter', () => {
                    btnEliminar.style.display = 'inline';
                });

                // Ocultar el botón al salir del mouse
                li.addEventListener('mouseleave', () => {
                    btnEliminar.style.display = 'none';
                });

                // Eliminar el filtro al hacer clic en el botón
                btnEliminar.addEventListener('click', async () => {
                    const confirmar = await Swal.fire({
                        title: `¿Estás seguro de que deseas eliminar la categoría "${nuevaCategoria.nombre}"?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    });
                    if (confirmar.isConfirmed) {
                        try {
                            const respuesta = await fetch(`/api/categorias/${nuevaCategoria.id}`, {
                                method: 'DELETE',
                            });

                            if (respuesta.ok) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Categoría eliminada',
                                    text: 'Categoría eliminada exitosamente.',
                                    toast: true,
                                    position: 'top-end'
                                });
                                cargarFiltros(); // Recargar los filtros después de eliminar
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al eliminar la categoría.',
                                    toast: true,
                                    position: 'top-end'
                                });
                            }
                        } catch (error) {
                            console.error('Error al eliminar la categoría:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un error al eliminar la categoría.',
                                toast: true,
                                position: 'top-end'
                            });
                        }
                    }
                });

                li.appendChild(btnEliminar);
                filtroLista.appendChild(li);

                // Limpiar el input y ocultar el contenedor
                nuevoFiltroInput.value = '';
                agregarFiltroContainer.style.display = 'none';
                btnAgregarFiltro.style.display = 'block'; // Volver a mostrar el botón "Agregar Filtro"
                
            
            } catch (error) {
                console.error('Error al guardar la categoría:', error);
                alert('Hubo un error al guardar la categoría.');
            }
        }
    });

    // Función para cargar los filtros existentes desde la tabla Categoria
    const cargarFiltros = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/categorias'); // Endpoint para obtener las categorías
            if (!respuesta.ok) {
                throw new Error('Error al cargar las categorías.');
            }

            const categorias = await respuesta.json();
            filtroLista.innerHTML = ''; // Limpiar la lista de filtros

            categorias.forEach(categoria => {
                const li = document.createElement('li');
                li.textContent = categoria.nombre;

                // Crear botón de eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = '🗑️';
                btnEliminar.classList.add('btn-eliminar');
                btnEliminar.style.display = 'none';

                // Mostrar el botón al pasar el mouse
                li.addEventListener('mouseenter', () => {
                    btnEliminar.style.display = 'inline';
                });

                // Ocultar el botón al salir del mouse
                li.addEventListener('mouseleave', () => {
                    btnEliminar.style.display = 'none';
                });

                // Eliminar el filtro al hacer clic en el botón
                btnEliminar.addEventListener('click', async () => {
                    const confirmar = await Swal.fire({
                        title: `¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    });
                    if (confirmar.isConfirmed) {
                        try {
                            const respuesta = await fetch(`/api/categorias/${categoria.id}`, {
                                method: 'DELETE',
                            });

                            if (respuesta.ok) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Categoría eliminada',
                                    text: 'Categoría eliminada exitosamente.',
                                    toast: true,
                                    position: 'top-end' 
                                });
                                cargarFiltros(); // Recargar los filtros después de eliminar
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al eliminar la categoría.',
                                    toast: true,
                                    position: 'top-end'
                                });
                            }
                        } catch (error) {
                            console.error('Error al eliminar la categoría:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un error al eliminar la categoría.',
                                toast: true,
                                position: 'top-end'
                            });
                        }
                    }
                });

                li.appendChild(btnEliminar);
                filtroLista.appendChild(li);
            });
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
            alert('Hubo un error al cargar las categorías.');
        } finally {
            ocultarLoader();
        }
    };

    // Llamar a la función para cargar los filtros al cargar la página
    cargarFiltros();

    const modalPreferencias = document.getElementById('modal-preferencias');
    const closeModalPreferencias = document.getElementById('closeModalPreferencias');
    const tablaMonedas = document.getElementById('tablaMonedas').querySelector('tbody');
    const formNuevaMoneda = document.getElementById('formNuevaMoneda');

    // Abrir el modal de preferencias
    document.getElementById('preferencias').addEventListener('click', (e) => {
        e.preventDefault();
        cargarMonedas();
        modalPreferencias.style.display = 'block';
    });

    // Cerrar el modal de preferencias
    closeModalPreferencias.addEventListener('click', () => {
        modalPreferencias.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalPreferencias) {
            modalPreferencias.style.display = 'none';
        }
    });

    // Cargar monedas en la tabla
    async function cargarMonedas() {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/monedas');
            if (!respuesta.ok) {
                throw new Error('Error al cargar las monedas.');
            }

            const monedas = await respuesta.json();
            tablaMonedas.innerHTML = '';

            monedas.forEach(moneda => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${moneda.nombre}</td>
                    <td>${moneda.moneda}</td>
                    <td>${moneda.valor_en_usd}</td>
                    <td>
                        <button class="btnEliminarMoneda" data-id="${moneda._id}">Eliminar</button>
                    </td>
                `;
                tablaMonedas.appendChild(fila);
            });


            document.querySelectorAll('.btnEliminarMoneda').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const idMoneda = e.target.dataset.id;
                    const confirmar = await Swal.fire({
                        title: `¿Estás seguro de que deseas eliminar la moneda ?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    });
                    if (confirmar.isConfirmed) {
                        try {
                            const respuesta = await fetch(`/api/monedas/${idMoneda}`, {
                                method: 'DELETE',
                            });
                            if (respuesta.ok) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Moneda eliminada',
                                    text: 'Moneda eliminada exitosamente.',
                                    toast: true,
                                    position: 'top-end'
                                });
                                cargarMonedas();
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al eliminar la moneda.',
                                    toast: true,
                                    position: 'top-end'
                                });
                            }
                        } catch (error) {
                            console.error('Error al eliminar la moneda:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un error al eliminar la moneda.',
                                toast: true,
                                position: 'top-end'
                            });
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar las monedas:', error);
        } finally {
            ocultarLoader();
        }
    }

    // Manejar el envío del formulario para agregar una nueva moneda
    formNuevaMoneda.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevaMoneda = {
            nombre: document.getElementById('nombreMoneda').value,
            moneda: document.getElementById('prefijoMoneda').value,
            valor_en_usd: parseFloat(document.getElementById('valorUSD').value),
        };

        try {
            const respuesta = await fetch('/api/monedas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaMoneda),
            });

            if (!respuesta.ok) {
                throw new Error('Error al agregar la moneda.');
            }

            Swal.fire({
                icon: 'success',
                title: 'Moneda agregada',
                text: 'Moneda agregada exitosamente.',
                toast: true,
                position: 'top-end'
            });
            cargarMonedas(); // Recargar la tabla de monedas
            formNuevaMoneda.reset();
        } catch (error) {
            console.error('Error al agregar la moneda:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al agregar la moneda.',
                toast: true,
                position: 'top-end'
            });
        }
    });

    // Modelo para redes sociales
    const redesSociales = [];

    // Función para cargar redes sociales desde el servidor
    async function cargarRedesSociales() {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/redes-sociales');
            if (!respuesta.ok) {
                throw new Error('Error al cargar las redes sociales.');
            }

            const redes = await respuesta.json();
            const listaRedes = document.querySelector('.redes-sociales');
            listaRedes.innerHTML = '';

            redes.forEach(red => {
                const li = document.createElement('li');

                // Verificar si el enlace tiene un esquema completo
                let enlaceCompleto = red.enlace;
                if (!/^https?:\/\//i.test(enlaceCompleto)) {
                    if (!enlaceCompleto.startsWith('www.')) {
                        enlaceCompleto = `www.${enlaceCompleto}`;
                    }
                    enlaceCompleto = `https://${enlaceCompleto}`;
                } else if (enlaceCompleto.startsWith('www.')) {
                    enlaceCompleto = `https://${enlaceCompleto}`;

                } else if (!enlaceCompleto.startsWith('http://') && !enlaceCompleto.startsWith('https://')) {
                    enlaceCompleto = `https://${enlaceCompleto}`; // Corregido para usar https  
                }

                li.innerHTML = `
                    <a href="${enlaceCompleto}" target="_blank">
                    <img src="https://cdn.simpleicons.org/${red.nombre}" alt="${red.nombre}" width="24" height="24">
                    ${red.nombre}
                    </a>
                <button class="btnEliminarRed" data-id="${red._id}" style="display:none">🗑️</button>
                `;
                listaRedes.appendChild(li);

                li.addEventListener('mouseenter', () => {
                    li.querySelector('.btnEliminarRed').style.display = 'inline';
                });
                li.addEventListener('mouseleave', () => {
                    li.querySelector('.btnEliminarRed').style.display = 'none';
                });
                const btnEliminarRed = li.querySelector('.btnEliminarRed');
                btnEliminarRed.addEventListener('click', () => {
                    eliminarRedSocial(red._id);
                });


            });
        } catch (error) {
            console.error('Error al cargar las redes sociales:', error);
        } finally {
            ocultarLoader();
        }
    }

    eliminarRedSocial = async (id) => {
        Swal.fire({
            title: '¿Estás seguro de que deseas eliminar esta red social?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const respuesta = await fetch(`/api/redes-sociales/${id}`, {
                        method: 'DELETE',
                    });
                    if (!respuesta.ok) {
                        alert('Error al eliminar la red social.');
                        return;
                    }

                Swal.fire({
                    icon: 'success',
                    title: 'Red social eliminada',
                    text: 'Red social eliminada exitosamente.',
                    toast: true,
                    position: 'top-end'
                });
                cargarRedesSociales(); // Recargar las redes sociales después de eliminar
            } catch (error) {
                console.error('Error al eliminar la red social:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al eliminar la red social.',
                    toast: true,
                    position: 'top-end'
                });
            }
        }
        });
    };

    // Manejar el botón para agregar red social
    document.getElementById('btn-agregar-red').addEventListener('click', async () => {
        const contenedor = document.querySelector('.redes_sociales'); 
        contenedor.innerHTML = ''; // Limpiar el contenedor para preparar la edición

        try {
            const respuesta = await fetch('/api/redes-sociales');
            if (!respuesta.ok) {
                throw new Error('Error al cargar las redes sociales.');
            }

            const redes = await respuesta.json();

            // Crear campos editables para las redes existentes
            redes.forEach(red => {
                const li = document.createElement('li');

                const inputNombre = document.createElement('input');
                inputNombre.type = 'text';
                inputNombre.value = red.nombre;
                inputNombre.className = `nombre`; // ID basado en el ID de la red

                const inputEnlace = document.createElement('input');
                inputEnlace.type = 'text';
                inputEnlace.value = red.enlace;
                inputEnlace.className = `enlace`; // ID basado en el ID de la red

                const inputId = document.createElement('input');
                inputId.type = 'hidden';
                inputId.value = red._id;
                inputId.className = `id`; // ID único para el campo oculto

                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = '🗑️';
                btnEliminar.addEventListener('click', () => {
                    eliminarRedSocial(red._id);
                });

                li.appendChild(inputNombre);
                li.appendChild(inputEnlace);
                li.appendChild(inputId);
                li.appendChild(btnEliminar);
                contenedor.appendChild(li);
            });

            // Agregar un campo vacío para una nueva red social
            const liNuevaRed = document.createElement('li');

            const inputNuevoNombre = document.createElement('input');
            inputNuevoNombre.type = 'text';
            inputNuevoNombre.placeholder = 'Nombre de la red social';
            inputNuevoNombre.className = 'nombre';

            const inputNuevoEnlace = document.createElement('input');
            inputNuevoEnlace.type = 'text';
            inputNuevoEnlace.placeholder = 'Enlace completo';
            inputNuevoEnlace.className = 'enlace';

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '🗑️';
            btnEliminar.addEventListener('click', () => {
                liNuevaRed.remove(); // Eliminar el campo de nueva red social
            });

            liNuevaRed.appendChild(inputNuevoNombre);
            liNuevaRed.appendChild(inputNuevoEnlace);
            liNuevaRed.appendChild(btnEliminar);
            contenedor.appendChild(liNuevaRed);
            document.getElementById('btn-guardar-red').style.display = 'inline'; // Mostrar el botón de guardar
            document.getElementById('Cancelar').style.display = 'inline'; // Mostrar el botón de guardar
        } catch (error) {
            console.error('Error al preparar las redes sociales para edición:', error);
        }
    });

    document.getElementById('btn-guardar-red').addEventListener('click', async () => {
        const contenedor = document.querySelector('.redes-sociales');
        const items = contenedor.querySelectorAll('li');

        for (const item of items) {
            const inputId = item.querySelector('.id');
            const inputNombre = item.querySelector('.nombre');
            const inputEnlace = item.querySelector('.enlace');

            const nombre = inputNombre ? inputNombre.value.trim() : '';
            const enlace = inputEnlace ? inputEnlace.value.trim() : '';

            if (!nombre || !enlace) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, complete todos los campos antes de guardar.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }

            if (inputId && inputId.value) {
                // Editar red existente
                const id = inputId.value;
                await fetch(`/api/redes-sociales/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, enlace, id }),
                });
            } else {
                // Crear nueva red social
                if (!nombre || !enlace) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campos incompletos',
                        text: 'Por favor, complete todos los campos antes de guardar.',
                        toast: true,
                        position: 'top-end'
                    });
                    return;
                }
                // Crear nuevo id a partir de los anteriores
                const respuesta = await fetch('/api/redes-sociales');
                const redes = await respuesta.json();
                const nuevoId = redes.length > 0 ? parseInt(redes[redes.length - 1].id) + 1 : 1;
                await fetch('/api/redes-sociales', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, enlace, id: nuevoId }),
                });
            }
        }

        Swal.fire({
            icon: 'success',
            title: 'Redes sociales guardadas',
            text: 'Las redes sociales se han guardado exitosamente.',
            toast: true,
            position: 'top-end'
        });
        cargarRedesSociales();
        document.getElementById('btn-guardar-red').style.display = 'none'; // Ocultar el botón de guardar
        document.getElementById('Cancelar').style.display = 'none'; // Ocultar el botón de cancelar
    });

    document.getElementById('Cancelar').addEventListener('click', () => {
        cargarRedesSociales(); // Recargar las redes sociales
        document.getElementById('btn-guardar-red').style.display = 'none'; // Ocultar el botón de guardar
        document.getElementById('Cancelar').style.display = 'none';
    });
        

    // Cargar redes sociales al cargar la página
    cargarRedesSociales();

    const listaUbicaciones = document.getElementById('listaUbicaciones');

    // --- UBICACIONES ---

    // Cargar ubicaciones en tabla plana
    async function cargarUbicacionesTabla() {
        mostrarLoader();
        const respuesta = await fetch('/api/ubicaciones');
        const ubicaciones = await respuesta.json();
        const tabla = document.getElementById('tablaUbicaciones');
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>País</th>
                    <th>Departamento</th>
                    <th>Ciudad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = tabla.querySelector('tbody');
        ubicaciones.forEach(pais => {
            let firstDept = true;
            pais.departamentos.forEach(departamento => {
                let firstCity = true;
                departamento.ciudades.forEach(ciudad => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${firstDept && firstCity ? pais.nombre : ''}</td>
                        <td>${firstCity ? departamento.nombre : ''}</td>
                        <td>${ciudad.nombre}</td>
                        <td>
                            <button class="btn-borrar" data-pais="${pais._id}" data-departamento="${departamento.nombre}" data-ciudad="${ciudad.nombre}">Borrar</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                    firstCity = false;
                });
                firstDept = false;
            });
        });
        // Evento borrar (unificado)
        tabla.querySelectorAll('.btn-borrar').forEach(btn => {
            btn.addEventListener('click', async () => {
                const paisId = btn.dataset.pais;
                const departamentoNombre = btn.dataset.departamento;
                const ciudadNombre = btn.dataset.ciudad;
                const confirmar = await Swal.fire({
                    title: `¿Estás seguro de que deseas eliminar la ciudad "${ciudadNombre}" del departamento "${departamentoNombre}" en el país "${paisId}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar'
                });
                if (confirmar.isConfirmed) {
                    await fetch(`/api/ubicaciones/${paisId}/departamento/${departamentoNombre}/ciudad/${ciudadNombre}`, { method: 'DELETE' });
                    cargarUbicacionesTabla();
                }
            });
        });
    }

    document.getElementById('btnAgregarUbicacion').addEventListener('click', async (e) => {
        e.preventDefault();
        mostrarLoader();
        const pais = document.getElementById('pais').value;
        const departamento = document.getElementById('departamento').value;
        const ciudad = document.getElementById('ciudad').value;
        await crearUbicacion(pais, departamento, ciudad);
        ocultarLoader();
    });

    // Crear nueva ubicación
    async function crearUbicacion(pais, departamento, ciudad) {
        mostrarLoader();
        // Usar el endpoint unificado
        const respuesta = await fetch('/api/ubicaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pais, departamento, ciudad })
        });
        const data = await respuesta.json();
        if (respuesta.status === 200) {
            swal.fire({
                icon: 'success',
                title: 'Ubicación Existente',
                text: data.message || 'La ubicación ya existe.',
                toast: true,
                position: 'top-end'
            });
        } else if (respuesta.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Ubicación creada',
                text: data.message || 'Ubicación creada correctamente.',
                toast: true,
                position: 'top-end'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || 'Error al crear la ubicación.',
                toast: true,
                position: 'top-end'
            });
        }
        cargarUbicacionesTabla();
        ocultarLoader();
    }

    // Llama cargarUbicacionesTabla() donde lo necesites para mostrar la tabla
    cargarUbicacionesTabla();

    // --- MAPA FOOTER ---
    // Usar API para guardar la ubicación del mapa en el backend
    const footerMapa = document.getElementById('footer-mapa');
    if (footerMapa) {
        async function renderMapaFooter() {
            // Obtener el HTML del backend primero
            let mapaHTML = '';
            try {
                const res = await fetch('/api/ubicacion-mapa');
                if (res.ok) {
                    const data = await res.json();
                    mapaHTML = data.html || '';
                    if (mapaHTML) {
                        localStorage.setItem('footerMapaURL', mapaHTML); // Sincronizar LS
                    }
                }
            } catch (e) {
                // Si falla la petición, usar localStorage
                mapaHTML = localStorage.getItem('footerMapaURL') || '';
            }
            // Si no hay datos en backend ni en LS, dejar vacío
            if (!mapaHTML) {
                mapaHTML = '';
            }
            footerMapa.innerHTML = `${mapaHTML}
                <div style="margin-top:10px;">
                    <label for="footerMapaURL"><strong>URL del mapa (iframe o enlace):</strong></label><br>
                    <input type="text" id="footerMapaURL" style="width:80%" placeholder="Pega aquí el iframe o enlace de Google Maps"><button id="btnGuardarMapa">Guardar Mapa</button>
                </div>`;
            const inputMapa = document.getElementById('footerMapaURL');
            inputMapa.value = mapaHTML;
            document.getElementById('btnGuardarMapa').onclick = guardarMapa;
        }
        async function guardarMapa() {
            const inputMapa = document.getElementById('footerMapaURL');
            const url = inputMapa.value.trim();
            let mapaHTML = '';
            if (url.startsWith('<iframe')) {
                mapaHTML = url;
            } else if (url.includes('google.com/maps')) {
                let embedUrl = url;
                if (url.includes('/maps/place/')) {
                    embedUrl = url.replace('/maps/place/', '/maps/embed?pb=');
                } else if (url.includes('/maps/dir/')) {
                    embedUrl = url.replace('/maps/dir/', '/maps/embed?pb=');
                }
                if (!embedUrl.includes('embed')) {
                    const qMatch = url.match(/[?&]q=([^&]+)/);
                    const q = qMatch ? decodeURIComponent(qMatch[1]) : '';
                    embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
                }
                mapaHTML = `<iframe src="${embedUrl}" width="100%" height="120" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'URL no válida',
                    text: 'Por favor, ingrese un iframe o un enlace válido de Google Maps.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }
            // Guardar en backend
            await fetch('/api/ubicacion-mapa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html: mapaHTML })
            });
            localStorage.setItem('footerMapaURL', mapaHTML);
            Swal.fire({
                icon: 'success',
                title: 'Mapa actualizado',
                text: 'La dirección del mapa se ha guardado correctamente.',
                toast: true,
                position: 'top-end'
            });
            renderMapaFooter();
        }
        renderMapaFooter();
    }

    cargarIpsPermitidas = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/ips');
            if (!respuesta.ok) {
                throw new Error('Error al cargar las IPs permitidas.');
            }
            const ips = await respuesta.json();
            const listaIps = document.getElementById('tablaIPs').getElementsByTagName('tbody')[0];
            const infoip = document.getElementById('infoIP');
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;
            let ipExistente = false;
            ips.forEach(ip => {
                if(ip.direccionIP === ipData.ip) {
                    ipExistente = true;
                };
            }); 
            if (!ipExistente) {
                swal.fire({
                    icon: 'warning',
                    title: 'IP no permitida',
                    text: 'Tu dirección IP no está en la lista de IPs permitidas. Por favor, contacta al administrador.',
                    toast: true,
                    position: 'top-end'
                });
                window.location.href = '/';
                return;
            }

            infoip.textContent = `Tu dirección IP es: ${ip}`;
            listaIps.innerHTML = '';
            ips.forEach(ip => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${ip.direccionIP}</td>
                    <td>${ip.descripcion}</td>
                    <td>${ip.CreadaEn}</td>
                    <td>
                        <button class="btn-eliminar-ip" data-ip="${ip.direccionIP}">Eliminar</button>
                    </td>
                `;
                listaIps.appendChild(tr);
            });

            // Agregar evento de eliminación a los botones
            const botonesEliminar = document.querySelectorAll('.btn-eliminar-ip');
            botonesEliminar.forEach(boton => {
                boton.addEventListener('click', async (event) => {
                    const ip = event.target.dataset.ip;

                    if(ip === ipData.ip) {
                        Swal.fire({
                            icon: 'error',
                            title: 'No puedes eliminar tu propia IP',
                            text: 'No puedes eliminar la IP que estás utilizando actualmente.',
                            toast: true,
                            position: 'top-end'
                        });
                        return;

                    }
                    const confirmar = await Swal.fire({
                        icon: 'warning',
                        title: 'Eliminar IP',
                        text: `¿Estás seguro de que deseas eliminar la IP ${ip}?`,
                        showCancelButton: true,
                        confirmButtonText: 'Eliminar',
                        cancelButtonText: 'Cancelar'
                    });
                    if (confirmar.isConfirmed) {
                        const response = await fetch(`/api/ips/${ip}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'IP eliminada',
                                text: `La IP ${ip} ha sido eliminada correctamente.`,
                                toast: true,
                                position: 'top-end'
                            });
                            cargarIpsPermitidas();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al eliminar IP',
                                text: `No se pudo eliminar la IP ${ip}.`,
                                toast: true,
                                position: 'top-end'
                            });
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar las IPs permitidas:', error);
        } finally {
            ocultarLoader();
        }
    };

    // Cargar las IPs permitidas al cargar la página
    cargarIpsPermitidas();
});


