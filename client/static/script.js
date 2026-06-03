const API_URL = 'http://localhost:3000/alumnos'

// DOM
// -- Tablas --
const tablaAlumnos = document.querySelector('#tabla-alumnos')

// -- Texto de feedback --
const responseBuscarPorId = document.querySelector('#response-buscar-por-id')
const responseForm = document.querySelector('#response-form')

// -- Inputs --
const formBuscarLegajo = document.querySelector('#form-buscar-legajo')

const formLegajo = document.querySelector('#form-legajo')
const formNombre = document.querySelector('#form-nombre')
const formApellido = document.querySelector('#form-apellido')
const formEmail = document.querySelector('#form-email')
const formEstado = document.querySelector('#form-estado')

// -- Botones --
const btnBuscarPorId = document.querySelector('#btn-buscar-por-id')
const btnCargarAlumnos = document.querySelector('#btn-cargar-alumnos')

const btnAgregarPost = document.querySelector('#btn-agregar-post')
const btnModificarPut = document.querySelector('#btn-modificar-put')
const btnBorrarDelete = document.querySelector('#btn-borrar-delete')
const btnLimpiarCampos = document.querySelector('#btn-limpiar-campos')

// -- Event listeners--
btnCargarAlumnos.addEventListener('click', getAlumnoAll)
btnBuscarPorId.addEventListener('click', getAlumnoById)
btnAgregarPost.addEventListener('click', postNewAlumno)
btnModificarPut.addEventListener('click', putAlumnoBylegajo)
btnBorrarDelete.addEventListener('click', deleteAlumnoBylegajo)

btnLimpiarCampos.addEventListener('click', limpiarFormulario)

// MÉTODOS

// GET (getAlumnoAll)

async function getAlumnoAll () {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      console.error(response.status, response.error)
      tablaAlumnos.innerHTML = '<tr><td colspan="5" style="color: red; text-align: center;">❌ Error al traer los datos</td></tr>'
    }

    const alumnos = await response.json()
    renderizarTabla(alumnos)
  } catch (error) {
    console.error('Error en getAlumnoAll:', error)
    tablaAlumnos.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">❌ ${error.message}</td></tr>`
  }
}

// GET (getAlumnoById)
async function getAlumnoById () {
  try {
    responseBuscarPorId.innerText = ''

    const legajoABuscar = formBuscarLegajo.value
    if (!legajoABuscar) {
      responseBuscarPorId.innerText = 'Ingrese un legajo'
      return
    }

    const response = await fetch(`${API_URL}/${legajoABuscar}`)

    if (!response.ok) {
      responseBuscarPorId.innerText = 'No encontrado'
      tablaAlumnos.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Alumno inexistente</td></tr>'
      return
    }

    const alumno = await response.json()

    renderizarTabla([alumno])
  } catch (error) {
    console.error('Error en getAlumnoById:', error)
    tablaAlumnos.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">❌ ${error.message}</td></tr>`
  }
}

// POST (postNewAlumno)
async function postNewAlumno () {
  try {
    // responseForm.innerHTML = ''

    if (!formLegajo || !formEstado) {
      responseForm.style.color = 'red'
      responseForm.innerHTML =
        'No debe ingresar los campos en "Legajo" o "Estado" '
      return
    }

    const nuevoAlumno = {
      nombre: formNombre.value,
      apellido: formApellido.value,
      email: formEmail.value
    }

    if (!nuevoAlumno.nombre || !nuevoAlumno.apellido || !nuevoAlumno.email) {
      responseForm.style.color = 'red'
      responseForm.innerText =
        'Todos los campos (Nombre, Apellido y Email) son obligatorios.'
      return
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoAlumno)
    })

    const resultado = await response.json
    responseForm.style.color = 'green'
    responseForm.innerText = `🎉 ${resultado.msg}`

    getAlumnoAll()
    copiarAlFormulario(resultado.alumnoNuevo)
  } catch (error) {
    console.error('Error en postNewAlumno:', error)
    responseForm.innerHTML = `❌ ${error.message}`
  }
}

// PUT (putAlumnoBylegajo)
// async function putAlumnoBylegajo() {
//   try {
//     // responseForm.innerHTML = ''

//     const legajoModificar = formLegajo.value ? formLegajo.value.trim() : ''

