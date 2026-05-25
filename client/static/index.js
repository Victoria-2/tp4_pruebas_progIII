// 🌐 URL del backend de Alumnos (Express)
// Local: http://localhost:3001/alumnos | En producción: Reemplazar por la URL que les dé Render
const API_URL = 'http://localhost:3000/alumnos'

// Referencias a elementos del DOM
const tablaAlumnos = document.getElementById('tabla-alumnos')
const formAlumno = document.getElementById('form-alumno')
const editandoLegajoInput = document.getElementById('editando-legajo')
const formTitulo = document.getElementById('form-titulo')
const btnSubmit = document.getElementById('btn-submit')
const btnCancelar = document.getElementById('btn-cancelar')

// Campos del formulario
const inputNombre = document.getElementById('form-nombre')
const inputApellido = document.getElementById('form-apellido')
const inputEmail = document.getElementById('form-email')
const inputLegajoVisual = document.getElementById('form-legajo')
const selectActive = document.getElementById('form-active')

// Elementos de grupos condicionales
const grupoLegajo = document.getElementById('grupo-legajo')
const grupoActivo = document.getElementById('grupo-activo')

// Al iniciar la página, listamos automáticamente a los alumnos
document.addEventListener('DOMContentLoaded', obtenerTodosLosAlumnos)

// ==========================================================
// 🟢 METHOD: GET (getAlumnoAll)
// ==========================================================
async function obtenerTodosLosAlumnos() {
  try {
    const response = await fetch(API_URL)

    // Manejo del estado 500 programado en el catch de tu controller
    if (!response.ok)
      throw new Error('No se pudieron obtener los datos de los alumnos')

    const alumnos = await response.json()
    renderizarTabla(alumnos)
  } catch (error) {
    console.error('Error en GET ALL:', error)
    tablaAlumnos.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">❌ ${error.message}</td></tr>`
  }
}

// ==========================================================
// 🔵 METHOD: GET /:legajo (getAlumnoById)
// ==========================================================
async function buscarUnAlumno() {
  const legajo = document.getElementById('busqueda-legajo').value
  if (!legajo) {
    alert('Por favor, ingrese un número de legajo para buscar.')
    return
  }

  try {
    const response = await fetch(`${API_URL}/${legajo}`)

    // Captura del estado 404 del backend si el legajo no existe
    if (response.status === 404) {
      const errorData = await response.json()
      alert(`⚠️ ${errorData.msg}`)
      return
    }

    if (!response.ok) throw new Error('Error interno al procesar la búsqueda.')

    const alumno = await response.json()

    // Si lo encuentra, renderiza únicamente a ese alumno en la tabla para aislarlo visualmente
    renderizarTabla([alumno])
  } catch (error) {
    alert(error.message)
  }
}

