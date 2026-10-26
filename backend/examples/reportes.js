const API_URL = "http://127.0.0.1:8000/api/reportes";

async function crearReporte() {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      especie: "Perro",
      descripcion: "Perro encontrado cerca del parque del barrio.",
      ubicacion: "Parque principal, Bogotá",
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}`);
  }

  const reporte = await respuesta.json();
  console.log("Reporte creado:", reporte);
  return reporte;
}

async function listarReportes() {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}`);
  }

  console.log("Reportes:", await respuesta.json());
}

crearReporte()
  .then(listarReportes)
  .catch((error) => console.error("Error al comunicarse con AnimaNova:", error));