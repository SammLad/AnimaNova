const API_ROOT = "http://127.0.0.1:8000/api";

async function enviar(ruta, datos) {
  const respuesta = await fetch(`${API_ROOT}${ruta}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}`);
  }

  return respuesta.json();
}

async function listarFauna() {
  const respuesta = await fetch(`${API_ROOT}/animales`);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}`);
  }

  console.log("Fauna silvestre:", await respuesta.json());
}

async function ejemplo() {
  const rescatista = await enviar("/actores", {
    nombre: "Equipo de rescate",
    rol: "rescatista",
    correo: `rescatista-${Date.now()}@animanova.local`,
    organizacion: "Centro de rehabilitación de fauna",
    ubicacion: "Bogotá",
  });

  const animal = await enviar("/animales", {
    especie: "zarigüeya común",
    grupo_taxonomico: "mamifero",
    sexo: "desconocido",
    descripcion: "Zarigüeya silvestre encontrada herida y bajo valoración.",
    habitat: "Bosque andino",
    condicion: "Requiere valoración por personal especializado",
    responsable_id: rescatista.id,
  });

  const reporte = await enviar("/reportes", {
    tipo: "herido",
    especie: animal.especie,
    grupo_taxonomico: animal.grupo_taxonomico,
    descripcion: "Se encontró una zarigüeya herida cerca del parque.",
    ubicacion: "Parque principal, Bogotá",
    animal_id: animal.id,
    reportante_id: rescatista.id,
    contacto: "contacto@animanova.local",
  });

  console.log("Reporte creado:", reporte);
  await listarFauna();
}

ejemplo().catch((error) => console.error("Error al comunicarse con AnimaNova:", error));