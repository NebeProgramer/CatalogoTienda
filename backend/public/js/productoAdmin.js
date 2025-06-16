let imagenesSeleccionadas = []; // Arreglo para almacenar las imágenes seleccionadas
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productoId = parseInt(window.location.pathname.split('/').pop(), 10);
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    


const formularioProducto = document.getElementById('formularioProducto');
        formularioProducto.style.display = 'block';
    
// Loader functions
function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

async function cargarMonedas() {
    mostrarLoader();
    try {
        const respuesta = await fetch('/api/monedas');
        if (!respuesta.ok) {
            throw new Error('Error al cargar las monedas.');
        }

        const monedas = await respuesta.json();
        const selectorMonedas = document.getElementById('monedas');
        selectorMonedas.innerHTML = ''; // Limpiar las opciones existentes

        monedas.forEach((moneda) => {
            const opcion = document.createElement('option');
            opcion.value = moneda.moneda;
            opcion.textContent = `${moneda.nombre} (${moneda.moneda})`;
            selectorMonedas.appendChild(opcion);
        });

        // Seleccionar la moneda del producto si está definida
        const productoMoneda = document.getElementById('monedas').dataset.moneda;
        if (productoMoneda) {
            selectorMonedas.value = productoMoneda;
        }
    } catch (error) {
        console.error('Error al cargar las monedas:', error);
        alert('Hubo un error al cargar las monedas. Intenta nuevamente.');
    } finally {
        ocultarLoader();
    }
}

async function cargarCategorias() {
    mostrarLoader();
    try {
        const respuesta = await fetch('/api/categorias');
        if (!respuesta.ok) {
            throw new Error('Error al cargar las categorías.');
        }

        const categorias = await respuesta.json();
        const selectorCategorias = document.getElementById('categorias');
        selectorCategorias.innerHTML = ''; // Limpiar las opciones existentes

        categorias.forEach((categoria) => {
            const opcion = document.createElement('option');
            opcion.value = categoria.nombre;
            opcion.textContent = categoria.nombre;
            selectorCategorias.appendChild(opcion);
        });

        // Seleccionar la categoría del producto si está definida
        const productoCategoria = document.getElementById('categorias').dataset.categoria;
        if (productoCategoria) {
            selectorCategorias.value = productoCategoria;
        }
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        alert('Hubo un error al cargar las categorías. Intenta nuevamente.');
    } finally {
        ocultarLoader();
    }
}

    await cargarMonedas();
    await cargarCategorias();
if (productoId === '0') {
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('categorias').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('monedas').value = '';
    document.getElementById('stock').value = '';
    const carruselItemsModal = document.querySelector('.carrusel-itemsModal');
    carruselItemsModal.innerHTML = ''; // Limpiar el carrusel de imágenes
    imagenesSeleccionadas = []; // Limpiar el arreglo de imágenes seleccionadas
}else{
    if (Number.isNaN(productoId) || productoId <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Producto inexistente',
                text: 'No se encontró el producto.',
                toast: true,
                position: 'top-end'
            });
            window.location.href = '/admin';
            return;
        }

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
        icon: 'error',
        title: 'Producto no encontrado',
        text: 'Producto no encontrado.',
        toast: true,
        position: 'top-end'
    });
    window.location.href = '/admin';
    return;
}

// Mostrar la información del producto en formularioProducto
document.getElementById('nombre').value = producto.nombre;
document.getElementById('descripcion').value = producto.descripcion;
document.getElementById('categorias').value = producto.categoria;
document.getElementById('precio').value = producto.precio;
document.getElementById('monedas').value = producto.moneda;
document.getElementById('stock').value = producto.stock;

const carruselItemsModal = document.querySelector('.carrusel-itemsModal');
carruselItemsModal.innerHTML = ''; // Limpiar el carrusel modal
imagenesSeleccionadas = []; // Limpiar el arreglo global de imágenes seleccionadas

producto.imagenes.forEach((imagen, index) => {
    imagenesSeleccionadas.push(imagen); // Agregar la imagen al arreglo global

    const item = document.createElement('div');
    item.classList.add('carrusel-itemModal');

    const img = document.createElement('img');
    img.classList.add('Preview-image');
    img.src = imagen; // Usar la ruta de la imagen
    img.alt = `Imagen ${index + 1}`;
    console.log(imagenesSeleccionadas);
    // Botón para eliminar la imagen del carrusel
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '❌';
    btnEliminar.classList.add('btnEliminarImagen');
    btnEliminar.style.zIndex = '10'; // Asegurarse de que el botón esté por encima de la imagen
    btnEliminar.addEventListener('click', () => {
        // Eliminar la imagen del arreglo y volver a renderizar
        imagenesSeleccionadas.splice(index, 1);
        actualizarCarrusel();
    });

    item.appendChild(img);
    item.appendChild(btnEliminar);
    carruselItemsModal.appendChild(item);
});

