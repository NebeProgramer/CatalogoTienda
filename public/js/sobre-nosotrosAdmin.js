document.addEventListener('DOMContentLoaded', () => {
    

    const usuario = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;

    if (usuario) {
        console.log('Sesión activa:', usuario);

        // Obtener el ul donde se agregarán los elementos
        const listaSesion = document.querySelector('.iniciosesion');

        // Crear el elemento <li> para "Perfil"
        const perfilLi = document.createElement('li');
        const perfilLink = document.createElement('a');
        if (usuario.nombre && usuario.nombre.trim() !== "") {
            perfilLink.textContent = 'Bienvenido ' + usuario.nombre;
        } else {
            perfilLink.textContent = 'Bienvenido Administrador';
        }
        perfilLink.id = 'perfilBtn';
        perfilLink.href = '#';
        perfilLink.addEventListener('click', () => mostrarPerfil(usuario));
        perfilLi.appendChild(perfilLink);

        // Agregar ambos elementos al <ul>
        listaSesion.innerHTML = '';
        listaSesion.appendChild(perfilLi);
    } else {
        console.log('No hay sesión activa.');
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    // Loader functions
function mostrarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

    async function cargarEquipoParaEditar() {
        mostrarLoader();
        try {
            const respuesta = await fetch('/api/sobre-nosotros'); // Endpoint actualizado
            if (!respuesta.ok) {
                throw new Error('Error al cargar los datos del equipo.');
            }
    
            const data = await respuesta.json();

            data.forEach(miembro => {
            const equipoLista = document.getElementById('equipo-lista');
            equipoLista.innerHTML = ''; // Limpiar el contenedor
    
            // Crear un formulario para editar los datos
            const miembroDiv = document.createElement('div');
            miembroDiv.classList.add('miembro-item'); // Clase para identificar cada miembro
            miembroDiv.innerHTML = `
                <div class="team-member">
                    <input type="file" id="foto" name="foto" accept="image/*" style="display: none;" />
                    <img src="${miembro.Foto}" alt="Foto de ${miembro.Nombres} ${miembro.Apellidos}" class="team-photo" style="cursor: pointer;" />
                    <div class="team-info">
                        <input type="text" id="nombres" name="nombres" value="${miembro.Nombres}" placeholder="Nombres" required />
                        <input type="text" id="apellidos" name="apellidos" value="${miembro.Apellidos}" placeholder="Apellidos" required />
                        <input type="email" id="correo" name="correo" value="${miembro.Correo}" placeholder="Correo" required />
                        <input type="number" id="telefono" name="telefono" value="${miembro.Telefono}" placeholder="Teléfono" required />
                        <textarea id="descripcion" name="descripcion" placeholder="Descripción" required>${miembro.Descripcion}</textarea>
                        <input type="hidden" id="equipo-id" name="equipo-id" value="${miembro.Id}" style="display:none;" /><!-- Campo oculto para el ID -->
                    </div>
                    <div class="team-actions">
                    <button type="button" class="eliminar-miembro-btn">Eliminar</button>
                    </div>
                </div>
            `;
    
            const fotoInput = miembroDiv.querySelector('input[name="foto"]');
            const fotoImg = miembroDiv.querySelector('img');
            const eliminarBtn = miembroDiv.querySelector('.eliminar-miembro-btn');
    
            // Permitir cambiar la foto al hacer clic
            fotoImg.addEventListener('click', () => {
                fotoInput.click();
            });
    
            // Actualizar la vista previa de la foto al seleccionar un archivo
            fotoInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        fotoImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
    
            // Evento para eliminar el miembro
            eliminarBtn.addEventListener('click', async () => {
                try {
                    const memberId = miembroDiv.querySelector('#equipo-id').value;
                    if (memberId) {
                        const confirmacion = swal.fire({
                            title: '¿Estás seguro?',
                            text: "No podrás recuperar este miembro después de eliminarlo.",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, eliminar',
                            cancelButtonText: 'Cancelar'
                        });
                        if (confirmacion.isConfirmed) {
                            const response = await fetch(`/api/sobre-nosotros/${memberId}`, {
                                method: 'DELETE'
                            });

                            if (!response.ok) {
                                throw new Error('Error al eliminar el miembro.');
                            }

                            swal.fire({
                                icon: 'success',
                                title: 'Miembro eliminado',
                                text: 'El miembro ha sido eliminado exitosamente.',
                                toast: true,
                                position: 'top-end'
                            });
                            equipoLista.removeChild(miembroDiv);
                    } else {
                        equipoLista.removeChild(miembroDiv);
                    }
                }
                } catch (error) {
                    console.error('Error al eliminar el miembro:', error);
                    alert('No se pudo eliminar el miembro.');
                }
            
            });
    
            equipoLista.appendChild(miembroDiv);
        });
        } catch (error) {
            console.error('Error al cargar los datos del equipo:', error);
            alert('No se pudieron cargar los datos del equipo.');
        } finally {
            ocultarLoader();
        }
    }
    
    function agregarCampoMiembro() {
        const equipoLista = document.getElementById('equipo-lista');
        const nuevoMiembro = document.createElement('div');
        nuevoMiembro.classList.add('miembro-item'); // Clase para identificar cada miembro
        nuevoMiembro.innerHTML = `
            <div class="team-member">
                    <input type="file" id="foto" name="foto" accept="image/*" style="display: none;" />
                <img src="" alt="Foto de nuevo miembro" class="team-photo" style="cursor: pointer;" />
                    <div class="team-info">
                        <input type="text" id="nombres" name="nombres" value="" placeholder="Nombres" required />
                        <input type="text" id="apellidos" name="apellidos" value="" placeholder="Apellidos" required />
                        <input type="email" id="correo" name="correo" value="" placeholder="Correo" required />
                        <input type="number" id="telefono" name="telefono" value="" placeholder="Teléfono" required />
                        <textarea id="descripcion" name="descripcion" placeholder="Descripción" required></textarea>
                        <input type="hidden" id="equipo-id" name="equipo-id" value="" style="display:none;" /><!-- Campo oculto para el ID -->
                    </div>
                    <div class="team-actions">
                    <button type="button" class="eliminar-miembro-btn">Eliminar</button>
                    </div>
                </div>
        `;
    
        const fotoInput = nuevoMiembro.querySelector('input[name="foto"]');
        const fotoImg = nuevoMiembro.querySelector('img');
        const eliminarBtn = nuevoMiembro.querySelector('.eliminar-miembro-btn');
    
        // Permitir cambiar la foto al hacer clic
        fotoImg.addEventListener('click', () => {
            fotoInput.click();
        });
    
        // Actualizar la vista previa de la foto al seleccionar un archivo
        fotoInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    fotoImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    
        // Evento para eliminar el miembro
        eliminarBtn.addEventListener('click', () => {
            equipoLista.removeChild(nuevoMiembro);
        });
    
        equipoLista.appendChild(nuevoMiembro);
    }

    async function guardarEquipo() {
        mostrarLoader();
        try {
            console.log('Guardando datos del equipo...');
            const miembros = document.querySelectorAll('.miembro-item'); // Seleccionar todos los miembros

            for (const miembro of miembros) {
                const Id = miembro.querySelector('input[name="equipo-id"]')?.value.trim();
                const Nombres = miembro.querySelector('input[name="nombres"]')?.value.trim();
                const Apellidos = miembro.querySelector('input[name="apellidos"]')?.value.trim();
                const Correo = miembro.querySelector('input[name="correo"]')?.value.trim();
                const Telefono = miembro.querySelector('input[name="telefono"]')?.value.trim();
                const Descripcion = miembro.querySelector('textarea[name="descripcion"]')?.value.trim();
                const FotoImg = miembro.querySelector('img.team-photo');
                const FotoFile = miembro.querySelector('input[name="foto"]')?.files[0];

                // Validar campos obligatorios
                if (!Nombres || !Apellidos || !Correo || !Telefono || !Descripcion) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campos incompletos',
                        text: 'Todos los campos son obligatorios. Por favor, complete todos los campos.',
                        toast: true,
                        position: 'top-end'
                    });
                    return;
                }

                const formData = new FormData();
                if (Id) formData.append('Id', Id);
                formData.append('Descripcion', Descripcion);
                formData.append('Nombres', Nombres);
                formData.append('Apellidos', Apellidos);
                formData.append('Correo', Correo);
                formData.append('Telefono', Telefono);
                if (FotoFile) {
                    formData.append('foto', FotoFile);
                } else if (FotoImg && FotoImg.src) {
                    const fileName = FotoImg.src.split('/').pop();
                    formData.append('foto', fileName);
                }

                console.log('Datos enviados:', {
                    id: formData.get('id'),
                    descripcion: formData.get('Descripcion'),
                    nombres: formData.get('Nombres'),
                    apellidos: formData.get('Apellidos'),
                    correo: formData.get('Correo'),
                    telefono: formData.get('Telefono'),
                    foto: formData.get('foto')
                });

                const respuesta = await fetch('/api/sobre-nosotros', {
                    method: 'POST',
                    body: formData
                });

                if (!respuesta.ok) {
                    const errorData = await respuesta.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorData.error || 'Error al guardar los datos del equipo.',
                        toast: true,
                        position: 'top-end'
                    });
                    return;
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Guardado exitoso',
                text: 'Datos del equipo guardados exitosamente.',
                toast: true,
                position: 'top-end'
            });
            location.reload();
        } catch (error) {
            console.error('Error al guardar los datos del equipo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text:'No se pudieron guardar los datos del equipo.',
                toast: true,
                position: 'top-end'
            });
        } finally {
            ocultarLoader();
        }
    }
    
    cargarEquipoParaEditar();


