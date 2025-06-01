let imagenesSeleccionadas = []; // Arreglo para almacenar las imágenes seleccionadas
document.addEventListener('DOMContentLoaded', async () => {
    function mostrarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex';
    }
    function ocultarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }
    mostrarLoader();
    const params = new URLSearchParams(window.location.search);
    const productoId = parseInt(params.get('id'), 10); // Obtener el ID del producto de la URL
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
const id = params.get('id');


    const productoDetalle = document.getElementById('productoDetalle');
    const comentarios = document.getElementById('comentarios');

        productoDetalle.style.display = 'block';
        comentarios.style.display = 'block';
    

    
    if (!productoId) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Producto inexistente',
            text: 'No se encontró el producto.'
        });
        window.location.href = 'index.html';
        return;
    }
async function cargarProducto(productoId) {
try {
// Obtener los datos del producto desde el servidor
const respuesta = await fetch('/api/productos');
if (!respuesta.ok) {
    throw new Error('Error al cargar los productos.');
}

const productos = await respuesta.json();
const producto = productos.find(p => p.id === productoId);

if (!producto) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Producto no encontrado',
        text: 'Producto no encontrado.'
    });
    window.location.href = 'index.html';
    return;
}

// Obtener la moneda preferida del usuario
const monedaPreferida = localStorage.getItem('monedaPreferida') || 'USD';

// Convertir el precio del producto a la moneda preferida
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
            throw new Error('Moneda no encontrada.');
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
const precioConvertido = await convertirPrecio(producto.precio, producto.moneda, monedaPreferida);

// Mostrar la información del producto en productoDetalle
document.getElementById('productoNombre').textContent = producto.nombre;
document.getElementById('productoDescripcion').textContent = producto.descripcion;
document.getElementById('productoCategoria').textContent = producto.categoria;
document.getElementById('productoPrecio').textContent = `${monedaPreferida} ${precioConvertido}`;
document.getElementById('productoStock').textContent = producto.stock;
document.getElementById('productoCalificacion').textContent = producto.calificacion.toFixed(1);


// Crear un carrusel para las imágenes del producto
const carrusel = document.getElementById('productoImagenes');
let currentIndex = 0; // Índice actual del carrusel

// Mostrar las imágenes en el carrusel
producto.imagenes.forEach((imagen, index) => {
    const img = document.createElement('img');
    img.src = imagen;
    img.alt = `Imagen ${index + 1}`;
    img.classList.add('carruselProd-imagen');
    if (index !== 0) {
        img.style.display = 'none'; // Ocultar todas las imágenes excepto la primera
    }
    carrusel.appendChild(img);
});
// Configurar los botones de navegación del carrusel
const prevButton = document.createElement('button');
prevButton.textContent = '❮';
prevButton.classList.add('carrusel-btn', 'prev-btn');
prevButton.addEventListener('click', () => {
    const images = document.querySelectorAll('.carruselProd-imagen');
    images[currentIndex].style.display = 'none'; // Ocultar la imagen actual
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Mover al índice anterior
    images[currentIndex].style.display = 'block'; // Mostrar la nueva imagen
});

const nextButton = document.createElement('button');
nextButton.textContent = '❯';
nextButton.classList.add('carrusel-btn', 'next-btn');
nextButton.addEventListener('click', () => {
    const images = document.querySelectorAll('.carruselProd-imagen');
    images[currentIndex].style.display = 'none'; // Ocultar la imagen actual
    currentIndex = (currentIndex + 1) % images.length; // Mover al índice siguiente
    images[currentIndex].style.display = 'block'; // Mostrar la nueva imagen
});

// Agregar los botones al carrusel
carrusel.appendChild(prevButton);
carrusel.appendChild(nextButton);

// Muevo la declaración de 'perfil' al inicio del script para evitar errores de referencia
const perfil = JSON.parse(localStorage.getItem('usuario'));