carruselItemsModal.innerHTML = ''; // Limpiar el carrusel modal
imagenesSeleccionadas = []; // Limpiar el arreglo global de imágenes seleccionadas

producto.imagenes.forEach((imagen, index) => {
    imagenesSeleccionadas.push(imagen); // Agregar la imagen al arreglo global

    const item = document.createElement('div');
    item.classList.add('carrusel-itemModal');

    const img = document.createElement('img');
    img.classList.add('Preview-image');
    img.src = imagen; // Usar la ruta de la imagen
    img.alt = `Imagen ${index + 1}`;

    // Botón para eliminar la imagen del carrusel
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '❌';
    btnEliminar.classList.add('btnEliminarImagen');
    btnEliminar.addEventListener('click', () => {
        // Eliminar la imagen del arreglo y volver a renderizar
        imagenesSeleccionadas.splice(index, 1);
        actualizarCarrusel();
    });

    item.appendChild(img);
    item.appendChild(btnEliminar);
    carruselItemsModal.appendChild(item);
});



} catch (error) {
console.error('Error al cargar el producto:', error);
alert('Hubo un error al cargar el producto. Intenta nuevamente.');
window.location.href = '/admin';
}
}

    
    if (usuario) {

        console.log('Sesión activa:', usuario);

        // Obtener el ul donde se agregarán los elementos
        const listaSesion = document.querySelector('.iniciosesion');

        // Crear el elemento <li> para "Perfil"
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = 'Bienvenido '+usuario.nombre;
        } else {
            perfilLink.textContent = 'Bienvenido Administrador';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#'; // Agregar href para que sea clickeable
        perfilLi.appendChild(perfilLink); // Agregar el <a> dentro del <li>

        

        // Agregar ambos elementos al <ul>
        listaSesion.innerHTML = ''; // Limpiar cualquier contenido previo
        listaSesion.appendChild(perfilLi);
        
        
    } else {
        console.log('No hay sesión activa.');
}


    const guardarProducto = async () => {
        mostrarLoader();
        try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!usuario) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión requerida',
                text: 'Por favor, inicia sesión para realizar esta acción.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const categoria = document.getElementById('categorias').value.trim();
        const precio = document.getElementById('precio').value.trim();
        const moneda = document.getElementById('monedas').value.trim();
        const stock = document.getElementById('stock').value.trim();

        if (!nombre || !descripcion || !categoria || !precio || !moneda || !stock) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos obligatorios.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('categoria', categoria);
        formData.append('precio', precio);
        formData.append('moneda', moneda);
        formData.append('stock', stock);
        formData.append('correo', usuario.correo); // Asociar el producto al usuario

        // Agregar las imágenes seleccionadas al FormData
        imagenesSeleccionadas.forEach((archivo) => {
            formData.append('imagenes', archivo);
        });

            const respuesta = await fetch('/api/productos', {
                method: 'POST',
                body: formData,
            });

            const data = await respuesta.json();
            if (respuesta.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto creado',
                    text: 'Producto creado exitosamente.',
                    toast: true,
                    position: 'top-end'
                });
                console.log(data);
                imagenesSeleccionadas = [];
                window.location.href = '/admin';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al crear el producto.',
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al guardar el producto.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    };

    // Función para actualizar un producto
    const actualizarProducto = async () => {
        mostrarLoader();
        try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión requerida',
                text: 'Por favor, inicia sesión para realizar esta acción.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const productoId = parseInt(params.get('id'), 10);

        if (Number.isNaN(productoId) || productoId <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Producto inexistente',
                text: 'No se ha seleccionado ningún producto para actualizar.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const categoria = document.getElementById('categorias').value.trim();
        const precio = document.getElementById('precio').value.trim();
        const moneda = document.getElementById('monedas').value.trim();
        const stock = document.getElementById('stock').value.trim();

        if (!nombre || !descripcion || !categoria || !precio || !moneda || !stock) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos obligatorios.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('categoria', categoria);
        formData.append('precio', precio);
        formData.append('moneda', moneda);
        formData.append('stock', stock);
        formData.append('correo', usuario.correo);

        // Procesar imágenes seleccionadas
        imagenesSeleccionadas.forEach((archivo) => {
                formData.append('imagenes', archivo);
            }
        );

            const respuesta = await fetch(`/api/productos/${productoId}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await respuesta.json();
            if (respuesta.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto actualizado',
                    text: 'Producto actualizado exitosamente.',
                    toast: true,
                    position: 'top-end'
                });
                imagenesSeleccionadas = [];
                window.location.href = '/admin'; // Redirigir a la página principal
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Error al actualizar el producto.',
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el producto.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    };

    // Asignar evento al botón "Guardar"
    document.getElementById('btnGuardar').addEventListener('click', (event) => {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const productoId = parseInt(window.location.pathname.split('/').pop(), 10); // Obtener el ID del producto de la URL

        if ( productoId> 0) {
            // Si hay un ID de producto, se trata de una actualización
            actualizarProducto();
        } else {
            // Si no hay un ID de producto, se trata de una creación
            guardarProducto();
            }
const carruselItems = document.querySelector('.carrusel-itemsModal');
        carruselItems.innerHTML = '';
    });

    
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

    // Asignar eventos a los botones del carrusel
    document.querySelector('.carrusel-prevModal').addEventListener('click', (e) => {
        e.preventDefault();
        moveCarrusel(1)
    });
    document.querySelector('.carrusel-nextModal').addEventListener('click', (e) => {
        e.preventDefault();
        moveCarrusel(-1)
    });



// Evento para manejar la selección de imágenes y convertirlas a base64
const manejarSubidaDeImagenes = () => {
        const archivos = Array.from(document.getElementById('imagen').files);

        if (archivos.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin imágenes',
                text: 'Por favor, selecciona al menos una imagen.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const maxSize = 5 * 1024 * 1024; // Tamaño máximo permitido: 5 MB

        archivos.forEach((archivo) => {
            if (archivo.size > maxSize) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo muy grande',
                    text: `El archivo ${archivo.name} excede el tamaño máximo permitido de 5 MB.`,
                    toast: true,
                    position: 'top-end'
                });
                return;
            }

            imagenesSeleccionadas.push(archivo);

            // Crear un elemento de vista previa para la imagen
            const item = document.createElement('div');
            item.classList.add('carrusel-itemModal');

            const img = document.createElement('img');
            img.classList.add('Preview-image');
            img.src = URL.createObjectURL(archivo); // Crear una URL para la vista previa
            img.alt = archivo.name;

            // Botón para eliminar la imagen
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '❌';
            btnEliminar.classList.add('btnEliminarImagen');
            btnEliminar.addEventListener('click', () => {
                const index = imagenesSeleccionadas.indexOf(archivo);
                if (index !== -1) {
                    imagenesSeleccionadas.splice(index, 1);
                    actualizarCarrusel();
                }
            });

            item.appendChild(img);
            item.appendChild(btnEliminar);
            document.querySelector('.carrusel-itemsModal').appendChild(item);
        });
        
    };

document.getElementById('imagen').addEventListener('change', manejarSubidaDeImagenes);

// Función para eliminar la imagen activa del carrusel
// Cambiar la lógica para buscar el índice de la imagen activa usando un ID
function eliminarImagenActiva() {
    const carruselItems = document.querySelector('.carrusel-itemsModal');
    const items = carruselItems.querySelectorAll('.carrusel-itemModal');

    // Buscar el índice de la imagen activa usando un ID
    let activeIndex = -1;
    items.forEach((item, index) => {
        if (item.id === 'active') {
            activeIndex = index;
        }
    });

    if (activeIndex !== -1) {
        imagenesSeleccionadas.splice(activeIndex, 1);
        actualizarCarrusel();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Sin imagen activa',
            text: 'No hay una imagen activa para eliminar.',
            toast: true,
            position: 'top-end'
        });
    }
}

// Actualizar el carrusel para marcar la primera imagen como activa
function actualizarCarrusel() {
    const carruselItems = document.querySelector('.carrusel-itemsModal');
    const items = carruselItems.querySelectorAll('.carrusel-itemModal');

    // Limpiar todos los IDs "active"
    items.forEach((item) => item.removeAttribute('id'));
    // Si hay imágenes seleccionadas, marcar la primera como activa
    if (imagenesSeleccionadas.length > 0) {
        items[0].id = 'active';
    }

    // Renderizar el carrusel nuevamente si es necesario
    carruselItems.innerHTML = ''; // Limpia el carrusel
    imagenesSeleccionadas.forEach((imagen, index) => {
        const item = document.createElement('div');
        item.classList.add('carrusel-itemModal');
        if (index === 0) item.id = 'active'; // Marcar la primera como activa

        const img = document.createElement('img');
        img.classList.add('Preview-image');
        img.src = typeof imagen === 'string' ? imagen : URL.createObjectURL(imagen);
        img.alt = `Imagen ${index + 1}`;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '❌';
        btnEliminar.classList.add('btnEliminarImagen');
        btnEliminar.addEventListener('click', () => {
            imagenesSeleccionadas.splice(index, 1);
            actualizarCarrusel();
        });

        item.appendChild(img);
        item.appendChild(btnEliminar);
        carruselItems.appendChild(item);
    });
}

// Asignar evento al botón de eliminar imagen


// Asignar evento al botón de subir imágenes
document.getElementById('subirImg').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('imagen').click(); // Simular clic en el input de archivo
});

// Asignar evento al botón de eliminar imagen



});