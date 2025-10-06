// Función para abrir el modal de reserva con el servicio seleccionado
function pedirCita(servicio) {
  document.getElementById("servicioSeleccionado").textContent = servicio;
  document.getElementById("modalCita").style.display = "block";
}

// Función para cerrar el modal
function cerrarModal() {
  document.getElementById("modalCita").style.display = "none";
  document.getElementById("mensajeError").textContent = "";
  document.getElementById("formCita").reset();
}

// Guardar cita con validaciones
let citas = JSON.parse(localStorage.getItem("citas")) || [];

function guardarCita(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const contacto = document.getElementById("contacto").value.trim();
  const fechaHoraInput = document.getElementById("fechaHora").value;

  if (!nombre || !contacto || !fechaHoraInput) {
    document.getElementById("mensajeError").textContent = "Todos los campos son obligatorios.";
    return;
  }

  const fechaHora = new Date(fechaHoraInput);
  const ahora = new Date();

  // Validación: mínimo 24h de antelación
  if ((fechaHora - ahora) < 24 * 60 * 60 * 1000) {
    document.getElementById("mensajeError").textContent = "La cita debe pedirse con al menos 24 horas de antelación.";
    return;
  }

  // Validación: máximo 2 citas por hora
  const horaStr = fechaHora.toISOString().slice(0, 13); // YYYY-MM-DDTHH
  const citasMismaHora = citas.filter(c => c.fechaHora.slice(0, 13) === horaStr);

  if (citasMismaHora.length >= 2) {
    document.getElementById("mensajeError").textContent = "Esta hora ya está completa, elige otra.";
    return;
  }

  // Guardar la cita
  const servicio = document.getElementById("servicioSeleccionado").textContent;
  citas.push({ nombre, contacto, servicio, fechaHora: fechaHora.toISOString() });
  localStorage.setItem("citas", JSON.stringify(citas));

  alert(`Cita reservada correctamente para ${nombre} en el servicio "${servicio}".`);
  cerrarModal();
}

// Cerrar modal si se hace click fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById("modalCita");
  if (event.target == modal) {
    cerrarModal();
  }
}