import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import deerImage from '../../assets/deer.png';
import { getReports, getSession, saveReports, signOut } from '../../servicios/auth';
import '../../assets/styles/home.css';

const animals = [
  { name: 'Max', detail: 'Perro · Amigable y juguetón', emoji: '🐕' },
  { name: 'Luna', detail: 'Gata · Tranquila y cariñosa', emoji: '🐈' },
  { name: 'Rocky', detail: 'Perro · Activo y sociable', emoji: '🐶' },
];

const stories = [
  { title: 'Cuidados básicos', text: 'Aprende sobre alimentación adecuada, higiene, ejercicio y visitas al veterinario.' },
  { title: 'Adoptar con responsabilidad', text: 'Prepara tu hogar y asume el compromiso de cuidar a un animal durante toda su vida.' },
  { title: 'Protección animal', text: 'Conoce cómo actuar responsablemente y ayudar a los animales de tu comunidad.' },
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(getSession);
  const [reports, setReports] = useState(getReports);
  const [reportMessage, setReportMessage] = useState('');
  const [donationAmount, setDonationAmount] = useState('25');
  const [donationMessage, setDonationMessage] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  function handleSignOut() {
    signOut();
    setSession(null);
    navigate('/', { replace: true });
  }

  function submitReport(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const report = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      especie: form.get('especie').toString().trim(),
      ubicacion: form.get('ubicacion').toString().trim(),
      descripcion: form.get('descripcion').toString().trim(),
      estado: 'Reportado',
      fecha: new Date().toLocaleDateString('es-CO'),
    };
    const updatedReports = [report, ...reports];
    saveReports(updatedReports);
    setReports(updatedReports);
    setReportMessage(`Reporte ${report.id} registrado. Un equipo de rescate podrá darle seguimiento.`);
    event.currentTarget.reset();
  }

  function submitDonation(event) {
    event.preventDefault();
    const amount = Number(donationAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setDonationMessage('Escribe un monto válido mayor que cero.');
      return;
    }
    const donations = JSON.parse(localStorage.getItem('anima_donations') || '[]');
    localStorage.setItem('anima_donations', JSON.stringify([
      { id: `DON-${Date.now()}`, monto: amount, fecha: new Date().toISOString() },
      ...donations,
    ]));
    setDonationMessage(`¡Gracias! Registramos tu aporte de $${amount.toLocaleString('es-CO')} para esta simulación.`);
  }

  function submitContact(event) {
    event.preventDefault();
    setContactMessage('Gracias por escribirnos. Tu mensaje quedó registrado en esta demostración.');
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
            <a href="#adopciones">Adopciones</a>
            <a href="#donaciones">Donaciones</a>
            <a href="#blog">Blog</a>
          </nav>
          <div className="header-actions">
            {session ? (
              <>
                <span className="session-greeting">Hola, {session.nombre}</span>
                <button className="button button--quiet" type="button" onClick={handleSignOut}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link className="button button--quiet" to="/login">Ingresar</Link>
                <Link className="button button--primary" to="/crear-cuenta">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="public-main">
        {location.state?.notice && <p className="public-notice" role="status">{location.state.notice}</p>}

        <section className="hero-section" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">Cuidamos cada historia</span>
            <h1>Una comunidad que protege y transforma vidas.</h1>
            <p>Anima Nova conecta a ciudadanos, rescatistas, refugios y centros de cuidado para dar a cada animal una nueva oportunidad.</p>
            <div className="hero-actions">
              <a href="#reportar" className="button button--primary">Reportar un animal</a>
              <a href="#adopciones" className="button button--outline">Conocer adopciones</a>
            </div>
            <div className="hero-stats">
              <div><strong>{reports.length}</strong><span>casos en seguimiento</span></div>
              <div><strong>5</strong><span>roles de la comunidad</span></div>
              <div><strong>1</strong><span>objetivo: cuidar</span></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art__halo" />
            <img src={deerImage} alt="Ciervo de Anima Nova" />
            <div className="hero-note"><span>♡</span><div><strong>Pequeñas acciones</strong><small>crean grandes cambios</small></div></div>
          </div>
        </section>

        <section className="intro-grid" aria-label="Nuestra misión">
          <article className="intro-card intro-card--highlight">
            <span className="eyebrow">¿Quiénes somos?</span>
            <h2>El cuidado animal nos une.</h2>
            <p>Somos una comunidad dedicada al rescate y protección de animales domésticos y silvestres. Facilitamos la colaboración para que puedan vivir de manera segura y encontrar hogares responsables.</p>
          </article>
          <article className="intro-card"><span className="feature-icon">🛟</span><h3>Respuesta coordinada</h3><p>Las alertas de la comunidad llegan a personas y organizaciones preparadas para ayudar.</p></article>
          <article className="intro-card"><span className="feature-icon">🏡</span><h3>Nuevos hogares</h3><p>Impulsamos adopciones responsables y acompañamos a quienes desean brindar una familia.</p></article>
        </section>

        <section className="content-section" id="reportar">
          <div className="section-heading">
            <span className="eyebrow">Ayuda inmediata</span>
            <h2>¿Viste un animal en peligro?</h2>
            <p>Comparte los datos del caso para que la red de rescate pueda organizar la atención.</p>
          </div>
          <div className="report-layout">
            <form className="panel-card report-form" onSubmit={submitReport}>
              <label htmlFor="report-especie">Especie o tipo de animal</label>
              <input id="report-especie" name="especie" placeholder="Ej. Canino, ave, gato" required />
              <label htmlFor="report-location">Ubicación</label>
              <input id="report-location" name="ubicacion" placeholder="Dirección o punto de referencia" required />
              <label htmlFor="report-description">¿Qué sucede?</label>
              <textarea id="report-description" name="descripcion" rows="4" placeholder="Describe brevemente el estado del animal" required />
              <button className="button button--danger" type="submit">Enviar alerta de rescate</button>
              {reportMessage && <p className="form-message form-message--success" role="status">{reportMessage}</p>}
            </form>
            <aside className="rescue-aside">
              <span className="feature-icon">🚨</span>
              <h3>Consejos mientras llega ayuda</h3>
              <ul>
                <li>Mantén una distancia segura y evita asustar al animal.</li>
                <li>No suministres medicamentos ni alimentos a la fuerza.</li>
                <li>Comparte una ubicación clara y visible.</li>
              </ul>
              <Link to="/crear-cuenta">Crea tu cuenta para dar seguimiento →</Link>
            </aside>
          </div>
          <div className="recent-cases">
            <h3>Casos activos de la comunidad</h3>
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
        </section>

        <section className="content-section tactics-section" id="tacticas">
          <div className="section-heading">
            <span className="eyebrow">Información para todos</span>
            <h2>Tácticas de auxilio inmediato</h2>
            <p>Orientación general para actuar con prudencia antes de que llegue el equipo especializado.</p>
          </div>
          <div className="info-grid">
            <article className="info-card"><span className="severity severity--high">Crítico</span><h3>Mamíferos y mascotas</h3><p>Ante una hemorragia, aplica presión suave con un paño limpio solo si hacerlo es seguro. No intentes inmovilizar lesiones sin orientación profesional.</p></article>
            <article className="info-card"><span className="severity severity--medium">Moderado</span><h3>Aves</h3><p>Reduce el ruido y mantén distancia. No fuerces agua o alimento; comunica la ubicación a un rescatista o especialista.</p></article>
            <article className="info-card"><span className="severity severity--low">Preventivo</span><h3>Fauna silvestre</h3><p>No intentes capturarla ni tocarla. Aleja a otras personas y espera instrucciones del equipo especializado.</p></article>
          </div>
        </section>

        <section className="content-section adoption-section" id="adopciones">
          <div className="section-heading">
            <span className="eyebrow">Adopción responsable</span>
            <h2>Un hogar cambia dos vidas</h2>
            <p>Conoce algunos animales que esperan una familia comprometida.</p>
          </div>
          <div className="animal-grid">
            {animals.map((animal) => (
              <article className="animal-card" key={animal.name}>
                <div className="animal-card__photo" aria-hidden="true">{animal.emoji}</div>
                <div className="animal-card__body"><span className="animal-label">En busca de hogar</span><h3>{animal.name}</h3><p>{animal.detail}</p><Link className="button button--outline" to="/login">Consultar adopción</Link></div>
              </article>
            ))}
          </div>
          <p className="adoption-note">Para adoptar se requiere identificación vigente, un espacio seguro y compromiso de cuidado y seguimiento veterinario.</p>
        </section>

        <section className="content-section donation-section" id="donaciones">
          <div className="donation-copy">
            <span className="eyebrow">Ayuda solidaria</span>
            <h2>Cada aporte se convierte en cuidado.</h2>
            <p>Apoya alimentos, atención veterinaria y espacios seguros en los refugios. Esta página registra donaciones de forma local como demostración; no procesa pagos reales.</p>
          </div>
          <form className="donation-form" onSubmit={submitDonation}>
            <label htmlFor="donation-amount">Monto de aporte (USD)</label>
            <div className="amount-options">
              {['10', '25', '50'].map((amount) => <button type="button" className={donationAmount === amount ? 'amount-option is-selected' : 'amount-option'} key={amount} onClick={() => setDonationAmount(amount)}>${amount}</button>)}
            </div>
            <input id="donation-amount" type="number" min="1" step="1" value={donationAmount} onChange={(event) => setDonationAmount(event.target.value)} required />
            <button className="button button--primary" type="submit">Registrar aporte de prueba</button>
            {donationMessage && <p className="form-message form-message--success" role="status">{donationMessage}</p>}
          </form>
        </section>

        <section className="content-section" id="blog">
          <div className="section-heading">
            <span className="eyebrow">Blog del cuidador</span>
            <h2>Aprendamos a cuidar mejor</h2>
            <p>Información sencilla para proteger y comprender a los animales.</p>
          </div>
          <div className="info-grid blog-grid">
            {stories.map((story, index) => <article className="info-card blog-card" key={story.title}><span className="blog-number">0{index + 1}</span><h3>{story.title}</h3><p>{story.text}</p></article>)}
          </div>
        </section>

        <section className="content-section contact-section" id="contacto">
          <div className="contact-copy"><span className="eyebrow">Estamos para ayudarte</span><h2>Conversemos</h2><p>¿Tienes dudas, una propuesta o quieres colaborar con la red?</p><a href="mailto:hola@animanova.org">hola@animanova.org</a></div>
          <form className="contact-form" onSubmit={submitContact}>
            <label htmlFor="contact-name">Tu nombre</label><input id="contact-name" name="nombre" required />
            <label htmlFor="contact-email">Correo electrónico</label><input id="contact-email" name="correo" type="email" required />
            <label htmlFor="contact-message">Mensaje</label><textarea id="contact-message" name="mensaje" rows="3" required />
            <button className="button button--primary" type="submit">Enviar mensaje</button>
            {contactMessage && <p className="form-message form-message--success" role="status">{contactMessage}</p>}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <Link className="brand brand--footer" to="/"><img className="brand__mark" src={deerImage} alt="" /><span>Anima Nova</span></Link>
        <p>Cuidamos, protegemos y damos nuevas oportunidades.</p>
        <div><Link to="/login">Ingresar</Link><Link to="/crear-cuenta">Crear cuenta</Link></div>
        <small>© 2026 Anima Nova · Plataforma demostrativa</small>
      </footer>
    </div>
  );
}