document.getElementById('agregar-miembro-btn').addEventListener('click', () => {
    agregarCampoMiembro();
});

document.getElementById('guardar-equipo-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await guardarEquipo();
});



    // Cargar historia en el textarea
    async function cargarHistoria() {
        const textarea = document.getElementById('historia-textarea');
        if (!textarea) return;
        try {
            const res = await fetch('/api/historia');
            if (res.ok) {
                const data = await res.json();
                textarea.value = data.historia || '';
            } else {
                textarea.value = '';
            }
        } catch (error) {
            textarea.value = '';
        }
    }

    // Guardar historia al enviar el formulario
    const formHistoria = document.getElementById('form-historia');
    if (formHistoria) {
        formHistoria.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textarea = document.getElementById('historia-textarea');
            const historia = textarea.value.trim();
            if (!historia) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo vacío',
                    text: 'Por favor, escribe la historia antes de guardar.',
                    toast: true,
                    position: 'top-end'
                });
                return;
            }
            try {
                const res = await fetch('/api/historia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ historia })
                });
                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Historia guardada',
                        text: 'La historia se guardó correctamente.',
                        toast: true,
                        position: 'top-end'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo guardar la historia.',
                        toast: true,
                        position: 'top-end'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar la historia.',
                    toast: true,
                    position: 'top-end'
                });
            }
        });
        cargarHistoria();
    }

});