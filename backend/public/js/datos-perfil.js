document.addEventListener('DOMContentLoaded', () => {
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

    if (!usuario.correo) {
        Swal.fire({
            icon: 'warning',
            title: 'No hay datos de sesión',
            text: 'Por favor, inicia sesión.',
            toast: true,
            position: 'top-end'
        });
        window.location.href = '/';
        return;
    }
    const btnEditarPerfil = document.getElementById('iniciarSesion'); // Botón "Editar perfil"
    const btnCerrarSesion = document.getElementById('crearCuenta'); // Botón "Cerrar sesión"

    if (usuario && usuario.correo) {
        // Cambiar el texto del botón "Editar perfil" al nombre del usuario
        btnEditarPerfil.textContent = usuario.nombre || 'Editar Perfil';
        btnEditarPerfil.href = 'datos-perfil.html'; // Redirigir a la misma página

        // Asignar la función de cerrar sesión al botón "Cerrar sesión"
        btnCerrarSesion.addEventListener('click', () => {
            localStorage.clear(); // Limpiar el localStorage
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión correctamente.',
            }).then(() => {
                localStorage.removeItem('usuario'); // Limpiar el localStorage
                window.location.href = '/'; // Redirigir al index
            });
        });
    } else {
        // Si no hay una cuenta iniciada, redirigir a la página de inicio de sesión
        btnEditarPerfil.textContent = 'Iniciar Sesión';
        btnEditarPerfil.href = '/'; // Redirigir al index para iniciar sesión

        btnCerrarSesion.style.display = 'none'; // Ocultar el botón "Cerrar sesión"
        Swal.fire({
            icon: 'warning',
            title: 'No hay sesión iniciada',
            text: 'Por favor, inicia sesión para acceder a tu perfil.',
            
        }).then(() => {
            window.location.href = '/'; // Redirigir al index
        });
    }

    

    // Elementos del DOM
    const nombrePerfil = document.getElementById('nombrePerfil');
    const apellidoPerfil = document.getElementById('apellidoPerfil');
    const telefono = document.getElementById('telefono');
    const emailPerfil = document.getElementById('emailPerfil');
    const descripcionPerfil = document.getElementById('descripcionPerfil');
    const btnGuardarCambios = document.getElementById('btnPerfil');
    const btnAgregarDireccion = document.getElementById('btnDireccion');
    const btnBorrarDireccion = document.getElementById('btnBorrarDireccion');
    const btnAgregarTarjeta = document.getElementById('btnAgregarTarjeta');
    const btnBorrarTarjeta = document.getElementById('btnBorrarTarjeta');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const formTarjetaContainer = document.getElementById('formTarjetaContainer');
    const formDireccionContainer = document.getElementById('formDireccionContainer');
    const btnGuardarDireccion = document.getElementById('btnGuardarDireccion');
    const btnGuardarTarjeta = document.getElementById('btnGuardarTarjeta');
    const formDireccion = document.getElementById('formDireccion');
    const formTarjeta = document.getElementById('formTarjeta');
    const paisSelect = document.getElementById('pais');
    const ciudadSelect = document.getElementById('ciudad');
    const departamentoSelect = document.getElementById('departamento');
    const eliminarCuenta = document.getElementById('btnEliminarCuenta');

    let direccionSeleccionada = null;
    let tarjetaSeleccionada = null;


    // Función para actualizar el localStorage
    const actualizarLocalStorage = () => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        console.log(usuario);
    };

    // Actualizar el perfil en el localStorage al escribir en los campos
    nombrePerfil.addEventListener('input', (event) => {
        usuario.nombre = event.target.value;
        actualizarLocalStorage();
    });

    apellidoPerfil.addEventListener('input', (event) => {
        usuario.apellido = event.target.value;
        actualizarLocalStorage();
    });

    telefono.addEventListener('input', (event) => {
        usuario.telefono = event.target.value;
        actualizarLocalStorage();
    });

    descripcionPerfil.addEventListener('input', (event) => {
        usuario.descripcion = event.target.value;
        actualizarLocalStorage();
    });

    // Función para cargar el perfil en el DOM
    const cargarPerfil = () => {
        nombrePerfil.value = usuario.nombre || '';
        apellidoPerfil.value = usuario.apellido || '';
        telefono.value = usuario.telefono || '';
        emailPerfil.value = usuario.correo || '';
        emailPerfil.disabled = true; // Hacer el correo no modificable
        descripcionPerfil.value = usuario.descripcion || '';

        // Cargar direcciones
        const tablaDirecciones = document.querySelector('#tablaDirecciones tbody');
    tablaDirecciones.innerHTML = ''; // Limpiar la tabla antes de cargar las direcciones

    usuario.direccion.forEach((direccion, index) => {
        const fila = document.createElement('tr');
        fila.dataset.index = index;

        fila.innerHTML = `
            <td>${direccion.Calle}</td>
            <td>${direccion.Carrera}</td>
            <td>${direccion.Casa}</td>
            <td>${direccion.Piso}</td>
            <td>${direccion.CodigoPostal}</td>
            <td>${direccion.Departamento}</td>
            <td>${direccion.Ciudad}</td>
            <td>${direccion.Pais}</td>
        `;

        fila.addEventListener('click', () => {
            // Si la fila ya está seleccionada, deseleccionarla
            if (fila.classList.contains('selected')) {
                fila.classList.remove('selected');
                direccionSeleccionada = null;
            } else {
                // Deseleccionar la fila previamente seleccionada
                if (direccionSeleccionada) {
                    direccionSeleccionada.classList.remove('selected');
                }
                direccionSeleccionada = fila;
                direccionSeleccionada.classList.add('selected');
            }
        });

        tablaDirecciones.appendChild(fila);
    });

    document.getElementById('inicio').addEventListener('click', () => {
        window.location.href = '/'; // Redirigir a la página de inicio
    });
        

        // Cargar tarjetas
        const tablaTarjetas = document.querySelector('#tablaTarjetas tbody');
    tablaTarjetas.innerHTML = ''; // Limpiar la tabla antes de cargar las tarjetas

    usuario.tarjeta.forEach((tarjeta, index) => {
        const fila = document.createElement('tr');
        fila.dataset.index = index;

        // Validar que el número de tarjeta no sea undefined antes de usar slice
        const numeroTarjeta = tarjeta.Numero ? tarjeta.Numero.slice(-4) : '****';

        fila.innerHTML = `
            <td>${tarjeta.Titular}</td>
            <td id="numeroCard">**** **** **** ${numeroTarjeta}</td>
            <td id="cvc">***</td>
            <td>${tarjeta.FechaVencimiento || 'Sin fecha'}</td>
            <td>
                <button type="button" class="btnToggleDetalles">Mostrar</button>
            </td>
        `;

        const btnToggleDetalles = fila.querySelector('.btnToggleDetalles');
        btnToggleDetalles.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const cvcCell = fila.querySelector('#cvc');
            const numeroCardCell = fila.querySelector('#numeroCard');
            if (cvcCell.textContent === '***') {
                cvcCell.textContent = tarjeta.CVC || '***';
            } else {
                cvcCell.textContent = '***';
            }
            if (numeroCardCell.textContent === `**** **** **** ${numeroTarjeta}`) {
                numeroCardCell.textContent = tarjeta.Numero || '**** **** **** ****';
            } else {
                numeroCardCell.textContent = `**** **** **** ${numeroTarjeta}`;
            }

        });

        fila.addEventListener('click', () => {
            // Si la fila ya está seleccionada, deseleccionarla
            if (fila.classList.contains('selected')) {
                fila.classList.remove('selected');
                tarjetaSeleccionada = null;
            } else {
                // Deseleccionar la fila previamente seleccionada
                if (tarjetaSeleccionada) {
                    tarjetaSeleccionada.classList.remove('selected');
                }
                tarjetaSeleccionada = fila;
                tarjetaSeleccionada.classList.add('selected');
            }
        });

        tablaTarjetas.appendChild(fila);
    });
    };

    // Función para cargar países, departamentos y ciudades desde la API
    const cargarUbicaciones = () => {
        fetch('/api/ubicaciones')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar las ubicaciones desde la API.');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !Array.isArray(data)) {
                    throw new Error('La estructura de los datos de ubicaciones no es válida.');
                }
    
                // Poblar el selector de países
                data.forEach(pais => {
                    const option = document.createElement('option');
                    option.value = pais.nombre;
                    option.textContent = pais.nombre;
                    paisSelect.appendChild(option);
                });
    
                // Evento para actualizar departamentos al seleccionar un país
                paisSelect.addEventListener('change', () => {
                    const paisSeleccionado = data.find(pais => pais.nombre === paisSelect.value);
                    departamentoSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
                    ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    
                    if (paisSeleccionado) {
                        paisSeleccionado.departamentos.forEach(departamento => {
                            const option = document.createElement('option');
                            option.value = departamento.nombre;
                            option.textContent = departamento.nombre;
                            departamentoSelect.appendChild(option);
                        });
    
                        departamentoSelect.addEventListener('change', () => {
                            const departamentoSeleccionado = paisSeleccionado.departamentos.find(departamento => departamento.nombre === departamentoSelect.value);
                            ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    
                            if (departamentoSeleccionado) {
                                departamentoSeleccionado.ciudades.forEach(ciudad => {
                                    const option = document.createElement('option');
                                    option.value = ciudad.nombre; // Ajustado para usar el campo "nombre" de la ciudad
                                    option.textContent = ciudad.nombre;
                                    ciudadSelect.appendChild(option);
                                });
                            }
                        });
                    }
                });
            })
            .catch(error => console.error('Error al cargar ubicaciones:', error));
    };

    // Función para guardar una nueva dirección
    const guardarDireccion = () => {
        // Obtener valores
        const calle = document.getElementById('calle').value.trim();
        const carrera = document.getElementById('carrera').value.trim();
        const casa = document.getElementById('piso').value.trim();
        const piso = document.getElementById('dpto').value.trim();
        const codigoPostal = document.getElementById('cp').value.trim();
        const departamento = document.getElementById('departamento').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const pais = document.getElementById('pais').value.trim();

        // Validaciones
        const soloLetrasNumEsp = /^[A-Za-z0-9\s]+$/;
        if (!calle || !carrera || !casa || !piso || !codigoPostal || !departamento || !ciudad || !pais) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos de la dirección.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
        if (!soloLetrasNumEsp.test(calle) || calle.length > 50) {
            Swal.fire({ icon: 'warning', title: 'Calle inválida', text: 'La calle solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
            return;
        }
        if (!soloLetrasNumEsp.test(carrera) || carrera.length > 50) {
            Swal.fire({ icon: 'warning', title: 'Carrera inválida', text: 'La carrera solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
            return;
        }
        if (!soloLetrasNumEsp.test(casa) || casa.length > 50) {
            Swal.fire({ icon: 'warning', title: 'Casa inválida', text: 'La casa solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
            return;
        }
        if (!soloLetrasNumEsp.test(piso) || piso.length > 50) {
            Swal.fire({ icon: 'warning', title: 'Piso inválido', text: 'El piso solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
            return;
        }
        if (!/^[0-9]{4,10}$/.test(codigoPostal)) {
            Swal.fire({ icon: 'warning', title: 'Código Postal inválido', text: 'El código postal debe tener entre 4 y 10 dígitos numéricos.', toast: true, position: 'top-end' });
            return;
        }
        if (!departamento) {
            Swal.fire({ icon: 'warning', title: 'Departamento requerido', text: 'Selecciona un departamento.', toast: true, position: 'top-end' });
            return;
        }
        if (!ciudad) {
            Swal.fire({ icon: 'warning', title: 'Ciudad requerida', text: 'Selecciona una ciudad.', toast: true, position: 'top-end' });
            return;
        }
        if (!pais) {
            Swal.fire({ icon: 'warning', title: 'País requerido', text: 'Selecciona un país.', toast: true, position: 'top-end' });
            return;
        }

        const nuevaDireccion = {
            Calle: calle,
            Carrera: carrera,
            Casa: casa,
            Piso: piso,
            CodigoPostal: codigoPostal,
            Departamento: departamento,
            Ciudad: ciudad,
            Pais: pais
        };
        usuario.direccion.push(nuevaDireccion);
        actualizarLocalStorage();
        hideModal();
        cargarPerfil();
    };

    // Función para guardar una nueva tarjeta
    const guardarTarjeta = () => {
        const titular = document.getElementById('nombreTarjeta').value;
        const numero = document.getElementById('numeroTarjeta').value;
        const cvc = document.getElementById('cvc').value;
        const fechaVencimiento = document.getElementById('fechaExpiracion').value;

        // Validar que todos los campos estén llenos
        if (!titular || !numero || !cvc || !fechaVencimiento) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos de la tarjeta.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        // Validar el formato del número de tarjeta (16 dígitos)
        const numeroTarjetaSinEspacios = numero.replace(/\s+/g, '');
        if (!/^\d{16}$/.test(numeroTarjetaSinEspacios)) {
            Swal.fire({
                icon: 'warning',
                title: 'Número de tarjeta inválido',
                text: 'El número de tarjeta debe tener 16 dígitos.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
        // Validar el formato del CVC (3 dígitos)
        if (!/^\d{3}$/.test(cvc)) {
            Swal.fire({
                icon: 'warning',
                title: 'CVC inválido',
                text: 'El CVC debe tener 3 dígitos.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
        // Validar el formato de la fecha de vencimiento (MM/AA)
        const fechaRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!fechaRegex.test(fechaVencimiento)) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha de vencimiento inválida',
                text: 'La fecha de vencimiento debe tener el formato MM/AA.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
        // Validar que la fecha de vencimiento no esté en el pasado
        const [mes, anio] = fechaVencimiento.split('/').map(Number);
        const fechaActual = new Date();
        const fechaVencimientoDate = new Date(2000 + anio, mes - 1); // Ajustar el año para la comparación
        if (fechaVencimientoDate < fechaActual) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha de vencimiento pasada',
                text: 'La fecha de vencimiento no puede estar en el pasado.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
        // Si todas las validaciones pasan, guardar la tarjeta
        const nuevaTarjeta = {
            Titular: titular,
            Numero: numero.trim(), // Cambiar "numero" a "Numero" para coincidir con el esquema
            CVC: cvc.trim(),
            FechaVencimiento: fechaVencimiento.trim() // Cambiar "Fecha" a "FechaVencimiento" para coincidir con el esquema
        };

        usuario.tarjeta.push(nuevaTarjeta);
        actualizarLocalStorage();
        hideModal();
        cargarPerfil();
    };

    // Función para borrar la dirección seleccionada
    const borrarDireccion = () => {
        if (direccionSeleccionada) {
            const index = direccionSeleccionada.dataset.index;
            usuario.direccion.splice(index, 1);
            actualizarLocalStorage();
            cargarPerfil();
            direccionSeleccionada = null;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Sin selección',
                text: 'Por favor, selecciona una dirección para borrar.',
                toast: true,
                position: 'top-end'
            });
        }
    };

    // Función para borrar la tarjeta seleccionada
    const borrarTarjeta = () => {
        if (tarjetaSeleccionada) {
            const index = tarjetaSeleccionada.dataset.index;
            usuario.tarjeta.splice(index, 1);
            actualizarLocalStorage();
            cargarPerfil();
            tarjetaSeleccionada = null;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Sin selección',
                text: 'Por favor, selecciona una tarjeta para borrar.',
                toast: true,
                position: 'top-end'
            });
        }
    };



    // Ajustar el envío de datos para que todos los campos de la tarjeta se envíen correctamente
    const subirPerfilAlServidor = async () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!usuario || !usuario.correo) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin perfil',
                text: 'No hay datos de perfil.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        mostrarLoader();
        try {
            const datosParaEnviar = {
                correo: usuario.correo,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                telefono: usuario.telefono,
                descripcion: usuario.descripcion,
                direccion: usuario.direccion,
                tarjeta: usuario.tarjeta.map(t => ({
                    Titular: t.Titular,
                    Numero: t.Numero,
                    CVC: t.CVC,
                    FechaVencimiento: t.FechaVencimiento
                })),
                carrito: usuario.carrito || []
            };

            console.log('Datos que se enviarán al servidor:', datosParaEnviar);

            const respuesta = await fetch('/api/perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosParaEnviar)
            });

            if (!respuesta.ok) {
                const error = await respuesta.json();
                console.error('Error en la respuesta del servidor:', error);
                throw new Error(error.error || 'Error al subir el perfil al servidor.');
            }

            const data = await respuesta.json();
            Swal.fire({
                icon: 'success',
                title: 'Perfil subido',
                text: 'Perfil subido actualizado correctamente.'
            });
            console.log('Respuesta del servidor:', data);
        } catch (error) {
            console.error('Error al subir el perfil al servidor:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al subir el perfil: ${error.message}`,
                toast: true,
                position: 'top-end'
            });
        } finally {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            // Limpiar el localStorage si es necesario
            ocultarLoader();
        }
    };

    // Obtener todas las direcciones
    const direcciones = document.querySelectorAll('.direccion-item');

    // Iterar sobre cada dirección y obtener sus valores
    direcciones.forEach((direccion) => {
        const calle = direccion.querySelector('.calle').textContent;
        const carrera = direccion.querySelector('.carrera').textContent;
        const casa = direccion.querySelector('.casa').textContent;
        const piso = direccion.querySelector('.piso').textContent;
        const codigoPostal = direccion.querySelector('.codigo-postal').textContent;
        const departamento = direccion.querySelector('.departamento').textContent;
        const ciudad = direccion.querySelector('.ciudad').textContent;
        const pais = direccion.querySelector('.pais').textContent;
    });

    // Obtener todas las tarjetas
    const tarjetas = document.querySelectorAll('.tarjeta-item');

    // Iterar sobre cada tarjeta y obtener sus valores
    tarjetas.forEach((tarjeta) => {
        const titular = tarjeta.querySelector('.titular').textContent;
        const numero = tarjeta.querySelector('.numero').textContent;
        const cvc = tarjeta.querySelector('.cvc').textContent;
        const fechaVencimiento = tarjeta.querySelector('.fecha-vencimiento').textContent;

        console.log({ titular, numero, cvc, fechaVencimiento });
    });

    // Asignar eventos a los botones
    btnGuardarCambios.addEventListener('click', () => {
        subirPerfilAlServidor();
    });
    btnAgregarDireccion.addEventListener('click', () => showModal(formDireccionContainer));
    btnBorrarDireccion.addEventListener('click', borrarDireccion);
    btnAgregarTarjeta.addEventListener('click', () => showModal(formTarjetaContainer));
    btnBorrarTarjeta.addEventListener('click', borrarTarjeta);
    btnGuardarDireccion.addEventListener('click', guardarDireccion);
    btnGuardarTarjeta.addEventListener('click', guardarTarjeta);
    closeModal.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    cargarPerfil();
    cargarUbicaciones(); // Cargar países, ciudades y departamentos

    const inputNumeroTarjeta = document.getElementById('numeroTarjeta');

    inputNumeroTarjeta.addEventListener('input', (event) => {
        let valor = event.target.value;

        // Eliminar todos los espacios existentes
        valor = valor.replace(/\s+/g, '');

        // Limitar a un máximo de 16 dígitos
        valor = valor.slice(0, 16);

        // Agregar un espacio cada 4 dígitos
        valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');

        // Actualizar el valor del input
        event.target.value = valor;
    });

    // Evitar que se ingresen caracteres no numéricos
    inputNumeroTarjeta.addEventListener('keypress', (event) => {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    });

    const inputFechaExpiracion = document.getElementById('fechaExpiracion');

    inputFechaExpiracion.addEventListener('input', (event) => {
        let valor = event.target.value;

        // Eliminar cualquier carácter no numérico
        valor = valor.replace(/[^0-9]/g, '');

        // Agregar el "/" automáticamente después de los primeros 2 dígitos
        if (valor.length > 2) {
            valor = valor.slice(0, 2) + '/' + valor.slice(2);
        }

        // Limitar a un máximo de 5 caracteres (MM/YY)
        valor = valor.slice(0, 5);

        // Actualizar el valor del input
        event.target.value = valor;
    });

    // Evitar que se ingresen caracteres no numéricos o más de 5 caracteres
    inputFechaExpiracion.addEventListener('keypress', (event) => {
        if (!/[0-9]/.test(event.key) || inputFechaExpiracion.value.length >= 5) {
            event.preventDefault();
        }
    });

    eliminarCuenta.addEventListener('click', async () => {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará tu cuenta permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                const respuesta = await fetch(`/api/usuarios/${usuario.correo}`, {
                                    method: 'DELETE'
                                });
                if (!respuesta.ok) {
                    throw new Error('Error al eliminar la cuenta.');
                }

                localStorage.removeItem('usuario');
                Swal.fire({
                    icon: 'success',
                    title: 'Cuenta eliminada',
                    text: 'Tu cuenta ha sido eliminada exitosamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    localStorage.removeItem('usuario'); // Limpiar el localStorage
                    window.location.href = '/'; // Redirigir al index
                });
            } catch (error) {
                console.error('Error al eliminar la cuenta:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No se pudo eliminar la cuenta: ${error.message}`,
                    confirmButtonText: 'Aceptar',
                    toast: true,
                    position: 'top-end'
                });
            }
        }
    });

    // Llamadas a funciones globales de loader, redes y mapa
    cargarRedesSociales(); // Llamar a la función para cargar redes sociales al iniciar
    renderMapaFooter(); // Llamar a la función para renderizar el mapa en el footer
});