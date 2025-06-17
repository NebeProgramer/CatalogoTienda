// Obtener los datos de la compra desde el backend
const cargarDatosCompra = async () => {
    mostrarLoader();
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const factura = window.location.pathname.split('/').pop()

        if (!factura) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Falta código de factura',
                text: 'No se proporcionó un código de factura.'
            });
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.correo) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Usuario no encontrado',
                text: 'No se encontró información del usuario.'
            });
            return;
        }

        let registroCompras;

        // Intentar obtener los datos desde la base de datos
        const respuesta = await fetch(`/api/usuarios/${usuario.correo}/compras?factura=${factura}`);
        if (respuesta.ok) {
            registroCompras = await respuesta.json();
        } else {
            console.warn('No se pudo obtener los datos desde la base de datos. Usando localStorage como respaldo.');
            registroCompras = usuario.registroCompras || [];
        }

        if (!registroCompras || registroCompras.length === 0) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Sin compras',
                text: 'No se encontraron compras registradas.'
            });
            return;
        }

        // Filtrar las compras por el código de factura
        const productosFactura = registroCompras.filter(item => item.factura === factura);

        if (productosFactura.length === 0) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Sin productos',
                text: 'No se encontraron productos para la factura proporcionada.'
            });
            return;
        }

        // Llenar los detalles de la compra
        const detalleCompra = document.getElementById('detalle-compra');
        productosFactura.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>$${(producto.cantidad * producto.precio).toFixed(2)}</td>
            `;
            detalleCompra.appendChild(row);
        });

        // Calcular el total general
        const totalGeneral = productosFactura.reduce((total, producto) => total + producto.cantidad * producto.precio, 0);
        document.getElementById('total-compra').innerHTML = `<strong>Total General:</strong> $${totalGeneral.toFixed(2)}`;

        // Llenar la información del comprador
        document.getElementById('nombre-comprador').querySelector('span').textContent = usuario.nombre || 'N/A';
        document.getElementById('direccion-envio').querySelector('span').textContent = productosFactura[0].direccion || 'N/A';
        const numeroTarjeta = productosFactura[0].tarjeta || 'N/A';
        const tarjetaEnmascarada = numeroTarjeta.replace(/.(?=.{4})/g, '*'); // Enmascarar todo excepto los últimos 4 dígitos
        document.getElementById('Numero-de-Tarjeta').querySelector('span').textContent = tarjetaEnmascarada;

        // Mostrar el código de factura y la fecha
        const codigoFactura = document.createElement('p');
        codigoFactura.innerHTML = `<strong>Código de Factura:</strong> ${factura}`;
        document.getElementById('resumen-compra').appendChild(codigoFactura);

        const fechaFactura = document.createElement('p');
        const fecha = new Date(productosFactura[0].fecha);
        fechaFactura.innerHTML = `<strong>Fecha de Factura:</strong> ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
        document.getElementById('resumen-compra').appendChild(fechaFactura);
    } catch (error) {
        console.error('Error al cargar los datos de la compra:', error);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al cargar los datos de la compra.'
        });
    } finally {
        ocultarLoader();
    }
};

// Botón para regresar al inicio
document.getElementById('btn-regresar').addEventListener('click', () => {
    window.location.href = '/';
});

// Cargar los datos de la compra al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosCompra);

// Funciones para mostrar y ocultar el loader
const mostrarLoader = () => {
    document.getElementById('loader').style.display = 'block';
};
const ocultarLoader = () => {
    document.getElementById('loader').style.display = 'none';
};