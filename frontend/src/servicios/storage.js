<<<<<<< HEAD
﻿const WC_KEYS = {
  USERS: 'wc_users',
  SESSION: 'wc_session',
  REPORTS: 'wc_reports',
  BLOG: 'wc_blog',
  SPECIALISTS: 'wc_specialists',
  NOTIFICATIONS: 'wc_notifications',
  SEEDED: 'wc_seeded_wildcare'
=======
/* ===========================================================
   AnimaNova — storage.js (Frontera de Datos & Reglas de Negocio)
=========================================================== */

const WC_KEYS = {
  USERS: "wc_users",
  SESSION: "wc_session",
  REPORTS: "wc_reports",
  DONATIONS: "wc_donations",
  BLOG: "wc_blog",
  ADOPTIONS: "wc_adoptions",
  JORNADAS: "wc_jornadas",
  SPECIALISTS: "wc_specialists",
  NOTIFICATIONS: "wc_notifications",
  VOLUNTEER_REQUESTS: "wc_volunteer_requests",
  CONTACT_REQUESTS: "wc_contact_requests",
  ADOPTION_REQUIREMENTS: "wc_adoption_requirements",
  ENTITIES: "wc_entities",
  SEEDED: "wc_seeded_v3",
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
};

function wcGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("Error leyendo LocalStorage:", key, e);
    return fallback;
  }
}

function wcSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function wcUid(prefix) {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 7)
  );
}

