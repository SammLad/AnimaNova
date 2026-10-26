# Backend de AnimaNova

API para organizar la atención de animales domésticos: perfiles de animales, actores de la comunidad y reportes de pérdida, hallazgo, ayuda y adopción. Está construida con FastAPI y SQLite; la base de datos se crea automáticamente en `data/animanova.db` al iniciar la API.

## Requisitos

- Python 3.10 o superior
- pip
- Node.js solo para ejecutar el ejemplo JavaScript

## Preparar el entorno en Windows

Abre PowerShell en esta carpeta (`backend`) y ejecuta:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Si PowerShell bloquea la activación, ejecuta `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` en esa terminal y vuelve a activar el entorno.

## Iniciar y probar

Con el entorno virtual activado:

```powershell
python -m uvicorn app.main:app --reload
```

Abre `http://127.0.0.1:8000/docs` para probar los endpoints interactivos. La API queda en `http://127.0.0.1:8000`.

## Entidades

- **Actor:** persona u organización que participa. Roles: `usuario`, `rescatista`, `refugio` y `adoptante`. Tiene nombre, correo único y datos de contacto/ubicación opcionales.
- **Animal doméstico:** perfil con especie permitida (`perro`, `gato`, `conejo`, `ave_domestica`, `pez`, `otro_domestico`), descripción, estado, responsable opcional y datos básicos de cuidado. La API valida las especies del catálogo doméstico.
- **Reporte:** aviso de pérdida, hallazgo, solicitud de ayuda o adopción. Registra especie doméstica, descripción, ubicación, contacto y, cuando se conoce, el animal y el actor que reporta.

## Endpoints

- `GET /`: comprobar que la API responde.
- `POST /api/actores` y `GET /api/actores`: registrar y listar usuarios, rescatistas, refugios y adoptantes. Se puede filtrar con `?rol=rescatista`.
- `POST /api/animales`: crear el perfil de un animal doméstico.
- `GET /api/animales`: listar perfiles; filtros opcionales `?especie=perro` y `?estado=en_adopcion`.
- `GET /api/animales/{animal_id}`: consultar un perfil.
- `PATCH /api/animales/{animal_id}/estado`: cambiar su situación de cuidado o adopción.
- `POST /api/reportes`: crear un reporte doméstico; `animal_id` y `reportante_id` son opcionales.
- `GET /api/reportes`: listar reportes; filtros opcionales `?tipo=perdido` y `?estado=pendiente`.
- `GET /api/reportes/{report_id}`: consultar un reporte.
- `PATCH /api/reportes/{report_id}/estado`: cambiar su estado a `pendiente`, `en_revision`, `atendido` o `cerrado`.

Para probar la comunicación desde JavaScript, deja la API ejecutándose y, en otra terminal, ejecuta `node examples/reportes.js` desde esta carpeta. El ejemplo registra un rescatista, crea el perfil de un perro y publica un reporte relacionado.

## Límites actuales

Es una base de aprendizaje: todavía no incluye inicio de sesión, autorización por rol, carga de archivos de imagen, módulo veterinario ni publicación en internet. Aunque el rol se registra, no restringe acciones todavía. Antes de usar datos reales o desplegarla, se debe implementar autenticación y autorización, además de acordar el manejo de datos personales y contactos.

## Base existente

Si ya existía la tabla de reportes de la versión anterior, al iniciar esta API se renombra como `reportes_anteriores`; no se borra. La nueva API trabaja con las tablas `actores`, `animales` y `reportes`.