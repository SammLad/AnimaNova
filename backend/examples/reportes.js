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

async function listarAnimales() {
  const respuesta = await fetch(`${API_ROOT}/animales`);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}`);
  }

  console.log("Animales silvestres en seguimiento:", await respuesta.json());
}

async function ejemplo() {
  const rescatista = await enviar("/actores", {
    nombre: "Equipo de rescate",
    rol: "rescatista",
    correo: `rescatista-${Date.now()}@animanova.local`,
    organizacion: "Red comunitaria",
    ubicacion: "Bogotá",
  });

  const animal = await enviar("/animales", {
    nombre: "Loro",
    especie: "ave_silvestre",
    raza: "No aplica",
    sexo: "hembra",
    edad_aproximada: "1 año",
    descripcion: "Ave silvestre encontrada en una zona urbana y bajo cuidado temporal.",
    vacunado: false,
    esterilizado: false,
    responsable_id: rescatista.id,
  });

  const reporte = await enviar("/reportes", {
    tipo: "alerta",
    especie: animal.especie,
    descripcion: "Se reportó a un ave silvestre en la zona del parque con signos de desorientación.",
    ubicacion: "Parque principal, Bogotá",
    animal_id: animal.id,
    reportante_id: rescatista.id,
    contacto: "contacto@animanova.local",
  });

  console.log("Reporte creado:", reporte);
  await listarAnimales();
}

ejemplo().catch((error) => console.error("Error al comunicarse con WildCare:", error));