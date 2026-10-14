-- ===========================================================
--  WildCare — Base de datos MySQL 8.x
--  16 tablas: roles, usuarios, entidades, reportes y módulos asociados
-- ===========================================================

-- DROP DATABASE IF EXISTS wildcare;
CREATE DATABASE wildcare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE wildcare;

-- -----------------------------------------------------------
-- 1. ROLES
-- -----------------------------------------------------------
CREATE TABLE roles (
  id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(30)  NOT NULL,
  descripcion VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 2. ENTIDADES (refugios, zoológicos, santuarios)
-- -----------------------------------------------------------
CREATE TABLE entidades (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo           ENUM('refugio','zoologico','santuario') NOT NULL,
  nombre         VARCHAR(120) NOT NULL,
  correo         VARCHAR(120) NULL,
  telefono       VARCHAR(20)  NULL,
  direccion      VARCHAR(200) NULL,
  estado         ENUM('activo','bloqueado') NOT NULL DEFAULT 'activo',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_entidades_nombre (nombre)
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 3. USUARIOS
-- -----------------------------------------------------------
CREATE TABLE usuarios (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  rol_id         TINYINT UNSIGNED NOT NULL,
  entidad_id     INT UNSIGNED NULL,
  nombre         VARCHAR(120) NOT NULL,
  correo         VARCHAR(120) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  telefono       VARCHAR(20)  NULL,
  estado         ENUM('activo','bloqueado') NOT NULL DEFAULT 'activo',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo),
  KEY idx_usuarios_rol (rol_id),
  KEY idx_usuarios_entidad (entidad_id),
  CONSTRAINT fk_usuarios_rol     FOREIGN KEY (rol_id)     REFERENCES roles (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_usuarios_entidad FOREIGN KEY (entidad_id) REFERENCES entidades (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 4. REPORTES
-- -----------------------------------------------------------
CREATE TABLE reportes (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo          VARCHAR(20)  NOT NULL,
  reportante_id   INT UNSIGNED NULL,
  rescatista_id   INT UNSIGNED NULL,
  entidad_id      INT UNSIGNED NULL,
  tipo_animal     VARCHAR(60)  NOT NULL,
  clasificacion   ENUM('Pendiente','Doméstico','Silvestre') NOT NULL DEFAULT 'Pendiente',
  descripcion     TEXT NOT NULL,
  ubicacion       VARCHAR(200) NOT NULL,
  coordenadas_url VARCHAR(500) NULL,
  foto_url        VARCHAR(500) NULL,
  estado          ENUM('reportado','en-camino','rescatado','en-refugio','en-adopcion','adoptado')
                  NOT NULL DEFAULT 'reportado',
  fecha_reporte   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reportes_codigo (codigo),
  KEY idx_reportes_estado (estado),
  KEY idx_reportes_tipo (tipo_animal),
  KEY idx_reportes_reportante (reportante_id),
  KEY idx_reportes_rescatista (rescatista_id),
  KEY idx_reportes_entidad (entidad_id),
  CONSTRAINT fk_reportes_reportante FOREIGN KEY (reportante_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_reportes_rescatista FOREIGN KEY (rescatista_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_reportes_entidad    FOREIGN KEY (entidad_id)    REFERENCES entidades (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 5. REPORTE_COMENTARIOS
-- -----------------------------------------------------------
CREATE TABLE reporte_comentarios (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reporte_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NULL,
  comentario TEXT NOT NULL,
  fecha      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_comentarios_reporte (reporte_id),
  KEY idx_comentarios_usuario (usuario_id),
  CONSTRAINT fk_comentarios_reporte FOREIGN KEY (reporte_id) REFERENCES reportes (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 6. REPORTE_ACTUALIZACIONES (bitácora de cambios)
-- -----------------------------------------------------------
CREATE TABLE reporte_actualizaciones (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reporte_id      INT UNSIGNED NOT NULL,
  usuario_id      INT UNSIGNED NULL,
  detalle         VARCHAR(500) NOT NULL,
  estado_anterior VARCHAR(20)  NULL,
  estado_nuevo    VARCHAR(20)  NULL,
  fecha           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_actualizaciones_reporte (reporte_id, fecha),
  KEY idx_actualizaciones_usuario (usuario_id),
  CONSTRAINT fk_actualizaciones_reporte FOREIGN KEY (reporte_id) REFERENCES reportes (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_actualizaciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 7. HISTORIAL_MEDICO
-- -----------------------------------------------------------
CREATE TABLE historial_medico (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reporte_id     INT UNSIGNED NOT NULL,
  veterinario_id INT UNSIGNED NULL,
  diagnostico    VARCHAR(255) NOT NULL,
  tratamiento    TEXT NOT NULL,
  fecha          DATE NOT NULL,
  PRIMARY KEY (id),
  KEY idx_historial_reporte (reporte_id),
  KEY idx_historial_vet (veterinario_id),
  CONSTRAINT fk_historial_reporte FOREIGN KEY (reporte_id) REFERENCES reportes (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_historial_vet     FOREIGN KEY (veterinario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 8. SOLICITUDES_ADOPCION
-- -----------------------------------------------------------
CREATE TABLE solicitudes_adopcion (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reporte_id        INT UNSIGNED NOT NULL,
  usuario_id        INT UNSIGNED NULL,
  nombre_postulante VARCHAR(120) NOT NULL,
  telefono          VARCHAR(20)  NOT NULL,
  espacio_adecuado  ENUM('si','no') NOT NULL,
  estado            ENUM('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
  respuesta         VARCHAR(255) NULL,
  fecha_solicitud   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_decision    DATETIME NULL,
  decidido_por      INT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_adopcion_reporte (reporte_id),
  KEY idx_adopcion_usuario (usuario_id),
  KEY idx_adopcion_estado (estado),
  KEY idx_adopcion_decidido (decidido_por),
  CONSTRAINT fk_adopcion_reporte   FOREIGN KEY (reporte_id)   REFERENCES reportes (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_adopcion_usuario   FOREIGN KEY (usuario_id)   REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_adopcion_decidido  FOREIGN KEY (decidido_por) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 9. REQUISITOS_ADOPCION
-- -----------------------------------------------------------
CREATE TABLE requisitos_adopcion (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  entidad_id  INT UNSIGNED NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  orden       SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_requisitos_entidad (entidad_id),
  CONSTRAINT fk_requisitos_entidad FOREIGN KEY (entidad_id) REFERENCES entidades (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 10. JORNADAS
-- -----------------------------------------------------------
CREATE TABLE jornadas (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  entidad_id  INT UNSIGNED NULL,
  creado_por  INT UNSIGNED NULL,
  titulo      VARCHAR(150) NOT NULL,
  lugar       VARCHAR(200) NOT NULL,
  fecha       DATE NOT NULL,
  descripcion TEXT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_jornadas_fecha (fecha),
  KEY idx_jornadas_entidad (entidad_id),
  KEY idx_jornadas_creador (creado_por),
  CONSTRAINT fk_jornadas_entidad FOREIGN KEY (entidad_id) REFERENCES entidades (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_jornadas_creador FOREIGN KEY (creado_por) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 11. DONACIONES
-- -----------------------------------------------------------
CREATE TABLE donaciones (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo_transaccion VARCHAR(20)  NOT NULL,
  usuario_id         INT UNSIGNED NULL,
  entidad_destino_id INT UNSIGNED NULL,
  monto              DECIMAL(12,2) NOT NULL,
  moneda             CHAR(3) NOT NULL DEFAULT 'USD',
  fecha              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_donaciones_codigo (codigo_transaccion),
  KEY idx_donaciones_usuario (usuario_id),
  KEY idx_donaciones_entidad (entidad_destino_id),
  CONSTRAINT chk_donaciones_monto CHECK (monto > 0),
  CONSTRAINT fk_donaciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_donaciones_entidad FOREIGN KEY (entidad_destino_id) REFERENCES entidades (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 12. BLOG_PUBLICACIONES
-- -----------------------------------------------------------
CREATE TABLE blog_publicaciones (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  autor_id          INT UNSIGNED NULL,
  titulo            VARCHAR(200) NOT NULL,
  contenido         TEXT NOT NULL,
  foto_url          VARCHAR(500) NULL,
  aprobado          TINYINT(1) NOT NULL DEFAULT 0,
  aprobado_por      INT UNSIGNED NULL,
  fecha_publicacion DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (id),
  KEY idx_blog_aprobado (aprobado),
  KEY idx_blog_autor (autor_id),
  KEY idx_blog_aprobador (aprobado_por),
  CONSTRAINT fk_blog_autor     FOREIGN KEY (autor_id)     REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_blog_aprobador FOREIGN KEY (aprobado_por) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 13. ESPECIALISTAS
-- -----------------------------------------------------------
CREATE TABLE especialistas (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(120) NOT NULL,
  especialidad VARCHAR(150) NOT NULL,
  correo       VARCHAR(120) NOT NULL,
  telefono     VARCHAR(20)  NULL,
  activo       TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_especialistas_correo (correo)
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 14. SOLICITUDES_CONTACTO
-- -----------------------------------------------------------
CREATE TABLE solicitudes_contacto (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  especialista_id   INT UNSIGNED NOT NULL,
  usuario_id        INT UNSIGNED NULL,
  correo_solicitante VARCHAR(120) NOT NULL,
  motivo            TEXT NOT NULL,
  estado            ENUM('pendiente','atendida') NOT NULL DEFAULT 'pendiente',
  fecha             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contacto_especialista (especialista_id),
  KEY idx_contacto_usuario (usuario_id),
  CONSTRAINT fk_contacto_especialista FOREIGN KEY (especialista_id) REFERENCES especialistas (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_contacto_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 15. SOLICITUDES_VOLUNTARIADO
-- -----------------------------------------------------------
CREATE TABLE solicitudes_voluntariado (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id      INT UNSIGNED NULL,
  entidad_id      INT UNSIGNED NOT NULL,
  nombre          VARCHAR(120) NOT NULL,
  correo          VARCHAR(120) NOT NULL,
  estado          ENUM('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
  respuesta       VARCHAR(255) NULL,
  fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_decision  DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_voluntariado_usuario (usuario_id),
  KEY idx_voluntariado_entidad (entidad_id),
  KEY idx_voluntariado_estado (estado),
  CONSTRAINT fk_voluntariado_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_voluntariado_entidad FOREIGN KEY (entidad_id) REFERENCES entidades (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- 16. NOTIFICACIONES
-- -----------------------------------------------------------
CREATE TABLE notificaciones (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NULL,
  reporte_id INT UNSIGNED NULL,
  mensaje    VARCHAR(500) NOT NULL,
  ubicacion  VARCHAR(200) NULL,
  leida      TINYINT(1) NOT NULL DEFAULT 0,
  fecha      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_usuario (usuario_id, leida),
  KEY idx_notif_reporte (reporte_id),
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_notif_reporte FOREIGN KEY (reporte_id) REFERENCES reportes (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;


-- ===========================================================
--  DATOS INICIALES (equivalentes a wcSeedAll() de storage.js)
--  Los password_hash son marcadores: reemplázalos por hashes
--  reales (bcrypt/argon2) generados desde el backend.
-- ===========================================================

INSERT INTO roles (nombre, descripcion) VALUES
('usuario',    'Público general: reporta, adopta, dona, escribe en el blog y se inscribe como voluntario'),
('rescatista', 'Acepta casos, clasifica animales y actualiza estados de rescate'),
('refugio',    'Refugio / veterinario: fichas clínicas, jornadas, requisitos y decisiones de adopción y voluntariado'),
('admin',      'Administrador general: modera el blog, gestiona cuentas y audita donaciones');

INSERT INTO entidades (tipo, nombre, correo, telefono, direccion, estado) VALUES
('refugio',   'Refugio Central WildCare',  'refugio@wildcare.com', NULL, NULL, 'activo'),
('zoologico', 'Zoológico Regional Norte',  'zoo@wildcare.com',     NULL, NULL, 'activo'),
('santuario', 'Santuario de Aves Libres',  NULL,                   NULL, NULL, 'activo');

INSERT INTO usuarios (rol_id, entidad_id, nombre, correo, password_hash, estado) VALUES
((SELECT id FROM roles WHERE nombre='admin'),      NULL, 'Test Core',    'admin@wildcare.com',   'CAMBIAR_HASH_ADMIN',   'activo'),
((SELECT id FROM roles WHERE nombre='usuario'),    NULL, 'María López',  'maria@example.com',    'CAMBIAR_HASH_USUARIO', 'activo'),
((SELECT id FROM roles WHERE nombre='rescatista'), NULL, 'Camilo Rojas', 'camilo@example.com',   'CAMBIAR_HASH_RESCATA', 'activo'),
((SELECT id FROM roles WHERE nombre='refugio'),
  (SELECT id FROM entidades WHERE nombre='Refugio Central WildCare'),
  'Veterinario Refugio Central', 'vet@wildcare.com', 'CAMBIAR_HASH_REFUGIO', 'activo');

INSERT INTO especialistas (nombre, especialidad, correo, telefono) VALUES
('Dra. Elena Rostova',  'Fauna Silvestre y Aves',       'elena.wildlife@gmail.com', '+57 312 456 7890'),
('Dr. Carlos Mendoza',  'Grandes Felinos y Mamíferos',  'carlos.m@vetcare.org',     '+57 315 987 6543');

INSERT INTO jornadas (entidad_id, creado_por, titulo, lugar, fecha, descripcion) VALUES
((SELECT id FROM entidades WHERE nombre='Refugio Central WildCare'),
 (SELECT id FROM usuarios WHERE correo='vet@wildcare.com'),
 'Gran Jornada por la Fauna Doméstica', 'Parque Central de la Ciudad', '2026-07-15',
 'Ven y conoce a tu próximo compañero de vida. Estaremos entregando kits de bienvenida.');

INSERT INTO requisitos_adopcion (entidad_id, descripcion, orden)
SELECT e.id, r.descripcion, r.orden
FROM entidades e
JOIN (
  SELECT 'Documento de identidad vigente' AS descripcion, 1 AS orden
  UNION ALL SELECT 'Espacio seguro y adecuado para el animal', 2
  UNION ALL SELECT 'Compromiso de cuidado responsable y seguimiento veterinario', 3
) r
WHERE e.nombre = 'Refugio Central WildCare';

INSERT INTO reportes
  (codigo, reportante_id, rescatista_id, entidad_id, tipo_animal, clasificacion, descripcion,
   ubicacion, coordenadas_url, foto_url, estado, fecha_reporte)
VALUES
('REP_9921', NULL, NULL,
 (SELECT id FROM entidades WHERE nombre='Refugio Central WildCare'),
 'Gato', 'Doméstico',
 'Gatito rescatado en buen estado, ideal para adopción responsable.',
 'Transversal 54 #10-22', 'https://maps.google.com/?q=4.6104,-74.0721',
 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=400&auto=format&fit=crop',
 'en-adopcion', '2026-06-21 15:45:00'),
('REP_4812', NULL, NULL, NULL,
 'Canino', 'Doméstico',
 'Perrito herido en una pata encontrado cerca de la autopista norte.',
 'Calle 142 con Carrera 19', 'https://maps.google.com/?q=4.7258,-74.0422',
 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop',
 'reportado', '2026-06-22 10:30:00');

INSERT INTO reporte_comentarios (reporte_id, usuario_id, comentario, fecha)
VALUES ((SELECT id FROM reportes WHERE codigo='REP_9921'),
        (SELECT id FROM usuarios WHERE correo='camilo@example.com'),
        'Listo para recibir un hogar seguro.', '2026-06-21 16:00:00');

INSERT INTO historial_medico (reporte_id, veterinario_id, diagnostico, tratamiento, fecha)
VALUES ((SELECT id FROM reportes WHERE codigo='REP_9921'),
        (SELECT id FROM usuarios WHERE correo='vet@wildcare.com'),
        'Desparasitación', 'Control veterinario y vacunas.', '2026-06-22');

INSERT INTO blog_publicaciones (autor_id, titulo, contenido, foto_url, aprobado, aprobado_por, fecha_publicacion) VALUES
((SELECT id FROM usuarios WHERE correo='admin@wildcare.com'),
 'Primeros auxilios ante fracturas de aves',
 'Nunca intentes entablillar el ala sin guantes. Mantén al ave en una caja oscura y ventilada.',
 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=400&auto=format&fit=crop',
 1, (SELECT id FROM usuarios WHERE correo='admin@wildcare.com'), '2026-06-18'),
((SELECT id FROM usuarios WHERE correo='admin@wildcare.com'),
 'Rescate Exitoso: El retorno del Venado de Oro',
 'Gracias al reporte oportuno de la comunidad, logramos recuperar un ciervo juvenil que deambulaba por la zona escolar.',
 'https://plus.unsplash.com/premium_photo-1661819541230-034d07819c9b?q=80&w=400&auto=format&fit=crop',
 1, (SELECT id FROM usuarios WHERE correo='admin@wildcare.com'), '2026-06-20');

INSERT INTO donaciones (codigo_transaccion, usuario_id, entidad_destino_id, monto, moneda, fecha)
VALUES ('TX_99012', NULL, NULL, 50.00, 'USD', '2026-06-23 08:12:00');

INSERT INTO notificaciones (usuario_id, reporte_id, mensaje, ubicacion, leida)
VALUES (NULL,
        (SELECT id FROM reportes WHERE codigo='REP_4812'),
        'Nuevo reporte de Canino en peligro en Calle 142.',
        'Calle 142 con Carrera 19', 0);


-- ===========================================================
--  VISTAS ÚTILES PARA EL FRONTEND
-- ===========================================================

-- Casos activos con su último cambio (tarjetas "Últ. cambio")
CREATE VIEW v_reportes_ultimo_cambio AS
SELECT r.id, r.codigo, r.tipo_animal, r.clasificacion, r.estado, r.ubicacion, r.foto_url,
       (SELECT MAX(a.fecha)   FROM reporte_actualizaciones a WHERE a.reporte_id = r.id) AS ultimo_cambio,
       (SELECT a2.detalle     FROM reporte_actualizaciones a2
         WHERE a2.reporte_id = r.id ORDER BY a2.fecha DESC LIMIT 1)                      AS ultimo_detalle
FROM reportes r;

-- Animales listos para adopción (módulo de adopciones)
CREATE VIEW v_animales_adoptables AS
SELECT id, codigo, tipo_animal, ubicacion, foto_url, estado
FROM reportes
WHERE estado IN ('rescatado','en-refugio','en-adopcion');

-- Blog público (solo aprobados)
CREATE VIEW v_blog_publico AS
SELECT id, titulo, contenido, foto_url, fecha_publicacion
FROM blog_publicaciones
WHERE aprobado = 1
ORDER BY fecha_publicacion DESC;