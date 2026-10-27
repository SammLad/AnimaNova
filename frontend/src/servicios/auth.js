<<<<<<< HEAD
const USERS_KEY = 'anima_users';
const SESSION_KEY = 'anima_session';
const REPORTS_KEY = 'anima_reports';
export const VALID_ROLES = ['admin', 'usuario', 'rescatista', 'refugio'];
=======
const USERS_KEY = "anima_users";
const SESSION_KEY = "anima_session";
const REPORTS_KEY = "anima_reports";
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803

export const DEMO_ADMIN = {
  email: "admin@animanova.com",
  password: "Admin2026!",
};

export const DEMO_ACCOUNTS = [
  DEMO_ADMIN,
<<<<<<< HEAD
  { email: 'usuario@animanova.com', password: 'Usuario2026!', nombre: 'Ana García', rol: 'usuario' },
  { email: 'rescatista@animanova.com', password: 'Rescate2026!', nombre: 'Equipo Rescate', rol: 'rescatista' },
  { email: 'refugio@animanova.com', password: 'Refugio2026!', nombre: 'Refugio Esperanza', rol: 'refugio' },
=======
  {
    email: "rescatista@animanova.com",
    password: "Rescate2026!",
    nombre: "Equipo Rescate",
    rol: "rescatista",
  },
  {
    email: "refugio@animanova.com",
    password: "Refugio2026!",
    nombre: "Refugio Esperanza",
    rol: "refugio",
  },
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
];

export const SUPPORTED_ROLES = ["admin", "ciudadano", "rescatista", "refugio"];

export const ROLE_LABELS = {
<<<<<<< HEAD
  admin: 'Administrador',
  usuario: 'Usuario',
  rescatista: 'Rescatista',
  refugio: 'Refugio',
=======
  admin: "Administrador",
  ciudadano: "Ciudadano",
  rescatista: "Rescatista",
  refugio: "Refugio",
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
};

export function normalizeRole(role) {
  if (!role) return role;
  const normalized = String(role).trim().toLowerCase();
  if (normalized === 'ciudadano') return 'usuario';
  return normalized;
}

export function rolePath(role) {
<<<<<<< HEAD
  const normalized = normalizeRole(role);
  if (!normalized) return '/';
  if (normalized === 'admin') return '/panel/admin';
  return VALID_ROLES.includes(normalized) ? `/panel/${normalized}` : '/';
=======
  return role === "admin" ? "/panel/admin" : "/";
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
}

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(value))
      throw new Error(`El contenido de ${key} no es una lista.`);
    return value;
  } catch (error) {
    console.error(`No se pudieron leer los datos de ${key}.`, error);
    throw new Error(
      "No fue posible leer los datos guardados. Recarga la página e inténtalo nuevamente.",
    );
  }
}

function ensureDemoData() {
  const users = readArray(USERS_KEY).map((user) => ({
    ...user,
    rol: normalizeRole(user.rol),
  }));

  let usersChanged = false;
  DEMO_ACCOUNTS.forEach((account, index) => {
    if (!users.some((user) => user.email === account.email)) {
      users.push({
        id: `demo-${index}`,
        nombre: account.nombre || "Administrador Anima Nova",
        email: account.email,
        password: account.password,
        rol: account.rol || "admin",
        estado: "activo",
      });
      usersChanged = true;
    }
  });

  const normalizedUsers = users.map((user) => ({
    ...user,
    rol: VALID_ROLES.includes(normalizeRole(user.rol)) ? normalizeRole(user.rol) : 'usuario',
  }));

  if (usersChanged || JSON.stringify(users) !== JSON.stringify(normalizedUsers)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(normalizedUsers));
  }

  const reports = readArray(REPORTS_KEY);
  if (reports.length === 0) {
<<<<<<< HEAD
    localStorage.setItem(REPORTS_KEY, JSON.stringify([
      {
        id: 'REP-1042',
        especie: 'Ave silvestre',
        ubicacion: 'Parque del Norte',
        descripcion: 'Ave encontrada en el suelo, con heridas leves y dificultad para volar.',
        estado: 'Pendiente',
        fecha: '2026-10-25',
        reportadoPor: 'Usuario demo',
      },
      {
        id: 'REP-1041',
        especie: 'Mamífero silvestre',
        ubicacion: 'Calle 142 con Carrera 19',
        descripcion: 'Se observó un mamífero en una zona urbana con síntomas de desorientación.',
        estado: 'En atención',
        fecha: '2026-10-24',
        reportadoPor: 'Usuario demo',
      },
    ]));
=======
    localStorage.setItem(
      REPORTS_KEY,
      JSON.stringify([
        {
          id: "REP-1042",
          especie: "Ave silvestre",
          ubicacion: "Calle 142 con Carrera 19",
          descripcion:
            "Ave silvestre encontrada herida; se reportó a un equipo especializado.",
          estado: "Reportado",
          fecha: "2026-10-25",
        },
        {
          id: "REP-1041",
          especie: "Zarigüeya",
          ubicacion: "Parque del Norte",
          descripcion:
            "Zarigüeya encontrada en una zona urbana; requiere valoración especializada.",
          estado: "En atención",
          fecha: "2026-10-24",
        },
      ]),
    );
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
  }
}

ensureDemoData();

export function getUsers() {
  return readArray(USERS_KEY).map((user) => ({
    ...user,
    rol: normalizeRole(user.rol),
  }));
}

export function getReports() {
  return readArray(REPORTS_KEY);
}

export function saveReports(reports) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function registerCitizen({ nombre, email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("Ya existe una cuenta registrada con ese correo.");
  }

  const user = {
    id: `usr-${Date.now()}`,
    nombre: nombre.trim(),
    email: normalizedEmail,
    password,
<<<<<<< HEAD
    rol: 'usuario',
    estado: 'activo',
=======
    rol: "ciudadano",
    estado: "activo",
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return user;
}

export function signIn(identifier, password) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = getUsers().find(
    (candidate) =>
      (candidate.email.toLowerCase() === normalizedIdentifier ||
        candidate.nombre.toLowerCase() === normalizedIdentifier) &&
      candidate.password === password &&
      SUPPORTED_ROLES.includes(candidate.rol) &&
      candidate.estado !== "suspendido",
  );

  if (!user)
    throw new Error(
      "Usuario o contraseña incorrectos, o la cuenta está suspendida.",
    );

<<<<<<< HEAD
  const session = { id: user.id, nombre: user.nombre, email: user.email, rol: normalizeRole(user.rol) };
=======
  const session = {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
  };
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try {
<<<<<<< HEAD
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!session) return null;
    return { ...session, rol: normalizeRole(session.rol) };
=======
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (session && !SUPPORTED_ROLES.includes(session.rol)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
  } catch (error) {
    console.error("No se pudo recuperar la sesión actual.", error);
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}
