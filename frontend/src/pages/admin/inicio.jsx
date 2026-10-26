import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getReports, getSession, getUsers, ROLE_LABELS, rolePath, saveReports, signOut } from '../../servicios/auth';
import '../../assets/styles/dashboard.css';

const PORTALS = {
  admin: {
    title: 'Centro de administración',
    subtitle: 'Gestiona la comunidad y coordina la respuesta de Anima Nova.',
    navigation: ['Resumen', 'Reportes', 'Usuarios'],
    intro: 'Panel general',
    actions: ['Supervisar casos activos', 'Revisar cuentas de la comunidad', 'Mantener actualizada la red de atención'],
  },
  ciudadano: {
    title: 'Mi espacio ciudadano',
    subtitle: 'Consulta tus reportes y participa en una comunidad que protege la vida animal.',
    navigation: ['Resumen', 'Mis reportes', 'Adopciones'],
    intro: 'Participación ciudadana',
    actions: ['Reporta animales en riesgo', 'Da seguimiento a los casos', 'Consulta animales disponibles para adopción'],
  },
  rescatista: {
    title: 'Centro de rescate',
    subtitle: 'Organiza la atención de alertas y actualiza el estado de cada rescate.',
    navigation: ['Resumen', 'Alertas', 'Guía de campo'],
    intro: 'Coordinación de rescates',
    actions: ['Revisa reportes pendientes', 'Coordina la atención en campo', 'Registra cuándo un animal está a salvo'],
  },
  refugio: {
    title: 'Panel del refugio',
    subtitle: 'Coordina ingresos, cuidados y oportunidades de adopción desde un solo lugar.',
    navigation: ['Resumen', 'Casos recibidos', 'Adopciones'],
    intro: 'Gestión del refugio',
    actions: ['Revisa animales remitidos', 'Actualiza el estado de atención', 'Promueve adopciones responsables'],
  },
  zoologico: {
    title: 'Panel de centro de fauna',
    subtitle: 'Da seguimiento a fauna silvestre y coordina su atención especializada.',
    navigation: ['Resumen', 'Fauna remitida', 'Rehabilitación'],
    intro: 'Cuidado de fauna silvestre',
    actions: ['Revisa alertas de fauna silvestre', 'Coordina evaluaciones especializadas', 'Registra avances de rehabilitación'],
  },
};

function formatDate(date) {
  return date || 'Fecha no registrada';
}

function createReport(form, reporter) {
  return {
    id: `REP-${Date.now().toString().slice(-6)}`,
    especie: form.get('especie').toString().trim(),
    ubicacion: form.get('ubicacion').toString().trim(),
    descripcion: form.get('descripcion').toString().trim(),
    estado: 'Reportado',
    fecha: new Date().toLocaleDateString('es-CO'),
    reportadoPor: reporter,
  };
}

