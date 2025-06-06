document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const modal = document.getElementById('modal');
    const olvidoContainer = document.getElementById('formOlvidoContainer');
    const olvidoContainerbtn = document.getElementById('olvidoContrasena');
    const formSesionContainer = document.getElementById('formSesionContainer');
    const formImagenContainer = document.getElementById('formImagenContainer');
    const formPreferenciasContainer = document.getElementById('form-preferencias');
    const iniciarSesionBtn = document.getElementById('iniciarSesion');
    const crearCuentaBtn = document.getElementById('crearCuenta');
    const btnCrear = document.getElementById('btnCrear');
    const btnActualizar = document.getElementById('btnActualizar');
    const btnEliminar = document.getElementById('btnEliminar');
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
    const reqLength = document.getElementById('req-length');
    const reqMayus = document.getElementById('req-mayus');
    const reqMinus = document.getElementById('req-minus');
    const reqNum = document.getElementById('req-num');
    const reqEspecial = document.getElementById('req-especial');

    

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

    passwordSesion.addEventListener('input', () => {
        validarRequisitos(passwordSesion.value, reqLength, reqMayus, reqMinus, reqNum, reqEspecial);
        validarCoincidencias(passwordSesion.value, passwordSesionC.value, passwordSesion, passwordSesionC);
    });
    passwordSesionC.addEventListener('input', () => validarCoincidencias(passwordSesion.value, passwordSesionC.value, passwordSesion, passwordSesionC));
    emailSesionC.addEventListener('input', () => validarCorreos(emailSesion.value, emailSesionC.value, emailSesion, emailSesionC));
    emailSesion.addEventListener('input', () => {
        if(emailSesionC.style.display !== 'none') {
            validarCorreos(emailSesion.value, emailSesionC.value, emailSesion, emailSesionC);
        }
    });

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

    usuarioActivo(Swal, mostrarLoader, ocultarLoader);

    
});

document.addEventListener("DOMContentLoaded", async () => {
    const equipoContainer = document.getElementById("equipoContainer");
    mostrarLoader();
    try {
        const response = await fetch("/api/sobre-nosotros"); // Endpoint actualizado
        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Falló la carga',
                text: 'Error al cargar los datos del equipo.',
                toast: true,
                position: 'top-end'
            });
            return;
        }

        const data = await response.json();
        console.log(data); // Verifica la estructura de los datos recibidos
        // Mostrar los datos directamente
        equipoContainer.innerHTML = data.map((member, index) => `
            <div class="team-member ${index % 2 === 0 ? 'reverse' : ''}">
                <img src="${member.Foto}" alt="Foto de ${member.Nombres} ${member.Apellidos}" class="team-photo">
                <div class="team-info">
                    <h3>${member.Nombres} ${member.Apellidos}</h3>
                    <p>${member.Descripcion}</p>
                    <p><strong>Correo:</strong> ${member.Correo}</p>
                    <p><strong>Teléfono:</strong> ${member.Telefono}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error al cargar los datos del equipo:", error);
        equipoContainer.innerHTML = "<p>Error al cargar los datos del equipo. Por favor, inténtalo más tarde.</p>";
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los datos del equipo.',
            toast: true,
            position: 'top-end'
        });
    } finally {
        ocultarLoader();
    }

    // Función para cargar redes sociales desde el servidor
    cargarRedesSociales(); // Llamar a la función para cargar redes sociales al iniciar

    // Mostrar el minimapa en el footer si existe
    const footerMapa = document.getElementById('footer-mapa');
    if (footerMapa) {
        const mapaHTML = localStorage.getItem('footerMapaURL') || '';
        footerMapa.innerHTML = mapaHTML;
    }
});


document.addEventListener('DOMContentLoaded', renderMapaFooter);
    
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar historia
    const historiaContainer = document.getElementById('historiaContainer');
    if (historiaContainer) {
        try {
            const res = await fetch('/api/historia');
            if (res.ok) {
                const data = await res.json();
                historiaContainer.innerHTML = `<p>${data.historia || ''}</p>`;
            } else {
                historiaContainer.innerHTML = '<p>No se pudo cargar la historia.</p>';
            }
        } catch (error) {
            historiaContainer.innerHTML = '<p>Error al cargar la historia.</p>';
        }
    }
});