// Helper para dibujar las filas en la tabla
function renderizarTabla(alumnos) {
  tablaAlumnos.innerHTML = ''

  if (alumnos.length === 0) {
    tablaAlumnos.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay alumnos registrados en el sistema.</td></tr>`
    return
  }

  alumnos.forEach((alumno) => {
    const fila = document.createElement('tr')

    const badgeEstado = alumno.isActive
      ? `<span class="badge-activo">Activo</span>`
      : `<span class="badge-inactivo">De Baja</span>`

    fila.innerHTML = `
            <td><strong>${alumno.legajo}</strong></td>
            <td>${alumno.apellido}, ${alumno.nombre}</td>
            <td>${alumno.email}</td>
            <td>${badgeEstado}</td>
            <td>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 0.85em;" onclick="cargarAlumnoEnFormulario(${JSON.stringify(alumno).replace(/"/g, '&quot;')})">✏️ Editar</button>
                <button class="btn-danger" onclick="eliminarAlumno(${alumno.legajo})">🗑️ Eliminar</button>
            </td>
        `
    tablaAlumnos.appendChild(fila)
  })
}

// ==========================================================
// 🟡 / 🟠 SUBMIT DEL FORMULARIO (Maneja POST o PUT)
// ==========================================================
formAlumno.addEventListener('submit', async (e) => {
  e.preventDefault()

  const legajoEditando = editandoLegajoInput.value

  // Si NO estamos editando, disparamos el ALTA (POST)
  if (!legajoEditando) {
    const nuevoAlumno = {
      nombre: inputNombre.value,
      apellido: inputApellido.value,
      email: inputEmail.value
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoAlumno)
      })

      const resultado = await response.json()

      if (response.status === 200) {
        alert(`🎉 ${resultado.msg}`)
        resetearFormulario()
        obtenerTodosLosAlumnos()
      } else {
        alert(`❌ Error: ${resultado.error}`)
      }
    } catch (error) {
      alert('Error de red al intentar dar de alta.')
    }
  }
  // Si SÍ hay un legajo cargado en el hidden, disparamos la MODIFICACIÓN (PUT)
  else {
    const alumnoModificado = {
      nombre: inputNombre.value,
      apellido: inputApellido.value,
      email: inputEmail.value,
      isActive: selectActive.value === 'true'
    }

    try {
      const response = await fetch(`${API_URL}/${legajoEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumnoModificado)
      })

      const resultado = await response.json()

      if (response.status === 201) {
        // Captura el 201 de tu controller
        alert(`🔄 ${resultado.msg}`)
        resetearFormulario()
        obtenerTodosLosAlumnos()
      } else {
        alert(`❌ Error: ${resultado.error}`)
      }
    } catch (error) {
      alert('Error de red al intentar modificar los datos.')
    }
  }
})

// ==========================================================
// 🔴 METHOD: DELETE (deleteAlumnoByLegajo)
// ==========================================================
async function eliminarAlumno(legajo) {
  const confirmacion = confirm(
    `¿Está seguro de que desea eliminar permanentemente al alumno con legajo n° ${legajo}?`
  )
  if (!confirmacion) return

  try {
    const response = await fetch(`${API_URL}/${legajo}`, {
      method: 'DELETE'
    })

    const resultado = await response.json()

    if (response.status === 200) {
      alert(`🗑️ ${resultado.msg}`)
      obtenerTodosLosAlumnos()
    } else if (response.status === 404) {
      alert(`⚠️ ${resultado.msg}`)
    } else {
      alert(`❌ Error: ${resultado.error}`)
    }
  } catch (error) {
    alert('Error de conexión al procesar la baja.')
  }
}

// ==========================================================
// 🛠️ FUNCIONES DE INTERFAZ (Cambio de estados Visuales)
// ==========================================================

// Pasa los datos de la fila de la tabla directo al formulario para permitir editarlos
function cargarAlumnoEnFormulario(alumno) {
  formTitulo.innerText = `🟠 Editar Alumno (Legajo: ${alumno.legajo})`
  btnSubmit.innerText = 'Actualizar Datos'
  btnSubmit.className = 'btn-secondary'
  btnCancelar.style.display = 'inline-block'

  // Mostramos los campos que solo pertenecen a la edición (Modificar)
  grupoLegajo.style.display = 'block'
  grupoActivo.style.display = 'block'

  // Llenamos los inputs con los datos actuales
  editandoLegajoInput.value = alumno.legajo
  inputLegajoVisual.value = alumno.legajo
  inputNombre.value = alumno.nombre
  inputApellido.value = alumno.apellido
  inputEmail.value = alumno.email
  selectActive.value = alumno.isActive ? 'true' : 'false'

  // Scroll suave hacia arriba para que el alumno note que se cargó el formulario
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Limpia el formulario y lo devuelve a su estado natural de "Alta"
function resetearFormulario() {
  formTitulo.innerText = '🟡 Registrar Nuevo Alumno'
  btnSubmit.innerText = 'Guardar Alumno'
  btnSubmit.className = 'btn-primary'
  btnCancelar.style.display = 'none'

  grupoLegajo.style.display = 'none'
  grupoActivo.style.display = 'none'

  editandoLegajoInput.value = ''
  formAlumno.reset()
}
