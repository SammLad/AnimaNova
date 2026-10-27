const WC_KEYS = {
  USERS: 'wc_users',
  SESSION: 'wc_session',
  REPORTS: 'wc_reports',
  BLOG: 'wc_blog',
  SPECIALISTS: 'wc_specialists',
  NOTIFICATIONS: 'wc_notifications',
  SEEDED: 'wc_seeded_wildcare',
};

function wcGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error('Error leyendo LocalStorage:', key, error);
    return fallback;
  }
}

function wcSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function wcSeedAll() {
  if (wcGet(WC_KEYS.SEEDED, false)) return;

  wcSet(WC_KEYS.SPECIALISTS, [
    { id: 'esp_1', nombre: 'Dra. Elena Rostova', especialidad: 'Fauna silvestre y aves', contacto: 'elena.wildlife@gmail.com', telefono: '+57 312 456 7890' },
    { id: 'esp_2', nombre: 'Dr. Carlos Mendoza', especialidad: 'Mamíferos y rehabilitación', contacto: 'carlos.m@vetcare.org', telefono: '+57 315 987 6543' },
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
      historialMedico: [],
    },
    {
      id: 'REP_4812',
      especie: 'Mamífero silvestre',
      ubicacion: 'Calle 142 con Carrera 19',
      descripcion: 'Se observó un mamífero desorientado cerca de la vía.',
      estado: 'en-atencion',
      fecha: '2026-06-22T10:30:00.000Z',
      comentarios: [],
      historialMedico: [],
    },
  ]);

  wcSet(WC_KEYS.BLOG, [
    { id: 'art_1', titulo: 'Primeros auxilios ante fracturas en aves', contenido: 'Nunca intentes entablillar el ala sin guantes. Mantén al animal en una caja oscura y ventilada.', aprobado: true, fecha: '2026-06-18' },
    { id: 'art_2', titulo: 'Rescate silencioso: cómo proteger la zona', contenido: 'Reduce el ruido, evita acercamientos innecesarios y comparte la ubicación exacta con una organización de rescate.', aprobado: true, fecha: '2026-06-20' },
  ]);

  wcSet(WC_KEYS.NOTIFICATIONS, [
    { id: 'not_1', mensaje: 'Nuevo reporte de ave silvestre en peligro en Parque del Norte.', fecha: new Date().toISOString(), ubicacion: 'Parque del Norte' },
  ]);

  wcSet(WC_KEYS.SEEDED, true);
}

wcSeedAll();

export const WildCareStorage = {
  read: wcGet,
  write: wcSet,
  keys: WC_KEYS,
};

export default WildCareStorage;