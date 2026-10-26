from datetime import datetime, timezone
from pathlib import Path
import sqlite3
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


BACKEND_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_DIR / "data"
DATABASE_PATH = DATA_DIR / "animanova.db"
ReportStatus = Literal["pendiente", "en_atencion", "resuelto"]

app = FastAPI(
    title="AnimaNova API",
    description="API inicial para reportar animales en situación de calle.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["*"],
)


class ReportCreate(BaseModel):
    especie: str = Field(min_length=2, max_length=50)
    descripcion: str = Field(min_length=10, max_length=1000)
    ubicacion: str = Field(min_length=3, max_length=200)
    imagen_url: str | None = Field(default=None, max_length=500)


class ReportStatusUpdate(BaseModel):
    estado: ReportStatus


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS reportes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                especie TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                ubicacion TEXT NOT NULL,
                imagen_url TEXT,
                estado TEXT NOT NULL DEFAULT 'pendiente',
                fecha_creacion TEXT NOT NULL
            )
            """
        )


def report_to_dict(report: sqlite3.Row) -> dict[str, object]:
    return dict(report)


initialize_database()


@app.get("/", tags=["inicio"])
def read_root() -> dict[str, str]:
    return {"mensaje": "Bienvenido a la API de AnimaNova", "documentacion": "/docs"}


@app.post("/api/reportes", status_code=201, tags=["reportes"])
def create_report(report: ReportCreate) -> dict[str, object]:
    created_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO reportes (especie, descripcion, ubicacion, imagen_url, fecha_creacion)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                report.especie,
                report.descripcion,
                report.ubicacion,
                report.imagen_url,
                created_at,
            ),
        )
        saved_report = connection.execute(
            "SELECT * FROM reportes WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()
    return report_to_dict(saved_report)


@app.get("/api/reportes", tags=["reportes"])
def list_reports() -> list[dict[str, object]]:
    with get_connection() as connection:
        reports = connection.execute(
            "SELECT * FROM reportes ORDER BY id DESC"
        ).fetchall()
    return [report_to_dict(report) for report in reports]


@app.get("/api/reportes/{report_id}", tags=["reportes"])
def get_report(report_id: int) -> dict[str, object]:
    with get_connection() as connection:
        report = connection.execute(
            "SELECT * FROM reportes WHERE id = ?", (report_id,)
        ).fetchone()
    if report is None:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return report_to_dict(report)


@app.patch("/api/reportes/{report_id}/estado", tags=["reportes"])
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
    return report_to_dict(report)