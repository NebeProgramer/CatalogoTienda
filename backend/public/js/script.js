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
    const reqLength = document.getElementById('req-length');
const reqMayus = document.getElementById('req-mayus');
const reqMinus = document.getElementById('req-minus');
const reqNum = document.getElementById('req-num');
const reqEspecial = document.getElementById('req-especial');



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
                        window.location.href = `producto.html?id=${producto.id}`;
                    });
    
                    const btnCarrito = divProducto.querySelector('.btnCarrito');
                    if (producto.stock > 0) {
                        btnCarrito.addEventListener('click', async () => {
                            agregarAlCarrito(producto.id);
                        });
                    }
    
                    carruselItems.appendChild(divProducto);
                };
                }
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            alert('Hubo un error al cargar los productos.');
        } finally {
            ocultarLoader();
        }
    };
    // Asignar eventos a las opciones de categoría


    function perfiles() {
        const usuarioSesion = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Invitado'};

    // Mostrar mensaje de bienvenida si hay un usuario
    if (usuarioSesion && usuarioSesion.nombre) {
        const bienvenida = document.querySelector('.bienvenida');
        if (bienvenida) {
            bienvenida.textContent = `Bienvenido ${usuarioSesion.nombre} a nuestra tienda!`;
        } else {

            // Crear y mostrar el mensaje de bienvenida
            const bienvenida = document.createElement('h3');
            bienvenida.classList.add('bienvenida');
            bienvenida.textContent = `Bienvenido ${usuarioSesion.nombre} a nuestra tienda!`;
            bienvenida.style.textAlign = 'center';
            bienvenida.style.marginBottom = '20px';
            crudSection.insertAdjacentElement('beforebegin', bienvenida);
        }
    }
    }
    perfiles();
    cargarProductos();

    function showModal(container) {
        modal.style.display = 'block';

        formSesionContainer.style.display = 'none';
        olvidoContainer.style.display = 'none';
        formPreferenciasContainer.style.display = 'none';
        formPagoContainer.style.display = 'none';
        container.style.display = 'block';
    }

    function hideModal() {
        modal.style.display = 'none';
        formSesionContainer.style.display = 'none';
      
        olvidoContainer.style.display = 'none';
        formPreferenciasContainer.style.display = 'none';
        formPagoContainer.style.display = 'none';
        document.getElementById('información-del-pago').innerHTML = '';
        document.getElementById('tarjetaCredito').innerHTML = '';
        document.getElementById('tarjetaCredito').value = '';
        document.getElementById('emailSesion').value = '';
        document.getElementById('passwordSesion').value = '';
        document.getElementById('emailSesionC').value = '';
        document.getElementById('passwordSesionC').value = '';

    }

    function setupLoginForm() {
        opcionTitulo.textContent = 'Iniciar Sesión';
        tco.style.display = 'none';
        tca.style.display = 'none';
        emailSesionC.style.display = 'none';
        passwordSesionC.style.display = 'none';
        emailSesionC.required = false;
        passwordSesionC.required = false;
        btnSesion.textContent = 'Iniciar Sesión';
        olvidoContainer.style.display = 'none';
        terminos.style.display = 'none';
        privacidad.style.display = 'none';
        imputTerminos.style.display = 'none';
        imputPrivacidad.style.display = 'none';
        imputPrivacidad.required = false;
        imputTerminos.required = false;
        reqLength.style.display = 'none';
        reqMayus.style.display = 'none';
        reqMinus.style.display = 'none';
        reqNum.style.display = 'none';
        reqEspecial.style.display = 'none';


    }

    function setupRegisterForm() {
        opcionTitulo.textContent = 'Crear Cuenta';
        tco.style.display = 'block';
        tca.style.display = 'block';
        emailSesionC.style.display = 'block';
        passwordSesionC.style.display = 'block';
        emailSesionC.required = true;
        passwordSesionC.required = true;
        btnSesion.textContent = 'Crear Cuenta';
        olvidoContainer.style.display = 'none';
        terminos.style.display = 'block';
        privacidad.style.display = 'block';
        imputTerminos.style.display = 'block';
        imputPrivacidad.style.display = 'block';
        imputPrivacidad.required = true;
        imputTerminos.required = true;
        reqLength.style.display = 'block';
        reqMayus.style.display = 'block';
        reqMinus.style.display = 'block';
        reqNum.style.display = 'block';
        reqEspecial.style.display = 'block';
    }

    function validarRequisitos(password) {
    let validos = 0;
    // Longitud
    if (password.length >= 8) {
        reqLength.style.color = 'green'; validos++;
    } else reqLength.style.color = 'red';
    // Mayúscula
    if (/[A-Z]/.test(password)) {
        reqMayus.style.color = 'green'; validos++;
    } else reqMayus.style.color = 'red';
    // Minúscula
    if (/[a-z]/.test(password)) {
        reqMinus.style.color = 'green'; validos++;
    } else reqMinus.style.color = 'red';
    // Número
    if (/\d/.test(password)) {
        reqNum.style.color = 'green'; validos++;
    } else reqNum.style.color = 'red';
    // Especial
    if (/[^A-Za-z0-9]/.test(password)) {
        reqEspecial.style.color = 'green'; validos++;
    } else reqEspecial.style.color = 'red';
    return validos === 5;
}

