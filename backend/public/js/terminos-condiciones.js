import { showModal, hideModal, setupLoginForm, setupRegisterForm, validarRequisitos, validarCoincidencias, validarCorreos, recuperarContraseña, crearCuenta, iniciarSesion, cerrarSesion, mostrarPerfil, usuarioActivo } from './js/Sesion.js';
import { mostrarLoader, ocultarLoader } from './js/Loaders.js';
import { renderMapaFooter } from './js/Mapa.js';
import { cargarRedesSociales } from './js/Redes.js';

document.addEventListener('DOMContentLoaded', async () => {
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

    // Reemplazar las funciones locales por llamadas a los imports
    olvidoContainerbtn.addEventListener('click', function (e) {
        e.preventDefault();
        formSesionContainer.style.display = 'none';
        showModal(olvidoContainer, modal, formSesionContainer, olvidoContainer);
    });

    iniciarSesionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer);
        setupLoginForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
    });

    crearCuentaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(formSesionContainer, modal, formSesionContainer, olvidoContainer);
        setupRegisterForm({
            opcionTitulo, tco, tca, emailSesionC, passwordSesionC, btnSesion, olvidoContainer, terminos, privacidad, imputTerminos, imputPrivacidad, reqLength, reqMayus, reqMinus, reqNum, reqEspecial
        });
    });

    closeModal.addEventListener('click', () => hideModal(modal, formSesionContainer, olvidoContainer));

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            hideModal(modal, formSesionContainer, olvidoContainer);
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
            await recuperarContraseña(correoRecuperar, Swal, () => hideModal(modal, formSesionContainer, olvidoContainer));
        });
    }

    btnSesion.addEventListener('click', async (e) => {
        e.preventDefault();
        if (btnSesion.textContent === 'Crear Cuenta') {
            await crearCuenta({ emailSesionC, emailSesion, passwordSesionC, passwordSesion, validarRequisitos, validarCorreos, Swal, mostrarLoader, ocultarLoader, hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer), formSesion: form.sesion, reqLength, reqMayus, reqMinus, reqNum, reqEspecial });
        } else if (btnSesion.textContent === 'Iniciar Sesión') {
            await iniciarSesion({ emailSesion, passwordSesion, mostrarLoader, ocultarLoader, Swal, iniciarSesionBtn, crearCuentaBtn, hideModal: () => hideModal(modal, formSesionContainer, olvidoContainer), formSesion: form.sesion, btnSesion, mostrarPerfil, cerrarSesion });
        }
    });

    const usuario = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;

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
    } else {
        console.log('No hay sesión activa.');


    }

    async function cargarTerminos() {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/terminos-condiciones');
            if (!respuesta.ok) {
                throw new Error('Error al cargar los términos y condiciones.');
            }

            const terminos = await respuesta.json();
            const listaTerminos = document.getElementById('lista-terminos');
            listaTerminos.innerHTML = '';

            terminos.forEach((termino) => {
                const terminoDiv = document.createElement('div');
                terminoDiv.innerHTML = `
                    <h3>${termino.titulo}</h3>
                    <p>${termino.contenido}</p>
                    <p style="font-size: small;">Última modificación: ${new Date(termino.ultimaModificacion).toLocaleDateString()} | Modificado por: ${termino.modificadoPor}</p>
                    
                `;
                listaTerminos.appendChild(terminoDiv);
            });
        } catch (error) {
            console.error('Error al cargar los términos y condiciones:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los términos y condiciones.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    }
    renderMapaFooter();
    cargarRedesSociales(); // Llamar a la función para cargar redes sociales al iniciar
    cargarTerminos();
    // Mostrar el minimapa en el footer si existe
    const footerMapa = document.getElementById('footer-mapa');
    if (footerMapa) {
        const mapaHTML = localStorage.getItem('footerMapaURL') || '';
        footerMapa.innerHTML = mapaHTML;
    }
});