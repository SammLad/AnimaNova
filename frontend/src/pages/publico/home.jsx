<<<<<<< HEAD
﻿import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import deerImage from '../../assets/deer.png';
import deerIcon from '../../assets/icowhite.png';
import { getReports, getSession, saveReports, signOut } from '../../servicios/auth';
import '../../assets/styles/home.css';

const stories = [
  {
    title: 'Primeros auxilios',
    text: 'Conoce cómo actuar con calma, evaluar riesgos y evitar la manipulación innecesaria antes de llegar a un rescatista.',
    emoji: '🩺',
  },
  {
    title: 'Registro del caso',
    text: 'Documenta la especie, la ubicación, el nivel de emergencia y cualquier detalle que ayude a la coordinación del rescate.',
    emoji: '📝',
  },
  {
    title: 'Seguimiento del animal',
    text: 'Entiende cómo pasa de un reporte a un rescate, traslado y ingreso formal a un refugio.',
    emoji: '📍',
=======
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import deerImage from "../../assets/deer.png";
import {
  getReports,
  getSession,
  saveReports,
  signOut,
} from "../../servicios/auth";
import "../../assets/styles/home.css";

const animals = [
  {
    name: "Zarigüeya común",
    detail:
      "En valoración veterinaria tras ser encontrada fuera de su hábitat.",
    emoji: "🦝",
  },
  {
    name: "Guacamaya",
    detail: "En recuperación con seguimiento de especialistas en fauna.",
    emoji: "🦜",
  },
  {
    name: "Iguana verde",
    detail: "En observación para determinar si puede volver a su entorno.",
    emoji: "🦎",
  },
];

const stories = [
  {
    title: "Cómo actuar ante fauna herida",
    text: "Mantén distancia, evita manipular al animal y contacta a las autoridades ambientales o a un centro de rescate.",
  },
  {
    title: "Rehabilitación y liberación",
    text: "Conoce por qué la atención especializada y la liberación en un hábitat adecuado son esenciales para la fauna silvestre.",
  },
  {
    title: "Protege su hábitat",
    text: "Aprende a reducir riesgos para las especies silvestres y a reportar amenazas en su entorno.",
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
  },
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(getSession);
  const [reports, setReports] = useState(getReports);
  const [reportMessage, setReportMessage] = useState("");
  const [donationAmount, setDonationAmount] = useState("25");
  const [donationMessage, setDonationMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  function handleSignOut() {
    signOut();
    setSession(null);
    navigate("/", { replace: true });
  }

  function submitReport(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const report = {
      id: `REP-${Date.now().toString().slice(-6)}`,
<<<<<<< HEAD
      especie: form.get('especie').toString().trim(),
      ubicacion: form.get('ubicacion').toString().trim(),
      coordenadas: form.get('coordenadas')?.toString().trim() || 'Sin geolocalización registrada',
      descripcion: form.get('descripcion').toString().trim(),
      emergencia: form.get('emergencia')?.toString() || 'Media',
      estado: 'Pendiente',
      fecha: new Date().toLocaleDateString('es-CO'),
      reportadoPor: session?.nombre || 'Usuario anónimo',
=======
      especie: form.get("especie").toString().trim(),
      ubicacion: form.get("ubicacion").toString().trim(),
      descripcion: form.get("descripcion").toString().trim(),
      estado: "Reportado",
      fecha: new Date().toLocaleDateString("es-CO"),
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
    };
    const updatedReports = [report, ...reports];
    saveReports(updatedReports);
    setReports(updatedReports);
<<<<<<< HEAD
    setReportMessage(`Reporte ${report.id} registrado. Un rescatista puede revisar el caso y coordinar la atención.`);
=======
    setReportMessage(
      `Reporte ${report.id} registrado. Un equipo de rescate podrá darle seguimiento.`,
    );
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
    event.currentTarget.reset();
  }

  function submitDonation(event) {
    event.preventDefault();
    const amount = Number(donationAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setDonationMessage("Escribe un monto válido mayor que cero.");
      return;
    }
<<<<<<< HEAD
    const donations = JSON.parse(localStorage.getItem('anima_donations') || '[]');
    localStorage.setItem('anima_donations', JSON.stringify([
      { id: `DON-${Date.now()}`, monto: amount, fecha: new Date().toISOString() },
      ...donations,
    ]));
    setDonationMessage(`¡Gracias! Registramos tu aporte de $${amount.toLocaleString('es-CO')} para apoyar refugios y rescates.`);
=======
    const donations = JSON.parse(
      localStorage.getItem("anima_donations") || "[]",
    );
    localStorage.setItem(
      "anima_donations",
      JSON.stringify([
        {
          id: `DON-${Date.now()}`,
          monto: amount,
          fecha: new Date().toISOString(),
        },
        ...donations,
      ]),
    );
    setDonationMessage(
      `¡Gracias! Registramos tu aporte de $${amount.toLocaleString("es-CO")} para esta simulación.`,
    );
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
  }

  function submitContact(event) {
    event.preventDefault();
    setContactMessage(
      "Gracias por escribirnos. Tu mensaje quedó registrado en esta demostración.",
    );
    event.currentTarget.reset();
  }

  return (
    <div className="home-wrapper">
      <header className="site-header">
        <div className="site-header__inner">
          <a href="#inicio" className="brand" aria-label="Anima Nova, inicio">
            <img className="brand__mark" src={deerImage} alt="" />
            <span>Anima Nova</span>
          </a>
          <nav className="main-nav" aria-label="Navegación principal">
            <a href="#inicio">Inicio</a>
            <a href="#reportar">Reportar</a>
<<<<<<< HEAD
            <a href="#tacticas">Guía</a>
=======
            <a href="#adopciones">Conservación</a>
            <a href="#donaciones">Donaciones</a>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
            <a href="#blog">Blog</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <div className="header-actions">
            {session ? (
              <>
                <span className="session-greeting">Hola, {session.nombre}</span>
                <button
                  className="button button--quiet"
                  type="button"
                  onClick={handleSignOut}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="button button--quiet" to="/login">
                  Ingresar
                </Link>
                <Link className="button button--primary" to="/crear-cuenta">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="public-main">
        {location.state?.notice && (
          <p className="public-notice" role="status">
            {location.state.notice}
          </p>
        )}

        <section className="hero-section" id="inicio">
          <div className="hero-copy">
<<<<<<< HEAD
            <span className="eyebrow">Fauna silvestre y rescate</span>
            <h1>Reporte, rescate y acompaña a la fauna en riesgo.</h1>
            <p>WildCare conecta a usuarios, rescatistas y refugios para atender animales silvestres que necesitan ayuda urgente y coordinar su cuidado seguro.</p>
            <div className="hero-actions">
              <a href="#reportar" className="button button--primary">Reportar emergencia</a>
              <a href="#tacticas" className="button button--outline">Ver guía de auxilio</a>
            </div>
            <div className="hero-stats">
              <div><strong>{reports.length}</strong><span>casos en seguimiento</span></div>
              <div><strong>4</strong><span>roles clave</span></div>
              <div><strong>1</strong><span>objetivo: proteger</span></div>
=======
            <span className="eyebrow">Cuidamos cada historia</span>
            <h1>Una comunidad que protege y transforma vidas.</h1>
            <p>
              Anima Nova conecta a ciudadanos, rescatistas y centros
              especializados para proteger la fauna silvestre mediante rescate,
              rehabilitación y conservación de sus hábitats.
            </p>
            <div className="hero-actions">
              <a href="#reportar" className="button button--primary">
                Reportar un animal
              </a>
              <a href="#adopciones" className="button button--outline">
                Conocer la rehabilitación
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{reports.length}</strong>
                <span>casos en seguimiento</span>
              </div>
              <div>
                <strong>5</strong>
                <span>roles de la comunidad</span>
              </div>
              <div>
                <strong>1</strong>
                <span>objetivo: cuidar</span>
              </div>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art__halo" />
            <img src={deerImage} alt="Ciervo de Anima Nova" />
<<<<<<< HEAD
            <div className="hero-note"><span>♡</span><div><strong>Acciones rápidas</strong><small>salvan vidas silvestres</small></div></div>
=======
            <div className="hero-note">
              <span>♡</span>
              <div>
                <strong>Pequeñas acciones</strong>
                <small>crean grandes cambios</small>
              </div>
            </div>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
          </div>
        </section>

        <section className="intro-grid" aria-label="Nuestra misión">
          <article className="intro-card intro-card--highlight">
<<<<<<< HEAD
            <span className="eyebrow">Nuestra misión</span>
            <h2>Responder con rapidez y respeto.</h2>
            <p>Facilitamos la atención de animales silvestres en riesgo mediante reportes claros, coordinación con rescatistas y seguimiento por parte de refugios especializados.</p>
          </article>
          <article className="intro-card"><span className="feature-icon">🛟</span><h3>Respuesta coordinada</h3><p>Las alertas de la comunidad llegan a rescatistas y refugios preparados para actuar con seguridad.</p></article>
          <article className="intro-card"><span className="feature-icon">🏥</span><h3>Seguimiento sanitario</h3><p>Los animales recuperados son ingresados y monitoreados con información médica y de evolución.</p></article>
=======
            <span className="eyebrow">¿Quiénes somos?</span>
            <h2>El cuidado animal nos une.</h2>
            <p>
              Somos una comunidad dedicada al rescate, rehabilitación y
              protección de animales silvestres. Facilitamos la colaboración con
              especialistas para favorecer su regreso seguro a la naturaleza.
            </p>
          </article>
          <article className="intro-card">
            <span className="feature-icon">🛟</span>
            <h3>Respuesta coordinada</h3>
            <p>
              Las alertas de la comunidad llegan a personas y organizaciones
              preparadas para ayudar.
            </p>
          </article>
          <article className="intro-card">
            <span className="feature-icon">🌿</span>
            <h3>Rehabilitación y liberación</h3>
            <p>
              Apoyamos la recuperación de cada ejemplar y su retorno responsable
              a un hábitat adecuado.
            </p>
          </article>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
        </section>

        <section className="content-section" id="reportar">
          <div className="section-heading">
            <span className="eyebrow">Ayuda inmediata</span>
<<<<<<< HEAD
            <h2>¿Viste un animal silvestre en peligro?</h2>
            <p>Comparte los datos del caso para que un rescatista pueda evaluar la urgencia y coordinar la atención.</p>
=======
            <h2>¿Viste un animal en peligro?</h2>
            <p>
              Comparte los datos del caso para que la red de rescate pueda
              organizar la atención.
            </p>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
          </div>
          <div className="report-layout">
            <form className="panel-card report-form" onSubmit={submitReport}>
              <label htmlFor="report-especie">Especie o tipo de animal</label>
<<<<<<< HEAD
              <input id="report-especie" name="especie" placeholder="Ej. Loro, venado, felino, ave" required />

              <label htmlFor="report-location">Ubicación exacta o referencia</label>
              <input id="report-location" name="ubicacion" placeholder="Dirección, barrio o punto de referencia" required />

              <label htmlFor="report-coordinates">Coordenadas o enlace de ubicación</label>
              <input id="report-coordinates" name="coordenadas" placeholder="Ej. 4.7110,-74.0721 o enlace de mapa" />

              <label htmlFor="report-emergency">Nivel de emergencia</label>
              <select id="report-emergency" name="emergencia" defaultValue="Media">
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>

              <label htmlFor="report-description">¿Qué sucede?</label>
              <textarea id="report-description" name="descripcion" rows="4" placeholder="Describe el estado del animal, lesiones, comportamiento o riesgos observados" required />

              <button className="button button--danger" type="submit">Enviar reporte</button>
              {reportMessage && <p className="form-message form-message--success" role="status">{reportMessage}</p>}
=======
              <input
                id="report-especie"
                name="especie"
                placeholder="Ej. Ave silvestre, zarigüeya, iguana"
                required
              />
              <label htmlFor="report-location">Ubicación</label>
              <input
                id="report-location"
                name="ubicacion"
                placeholder="Dirección o punto de referencia"
                required
              />
              <label htmlFor="report-description">¿Qué sucede?</label>
              <textarea
                id="report-description"
                name="descripcion"
                rows="4"
                placeholder="Describe brevemente el estado del animal"
                required
              />
              <button className="button button--danger" type="submit">
                Enviar alerta de rescate
              </button>
              {reportMessage && (
                <p className="form-message form-message--success" role="status">
                  {reportMessage}
                </p>
              )}
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
            </form>

            <aside className="rescue-aside">
              <span className="feature-icon">🚨</span>
              <h3>Antes de intervenir</h3>
              <ul>
<<<<<<< HEAD
                <li>No manipule al animal si presenta signos de agresividad o estrés intenso.</li>
                <li>Evite alimentar o medicar sin orientaciones.</li>
                <li>Comparte una ubicación clara para facilitar la respuesta.</li>
              </ul>
              <Link to="/crear-cuenta">Crear cuenta para dar seguimiento →</Link>
            </aside>
          </div>
          <div className="recent-cases">
            <h3>Casos activos en la comunidad</h3>
            <div className="case-grid">
              {reports.slice(0, 3).map((report) => (
                <article className="case-card" key={report.id}>
                  <div className="case-card__top"><span>{report.especie}</span><span className="status-pill">{report.estado}</span></div>
                  <h4>{report.id}</h4>
                  <p>{report.ubicacion}</p>
                  <small>{report.fecha}</small>
                </article>
              ))}
            </div>
          </div>
=======
                <li>
                  No intentes tocar, capturar ni trasladar al animal silvestre.
                </li>
                <li>
                  Mantén alejadas a las personas; no le des comida, agua ni
                  medicamentos.
                </li>
                <li>
                  Reporta la ubicación a las autoridades ambientales o a un
                  centro de rescate.
                </li>
              </ul>
              <Link to="/crear-cuenta">
                Crea tu cuenta para dar seguimiento →
              </Link>
            </aside>
          </div>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
        </section>

        <section className="content-section tactics-section" id="tacticas">
          <div className="section-heading">
<<<<<<< HEAD
            <span className="eyebrow">Guía de auxilio</span>
            <h2>Actúa con precaución y criterio</h2>
            <p>Estas recomendaciones orientan la atención inicial sin sustituir la evaluación profesional del equipo de rescate.</p>
          </div>
          <div className="info-grid">
            <article className="info-card"><span className="severity severity--high">Crítico</span><h3>Mamíferos y felinos</h3><p>Si el animal presenta heridas graves, mantén distancia y evita inmovilizarlo sin orientación. Reporta la ubicación exacta y el nivel de emergencia.</p></article>
            <article className="info-card"><span className="severity severity--medium">Moderado</span><h3>Aves y voladores</h3><p>Reduce el ruido y busca un espacio tranquilo. No intentes obligarlo a comer ni darle agua si está exhausto o herido.</p></article>
            <article className="info-card"><span className="severity severity--low">Preventivo</span><h3>Fauna silvestre</h3><p>Nunca lo captures ni lo lleves a tu hogar. Aleja a personas y animales domésticos para evitar estrés o ataque.</p></article>
          </div>
        </section>

=======
            <span className="eyebrow">Fauna silvestre</span>
            <h2>Cómo ayudar sin ponerla en riesgo</h2>
            <p>
              La manipulación puede lastimar al animal y ponerte en peligro.
              Mantén distancia y deja la atención en manos de personal
              especializado.
            </p>
          </div>
          <div className="info-grid">
            <article className="info-card">
              <h3>Observa desde una distancia segura</h3>
              <p>
                No lo toques ni intentes capturarlo, incluso si parece herido.
                Algunos animales reaccionan por miedo y pueden lastimarse o
                lastimarte.
              </p>
            </article>
            <article className="info-card">
              <h3>Reduce el estrés y los riesgos</h3>
              <p>
                Mantén alejadas a las personas. No le ofrezcas alimentos, agua
                ni medicamentos; espera indicaciones del equipo de rescate.
              </p>
            </article>
            <article className="info-card">
              <h3>Contacta a especialistas</h3>
              <p>
                Comparte la ubicación exacta, una descripción del animal y su
                estado con las autoridades ambientales o un centro de atención
                de fauna silvestre.
              </p>
            </article>
          </div>
        </section>

        <section className="content-section adoption-section" id="adopciones">
          <div className="section-heading">
            <span className="eyebrow">Rehabilitación responsable</span>
            <h2>Recuperarse para volver a la naturaleza</h2>
            <p>
              Conoce ejemplos de fauna silvestre que requiere valoración y
              atención especializada antes de regresar a su hábitat.
            </p>
          </div>
          <div className="animal-grid">
            {animals.map((animal) => (
              <article className="animal-card" key={animal.name}>
                <div className="animal-card__photo" aria-hidden="true">
                  {animal.emoji}
                </div>
                <div className="animal-card__body">
                  <span className="animal-label">En rehabilitación</span>
                  <h3>{animal.name}</h3>
                  <p>{animal.detail}</p>
                  <Link className="button button--outline" to="/login">
                    Reportar un caso
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="adoption-note">
            La valoración, rehabilitación y liberación de fauna silvestre deben
            quedar a cargo de equipos autorizados.
          </p>
        </section>

>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
        <section className="content-section donation-section" id="donaciones">
          <div className="donation-copy">
            <span className="eyebrow">Apoyo solidario</span>
            <h2>Cada aporte se convierte en cuidado.</h2>
<<<<<<< HEAD
            <p>Apoya alimentos, atención veterinaria y transporte de animales rescatados. Esta simulación registra donaciones locales sin procesar pagos reales.</p>
=======
            <p>
              Apoya la atención veterinaria especializada, la rehabilitación y
              la protección de hábitats. Esta página registra donaciones de
              forma local como demostración; no procesa pagos reales.
            </p>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
          </div>
          <form className="donation-form" onSubmit={submitDonation}>
            <label htmlFor="donation-amount">Monto de apoyo (USD)</label>
            <div className="amount-options">
<<<<<<< HEAD
              {['10', '25', '50'].map((amount) => (
                <button type="button" className={donationAmount === amount ? 'amount-option is-selected' : 'amount-option'} key={amount} onClick={() => setDonationAmount(amount)}>${amount}</button>
              ))}
            </div>
            <input id="donation-amount" type="number" min="1" step="1" value={donationAmount} onChange={(event) => setDonationAmount(event.target.value)} required />
            <button className="button button--primary" type="submit">Registrar aporte</button>
            {donationMessage && <p className="form-message form-message--success" role="status">{donationMessage}</p>}
=======
              {["10", "25", "50"].map((amount) => (
                <button
                  type="button"
                  className={
                    donationAmount === amount
                      ? "amount-option is-selected"
                      : "amount-option"
                  }
                  key={amount}
                  onClick={() => setDonationAmount(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <input
              id="donation-amount"
              type="number"
              min="1"
              step="1"
              value={donationAmount}
              onChange={(event) => setDonationAmount(event.target.value)}
              required
            />
            <button className="button button--primary" type="submit">
              Registrar aporte de prueba
            </button>
            {donationMessage && (
              <p className="form-message form-message--success" role="status">
                {donationMessage}
              </p>
            )}
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
          </form>
        </section>

        <section className="content-section" id="blog">
          <div className="section-heading">
<<<<<<< HEAD
            <span className="eyebrow">Contenido educativo</span>
            <h2>Aprendamos a actuar mejor</h2>
            <p>Información útil para evitar riesgos, coordinar rescates y acompañar la recuperación de especies en peligro.</p>
=======
            <span className="eyebrow">Blog del cuidador</span>
            <h2>Aprendamos a cuidar mejor</h2>
            <p>
              Información sencilla para proteger y comprender a los animales.
            </p>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
          </div>
          <div className="info-grid blog-grid">
            {stories.map((story, index) => (
              <article className="info-card blog-card" key={story.title}>
                <span className="blog-number">0{index + 1}</span>
<<<<<<< HEAD
                <span className="feature-icon feature-icon--in-card">{story.emoji}</span>
=======
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
                <h3>{story.title}</h3>
                <p>{story.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section contact-section" id="contacto">
          <div className="contact-copy">
            <span className="eyebrow">Estamos para ayudarte</span>
            <h2>Conversemos</h2>
<<<<<<< HEAD
            <p>¿Tienes dudas, quieres apoyar la red o compartir información útil para la comunidad?</p>
=======
            <p>¿Tienes dudas, una propuesta o quieres colaborar con la red?</p>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
            <a href="mailto:hola@animanova.org">hola@animanova.org</a>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <label htmlFor="contact-name">Tu nombre</label>
            <input id="contact-name" name="nombre" required />
            <label htmlFor="contact-email">Correo electrónico</label>
            <input id="contact-email" name="correo" type="email" required />
            <label htmlFor="contact-message">Mensaje</label>
            <textarea id="contact-message" name="mensaje" rows="3" required />
<<<<<<< HEAD
            <button className="button button--primary" type="submit">Enviar mensaje</button>
            {contactMessage && <p className="form-message form-message--success" role="status">{contactMessage}</p>}
=======
            <button className="button button--primary" type="submit">
              Enviar mensaje
            </button>
            {contactMessage && (
              <p className="form-message form-message--success" role="status">
                {contactMessage}
              </p>
            )}
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
          </form>
        </section>
      </main>

      <footer className="site-footer">
<<<<<<< HEAD
        <Link className="brand brand--footer" to="/"><img className="brand__mark" src={deerIcon} alt="" /><span>Anima Nova</span></Link>
        <p>Protegemos la fauna y acompañamos la recuperación de cada especie.</p>
        <div><Link to="/login">Ingresar</Link><Link to="/crear-cuenta">Crear cuenta</Link></div>
=======
        <Link className="brand brand--footer" to="/">
          <img className="brand__mark" src={deerImage} alt="" />
          <span>Anima Nova</span>
        </Link>
        <p>Cuidamos, protegemos y damos nuevas oportunidades.</p>
        <div>
          <Link to="/login">Ingresar</Link>
          <Link to="/crear-cuenta">Crear cuenta</Link>
        </div>
>>>>>>> d0cefb837bac01eb79b9c4106afb662d0e6dd803
        <small>© 2026 Anima Nova · Plataforma demostrativa</small>
      </footer>
    </div>
  );
}
