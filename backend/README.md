# Backend de AnimaNova

API para registrar y atender fauna silvestre: animales observados o rescatados,
reportes comunitarios y actores que participan en rescates y rehabilitación.
Está construida con FastAPI y SQLite. La base exclusiva del backend se crea
automáticamente en `data/fauna_silvestre.db`.

## Requisitos

- Python 3.10 o superior
- pip

## Preparar el entorno en Windows

Abre PowerShell en esta carpeta (`backend`) y ejecuta:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Si PowerShell bloquea la activación, ejecuta
`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` en esa terminal y
vuelve a activar el entorno.

## Iniciar y probar

Con el entorno virtual activado:

```powershell
python -m uvicorn app.main:app --reload
```

La API queda en `http://127.0.0.1:8000`; la documentación interactiva está en
`http://127.0.0.1:8000/docs`. CORS permite el origen de desarrollo de Vite en
`localhost:5173` y `127.0.0.1:5173`.

## Entidades

- **Actor:** ciudadano, rescatista, refugio/centro de rehabilitación, zoológico
  o autoridad ambiental. Tiene nombre, correo único y datos opcionales de
  contacto y ubicación.
- **Fauna silvestre:** especie, grupo taxonómico, sexo, edad aproximada,
  descripción, hábitat, condición, estado de conservación y situación de
  atención. Se rechazan nombres comunes de animales domésticos conocidos.
- **Reporte de fauna:** avistamiento, animal herido, rescate, amenaza, tráfico
  ilegal o liberación; registra especie, grupo taxonómico, ubicación, contacto
  opcional y referencias opcionales al animal y al actor que reporta.

Los grupos taxonómicos aceptados son `mamifero`, `ave`, `reptil`, `anfibio`,
`pez` e `invertebrado`. Los estados de atención de un animal son `reportado`,
`rescatado`, `en_rehabilitacion`, `liberado` y `fallecido`. Los estados de un
reporte son `pendiente`, `en_revision`, `atendido` y `cerrado`.

## Endpoints

- `GET /`: comprobar que la API responde.
- `POST /api/actores` y `GET /api/actores`: registrar y listar actores;
  admite filtro opcional `?rol=rescatista`.
- `POST /api/animales`: registrar fauna silvestre.
- `GET /api/animales`: listar registros; filtros opcionales `?especie=venado`,
  `?grupo_taxonomico=mamifero` y `?estado=rescatado`.
- `GET /api/animales/{animal_id}`: consultar un registro de fauna.
- `PATCH /api/animales/{animal_id}/estado`: actualizar su situación de atención.
- `POST /api/reportes`: publicar un reporte silvestre; `animal_id` y
  `reportante_id` son opcionales.
- `GET /api/reportes`: listar reportes; filtros opcionales `?tipo=herido` y
  `?estado=pendiente`.
- `GET /api/reportes/{report_id}`: consultar un reporte.
- `PATCH /api/reportes/{report_id}/estado`: actualizar su estado.

Los endpoints y métodos HTTP conservan la estructura REST del cliente
demostrativo. La API usa una base nueva (`fauna_silvestre.db`) para no mezclar
registros anteriores con los datos de fauna silvestre.

## Limitaciones

La API aún no implementa autenticación, autorización por rol ni carga de
imágenes; las URL de imagen son referencias proporcionadas por el cliente.
Aunque la API está habilitada para el origen local del frontend, la interfaz
actual guarda datos en `localStorage` y todavía no realiza solicitudes HTTP al
backend. La integración efectiva de la interfaz requiere conectar sus servicios
de datos a estos endpoints.