//     if (!legajoModificar) {
//       responseForm.style.color = 'red'
//       responseForm.innerText =
//         '❌ Debe seleccionar un alumno de la tabla para editar.'
//       return
//     }

//     const alumnoModificado = {
//       nombre: formNombre.value.trim(),
//       apellido: formApellido.value.trim(),
//       email: formEmail.value.trim(),
//       isActive: formEstado.value === 'true'
//     }

//     if (
//       !alumnoModificado.nombre ||
//       !alumnoModificado.apellido ||
//       !alumnoModificado.email
//     ) {
//       responseForm.style.color = 'red'
//       responseForm.innerText =
//         '❌ Los campos Nombre, Apellido y Email no pueden estar vacíos.'
//       return
//     }

//     const response = await fetch(`${API_URL}/${legajoModificar}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(alumnoModificado)
//     })

//     const resultado = await response.json()

//     if (response.ok) {
//       responseForm.style.color = 'green'
//       responseForm.innerText = `🎉 ${resultado.msg}`

//       limpiarFormulario() // 💡 Resetea la pantalla para la siguiente acción
//       getAlumnoAll() // Trae la lista actualizada
//     }
//   } catch (error) {
//     console.error('Error en postNewAlumno:', error)
//     responseForm.innerHTML = `❌ ${error.message}`
//   }
// }

// DELETE (deleteAlumnoBylegajo)
async function deleteAlumnoBylegajo () {
  try {
    responseForm.innerHTML = ''

    // Capturamos el legajo del alumno seleccionado en el formulario
    const legajoABorrar = formLegajo.value ? formLegajo.value.trim() : ''

    if (!legajoABorrar) {
      responseForm.style.color = 'red'
      responseForm.innerText =
        '❌ Debe seleccionar un alumno de la tabla para poder eliminarlo.'
      return
    }

    // Confirmación de cortesía para el usuario
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar al alumno con legajo n° ${legajoABorrar}?`
    )
    if (!confirmar) return

    // Realizamos la petición DELETE inyectando el legajo en la URL
    const response = await fetch(`${API_URL}/${legajoABorrar}`, {
      method: 'DELETE'
    })

    const resultado = await response.json()

    if (!response.ok) {
      responseForm.style.color = 'red'
      responseForm.innerText = `❌ ${resultado.error || 'No se pudo eliminar al alumno.'}`
      return
    }

    // Feedback de éxito en verde
    responseForm.style.color = 'green'
    responseForm.innerText = `🗑️ ${resultado.msg}`

    // Limpiamos los campos del formulario y refrescamos la tabla en tiempo real
    limpiarFormulario()
    getAlumnoAll()
  } catch (error) {
    console.error('Error en deleteAlumnoBylegajo:', error)
    responseForm.style.color = 'red'
    responseForm.innerHTML = `❌ Error de red: ${error.message}`
  }
}

// FUNCIONES
function copiarAlFormulario (alumno) {
  formLegajo.value = alumno.legajo
  formNombre.value = alumno.nombre
  formApellido.value = alumno.apellido
  formEmail.value = alumno.email
  formEstado.value = alumno.isActive ? 'true' : 'false'
}

function limpiarFormulario () {
  formLegajo.value = ''
  formNombre.value = ''
  formApellido.value = ''
  formEmail.value = ''
  formEstado.value = ''
  responseBuscarPorId.innerText = ''
  formBuscarLegajo.value = ''
}

function renderizarTabla (alumnos) {
  if (alumnos.length === 0) {
    tablaAlumnos.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay alumnos registrados en el sistema.</td></tr>'
    return
  }

  alumnos.forEach((alumno) => {
    const fila = document.createElement('tr')
    fila.innerHTML = `
        <td><strong>${alumno.legajo}</strong></td>
        <td>${alumno.nombre}</td>
        <td>${alumno.apellido}</td>
        <td>${alumno.email}</td>
        <td>${alumno.isActive ? 'Activo' : 'Baja'}</td>
        <td>
          <button class="btn-editar">✏️ Editar</button>
          </td>
    `
    const btnEditar = fila.querySelector('.btn-editar')
    btnEditar.addEventListener('click', () => {
      copiarAlFormulario(alumno)
    })
    tablaAlumnos.appendChild(fila)
  })
}
