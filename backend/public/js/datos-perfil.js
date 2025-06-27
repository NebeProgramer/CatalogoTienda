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
    };    // Función para guardar una nueva dirección
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
        const soloLetrasNumEsp = /^[A-Za-z0-9\s#-]+$/;
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
            Swal.fire({ icon: 'warning', title: 'Tipo de vía inválido', text: 'El tipo de vía solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
            return;
        }
        if (!soloLetrasNumEsp.test(carrera) || carrera.length > 50) {
            Swal.fire({ icon: 'warning', title: 'Número principal inválido', text: 'El número principal solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
            return;
        }
        if (!soloLetrasNumEsp.test(casa) || casa.length > 50) {
            Swal.fire({ icon: 'warning', title: 'Número secundario inválido', text: 'El número secundario solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
            return;
        }
        if (!soloLetrasNumEsp.test(piso) || piso.length > 50) {
            Swal.fire({ icon: 'warning', title: 'Complemento inválido', text: 'El complemento solo puede contener letras, números y espacios (máx 50).', toast: true, position: 'top-end' });
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
        ocultarModalUnico();
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
        }        // Validar el formato del número de tarjeta según el tipo
        const numeroTarjetaSinEspacios = numero.replace(/\s+/g, '');
        const tipoTarjeta = detectCardType(numeroTarjetaSinEspacios);
        let longitudValida = false;
        let mensajeError = '';
        switch(tipoTarjeta) {
            case 'amex':
                longitudValida = /^\d{15}$/.test(numeroTarjetaSinEspacios);
                mensajeError = 'El número de tarjeta American Express debe tener 15 dígitos.';
                break;
            case 'diners':
                longitudValida = /^\d{14}$/.test(numeroTarjetaSinEspacios);
                mensajeError = 'El número de tarjeta Diners Club debe tener 14 dígitos.';
                break;            case 'visa':
            case 'mastercard':
            case 'maestro':
            case 'discover':
            case 'jcb':
                longitudValida = /^\d{16}$/.test(numeroTarjetaSinEspacios);
                mensajeError = 'El número de tarjeta debe tener 16 dígitos.';
                break;
            default:
                longitudValida = /^\d{13,19}$/.test(numeroTarjetaSinEspacios);
                mensajeError = 'El número de tarjeta debe tener entre 13 y 19 dígitos.';
        }
        if (!longitudValida) {
            Swal.fire({
                icon: 'warning',
                title: 'Número de tarjeta inválido',
                text: mensajeError,
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
        ocultarModalUnico();
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
    });
    // Asignar eventos a los botones
    btnGuardarCambios.addEventListener('click', () => {
        subirPerfilAlServidor();
    });
    btnAgregarDireccion.addEventListener('click', () => mostrarModalUnico(formDireccionContainer));
    btnBorrarDireccion.addEventListener('click', borrarDireccion);
    btnAgregarTarjeta.addEventListener('click', () => mostrarModalUnico(formTarjetaContainer));
    btnBorrarTarjeta.addEventListener('click', borrarTarjeta);
    btnGuardarDireccion.addEventListener('click', guardarDireccion);
    btnGuardarTarjeta.addEventListener('click', guardarTarjeta);
    closeModal.addEventListener('click', ocultarModalUnico);    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            ocultarModalUnico();
        }
    });    cargarPerfil();
    cargarUbicaciones(); // Cargar países, ciudades y departamentos
    const inputNumeroTarjeta = document.getElementById('numeroTarjeta');    inputNumeroTarjeta.addEventListener('input', (event) => {
        let valor = event.target.value;
        // Eliminar todos los espacios existentes
        valor = valor.replace(/\s+/g, '');
        // Detectar tipo de tarjeta y actualizar logo
        const tipoTarjeta = detectCardType(valor);
        updateCardLogo(tipoTarjeta);
        // Si no hay valor, ocultar el logo
        if (!valor) {
            updateCardLogo('unknown');
        }
        // Determinar longitud máxima según el tipo de tarjeta
        let maxLength = 16; // Por defecto 16 dígitos
        if (tipoTarjeta === 'amex') {
            maxLength = 15; // American Express usa 15 dígitos
        } else if (tipoTarjeta === 'diners') {
            maxLength = 14; // Diners Club usa 14 dígitos
        }
        // Limitar según la longitud máxima del tipo de tarjeta
        valor = valor.slice(0, maxLength);
        // Agregar espacios según el tipo de tarjeta
        if (tipoTarjeta === 'amex') {
            // Amex: 4-6-5 (XXXX XXXXXX XXXXX)
            valor = valor.replace(/(\d{4})(\d{1,6})?(\d{1,5})?/, (match, p1, p2, p3) => {
                let formatted = p1;
                if (p2) formatted += ' ' + p2;
                if (p3) formatted += ' ' + p3;
                return formatted;
            });
        } else {
            // Visa, Mastercard, Discover, etc.: 4-4-4-4 (XXXX XXXX XXXX XXXX)
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
        }
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
    function mostrarModalUnico(formularioAMostrar) {
        const modal = document.getElementById('modal');
        const formTarjetaContainer = document.getElementById('formTarjetaContainer');
        const formDireccionContainer = document.getElementById('formDireccionContainer');
        // Oculta ambos formularios
        formTarjetaContainer.style.display = 'none';
        formDireccionContainer.style.display = 'none';
        // Muestra solo el formulario recibido
        if (formularioAMostrar) {
            formularioAMostrar.style.display = 'block';
        }
        // Muestra el modal
        modal.style.display = 'block';
    }
    function ocultarModalUnico() {
        const modal = document.getElementById('modal');
        const formTarjetaContainer = document.getElementById('formTarjetaContainer');
        const formDireccionContainer = document.getElementById('formDireccionContainer');
        modal.style.display = 'none';
        formTarjetaContainer.style.display = 'none';
        formDireccionContainer.style.display = 'none';
    }
    // Elementos del avatar
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarInput = document.getElementById('avatarInput');
    const btnCambiarAvatar = document.getElementById('btnCambiarAvatar');
    const btnEliminarAvatar = document.getElementById('btnEliminarAvatar');
    // Funcionalidad del avatar    const inicializarAvatar = () => {
        // Mostrar la imagen actual del usuario
        if (usuario.fotoGoogle && usuario.fotoGoogle.trim() !== "") {
            avatarPreview.src = usuario.fotoGoogle;
        } else if (usuario.fotoPerfil && usuario.fotoPerfil.trim() !== "") {
            avatarPreview.src = usuario.fotoPerfil;
        } else {
            avatarPreview.src = '/img/default-avatar.svg';
        }
        // Agregar manejo de errores para imágenes que no cargan
        avatarPreview.onerror = function() {
            this.src = '/img/default-avatar.svg';
        };
        // Asegurar que las dimensiones se mantengan
        avatarPreview.onload = function() {            this.style.width = '120px';
            this.style.height = '120px';
            this.style.objectFit = 'cover';
            this.style.borderRadius = '50%';
        };
    // Event listener para cambiar avatar
    btnCambiarAvatar.addEventListener('click', () => {
        avatarInput.click();
    });
    // Event listener para eliminar avatar
    btnEliminarAvatar.addEventListener('click', async () => {
        try {
            mostrarLoader();
            const result = await Swal.fire({
                title: '¿Eliminar foto de perfil?',
                text: "Se establecerá la imagen por defecto",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ffb700',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
            if (result.isConfirmed) {
                // Actualizar en la base de datos
                const response = await fetch('/api/perfil', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        correo: usuario.correo,
                        fotoPerfil: ""
                    })
                });
                if (response.ok) {
                    usuario.fotoPerfil = "";
                    actualizarLocalStorage();
                    avatarPreview.src = '/img/default-avatar.svg';
                    Swal.fire({
                        icon: 'success',
                        title: 'Foto eliminada',
                        text: 'Tu foto de perfil ha sido eliminada exitosamente.',
                        toast: true,
                        position: 'top-end',
                        timer: 3000
                    });
                } else {
                    throw new Error('Error al eliminar la foto');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la foto de perfil.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    });
    // Event listener para subir nueva imagen
    avatarInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo inválido',
                text: 'Por favor selecciona una imagen válida.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo muy grande',
                text: 'La imagen debe ser menor a 5MB.',
                toast: true,
                position: 'top-end'
            });
            return;
        }
        try {
            mostrarLoader();
            // Crear FormData para enviar la imagen
            const formData = new FormData();
            formData.append('fotoPerfil', file);
            formData.append('correo', usuario.correo);
            const response = await fetch('/api/perfil/foto', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                // Actualizar la imagen en el preview
                avatarPreview.src = data.fotoPerfil;
                // Actualizar el usuario y localStorage
                usuario.fotoPerfil = data.fotoPerfil;
                actualizarLocalStorage();
                Swal.fire({
                    icon: 'success',
                    title: 'Foto actualizada',
                    text: 'Tu foto de perfil ha sido actualizada exitosamente.',
                    toast: true,
                    position: 'top-end',
                    timer: 3000
                });
            } else {
                throw new Error(data.error || 'Error al subir la imagen');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo subir la imagen. Intenta nuevamente.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
        // Limpiar el input
        avatarInput.value = '';
    });    // Inicializar avatar al cargar la página
    inicializarAvatar();
    // Llamadas a funciones globales de loader, redes y mapa
    cargarRedesSociales(); // Llamar a la función para cargar redes sociales al iniciar
    renderMapaFooter(); // Llamar a la función para renderizar el mapa en el footer
    // ===== FUNCIONALIDAD DE DETECCIÓN DE TARJETAS DE CRÉDITO =====
      /**
     * Detecta el tipo de tarjeta de crédito basado en el número
     * @param {string} cardNumber - Número de tarjeta sin espacios
     * @returns {string} - Tipo de tarjeta (visa, mastercard, amex, etc.)
     */    function detectCardType(cardNumber) {
        // Eliminar espacios y caracteres no numéricos
        const number = cardNumber.replace(/\D/g, '');
        // Si no hay número o es muy corto, retornar unknown
        if (!number || number.length < 2) {
            return 'unknown';
        }        // Patrones de los diferentes tipos de tarjetas (más precisos)
        const cardPatterns = {
            // Visa: empieza con 4, 13-19 dígitos
            visa: /^4[0-9]{0,18}$/,
            // Mastercard: 5100-5599, 2221-2720, y rangos adicionales para débito (238x, 239x, etc.)
            mastercard: /^(5[1-5][0-9]{0,14}|2(22[1-9]|2[3-9][0-9]|[3-6][0-9][0-9]|7[0-1][0-9]|720)[0-9]{0,12}|23[8-9][0-9]{0,13})$/,
            // American Express: 34xx o 37xx, 15 dígitos
            amex: /^3[47][0-9]{0,13}$/,
            // Discover: 6011, 622126-622925, 644-649, 65, 16 dígitos
            discover: /^(6011|65[0-9]{0,2}|64[4-9][0-9]?|622(12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|91[0-9]|92[0-5]))[0-9]{0,10}$/,
            // Diners Club: 300-305, 36, 38, 14 dígitos
            diners: /^(30[0-5][0-9]{0,11}|3[68][0-9]{0,12})$/,
            // JCB: 2131, 1800, 35xx, 15-16 dígitos
            jcb: /^(2131|1800|35[0-9]{0,2})[0-9]{0,12}$/,
            // Maestro: otros rangos específicos (excluyendo los ya cubiertos por Mastercard)
            maestro: /^(50[0-9]{0,14}|6[0-9]{0,15}|6759[0-9]{0,12}|6761[0-9]{0,12}|6762[0-9]{0,12}|6763[0-9]{0,12})$/
        };
          // Verificar cada patrón en orden de prioridad
        // American Express y Diners tienen prioridad sobre JCB para 3xxx
        if (cardPatterns.amex.test(number)) return 'amex';
        if (cardPatterns.diners.test(number)) return 'diners';
        if (cardPatterns.jcb.test(number)) return 'jcb';
        if (cardPatterns.visa.test(number)) return 'visa';
        if (cardPatterns.mastercard.test(number)) return 'mastercard';
        if (cardPatterns.maestro.test(number)) return 'maestro';
        if (cardPatterns.discover.test(number)) return 'discover';
        return 'unknown';
    }    /**
     * Actualiza el logo de la tarjeta en la interfaz
     * @param {string} cardType - Tipo de tarjeta detectado
     */
    function updateCardLogo(cardType) {
        const cardLogo = document.getElementById('cardLogo');
        const numeroTarjetaInput = document.getElementById('numeroTarjeta');
        // Mapeo de tipos de tarjeta a rutas de imagen
        const logoSources = {
            'visa': '/img/visa-logo.svg',
            'mastercard': '/img/mastercard-logo.svg',
            'amex': '/img/amex-logo.svg',
            'discover': '/img/discover-logo.svg',
            'diners': '/img/diners-logo.svg',
            'jcb': '/img/jcb-logo.svg',
            'maestro': '/img/maestro-logo.svg'
        };
        // Mostrar el logo correspondiente o ocultarlo si es desconocido
        if (cardType !== 'unknown' && logoSources[cardType]) {
            cardLogo.src = logoSources[cardType];
            cardLogo.style.display = 'block';
            // Actualizar placeholder según el tipo de tarjeta
            switch(cardType) {
                case 'amex':
                    numeroTarjetaInput.placeholder = 'XXXX XXXXXX XXXXX (15 dígitos)';
                    numeroTarjetaInput.maxLength = 17; // 15 dígitos + 2 espacios
                    break;
                case 'diners':
                    numeroTarjetaInput.placeholder = 'XXXX XXXX XXXX XX (14 dígitos)';
                    numeroTarjetaInput.maxLength = 17; // 14 dígitos + 3 espacios
                    break;
                case 'visa':
                    numeroTarjetaInput.placeholder = 'XXXX XXXX XXXX XXXX (Visa - 16 dígitos)';
                    numeroTarjetaInput.maxLength = 19; // 16 dígitos + 3 espacios
                    break;                case 'mastercard':
                    numeroTarjetaInput.placeholder = 'XXXX XXXX XXXX XXXX (Mastercard - 16 dígitos)';
                    numeroTarjetaInput.maxLength = 19; // 16 dígitos + 3 espacios
                    break;
                case 'maestro':
                    numeroTarjetaInput.placeholder = 'XXXX XXXX XXXX XXXX (Maestro - 16 dígitos)';
                    numeroTarjetaInput.maxLength = 19; // 16 dígitos + 3 espacios
                    break;
                case 'discover':
                    numeroTarjetaInput.placeholder = 'XXXX XXXX XXXX XXXX (Discover - 16 dígitos)';
                    numeroTarjetaInput.maxLength = 19; // 16 dígitos + 3 espacios
                    break;
                case 'jcb':
                    numeroTarjetaInput.placeholder = 'XXXX XXXX XXXX XXXX (JCB - 16 dígitos)';
                    numeroTarjetaInput.maxLength = 19; // 16 dígitos + 3 espacios
                    break;
                default:
                    numeroTarjetaInput.placeholder = 'XXXX XXXX XXXX XXXX (16 dígitos)';
                    numeroTarjetaInput.maxLength = 19;
            }
        } else {
            cardLogo.style.display = 'none';
            cardLogo.src = '';
            numeroTarjetaInput.placeholder = 'Ingrese el número de su tarjeta';
            numeroTarjetaInput.maxLength = 23; // Máximo para cualquier tipo
        }
    }
    // ===== EVENTOS DE FORMULARIOS =====
    // Evento para detectar cambios en el número de tarjeta y actualizar el logo
    formTarjeta.addEventListener('input', (event) => {
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        const tipoTarjeta = detectCardType(numeroTarjeta);
        updateCardLogo(tipoTarjeta);
    });
});
