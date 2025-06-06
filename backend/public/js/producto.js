let imagenesSeleccionadas = []; // Arreglo para almacenar las imágenes seleccionadas
document.addEventListener('DOMContentLoaded', async () => {
    
    mostrarLoader();
    cargarRedesSociales();
    renderMapaFooter();
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
// Limpiar el carrusel antes de agregar nuevas imágenes
carrusel.innerHTML = ''; // Limpiar el carrusel existente
// Verificar si el producto tiene imágenes
if (!producto.imagenes || producto.imagenes.length === 0) {
    const imgPlaceholder = document.createElement('img');
    imgPlaceholder.src = 'https://via.placeholder.com/300'; // Imagen de placeholder
    imgPlaceholder.alt = 'Imagen no disponible';
    imgPlaceholder.classList.add('carruselProd-imagen');
    carrusel.appendChild(imgPlaceholder);
    ocultarLoader();
    return; // Salir si no hay imágenes
}

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
            if(btnEditar.textContent === 'Editar') {
                btnEditar.removeEventListener('click', guardarEdicionComentario);
                btnEditar.addEventListener('click', () => habilitarEdicionComentario(comentario, li));
            }else{
                btnEditar.removeEventListener('click', habilitarEdicionComentario);
                btnEditar.addEventListener('click', () => guardarEdicionComentario(comentario, li));
            }
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
    const emailSesion = document.getElementById('emailSesion');
    const passwordSesion = document.getElementById('passwordSesion');
    const emailSesionC = document.getElementById('emailSesionC');
    const passwordSesionC = document.getElementById('passwordSesionC');
    const terminos = document.getElementById('terminos');
    const privacidad = document.getElementById('privacidad');
    const imputTerminos = document.getElementById('imputTerminos');
    const imputPrivacidad = document.getElementById('imputPrivacidad');
    const reqLength = document.getElementById('req-length');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEspecial = document.getElementById('req-especial');
    const olvidoContainerbtn = document.getElementById('olvidoContrasena');
    const olvidoContainer = document.getElementById('formOlvidoContainer');


    
    // --- Sesión reutilizable ---
    olvidoContainerbtn.addEventListener('click', function (e) {
        e.preventDefault();
        formSesionContainer.style.display = 'none';
        showModal(olvidoContainer, modal, formSesionContainer, olvidoContainer, null, null);
    });

    iniciarSesionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setupLoginForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer, null, null);
    });

    crearCuentaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setupRegisterForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer, null, null);
    });

    closeModal.addEventListener('click', () => hideModal(modal, formSesionContainer, olvidoContainer, null, null));

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal(modal, formSesionContainer, olvidoContainer, null, null);
        }
    });

    // Validación de requisitos de contraseña y coincidencia
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

    // Lógica para recuperación de contraseña
    const formOlvido = document.getElementById('formOlvidoContrasena');
    if (formOlvido) {
        formOlvido.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correoRecuperar = document.getElementById('emailOlvido').value.trim();
            await recuperarContraseña(correoRecuperar, Swal, () => hideModal(modal, formSesionContainer, olvidoContainer, null, null));
        });
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
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer, null, null),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD: null,
                perfiles: null,
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
                hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer, null, null),
                formSesion: form.sesion,
                btnSesion,
                mostrarPerfil,
                cerrarSesion,
                openCRUD: null,
                perfiles: null,
                carrito
            });
        }
    });
    CargarComentarios();
ocultarLoader();
}
cargarProducto(productoId);

});