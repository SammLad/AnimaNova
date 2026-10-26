# Backend de AnimaNova

API inicial para registrar y consultar reportes de animales en situación de calle. Está construida con FastAPI y SQLite; la base de datos se crea automáticamente en `data/animanova.db` al iniciar la API.

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

Endpoints iniciales:

- `GET /`: comprobar que la API responde.
- `POST /api/reportes`: crear un reporte con especie, descripción, ubicación e imagen opcional (URL).
- `GET /api/reportes`: listar reportes.
- `GET /api/reportes/{report_id}`: consultar un reporte.
- `PATCH /api/reportes/{report_id}/estado`: cambiar su estado a `pendiente`, `en_atencion` o `resuelto`.

Para probar la comunicación desde JavaScript, deja la API ejecutándose y, en otra terminal, ejecuta `node examples/reportes.js` desde esta carpeta.

## Alcance de esta primera etapa

Esta versión es una base de aprendizaje: no tiene inicio de sesión, permisos por tipo de usuario, carga de imágenes ni publicación en internet. Los cambios de estado todavía no están protegidos por roles. Esos elementos deben diseñarse antes de usar datos reales o desplegar el sistema; los siguientes módulos recomendados son usuarios y roles, autenticación y gestión segura de contactos.