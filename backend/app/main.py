from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
import sqlite3
from typing import Generator, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


BACKEND_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_DIR / "data"
DATABASE_PATH = DATA_DIR / "animanova.db"
PetSpecies = Literal["ave_silvestre", "mamifero_silvestre", "reptil", "anfibio", "pez", "otro"]
ActorRole = Literal["usuario", "rescatista", "refugio"]
AnimalStatus = Literal["reportado", "en_atencion", "trasladado", "ingresado", "recuperando"]
ReportType = Literal["alerta", "rescate", "traslado", "ingreso"]
ReportStatus = Literal["pendiente", "en_revision", "atendido", "cerrado"]

app = FastAPI(
    title="WildCare API",
    description="Gestión de fauna silvestre en riesgo, rescate, tránsito y seguimiento por refugios.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["*"],
)


class ActorCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    rol: ActorRole
    correo: str = Field(min_length=5, max_length=150)
    telefono: str | None = Field(default=None, max_length=30)
    organizacion: str | None = Field(default=None, max_length=120)
    ubicacion: str | None = Field(default=None, max_length=200)


class AnimalCreate(BaseModel):
    nombre: str | None = Field(default=None, max_length=80)
    especie: str = Field(min_length=2, max_length=80)
    raza: str | None = Field(default=None, max_length=80)
    sexo: Literal["macho", "hembra", "desconocido"] = "desconocido"
    edad_aproximada: str | None = Field(default=None, max_length=50)
    descripcion: str = Field(min_length=10, max_length=1000)
    vacunado: bool | None = None
    esterilizado: bool | None = None
    estado: AnimalStatus = "reportado"
    responsable_id: int | None = Field(default=None, gt=0)
    imagen_url: str | None = Field(default=None, max_length=500)


class ReportCreate(BaseModel):
    tipo: ReportType
    especie: str = Field(min_length=2, max_length=80)
    descripcion: str = Field(min_length=10, max_length=1000)
    ubicacion: str = Field(min_length=3, max_length=200)
    animal_id: int | None = Field(default=None, gt=0)
    reportante_id: int | None = Field(default=None, gt=0)
    contacto: str | None = Field(default=None, max_length=100)
    imagen_url: str | None = Field(default=None, max_length=500)


class ReportStatusUpdate(BaseModel):
    estado: ReportStatus


class AnimalStatusUpdate(BaseModel):
    estado: AnimalStatus