export default function AdminDashboard() {
  const { role } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const config = PORTALS[role];
  const [activeTab, setActiveTab] = useState(config?.navigation[0] || 'Resumen');
  const [reports, setReports] = useState(getReports);
  const [users] = useState(getUsers);
  const [reportMessage, setReportMessage] = useState('');

  const pendingCount = useMemo(
    () => reports.filter((report) => report.estado === 'Reportado').length,
    [reports],
  );

  if (!config) return <Navigate to="/" replace />;
  if (!session) return <Navigate to="/login" replace />;
  if (session.rol !== role) return <Navigate to={rolePath(session.rol)} replace />;

  function updateReport(reportId, status) {
    const updated = reports.map((report) => report.id === reportId ? { ...report, estado: status } : report);
    saveReports(updated);
    setReports(updated);
    setReportMessage(`El caso ${reportId} se actualizó: ${status}.`);
  }

  function submitCitizenReport(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const report = createReport(form, session.nombre);
    const updated = [report, ...reports];
    saveReports(updated);
    setReports(updated);
    setReportMessage(`Tu reporte ${report.id} fue guardado.`);
    event.currentTarget.reset();
  }

  function handleSignOut() {
    signOut();
    navigate('/', { replace: true });
  }

  const roleReports = role === 'ciudadano'
    ? reports.filter((report) => report.reportadoPor === session.nombre)
    : reports;

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="dashboard-brand" to="/"><span>🐾</span><strong>Anima Nova</strong></Link>
        <div className="sidebar-label">Espacio de trabajo</div>
        <nav className="dashboard-nav" aria-label="Secciones del panel">
          {config.navigation.map((item, index) => (
            <button
              className={activeTab === item ? 'dashboard-nav__item is-active' : 'dashboard-nav__item'}
              key={item}
              onClick={() => setActiveTab(item)}
              type="button"
            >
              <span className="nav-icon">{['⌂', '◉', '✦'][index % 3]}</span>{item}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/">← Sitio público</Link>
          <button type="button" onClick={handleSignOut}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div><span className="dashboard-overline">{ROLE_LABELS[role]}</span><h1>{activeTab}</h1></div>
          <div className="dashboard-profile"><span className="profile-avatar">{session.nombre.slice(0, 1).toUpperCase()}</span><span><strong>{session.nombre}</strong><small>{ROLE_LABELS[role]}</small></span></div>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-welcome">
            <div><span className="eyebrow">ANIMA NOVA · {config.intro}</span><h2>{config.title}</h2><p>{config.subtitle}</p></div>
            {role === 'ciudadano' && <a href="#nuevo-reporte" className="button button--primary">+ Nuevo reporte</a>}
          </div>

          {role === 'admin' && activeTab === 'Resumen' && (
            <>
              <div className="metric-grid">
                <Metric label="Reportes activos" value={reports.length} note="Casos registrados" icon="◉" />
                <Metric label="Pendientes" value={pendingCount} note="Requieren asignación" icon="⌖" />
                <Metric label="Cuentas" value={users.length} note="En la comunidad" icon="♙" />
                <Metric label="Roles de gestión" value="5" note="Público y equipos" icon="✦" />
              </div>
              <div className="dashboard-grid">
                <section className="dashboard-card dashboard-card--wide">
                  <div className="card-heading"><div><h3>Casos recientes</h3><p>Actividad de la red de rescate</p></div><button type="button" className="text-button" onClick={() => setActiveTab('Reportes')}>Ver reportes →</button></div>
                  <ReportTable reports={reports.slice(0, 5)} onUpdate={updateReport} role={role} />
                </section>
                <section className="dashboard-card">
                  <div className="card-heading"><div><h3>Accesos rápidos</h3><p>Herramientas de administración</p></div></div>
                  <ul className="quick-list">{config.actions.map((action) => <li key={action}><span>✓</span>{action}</li>)}</ul>
                </section>
              </div>
            </>
          )}

          {role === 'admin' && activeTab === 'Reportes' && (
            <section className="dashboard-card">
              <div className="card-heading"><div><h3>Reportes de la comunidad</h3><p>Actualiza su estado para que los equipos mantengan la información al día.</p></div><span className="count-badge">{reports.length} casos</span></div>
              <ReportTable reports={reports} onUpdate={updateReport} role={role} />
              {reportMessage && <p className="dashboard-feedback" role="status">{reportMessage}</p>}
            </section>
          )}

          {role === 'admin' && activeTab === 'Usuarios' && (
            <section className="dashboard-card">
              <div className="card-heading"><div><h3>Usuarios registrados</h3><p>Ciudadanos y equipos que colaboran en la plataforma.</p></div><span className="count-badge">{users.length} cuentas</span></div>
              <div className="user-list">
                {users.map((user) => <div className="user-row" key={user.id}><span className="profile-avatar">{user.nombre.slice(0, 1).toUpperCase()}</span><div className="user-row__info"><strong>{user.nombre}</strong><span>{user.email}</span></div><span className="role-chip">{ROLE_LABELS[user.rol] || user.rol}</span><span className="user-state">{user.estado || 'activo'}</span></div>)}
              </div>
            </section>
          )}

          {role !== 'admin' && (
            <div className="role-dashboard">
              {activeTab === config.navigation[0] && (
                <>
                  <div className="metric-grid metric-grid--compact">
                    <Metric label={role === 'ciudadano' ? 'Mis reportes' : 'Casos en la red'} value={roleReports.length} note={role === 'ciudadano' ? 'Enviados desde tu cuenta' : 'Para seguimiento'} icon="◉" />
                    <Metric label="Pendientes" value={roleReports.filter((report) => report.estado === 'Reportado').length} note="Por atender" icon="⌖" />
                    <Metric label="Estado de cuenta" value="Activo" note="Acceso habilitado" icon="✓" />
                  </div>
                  <div className="dashboard-grid">
                    <section className="dashboard-card dashboard-card--wide">
                      <div className="card-heading"><div><h3>{role === 'ciudadano' ? 'Seguimiento de reportes' : 'Alertas y casos asignados'}</h3><p>{role === 'ciudadano' ? 'Consulta el estado de tus reportes.' : `Gestión para ${ROLE_LABELS[role].toLowerCase()}.`}</p></div><span className="count-badge">{roleReports.length} casos</span></div>
                      {roleReports.length ? <ReportTable reports={roleReports} onUpdate={updateReport} role={role} /> : <p className="empty-state">Todavía no tienes reportes asociados a tu cuenta.</p>}
                    </section>
                    <section className="dashboard-card">
                      <div className="card-heading"><div><h3>{config.intro}</h3><p>Herramientas disponibles</p></div></div>
                      <ul className="quick-list">{config.actions.map((action) => <li key={action}><span>✓</span>{action}</li>)}</ul>
                      {role === 'rescatista' && <div className="field-guide"><strong>Seguridad en campo</strong><p>Prioriza la seguridad del equipo y del animal. No manipules fauna silvestre sin capacitación y equipo adecuado.</p></div>}
                      {role === 'refugio' && <div className="field-guide"><strong>Requisitos de adopción</strong><p>Identificación vigente, espacio seguro y compromiso de cuidado veterinario.</p></div>}
                      {role === 'zoologico' && <div className="field-guide"><strong>Atención especializada</strong><p>Coordina evaluaciones con personal veterinario de fauna y registra cada avance.</p></div>}
                      {role === 'ciudadano' && <a className="text-button citizen-adoption-link" href="/#adopciones">Ver animales en adopción →</a>}
                    </section>
                  </div>
                  {role === 'ciudadano' && <CitizenReportForm onSubmit={submitCitizenReport} message={reportMessage} />}
                </>
              )}

              {role !== 'ciudadano' && activeTab === config.navigation[1] && (
                <section className="dashboard-card">
                  <div className="card-heading"><div><h3>{config.navigation[1]}</h3><p>Casos disponibles para tu equipo de atención.</p></div><span className="count-badge">{roleReports.length} casos</span></div>
                  <ReportTable reports={roleReports} onUpdate={updateReport} role={role} />
                </section>
              )}

              {role === 'ciudadano' && activeTab === 'Mis reportes' && (
                <section className="dashboard-card">
                  <div className="card-heading"><div><h3>Reportes enviados desde tu cuenta</h3><p>Consulta el estado actual de cada caso que registraste.</p></div><span className="count-badge">{roleReports.length} casos</span></div>
                  {roleReports.length ? <ReportTable reports={roleReports} onUpdate={updateReport} role={role} /> : <p className="empty-state">Aún no has enviado reportes desde esta cuenta.</p>}
                  <CitizenReportForm onSubmit={submitCitizenReport} message={reportMessage} />
                </section>
              )}

              {(activeTab === 'Guía de campo' || (role === 'refugio' && activeTab === 'Adopciones') || (role === 'zoologico' && activeTab === 'Rehabilitación')) && (
                <section className="dashboard-card guidance-panel">
                  <div className="card-heading"><div><h3>{activeTab}</h3><p>Recursos de apoyo para el trabajo de tu organización.</p></div></div>
                  <ul className="quick-list">{config.actions.map((action) => <li key={action}><span>✓</span>{action}</li>)}</ul>
                  {role === 'rescatista' && <div className="field-guide"><strong>Seguridad en campo</strong><p>Evalúa los riesgos antes de acercarte. En fauna silvestre, mantén distancia y solicita apoyo especializado. Registra la ubicación y el estado del caso.</p></div>}
                  {role === 'refugio' && <div className="field-guide"><strong>Requisitos básicos para adopción</strong><p>Solicita identificación vigente, verifica que el hogar tenga un espacio seguro y acuerda seguimiento veterinario y cuidado responsable.</p></div>}
                  {role === 'zoologico' && <div className="field-guide"><strong>Seguimiento de rehabilitación</strong><p>Documenta la evaluación inicial, coordina con personal veterinario de fauna y registra cada avance antes de planear la liberación.</p></div>}
                </section>
              )}

              {role === 'ciudadano' && activeTab === 'Adopciones' && (
                <section className="dashboard-card guidance-panel">
                  <div className="card-heading"><div><h3>Animales que buscan hogar</h3><p>Conoce el proceso de adopción responsable desde el sitio público.</p></div></div>
                  <ul className="quick-list"><li><span>🐕</span>Max · Amigable y juguetón</li><li><span>🐈</span>Luna · Tranquila y cariñosa</li><li><span>🐶</span>Rocky · Activo y sociable</li></ul>
                  <Link className="text-button citizen-adoption-link" to="/#adopciones">Ver adopciones y requisitos →</Link>
                </section>
              )}
              {role !== 'ciudadano' && reportMessage && <p className="dashboard-feedback" role="status">{reportMessage}</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, note, icon }) {
  return <article className="metric-card"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function CitizenReportForm({ onSubmit, message }) {
  return (
    <section className="dashboard-card citizen-report-card" id="nuevo-reporte">
      <div className="card-heading"><div><h3>Enviar un reporte</h3><p>Describe la situación para que la red pueda organizar la atención.</p></div></div>
      <form className="dashboard-report-form" onSubmit={onSubmit}>
        <label>Especie o tipo<input name="especie" required placeholder="Ej. Gato, ave, perro" /></label>
        <label>Ubicación<input name="ubicacion" required placeholder="Dirección o referencia" /></label>
        <label className="form-full">Descripción<textarea name="descripcion" required rows="3" placeholder="¿Qué le sucede al animal?" /></label>
        <button type="submit" className="button button--primary">Enviar reporte</button>
      </form>
      {message && <p className="dashboard-feedback" role="status">{message}</p>}
    </section>
  );
}

function ReportTable({ reports, onUpdate, role }) {
  const nextAction = {
    admin: { label: 'Validar caso', status: 'En atención' },
    rescatista: { label: 'Atender', status: 'En atención' },
    refugio: { label: 'Recibir caso', status: 'En refugio' },
    zoologico: { label: 'Iniciar revisión', status: 'En evaluación' },
  }[role];

  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <thead><tr><th>Caso</th><th>Animal</th><th>Ubicación</th><th>Estado</th><th>Fecha</th>{nextAction && <th>Acción</th>}</tr></thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td><strong>{report.id}</strong><small>{report.descripcion}</small></td>
              <td>{report.especie}</td><td>{report.ubicacion}</td><td><span className={`case-status ${report.estado.toLowerCase().replaceAll(' ', '-')}`}>{report.estado}</span></td><td>{formatDate(report.fecha)}</td>
              {nextAction && <td>{report.estado === 'Reportado' ? <button className="table-action" type="button" onClick={() => onUpdate(report.id, nextAction.status)}>{nextAction.label}</button> : role === 'rescatista' && report.estado === 'En atención' ? <button className="table-action" type="button" onClick={() => onUpdate(report.id, 'Rescatado')}>Marcar rescatado</button> : <span className="table-done">Actualizado</span>}</td>}
            </tr>
          ))}
          {reports.length === 0 && <tr><td colSpan={nextAction ? 6 : 5} className="empty-row">No hay casos para mostrar.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