function wcSeedAll() {
  if (wcGet(WC_KEYS.SEEDED, false)) return;

  wcSet(WC_KEYS.SPECIALISTS, [
<<<<<<< HEAD
    { id: 'esp_1', nombre: 'Dra. Elena Rostova', especialidad: 'Fauna silvestre y aves', contacto: 'elena.wildlife@gmail.com', telefono: '+57 312 456 7890' },
    { id: 'esp_2', nombre: 'Dr. Carlos Mendoza', especialidad: 'Mamíferos y rehabilitación', contacto: 'carlos.m@vetcare.org', telefono: '+57 315 987 6543' }
  ]);

  wcSet(WC_KEYS.REPORTS, [
    {
      id: 'REP_9921',
      especie: 'Ave silvestre',
      ubicacion: 'Parque del Norte',
      descripcion: 'Ave encontrada en el suelo con movilidad limitada.',
      estado: 'pendiente',
      fecha: '2026-06-21T15:45:00.000Z',
      comentarios: ['Se requiere revisión para evaluar la posibilidad de traslado.'],
      historialMedico: []
    },
    {
      id: 'REP_4812',
      especie: 'Mamífero silvestre',
      ubicacion: 'Calle 142 con Carrera 19',
      descripcion: 'Se observó un mamífero desorientado cerca de la vía.',
      estado: 'en-atencion',
      fecha: '2026-06-22T10:30:00.000Z',
=======
    {
      id: "esp_1",
      nombre: "Dra. Elena Rostova",
      especialidad: "Fauna Silvestre y Aves",
      contacto: "elena.wildlife@gmail.com",
      telefono: "+57 312 456 7890",
    },
    {
      id: "esp_2",
      nombre: "Dr. Carlos Mendoza",
      especialidad: "Grandes Felinos y Mamíferos",
      contacto: "carlos.m@vetcare.org",
      telefono: "+57 315 987 6543",
    },
  ]);

  // Jornadas de conservación
  wcSet(WC_KEYS.JORNADAS, [
    {
      id: "jor_1",
      titulo: "Jornada por la Fauna Silvestre",
      fecha: "2026-07-15",
      lugar: "Parque Central de la Ciudad",
      descripcion:
        "Participa en actividades de educación ambiental y protección de hábitats silvestres.",
    },
  ]);

  // Reportes Iniciales (Flujo Dinámico)
  wcSet(WC_KEYS.REPORTS, [
    {
      id: "REP_9921",
      tipoAnimal: "Zarigüeya",
      clasificacion: "Silvestre",
      descripcion:
        "Zarigüeya rescatada para valoración y rehabilitación especializada.",
      ubicacion: "Transversal 54 #10-22",
      coordenadas: "https://maps.google.com/?q=4.6104,-74.0721",
      estado: "rescatado",
      foto: "../../assets/deer.png",
      fecha: "2026-06-21T15:45:00.000Z",
      comentarios: [
        "En valoración para su recuperación y retorno seguro a su hábitat.",
      ],
      historialMedico: [
        {
          fecha: "2026-06-22",
          diagnostico: "Desparasitación",
          tratamiento: "Control veterinario y vacunas.",
        },
      ],
    },
    {
      id: "REP_4812",
      tipoAnimal: "Ave silvestre",
      clasificacion: "Silvestre",
      descripcion:
        "Ave silvestre herida encontrada cerca de la autopista norte; requiere atención especializada.",
      ubicacion: "Calle 142 con Carrera 19",
      coordenadas: "https://maps.google.com/?q=4.7258,-74.0422",
      estado: "reportado",
      foto: "../../assets/deer.png",
      fecha: "2026-06-22T10:30:00.000Z",
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
      comentarios: [],
      historialMedico: [],
    },
  ]);

  wcSet(WC_KEYS.BLOG, [
<<<<<<< HEAD
    { id: 'art_1', titulo: 'Primeros auxilios ante fracturas en aves', contenido: 'Nunca intentes entablillar el ala sin guantes. Mantén al animal en una caja oscura y ventilada.', aprobado: true, fecha: '2026-06-18' },
    { id: 'art_2', titulo: 'Rescate silencioso: cómo proteger la zona', contenido: 'Reduce el ruido, evita acercamientos innecesarios y comparte la ubicación exacta con una organización de rescate.', aprobado: true, fecha: '2026-06-20' }
  ]);

  wcSet(WC_KEYS.NOTIFICATIONS, [
    { id: 'not_1', mensaje: 'Nuevo reporte de ave silvestre en peligro en Parque del Norte.', fecha: new Date().toISOString(), ubicacion: 'Parque del Norte' }
=======
    {
      id: "art_1",
      titulo: "Cómo actuar ante un ave silvestre herida",
      contenido:
        "Mantén distancia, evita capturarla y contacta a las autoridades ambientales o a un centro de rescate.",
      aprobado: true,
      fecha: "2026-06-18",
      foto: "../../assets/deer.png",
    },
    {
      id: "art_2",
      titulo: "Rescate Exitoso: El retorno del Venado de Oro",
      contenido:
        "Gracias al reporte oportuno de la comunidad, logramos recuperar un ciervo juvenil que deambulaba por la zona escolar.",
      aprobado: true,
      fecha: "2026-06-20",
      foto: "../../assets/deer.png",
    },
  ]);

  // Donaciones Base
  wcSet(WC_KEYS.DONATIONS, [
    {
      id: "TX_99012",
      monto: 50,
      fecha: "2026-06-23T08:12:00.000Z",
      donante: "Anónimo",
    },
  ]);

  // Solicitudes de Voluntariado y Contacto Base
  wcSet(WC_KEYS.VOLUNTEER_REQUESTS, []);
  wcSet(WC_KEYS.CONTACT_REQUESTS, []);

  // Requisitos de atención de fauna y entidades de gestión
  wcSet(WC_KEYS.ADOPTION_REQUIREMENTS, [
    "Derivación a un centro autorizado de atención de fauna silvestre",
    "Valoración veterinaria por personal especializado",
    "Plan de rehabilitación y liberación en un hábitat adecuado",
  ]);
  wcSet(WC_KEYS.ENTITIES, [
    {
      id: "usr_1",
      tipo: "usuario",
      nombre: "María López",
      email: "maria@example.com",
      estado: "activo",
    },
    {
      id: "ref_1",
      tipo: "refugio",
      nombre: "Refugio Central WildCare",
      email: "refugio@wildcare.com",
      estado: "activo",
    },
    {
      id: "zoo_1",
      tipo: "zoologico",
      nombre: "Zoológico Regional Norte",
      email: "zoo@wildcare.com",
      estado: "activo",
    },
    {
      id: "res_1",
      tipo: "rescatista",
      nombre: "Camilo Rojas",
      email: "camilo@example.com",
      estado: "activo",
    },
  ]);

  // Notificaciones Base
  wcSet(WC_KEYS.NOTIFICATIONS, [
    {
      id: "not_1",
      mensaje: "Nuevo reporte de ave silvestre en peligro en Calle 142.",
      fecha: new Date().toISOString(),
      ubicacion: "Calle 142 con Carrera 19",
    },
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
  ]);

  wcSet(WC_KEYS.SEEDED, true);
}

wcSeedAll();

<<<<<<< HEAD
export const WildCareStorage = {
  getReports: () => wcGet(WC_KEYS.REPORTS, []),
  saveReports: (reports) => wcSet(WC_KEYS.REPORTS, reports),
  getSpecialists: () => wcGet(WC_KEYS.SPECIALISTS, []),
  getBlog: () => wcGet(WC_KEYS.BLOG, []),
  getNotifications: () => wcGet(WC_KEYS.NOTIFICATIONS, []),
  addNotification: (message, ubicacion) => {
    const current = wcGet(WC_KEYS.NOTIFICATIONS, []);
    const next = [{ id: wcUid('not'), mensaje: message, fecha: new Date().toISOString(), ubicacion }, ...current];
    wcSet(WC_KEYS.NOTIFICATIONS, next);
    return next;
  }
};
=======
// Funciones helper globales del ecosistema
function wcGetReports() {
  return wcGet(WC_KEYS.REPORTS, []);
}
function wcSaveReports(reports) {
  wcSet(WC_KEYS.REPORTS, reports);
}
function wcGetDonations() {
  return wcGet(WC_KEYS.DONATIONS, []);
}
function wcGetBlog() {
  return wcGet(WC_KEYS.BLOG, []);
}
function wcGetSpecialists() {
  return wcGet(WC_KEYS.SPECIALISTS, []);
}
function wcGetJornadas() {
  return wcGet(WC_KEYS.JORNADAS, []);
}
function wcGetNotifications() {
  return wcGet(WC_KEYS.NOTIFICATIONS, []);
}
function wcGetAdoptions() {
  return wcGet(WC_KEYS.ADOPTIONS, []);
}
function wcGetVolunteerRequests() {
  return wcGet(WC_KEYS.VOLUNTEER_REQUESTS, []);
}
function wcGetContactRequests() {
  return wcGet(WC_KEYS.CONTACT_REQUESTS, []);
}
function wcGetAdoptionRequirements() {
  return wcGet(WC_KEYS.ADOPTION_REQUIREMENTS, []);
}
function wcSaveAdoptionRequirements(requirements) {
  wcSet(WC_KEYS.ADOPTION_REQUIREMENTS, requirements);
}
function wcGetEntities() {
  return wcGet(WC_KEYS.ENTITIES, []);
}
function wcSaveEntities(entities) {
  wcSet(WC_KEYS.ENTITIES, entities);
}
function wcSaveVolunteerRequests(requests) {
  wcSet(WC_KEYS.VOLUNTEER_REQUESTS, requests);
}
function wcSaveContactRequests(requests) {
  wcSet(WC_KEYS.CONTACT_REQUESTS, requests);
}

const WC_ESTADOS = {
  reportado: { label: "Reportado", clase: "bg-danger text-white" },
  "en-camino": { label: "En Camino", clase: "bg-warning text-dark" },
  rescatado: { label: "Rescatado", clase: "bg-info text-white" },
  "en-refugio": { label: "En Refugio", clase: "bg-purple text-white" },
  "en-adopcion": { label: "En rehabilitación", clase: "bg-success text-white" },
  adoptado: { label: "Adoptado", clase: "bg-secondary text-white" },
};

function wcEstadoBadge(estado) {
  const e = WC_ESTADOS[estado] || {
    label: estado,
    clase: "bg-dark text-white",
  };
  return `<span class="badge ${e.clase} px-3 py-1 rounded-pill">${e.label}</span>`;
}
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
