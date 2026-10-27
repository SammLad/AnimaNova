const USERS_KEY = "anima_users";
const SESSION_KEY = "anima_session";
const REPORTS_KEY = "anima_reports";

export const DEMO_ADMIN = {
  email: "admin@animanova.com",
  password: "Admin2026!",
};

export const DEMO_ACCOUNTS = [
  DEMO_ADMIN,
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
];

export const SUPPORTED_ROLES = ["admin", "ciudadano", "rescatista", "refugio"];

export const ROLE_LABELS = {
  admin: "Administrador",
  ciudadano: "Ciudadano",
  rescatista: "Rescatista",
  refugio: "Refugio",
};

export function rolePath(role) {
  return role === "admin" ? "/panel/admin" : "/";
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
  const users = readArray(USERS_KEY);
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
  if (usersChanged) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  const reports = readArray(REPORTS_KEY);
  if (reports.length === 0) {
    localStorage.setItem(
      REPORTS_KEY,
      JSON.stringify([
        {
          id: "REP-1042",
          especie: "Canino",
          ubicacion: "Calle 142 con Carrera 19",
          descripcion:
            "Perrito con una pata lastimada, resguardado en un lugar seguro.",
          estado: "Reportado",
          fecha: "2026-10-25",
        },
        {
          id: "REP-1041",
          especie: "Felino",
          ubicacion: "Parque del Norte",
          descripcion:
            "Gato encontrado en el parque; requiere revisión veterinaria.",
          estado: "En atención",
          fecha: "2026-10-24",
        },
      ]),
    );
  }
}

ensureDemoData();

export function getUsers() {
  return readArray(USERS_KEY);
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
    rol: "ciudadano",
    estado: "activo",
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

  const session = {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (session && !SUPPORTED_ROLES.includes(session.rol)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch (error) {
    console.error("No se pudo recuperar la sesión actual.", error);
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}