passwordSesion.addEventListener('input', () => {
    validarRequisitos(passwordSesionC.value);
    validarCoincidencia();
});

passwordSesionC.addEventListener('input', () => {
    validarCoincidencia();
});

function validarCoincidencia() {
    if (passwordSesionC.value && passwordSesion.value) {
        if (passwordSesionC.value === passwordSesion.value) {
            passwordSesion.style.borderColor = 'green';
            passwordSesionC.style.borderColor = 'green';
        } else {
            passwordSesion.style.borderColor = 'red';
            passwordSesionC.style.borderColor = 'red'; 
        }
    } else {
        passwordSesion.style.borderColor = '';
    }
}

    olvidoContainerbtn.addEventListener('click', function (e) {
        e.preventDefault();
        formSesionContainer.style.display = 'none';
        showModal(olvidoContainer);
    })

    iniciarSesionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(formSesionContainer);
        setupLoginForm();
    });

    crearCuentaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        validarRequisitos('');
        showModal(formSesionContainer);
        setupRegisterForm();
    });

    closeModal.addEventListener('click', hideModal);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal();
        }
    });

        function validarCorreos() {
        const correo1 = emailSesionC.value.trim();
        const correo2 = emailSesion.value.trim();
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Validar formato
        if (!regexCorreo.test(correo1) || !regexCorreo.test(correo2)) {
            emailSesionC.style.borderColor = 'red';
            emailSesion.style.borderColor = 'red';
            return false;
        }
    
        // Validar coincidencia
        if (correo1 !== correo2) {
            emailSesionC.style.borderColor = 'red';
            emailSesion.style.borderColor = 'red';
            return false;
        }
    
        emailSesionC.style.borderColor = 'green';
        emailSesion.style.borderColor = 'green';
        return true;
    }
    
    // Puedes llamar a esta función al hacer submit o al escribir en los campos de correo:
    emailSesionC.addEventListener('input', validarCorreos);
    emailSesion.addEventListener('input', () => {
        if(emailSesionC.style.display !== 'none') {
            validarCorreos();
        }
    });



    // Función para manejar la creación de cuenta
    const crearCuenta = async () => {
        const correo = emailSesionC.value;
        const confirmCo = emailSesion.value;
        const contrasena = passwordSesionC.value;
        const confirmCon = passwordSesion.value;

        if (!correo || !contrasena || !confirmCo || !confirmCon) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        if (!validarRequisitos(contrasena)) {
        Swal.fire({ icon: 'error', title: 'Contraseña insegura', text: 'La contraseña no cumple los requisitos.', toast: true, position: 'top-end' });
        return;
    }
    if (contrasena !== confirmCon) {
        Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden', text: 'Las contraseñas no son iguales.', toast: true, position: 'top-end' });
        return;
    }

    if (!validarCorreos()) {
        Swal.fire({
            icon: 'error',
            title: 'Correos no coinciden',
            text: 'Por favor, verifica que los correos sean iguales.',
            toast: true,
            position: 'top-end'
        });
        return;
    }

        try {
            const respuesta = await fetch('/api/crear-cuenta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                hideModal();
            } else {
                
            }
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
            alert('Hubo un error al crear la cuenta. Intenta nuevamente.');
        }
        hideModal();
        form.sesion.reset();
    };

    // Función para manejar el inicio de sesión
    const iniciarSesion = async () => {
        const correo = emailSesion.value;
        const contrasena = passwordSesion.value;

        if (!correo || !contrasena) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;
        try {
            const respuesta = await fetch('/api/iniciar-sesion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena, ip })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem('usuario', JSON.stringify(data.user));
                if (data.user && data.user.rol === 'admin') {
                    openCRUD();
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido, administrador!',
                        text: 'Has iniciado sesión como administrador.',
                        toast: true,
                        position: 'top-end'
                    });
                }

                iniciarSesionBtn.style.display = 'none';
                crearCuentaBtn.style.display = 'none';

                const listaSesion = document.querySelector('.iniciosesion');

                const perfilLi = document.createElement('li');
                const perfilLink = document.createElement('a');
                if (data.user && data.user.nombre && data.user.nombre.trim() !== "") {
                    perfilLink.textContent = data.user.nombre;
                } else {
                    perfilLink.textContent = 'Editar Perfil';
                }
                perfilLink.id = 'perfilBtn';
                perfilLink.href = '#';
                perfilLink.addEventListener('click', () => mostrarPerfil(data.user));
                perfilLi.appendChild(perfilLink);

                const cerrarSesionLi = document.createElement('li');
                const cerrarSesionLink = document.createElement('a');
                cerrarSesionLink.textContent = 'Cerrar Sesión';
                cerrarSesionLink.id = 'cerrarSesionBtn';
                cerrarSesionLink.href = '#';
                cerrarSesionLink.addEventListener('click', cerrarSesion);
                cerrarSesionLi.appendChild(cerrarSesionLink);

                // Agregar ambos elementos al <ul>
                listaSesion.appendChild(perfilLi);
                listaSesion.appendChild(cerrarSesionLi);

                carrito.style.display = 'block';
                hideModal();
                
                
                form.sesion.reset();
                perfiles();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un error al iniciar sesión. Intenta nuevamente.');
        }
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        location.reload();
    };

    // Función para mostrar el perfil del usuario
    const mostrarPerfil = async (user) => {
        try {
            const respuesta = await fetch(`/api/perfil?correo=${user.correo}`);
            const perfil = await respuesta.json();

            if (respuesta.ok) {
                window.location.href = 'datos-perfil.html';
                localStorage.setItem('usuario', JSON.stringify(perfil));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: perfil.error,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            alert('Hubo un error al cargar el perfil. Intenta nuevamente.');
        }
    };

    btnSesion.addEventListener('click', (e) => {
        e.preventDefault();
        if (btnSesion.textContent === 'Crear Cuenta') {
            crearCuenta();
        } else if (btnSesion.textContent === 'Iniciar Sesión') {
            iniciarSesion();
        }
    });



    crudSection.style.display = "block";
    btnCrear.style.display = "none";

    function openCRUD() {
        crudSection.style.display = "block";
        btnCrear.style.display = "block";
    }

    // Arreglo global para almacenar las imágenes seleccionadas
   

    const cargarMonedas = async () => {
        try {
            const respuesta = await fetch('/api/monedas');
            if (!respuesta.ok) {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las monedas.',
                    toast: true,
                    position: 'top-end'
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
    
    // Función para mover el carrusel
    function moveCarrusel(direction) {
        const carruselItems = document.querySelector('.carrusel-itemsModal');
        const items = carruselItems.querySelectorAll('.carrusel-itemModal');
        const currentTransform = getComputedStyle(carruselItems).transform;
        const matrixValues = currentTransform !== 'none' ? currentTransform.split(',') : [0];
        const currentTranslateX = parseFloat(matrixValues[4]) || 0;
    
        const itemWidth = carruselItems.offsetWidth;
        const maxTranslateX = -(itemWidth * (items.length - 1));
        let newTranslateX = currentTranslateX + direction * itemWidth;
    
        if (newTranslateX > 0) newTranslateX = maxTranslateX; // Ir al último
        if (newTranslateX < maxTranslateX) newTranslateX = 0; // Ir al primero
    
        carruselItems.style.transform = `translateX(${newTranslateX}px)`;
    }
    
    const usuario = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;

    if (usuario) {
        console.log('Sesión activa:', usuario);
        

        // Mostrar funciones relacionadas con el usuario
        document.getElementById('crearCuenta').style.display = 'none';
        document.getElementById('iniciarSesion').style.display = 'none';
        if(usuario.rol === 'admin'){
            openCRUD();
        }
        

        // Obtener el ul donde se agregarán los elementos
        const listaSesion = document.querySelector('.iniciosesion');

        // Crear el elemento <li> para "Perfil"
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = usuario.nombre;
        } else {
            perfilLink.textContent = 'Editar Perfil';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLink.addEventListener('click', () => mostrarPerfil(usuario));
        perfilLi.appendChild(perfilLink);

        // Crear el elemento <li> para "Cerrar Sesión"
        const cerrarSesionLi = document.createElement('li');
        const cerrarSesionLink = document.createElement('a');
        cerrarSesionLink.textContent = 'Cerrar Sesión';
        cerrarSesionLink.id = 'cerrarSesionBtn';
        cerrarSesionLink.href = '#';
        cerrarSesionLink.addEventListener('click', cerrarSesion);
        cerrarSesionLi.appendChild(cerrarSesionLink);

        // Agregar ambos elementos al <ul>
        listaSesion.innerHTML = '';
        listaSesion.appendChild(perfilLi);
        listaSesion.appendChild(cerrarSesionLi);
        document.getElementById('carrito').style.display = 'block';
    } else {
        console.log('No hay sesión activa.');

        // Ocultar funciones relacionadas con el usuario
        document.getElementById('crearCuenta').style.display = 'block';
        document.getElementById('iniciarSesion').style.display = 'block';
        document.getElementById('carrito').style.display = 'none';

    }

    // Loader functions
function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

    document.querySelector('.btn-lupa').addEventListener('click', async (event) => {
        event.preventDefault();
        mostrarLoader();
        try {
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
                        producto.descripcion.toLowerCase().includes(terminoBusqueda)
                    );
        
                    carruselItems.innerHTML = ''; // Limpiar el carrusel
        
                    if (productosFiltrados.length === 0) {
                        const mensajeVacio = document.createElement('p');
                        mensajeVacio.textContent = 'No se encontraron productos.';
                        mensajeVacio.classList.add('mensaje-vacio');
                        carruselItems.appendChild(mensajeVacio);
                    } else {
                        for (const producto of productosFiltrados) {
                            const precioConvertido = await convertirPrecio(producto.precio, producto.moneda, monedaPreferida);
        
                            const divProducto = document.createElement('div');
                            divProducto.classList.add('producto');
                            divProducto.dataset.id = producto.id;
        
                            // Mostrar solo la primera imagen del producto
                            const primeraImagen = producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.jpg';
        
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
                                window.location.href = `producto.html?id=${producto.id}`;
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
                    alert('Hubo un error al buscar los productos.');
                }
            } else {
                // Modo volver atrás
                campoBusqueda.value = '';
                cargarProductos(); // Recargar todos los productos
                btnLupa.textContent = '🔍'; // Cambiar el texto del botón a "buscar"
            }
        } catch (error) {
            console.error('Error en el evento de búsqueda:', error);
        } finally {
            ocultarLoader();
        }
    });

    const cargarProductosRecomendados = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/productos');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos recomendados.');
            }
            const productos = await respuesta.json();
            const productosRecomendados = productos
                .filter(producto => producto.calificacion >= 4.0)
                .sort((a, b) => b.calificacion - a.calificacion);
            const monedaPreferida = localStorage.getItem('monedaPreferida') || 'USD';
            const carruselItemsRecomendados = document.querySelector('.carrusel-recomendados');
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
                    window.location.href = `producto.html?id=${producto.id}`;
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
    
    const inicializarCarruselRecomendados = () => {
        const carruselItems = document.querySelector('.producto-recomendado');
        const prevButton = document.querySelector('.carrusel-prev-recomendados');
        const nextButton = document.querySelector('.carrusel-next-recomendados');
        const productos = carruselItems.querySelectorAll('.producto-recomendado-inner');
        const productosPorVista = 3; // Mostrar 3 productos al mismo tiempo
        let currentIndex = 0;
    
        const actualizarCarrusel = () => {
            const totalProductos = productos.length;
            productos.forEach((producto, index) => {
                if (index >= currentIndex && index < currentIndex + productosPorVista) {
                    producto.style.display = 'block';
                } else {
                    producto.style.display = 'none';
                }
            });
        };
    
        const moverCarrusel = (direccion) => {
            const totalProductos = productos.length;
            currentIndex += direccion * productosPorVista;
    
            if (currentIndex < 0) {
                currentIndex = totalProductos - productosPorVista;
            } else if (currentIndex >= totalProductos) {
                currentIndex = 0;
            }
    
            actualizarCarrusel();
        };
    
        // Configurar botones de navegación
        prevButton.addEventListener('click', () => moverCarrusel(-1));
        nextButton.addEventListener('click', () => moverCarrusel(1));
    
        // Automatizar el carrusel
        setInterval(() => moverCarrusel(1), 5000); // Cambiar cada 5 segundos
    
        actualizarCarrusel(); // Inicializar el carrusel
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
                        position: 'top-end'
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
                        position: 'top-end'
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
                position: 'top-end'
            });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el carrito. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
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
            console.error('Error al actualizar el carrito:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el carrito. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
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
                        showModal(formPagoContainer);
                    });
    
                    carruselItems.appendChild(divProducto);
                }
    
                const btnComprarTodo = document.createElement('button');
                btnComprarTodo.textContent = 'Comprar todo';
                btnComprarTodo.classList.add('btnComprarTodo');
                btnComprarTodo.addEventListener('click', () => {
                    cargarFormularioPago(productosEnCarrito, usuario);
                    showModal(formPagoContainer);
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
        if (!mostrandoCarrito) {
            mostrarLoader();
            cargarCarrito();
            if (carruselRecomendados) carruselRecomendados.style.display = 'none';
            btnCarrito.innerHTML = '<a href="">Todos</a>';
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
    });

    document.getElementById('Preguntas').addEventListener('click', () => {
        // Aquí puedes agregar la funcionalidad deseada para "Preguntas y Respuestas"
        console.log('Preguntas y Respuestas clicado');
    });

    document.getElementById('btnPreferencias').addEventListener('click', () => {
        showModal(document.getElementById('form-preferencias'));
    });

    // Función para guardar las preferencias del usuario
    document.getElementById('formPreferencias').addEventListener('submit', (event) => {
        event.preventDefault();
        mostrarLoader();
        try {
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
                text: 'Preferencias guardadas exitosamente.',
                toast: true,
                position: 'top-end' 
            });
            hideModal();
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

        window.location.href = 'indexAdmin.html';
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
            filtroLista.innerHTML = '<li><a href="#" id="todos">Todos</a></li>'; // Reiniciar lista

            categorias.forEach(categoria => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = "#";
                a.textContent = categoria.nombre;
                a.addEventListener('click', () => cargarProductos(categoria.nombre));
                li.appendChild(a);
                filtroLista.appendChild(li);
            });

            // Asignar evento al filtro "Todos"
            document.getElementById('todos').addEventListener('click', () => cargarProductos('Todos'));
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

            if (!usuario || !usuario.carrito || usuario.carrito.length === 0) {
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
                body: JSON.stringify({ correo: usuario.correo, carrito: usuario.carrito, tarjeta, direccion}),
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
            window.location.href = `confirmacion.html?factura=${resultado.factura}`; // Redirigir con el código de factura
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

    
    // Función para cargar redes sociales desde el servidor
    async function cargarRedesSociales() {
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
                let enlaceCompleto = red.enlace.trim();
                // Validar y corregir el enlace
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
                `;
                listaRedes.appendChild(li);
            });
        } catch (error) {
            console.error('Error al cargar las redes sociales:', error);
        }
    }

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

    // Mostrar el minimapa en el footer si existe
    const footerMapa = document.getElementById('footer-mapa');
    if (footerMapa) {
        const mapaHTML = localStorage.getItem('footerMapaURL') || '';
        footerMapa.innerHTML = mapaHTML;
    }

    function renderMapaFooter() {
        const footerMapa = document.getElementById('footer-mapa');
        if (!footerMapa) return;
        let mapaHTML = '';
        fetch('/api/ubicacion-mapa')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                mapaHTML = data.html || '';
                if (mapaHTML) localStorage.setItem('footerMapaURL', mapaHTML);
                footerMapa.innerHTML = mapaHTML;
            })
            .catch(() => {
                mapaHTML = localStorage.getItem('footerMapaURL') || '';
                footerMapa.innerHTML = mapaHTML;
            });
    }
    document.addEventListener('DOMContentLoaded', renderMapaFooter);

    // Lógica para recuperación de contraseña
    const formOlvido = document.getElementById('formOlvidoContrasena');
    if (formOlvido) {
        formOlvido.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correoRecuperar = document.getElementById('emailOlvido').value.trim();
            if (!correoRecuperar) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Por favor, ingresa tu correo.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }
            try {
                const resp = await fetch('/api/recuperar-contrasena', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo: correoRecuperar })
                });
                const data = await resp.json();
                if (resp.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Revisa tu correo',
                        text: data.message,
                        toast: true,
                        position: 'top-end'
                    });
                    hideModal();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'No se pudo enviar el correo de recuperación.',
                        toast: true,
                        position: 'top-end'
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red',
                    text: 'No se pudo conectar con el servidor.',
                    toast: true,
                    position: 'top-end'
                });
            }
        });
    }
});