// Mostrar los comentarios con opción de edición si corresponde
function CargarComentarios() {
    mostrarLoader();
    const listaComentarios = document.getElementById('listaComentarios');
    if (!listaComentarios) return;
    listaComentarios.innerHTML = '';
    if (!producto.comentarios || producto.comentarios.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay comentarios aún.';
        listaComentarios.appendChild(li);
        return;
    }
    producto.comentarios.forEach(comentario => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${comentario.usuario}:</strong>
            <span class="comentario-texto">${comentario.comentario}</span>
            <p>Calificación: ⭐ <span class="comentario-calificacion">${comentario.calificacion}</span></p>
        `;
        // Verificar si el usuario actual es el autor del comentario
        if (perfil && perfil.correo === comentario.correo) {
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => habilitarEdicionComentario(comentario, li));
            li.appendChild(btnEditar);
        }
        listaComentarios.appendChild(li);
    });
    ocultarLoader();
}

    // Verificar si los elementos de texto y calificación existen antes de intentar acceder a sus propiedades
    function habilitarEdicionComentario(comentario, li) {
        const comentarioTexto = li.querySelector('.comentario-texto');
        const comentarioCalificacion = li.querySelector('.comentario-calificacion');

        // Convertir el texto del comentario en un input
        const inputComentario = document.createElement('input');
        inputComentario.type = 'text';
        inputComentario.value = comentarioTexto.textContent;
        comentarioTexto.replaceWith(inputComentario);

        // Convertir la calificación en un selector
        const selectCalificacion = document.createElement('select');
        for (let i = 1; i <= 5; i += 0.5) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} ⭐`;
            if (i === parseFloat(comentarioCalificacion.textContent)) {
                option.selected = true;
            }
            selectCalificacion.appendChild(option);
        }
        comentarioCalificacion.replaceWith(selectCalificacion);

        // Cambiar el botón de edición a guardar
        const btnGuardar = li.querySelector('button');
        btnGuardar.textContent = 'Guardar';
        btnGuardar.removeEventListener('click', habilitarEdicionComentario);
        btnGuardar.addEventListener('click', () => guardarEdicionComentario(comentario, li, inputComentario, selectCalificacion));
        
    }

    // Función para guardar la edición de un comentario
    async function guardarEdicionComentario(comentario, li, inputComentario, selectCalificacion) {
        mostrarLoader();
        const nuevoComentario = inputComentario.value.trim();
        const nuevaCalificacion = parseInt(selectCalificacion.value);

        if (!nuevoComentario || isNaN(nuevaCalificacion) || nuevaCalificacion < 1 || nuevaCalificacion > 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos inválidos',
                text: 'Por favor, completa todos los campos con valores válidos.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        try {
            const respuesta = await fetch(`/api/productos/${productoId}/comentarios/${comentario._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comentario: nuevoComentario, calificacion: nuevaCalificacion }),
            });

            if (!respuesta.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al editar el comentario.',
                    toast: true,
                    position: 'top-end'
                });
                throw new Error('Error al editar el comentario.');
            }

            Swal.fire({
                icon: 'success',
                title: 'Comentario editado',
                text: 'Comentario editado exitosamente.',
                toast: true,
                position: 'top-end'
            });

            // Actualizar la interfaz con los nuevos valores
            inputComentario.replaceWith(document.createTextNode(nuevoComentario));
            selectCalificacion.replaceWith(document.createTextNode(`${nuevaCalificacion} ⭐`));

            const btnEditar = li.querySelector('button');
            btnEditar.textContent = 'Editar';
            btnEditar.removeEventListener('click', guardarEdicionComentario);
            btnEditar.addEventListener('click', () => habilitarEdicionComentario(comentario, li));
        } catch (error) {
            console.error('Error al guardar el comentario editado:', error);
            alert('Hubo un error al guardar el comentario editado.');
        } finally {
            ocultarLoader();
            cargarProducto(productoId); // Recargar los comentarios
        }
    }

} catch (error) {
console.error('Error al cargar el producto:', error);
alert('Hubo un error al cargar el producto. Intenta nuevamente.');

}

    const perfil = JSON.parse(localStorage.getItem('usuario'));
    const formComentario = document.getElementById('formComentario');
    const cantidadProducto = document.getElementById('productoAcciones')
    const btnCarrito = document.getElementById('btnCarrito');

    // Mostrar el formulario de comentarios solo si la sesión está activa
    if (perfil) {
        formComentario.style.display = 'block'; 
        cantidadProducto.style.display = 'block';
        btnCarrito.style.display = 'block';
    }

    const modal = document.getElementById('modal');
    const formSesionContainer = document.getElementById('formSesionContainer');
    const iniciarSesionBtn = document.getElementById('iniciarSesion');
    const crearCuentaBtn = document.getElementById('crearCuenta');
    const closeModal = document.getElementById('closeModal');
    const btnSesion = document.getElementById('btnSesion');
    const tco = document.getElementById('TCo');
    const tca = document.getElementById('TCa');
    const emailSesionC = document.getElementById('emailSesionC');
    const passwordSesionC = document.getElementById('passwordSesionC');
    const terminos = document.getElementById('terminos');
    const privacidad = document.getElementById('privacidad');
    const imputTerminos = document.getElementById('imputTerminos');
    const imputPrivacidad = document.getElementById('imputPrivacidad');

    function showModal(container) {
        modal.style.display = 'block';
        formSesionContainer.style.display = 'none';
        container.style.display = 'block';
    }

    function hideModal() {
        modal.style.display = 'none';
        formSesionContainer.style.display = 'none';
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

    iniciarSesionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(formSesionContainer);
        setupLoginForm();
    });

    crearCuentaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(formSesionContainer);
        setupRegisterForm();
    });

    closeModal.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Validación de requisitos de contraseña y coincidencia
    const reqLength = document.getElementById('req-length');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEspecial = document.getElementById('req-especial');
    
    function validarRequisitos(password) {
        let validos = 0;
        if (password.length >= 8) { reqLength.style.color = 'green'; validos++; } else reqLength.style.color = 'red';
        if (/[A-Z]/.test(password)) { reqMayus.style.color = 'green'; validos++; } else reqMayus.style.color = 'red';
        if (/[a-z]/.test(password)) { reqMinus.style.color = 'green'; validos++; } else reqMinus.style.color = 'red';
        if (/\d/.test(password)) { reqNum.style.color = 'green'; validos++; } else reqNum.style.color = 'red';
        if (/[^A-Za-z0-9]/.test(password)) { reqEspecial.style.color = 'green'; validos++; } else reqEspecial.style.color = 'red';
        return validos === 5;
    }

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
            passwordSesionC.style.borderColor = '';
        }
    }

    function validarCorreos() {
        const correo1 = emailSesionC.value.trim();
        const correo2 = emailSesion.value.trim();
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo1) || !regexCorreo.test(correo2)) {
            emailSesionC.style.borderColor = 'red';
            emailSesion.style.borderColor = 'red';
            return false;
        }
        if (correo1 !== correo2) {
            emailSesionC.style.borderColor = 'red';
            emailSesion.style.borderColor = 'red';
            return false;
        }
        emailSesionC.style.borderColor = 'green';
        emailSesion.style.borderColor = 'green';
        return true;
    }

    passwordSesion.addEventListener('input', () => {
        validarRequisitos(passwordSesionC.value);
        validarCoincidencia();
    });
    passwordSesionC.addEventListener('input', validarCoincidencia);
    emailSesionC.addEventListener('input', validarCorreos);
    emailSesion.addEventListener('input', () => {
        if(emailSesionC.style.display !== 'none') {
            validarCorreos();
        }
    });

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

    const crearCuenta = async () => {
        const correo = emailSesionC.value;
        const confirmCo = emailSesion.value;
        const contrasena = passwordSesionC.value;
        const confirmCon = passwordSesion.value;
        const form = document.getElementById('formSesion');

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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al crear la cuenta. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
            });
        }
        hideModal();
        form.reset();
    };

    // Función para manejar el inicio de sesión
    const iniciarSesion = async () => {
        const correo = emailSesion.value;
        const contrasena = passwordSesion.value;
        const form = document.getElementById('formSesion');
        const btnCarrito = document.getElementById('btnCarrito');
        const comentario = document.getElementById('formComentario');

        if (!correo || !contrasena) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        const ipResponse = await fetch('https://api.ipify.org?format=json');
            console.log('IP pública obtenida:', ipResponse);
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
                alert(data.message);

                // Guardar los datos del usuario en Local Storage
                localStorage.setItem('usuario', JSON.stringify(data.user));

                // Cambiar botones a "Perfil" y "Cerrar Sesión"
                iniciarSesionBtn.style.display = 'none';
                crearCuentaBtn.style.display = 'none';

                // Obtener el ul donde se agregarán los elementos
                const listaSesion = document.querySelector('.iniciosesion');

                // Crear el elemento <li> para "Perfil"
                const perfilLi = document.createElement('li');
                const perfilLink = document.createElement('a');
                if (data.user && data.user.nombre && data.user.nombre.trim() !== "") {
                    perfilLink.textContent = data.user.nombre;
                } else {
                    perfilLink.textContent = 'Editar Perfil';
                }
                perfilLink.id = 'perfilBtn';
                perfilLink.href = '#'; // Agregar href para que sea clickeable
                perfilLink.addEventListener('click', () => mostrarPerfil(data.user));
                perfilLi.appendChild(perfilLink); // Agregar el <a> dentro del <li>

                // Crear el elemento <li> para "Cerrar Sesión"
                const cerrarSesionLi = document.createElement('li');
                const cerrarSesionLink = document.createElement('a');
                cerrarSesionLink.textContent = 'Cerrar Sesión';
                cerrarSesionLink.id = 'cerrarSesionBtn';
                cerrarSesionLink.href = '#';
                cerrarSesionLink.addEventListener('click', cerrarSesion);
                cerrarSesionLi.appendChild(cerrarSesionLink); // Agregar el <a> dentro del <li>

                // Agregar ambos elementos al <ul>
                listaSesion.appendChild(perfilLi);
                listaSesion.appendChild(cerrarSesionLi);
                // Agregar el botón de carrito
                btnCarrito.style.display = 'block';
                comentario.style.display = 'block';
                cantidadProducto.style.display = 'block';
                try{
                    const respuesta = await fetch('/api/productos');
        if (!respuesta.ok) {
            throw new Error('Error al cargar los productos.');
        }
        
        const productos = await respuesta.json();
        const producto = productos.find(p => p.id === productoId);
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if(usuario && usuario.rol=='admin'){
            document.getElementById('btnEditar').style.display = 'block';
            document.getElementById('btnEliminar').style.display = 'block';
        
        }else{
            document.getElementById('btnEditar').style.display = 'none';
            document.getElementById('btnEliminar').style.display = 'none';
        };
                }catch(error){
                    console.error('Error al cargar el producto:', error);
                    alert('Hubo un error al cargar el producto. Intenta nuevamente.');
                };
                hideModal();
                form.reset(); // Limpiar el formulario de sesión
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un error al iniciar sesión. Intenta nuevamente.');
        }
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        // Limpiar el Local Storage
        localStorage.removeItem('usuario');
        location.reload();
    };

    // Función para mostrar el perfil del usuario
    const mostrarPerfil = async (user) => {
        try {
            const respuesta = await fetch(`/api/perfil?correo=${user.correo}`);
            const perfil = await respuesta.json();

            if (respuesta.ok) {
                // Redirigir a datos-perfil.html y cargar los datos
                window.location.href = 'datos-perfil.html';
                localStorage.setItem('usuario', JSON.stringify(perfil));
            } else {
                alert(perfil.error);
            }
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            alert('Hubo un error al cargar el perfil. Intenta nuevamente.');
        }
    };

    // Asignar eventos a los botones
    btnSesion.addEventListener('click', (e) => {
        e.preventDefault();
        if (btnSesion.textContent === 'Crear Cuenta') {
            crearCuenta();
        } else if (btnSesion.textContent === 'Iniciar Sesión') {
            iniciarSesion();
        }
    });
    document.getElementById('inicio').addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirigir a la página de inicio
    });



    const agregarAlCarrito = async (idProducto, cantidad) => {
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
            const productoEnCarrito = usuario.carrito.find(item => item.id === idProducto);
            const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
    
            if (cantidadEnCarrito + cantidad > producto.stock) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Stock insuficiente',
                    text: 'No hay suficiente stock disponible para este producto.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }
    
            // Si el producto ya está en el carrito, incrementar la cantidad
            if (productoEnCarrito) {
                productoEnCarrito.cantidad += cantidad;
            } else {
                // Si no está en el carrito, agregarlo con la cantidad especificada
                usuario.carrito.push({ id: idProducto, cantidad });
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
    
    // Función para agregar un producto al carrito
    document.getElementById('btnCarrito').addEventListener('click', () => {
        const productoId = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
        const cantidad = parseInt(document.getElementById('cantidadProducto').value, 10);
    
        if (!productoId || isNaN(cantidad) || cantidad <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cantidad inválida',
                text: 'Por favor, selecciona una cantidad válida.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
    
        agregarAlCarrito(productoId, cantidad);
    });


    const comentario = document.getElementById('formComentario');
    if (usuario) {

        console.log('Sesión activa:', usuario);

        // Mostrar funciones relacionadas con el usuario
        document.getElementById('crearCuenta').style.display = 'none';
        document.getElementById('iniciarSesion').style.display = 'none';

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
        perfilLink.href = '#'; // Agregar href para que sea clickeable
        perfilLink.addEventListener('click', () => mostrarPerfil(usuario));
        perfilLi.appendChild(perfilLink); // Agregar el <a> dentro del <li>

        // Crear el elemento <li> para "Cerrar Sesión"
        const cerrarSesionLi = document.createElement('li');
        const cerrarSesionLink = document.createElement('a');
        cerrarSesionLink.textContent = 'Cerrar Sesión';
        cerrarSesionLink.id = 'cerrarSesionBtn';
        cerrarSesionLink.href = '#';
        cerrarSesionLink.addEventListener('click', cerrarSesion);
        cerrarSesionLi.appendChild(cerrarSesionLink); // Agregar el <a> dentro del <li>

        // Agregar ambos elementos al <ul>
        listaSesion.innerHTML = ''; // Limpiar cualquier contenido previo
        listaSesion.appendChild(perfilLi);
        listaSesion.appendChild(cerrarSesionLi);
        btnCarrito.style.display = 'block';
        cantidadProducto.style.display = 'block'; // Mostrar el campo de cantidad
        comentario.style.display = 'block'; // Mostrar el formulario de comentarios

    } else {
        console.log('No hay sesión activa.');

        // Ocultar funciones relacionadas con el usuario
        document.getElementById('crearCuenta').style.display = 'block';
        document.getElementById('iniciarSesion').style.display = 'block';
        btnCarrito.style.display = 'none'; // Ocultar el botón de carrito si no hay sesión activa
        comentario.style.display = 'none'; // Ocultar el formulario de comentarios si no hay sesión activa
        cantidadProducto.style.display = 'none'; // Ocultar el campo de cantidad si no hay sesión activa
        // Limpiar los elementos de la lista de sesión

    }

    document.getElementById('btnAgregarComentario').addEventListener('click', async (event) => {
        event.preventDefault();
        mostrarLoader();
        const comentarioTexto = document.getElementById('comentarioTexto').value.trim();
        const calificacion = parseFloat(document.getElementById('calificacion').value);
        const productoId = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
        const perfil = JSON.parse(localStorage.getItem('usuario'));

        if (!perfil || !perfil.correo) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión requerida',
                text: 'Por favor, inicia sesión para agregar un comentario.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        if (!comentarioTexto || isNaN(calificacion) || calificacion < 0 || calificacion > 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos inválidos',
                text: 'Por favor, completa todos los campos con valores válidos.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        try {
            const respuesta = await fetch(`/api/productos/${productoId}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: perfil.nombre || 'Usuario Anónimo',
                    correo: perfil.correo, // Aseguramos que el correo del perfil se suba
                    comentario: comentarioTexto,
                    calificacion,
                }),
            });

            if (!respuesta.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al agregar el comentario.',
                    toast: true,
                    position: 'top-end'
                });
                throw new Error('Error al agregar el comentario.');
            }

            Swal.fire({
                icon: 'success',
                title: 'Comentario agregado',
                text: 'Comentario agregado exitosamente.',
                toast: true,
                position: 'top-end'
            });
            CargarComentarios(); // Recargar la página para mostrar el nuevo comentario
        } catch (error) {
            console.error('Error al agregar el comentario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al agregar el comentario.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    });

    // Loader functions
function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

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
            `;
            listaRedes.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar las redes sociales:', error);
    } finally {
        ocultarLoader();
    }
}


    // Mostrar el minimapa en el footer si existe
    const footerMapa = document.getElementById('footer-mapa');
    if (footerMapa) {
        const mapaHTML = localStorage.getItem('footerMapaURL') || '';
        footerMapa.innerHTML = mapaHTML;
    }
CargarComentarios(); // Cargar los comentarios al iniciar
cargarRedesSociales(); // Llamar a la función para cargar redes sociales al iniciar
};


cargarProducto(productoId); // Cargar el producto al iniciar


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
});