@contextmanager
def get_connection() -> Generator[sqlite3.Connection, None, None]:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    with get_connection() as connection:
        existing_reports = connection.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'reportes'"
        ).fetchone()
        if existing_reports:
            columns = {
                row["name"] for row in connection.execute("PRAGMA table_info(reportes)")
            }
            if "tipo" not in columns:
                connection.execute("ALTER TABLE reportes RENAME TO reportes_anteriores")

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS actores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                rol TEXT NOT NULL CHECK (rol IN ('usuario', 'rescatista', 'refugio')),
                correo TEXT NOT NULL UNIQUE,
                telefono TEXT,
                organizacion TEXT,
                ubicacion TEXT,
                fecha_creacion TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS animales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                especie TEXT NOT NULL,
                raza TEXT,
                sexo TEXT NOT NULL,
                edad_aproximada TEXT,
                descripcion TEXT NOT NULL,
                vacunado INTEGER,
                esterilizado INTEGER,
                estado TEXT NOT NULL,
                responsable_id INTEGER REFERENCES actores(id),
                imagen_url TEXT,
                fecha_creacion TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS reportes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL,
                especie TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                ubicacion TEXT NOT NULL,
                animal_id INTEGER REFERENCES animales(id),
                reportante_id INTEGER REFERENCES actores(id),
                contacto TEXT,
                imagen_url TEXT,
                estado TEXT NOT NULL DEFAULT 'pendiente',
                fecha_creacion TEXT NOT NULL
            )
            """
        )


def row_to_dict(row: sqlite3.Row) -> dict[str, object]:
    return dict(row)


initialize_database()


@app.get("/", tags=["inicio"])
def read_root() -> dict[str, str]:
    return {
        "mensaje": "API de WildCare para fauna silvestre en riesgo",
        "documentacion": "/docs",
    }


@app.post("/api/actores", status_code=201, tags=["actores"])
def create_actor(actor: ActorCreate) -> dict[str, object]:
    created_at = datetime.now(timezone.utc).isoformat()
    try:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO actores (nombre, rol, correo, telefono, organizacion, ubicacion, fecha_creacion)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    actor.nombre,
                    actor.rol,
                    actor.correo,
                    actor.telefono,
                    actor.organizacion,
                    actor.ubicacion,
                    created_at,
                ),
            )
            saved_actor = connection.execute(
                "SELECT * FROM actores WHERE id = ?", (cursor.lastrowid,)
            ).fetchone()
    except sqlite3.IntegrityError as error:
        if "actores.correo" in str(error):
            raise HTTPException(status_code=409, detail="El correo ya está registrado") from error
        raise HTTPException(status_code=422, detail="Datos de actor relacionados no válidos") from error
    return row_to_dict(saved_actor)


@app.get("/api/actores", tags=["actores"])
def list_actors(rol: ActorRole | None = None) -> list[dict[str, object]]:
    with get_connection() as connection:
        if rol:
            actors = connection.execute(
                "SELECT * FROM actores WHERE rol = ? ORDER BY id DESC", (rol,)
            ).fetchall()
        else:
            actors = connection.execute("SELECT * FROM actores ORDER BY id DESC").fetchall()
    return [row_to_dict(actor) for actor in actors]


@app.post("/api/animales", status_code=201, tags=["animales silvestres"])
def create_animal(animal: AnimalCreate) -> dict[str, object]:
    created_at = datetime.now(timezone.utc).isoformat()
    try:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO animales (
                    nombre, especie, raza, sexo, edad_aproximada, descripcion,
                    vacunado, esterilizado, estado, responsable_id, imagen_url, fecha_creacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    animal.nombre,
                    animal.especie,
                    animal.raza,
                    animal.sexo,
                    animal.edad_aproximada,
                    animal.descripcion,
                    animal.vacunado,
                    animal.esterilizado,
                    animal.estado,
                    animal.responsable_id,
                    animal.imagen_url,
                    created_at,
                ),
            )
            saved_animal = connection.execute(
                "SELECT * FROM animales WHERE id = ?", (cursor.lastrowid,)
            ).fetchone()
    except sqlite3.IntegrityError as error:
        raise HTTPException(status_code=422, detail="El responsable indicado no existe") from error
    return row_to_dict(saved_animal)


@app.get("/api/animales", tags=["animales silvestres"])
def list_animals(
    especie: PetSpecies | None = None,
    estado: AnimalStatus | None = None,
) -> list[dict[str, object]]:
    conditions = []
    parameters: list[str] = []
    if especie:
        conditions.append("especie = ?")
        parameters.append(especie)
    if estado:
        conditions.append("estado = ?")
        parameters.append(estado)
    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    with get_connection() as connection:
        animals = connection.execute(
            f"SELECT * FROM animales {where_clause} ORDER BY id DESC", parameters
        ).fetchall()
    return [row_to_dict(animal) for animal in animals]


@app.get("/api/animales/{animal_id}", tags=["animales silvestres"])
def get_animal(animal_id: int) -> dict[str, object]:
    with get_connection() as connection:
        animal = connection.execute(
            "SELECT * FROM animales WHERE id = ?", (animal_id,)
        ).fetchone()
    if animal is None:
        raise HTTPException(status_code=404, detail="Animal doméstico no encontrado")
    return row_to_dict(animal)


@app.patch("/api/animales/{animal_id}/estado", tags=["animales silvestres"])
def update_animal_status(
    animal_id: int, update: AnimalStatusUpdate
) -> dict[str, object]:
    with get_connection() as connection:
        cursor = connection.execute(
            "UPDATE animales SET estado = ? WHERE id = ?",
            (update.estado, animal_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Animal doméstico no encontrado")
        animal = connection.execute(
            "SELECT * FROM animales WHERE id = ?", (animal_id,)
        ).fetchone()
    return row_to_dict(animal)


@app.post("/api/reportes", status_code=201, tags=["reportes de fauna silvestre"])
def create_report(report: ReportCreate) -> dict[str, object]:
    created_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as connection:
        if report.animal_id is not None:
            animal = connection.execute(
                "SELECT especie FROM animales WHERE id = ?", (report.animal_id,)
            ).fetchone()
            if animal is None:
                raise HTTPException(status_code=404, detail="Animal doméstico no encontrado")
            if animal["especie"] != report.especie:
                raise HTTPException(
                    status_code=422,
                    detail="La especie del reporte debe coincidir con la del animal",
                )
        try:
            cursor = connection.execute(
                """
                INSERT INTO reportes (
                    tipo, especie, descripcion, ubicacion, animal_id, reportante_id,
                    contacto, imagen_url, fecha_creacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    report.tipo,
                    report.especie,
                    report.descripcion,
                    report.ubicacion,
                    report.animal_id,
                    report.reportante_id,
                    report.contacto,
                    report.imagen_url,
                    created_at,
                ),
            )
            saved_report = connection.execute(
                "SELECT * FROM reportes WHERE id = ?", (cursor.lastrowid,)
            ).fetchone()
        except sqlite3.IntegrityError as error:
            raise HTTPException(status_code=422, detail="El reportante indicado no existe") from error
    return row_to_dict(saved_report)


@app.get("/api/reportes", tags=["reportes de fauna silvestre"])
def list_reports(
    tipo: ReportType | None = None,
    estado: ReportStatus | None = None,
) -> list[dict[str, object]]:
    conditions = []
    parameters: list[str] = []
    if tipo:
        conditions.append("tipo = ?")
        parameters.append(tipo)
    if estado:
        conditions.append("estado = ?")
        parameters.append(estado)
    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    with get_connection() as connection:
        reports = connection.execute(
            f"SELECT * FROM reportes {where_clause} ORDER BY id DESC", parameters
        ).fetchall()
    return [row_to_dict(report) for report in reports]


@app.get("/api/reportes/{report_id}", tags=["reportes de fauna silvestre"])
def get_report(report_id: int) -> dict[str, object]:
    with get_connection() as connection:
        report = connection.execute(
            "SELECT * FROM reportes WHERE id = ?", (report_id,)
        ).fetchone()
    if report is None:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return row_to_dict(report)


@app.patch("/api/reportes/{report_id}/estado", tags=["reportes de fauna silvestre"])
def update_report_status(
    report_id: int, update: ReportStatusUpdate
) -> dict[str, object]:
    with get_connection() as connection:
        cursor = connection.execute(
            "UPDATE reportes SET estado = ? WHERE id = ?",
            (update.estado, report_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")
        report = connection.execute(
            "SELECT * FROM reportes WHERE id = ?", (report_id,)
        ).fetchone()
