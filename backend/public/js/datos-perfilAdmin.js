document.addEventListener('DOMContentLoaded', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario')) || {
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        descripcion: '',
        direccion: [
            {
                Calle: '',
                Carrera: '',
                Casa: '',
                Piso: '',
                CodigoPostal: '',
                Departamento: '',
                Ciudad: '',
                Pais: ''
            }
        ],
        tarjeta: [
            {
                Titular: '',
                Numero: '',
                CVC: '',
                FechaVencimiento: ''
            }
        ]
    };
    const btnEditarPerfil = document.getElementById('iniciarSesion');
    if (!usuario.correo) {
        alert('No hay datos de sesión. Por favor, inicia sesión.');
        window.location.href = '/admin';
        return;
    }
    if (usuario && usuario.correo) {
        // Cambiar el texto del botón "Editar perfil" al nombre del usuario
        btnEditarPerfil.textContent = 'Bienvenido ' + usuario.nombre;
        btnEditarPerfil.href = 'datos-perfilAdmin.html'; // Redirigir a la misma página

    } else {
        // Si no hay una cuenta iniciada, redirigir a la página de inicio de sesión
        btnEditarPerfil.textContent = 'Iniciar Sesión';
        btnEditarPerfil.href = 'indexAdmin.html'; // Redirigir al index para iniciar sesión
    }

    

    // Elementos del DOM
    const nombrePerfil = document.getElementById('nombrePerfil');
    const apellidoPerfil = document.getElementById('apellidoPerfil');
    const telefono = document.getElementById('telefono');
    const emailPerfil = document.getElementById('correo');
    const descripcionPerfil = document.getElementById('descripcionPerfil');
    const registroCompraList = document.getElementById('registroCompra');
    const adminSwitch = document.getElementById('adminSwitch');
    const formPerfil = document.getElementById('formPerfil');

    let direccionSeleccionada = null;
    let tarjetaSeleccionada = null;

    // Función para mostrar el modal
    
    const actualizarLocalStorage = () => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
    };

    
    const usuariosContainer = document.getElementById('usuariosContainer');
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));

    if (!usuarioSesion) {
        alert('No hay una sesión activa. Por favor, inicia sesión.');
        window.location.href = '/admin';
        return;
    }

    const modalFactura = document.getElementById('modalFactura');
    const cerrarModalFactura = document.getElementById('cerrarModalFactura');
    const detalleFactura = document.getElementById('detalleFactura');

    cerrarModalFactura.addEventListener('click', () => {
        modalFactura.classList.add('oculto');
    });

    const mostrarModalFactura = () => {
        const modalFactura = document.getElementById('modalFactura');
        modalFactura.classList.add('mostrar');
    };

    const ocultarModalFactura = () => {
        const modalFactura = document.getElementById('modalFactura');
        modalFactura.classList.remove('mostrar');
    };

    window.addEventListener('click', (event) => {
        const modalFactura = document.getElementById('modalFactura');
        if (event.target === modalFactura) {
            modalFactura.classList.remove('mostrar');
        }
    });

    cerrarModalFactura.addEventListener('click', ocultarModalFactura);

 
    // Cargar usuarios desde el backend
    const cargarUsuarios = async () => {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/usuarios');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los usuarios.');
            }

            const usuarios = await respuesta.json();
            usuariosContainer.innerHTML = ''; // Limpiar el contenedor

            usuarios.forEach(usuario => {
                // Excluir al usuario en sesión activa
                if (usuario.correo === usuarioSesion.correo) {
                    return;
                }

                // Reemplazar caracteres no válidos en el correo para usarlo como ID
                const idSeguro = usuario.correo.replace(/[^a-zA-Z0-9-_]/g, '-');

                // Crear un contenedor para cada usuario
                const usuarioDiv = document.createElement('div');
                usuarioDiv.classList.add('usuario-card');
                usuarioDiv.innerHTML = `
                    <h3>${usuario.nombre} ${usuario.apellido}</h3>
                    <p><strong>Correo:</strong> ${usuario.correo}</p>
                    <p><strong>Teléfono:</strong> ${usuario.telefono || 'N/A'}</p>
                    <p><strong>Descripción:</strong> ${usuario.descripcion || 'N/A'}</p>
                    <p><strong>Rol:</strong> ${usuario.rol}</p>
                    <label for="adminSwitch-${idSeguro}">Admin:</label>
                    <label class="switch">
                        <input type="checkbox" id="adminSwitch-${idSeguro}" ${usuario.rol === 'admin' ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                    <button class="btn-ver-facturas" data-id="${usuario.correo}">Ver Facturas</button>
                    <button class="btn-eliminar-usuario" data-id="${usuario.correo}">Eliminar Usuario</button>
                    
                `;

                // Agregar evento al botón de eliminar usuario
                const btnEliminarUsuario = usuarioDiv.querySelector('.btn-eliminar-usuario');
                btnEliminarUsuario.addEventListener('click', async () => {
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "No podrás revertir esta acción.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                const respuesta = await fetch(`/api/usuarios/${usuario.correo}`, {
                                    method: 'DELETE'
                                });
                                if (!respuesta.ok) {
                                    throw new Error('Error al eliminar el usuario.');
                                }
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Usuario eliminado',
                                    text: 'El usuario ha sido eliminado exitosamente.',
                                    toast: true,
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                                cargarUsuarios(); // Recargar la lista de usuarios
                            } catch (error) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Hubo un error al eliminar el usuario.',
                                    toast: true,
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                            }
                        }
                    });
                });

                usuariosContainer.appendChild(usuarioDiv);

                //Subir facturas al modal
                const cargarFacturasEnModal = async (correo) => {
    detalleFactura.innerHTML = '';
    try {
        const respuesta = await fetch(`/api/usuarios/${correo}`);
        if (!respuesta.ok) {
            detalleFactura.innerHTML = '<p>Error al obtener las facturas del usuario.</p>';
            return;
        }

        const usuarioData = await respuesta.json();
        const facturasUsuario = usuarioData.registroCompra || [];

        if (facturasUsuario.length === 0) {
            detalleFactura.innerHTML = '<p>No se encontraron facturas para este usuario.</p>';
        } else {
            const tabla = document.createElement('table');
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>Factura</th>
                        <th>Fecha</th>
                        <th>Dirección</th>
                        <th>Tarjeta</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = tabla.querySelector('tbody');

            // Agrupar productos por factura
            const facturasAgrupadas = {};
            facturasUsuario.forEach(f => {
                if (!facturasAgrupadas[f.factura]) {
                    facturasAgrupadas[f.factura] = [];
                }
                facturasAgrupadas[f.factura].push(f);
            });

            // Generar filas agrupadas
            Object.entries(facturasAgrupadas).forEach(([facturaId, productos]) => {
                let totalFactura = 0;

                productos.forEach((producto, index) => {
                    const subtotal = producto.precio * producto.cantidad;
                    totalFactura += subtotal;

                    const fecha = new Date(producto.fecha).toLocaleDateString();
                    const direccion = producto.direccion || '—';
                    const ultimosDigitos = producto.tarjeta?.slice(-4) || '****';
                    const tarjetaFormateada = `**** **** **** ${ultimosDigitos}`;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index === 0 ? facturaId : ''}</td>
                        <td>${index === 0 ? fecha : ''}</td>
                        <td>${index === 0 ? direccion : ''}</td>
                        <td>${index === 0 ? tarjetaFormateada : ''}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.cantidad}</td>
                        <td>$${producto.precio.toFixed(2)}</td>
                        <td>$${subtotal.toFixed(2)}</td>
                    `;
                    tbody.appendChild(row);
                });

                // Fila de total
                const totalRow = document.createElement('tr');
                totalRow.innerHTML = `
                    <td colspan="7" style="text-align: right;"><strong>Total:</strong></td>
                    <td><strong>$${totalFactura.toFixed(2)}</strong></td>
                `;
                tbody.appendChild(totalRow);
            });

            detalleFactura.appendChild(tabla);
        }

        modalFactura.classList.remove('oculto');
    } catch (error) {
        console.error('❌ Error al obtener las facturas:', error);
        detalleFactura.innerHTML = '<p>Error al obtener las facturas del usuario.</p>';
    }
};


                // Agregar evento al botón para mostrar el modal con las facturas
                const btnVerFacturas = usuarioDiv.querySelector('.btn-ver-facturas');
                btnVerFacturas.addEventListener('click', () => {
                    mostrarModalFactura(); // Mostrar el modal
                    cargarFacturasEnModal(usuario.correo); // Cargar las facturas en el modal
                });

                // Agregar evento al switch de admin
                const adminSwitch = usuarioDiv.querySelector(`#adminSwitch-${idSeguro}`);
                adminSwitch.addEventListener('change', async (e) => {
                    const nuevoRol = e.target.checked ? 'admin' : 'usuario';
                    try {
                        const respuesta = await fetch(`/api/usuarios/${usuario.correo}/rol`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ rol: nuevoRol })
                        });

                        if (!respuesta.ok) {
                            throw new Error('Error al actualizar el rol.');
                        }
                       
                        cargarUsuarios(); // Recargar la lista de usuarios
                    } catch (error) {
                        
                        e.target.checked = !e.target.checked; // Revertir el cambio en caso de error
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        } finally {
            ocultarLoader();
        }
    };

    // Loader functions
    function mostrarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex';
    }
    function ocultarLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }

    cargarUsuarios();
});