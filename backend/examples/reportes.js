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

  console.log("Animales domésticos:", await respuesta.json());
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
    nombre: "Luna",
    especie: "perro",
    raza: "Criollo",
    sexo: "hembra",
    edad_aproximada: "2 años",
    descripcion: "Perra doméstica encontrada y actualmente bajo cuidado.",
    vacunado: false,
    esterilizado: false,
    responsable_id: rescatista.id,
  });

  const reporte = await enviar("/reportes", {
    tipo: "encontrado",
    especie: animal.especie,
    descripcion: "Luna fue encontrada cerca del parque del barrio.",
    ubicacion: "Parque principal, Bogotá",
    animal_id: animal.id,
    reportante_id: rescatista.id,
    contacto: "contacto@animanova.local",
  });

  console.log("Reporte creado:", reporte);
  await listarAnimales();
}

ejemplo().catch((error) => console.error("Error al comunicarse con AnimaNova:", error));