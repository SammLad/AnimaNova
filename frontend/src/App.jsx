import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/publico/home';
import AdminDashboard from './pages/admin/inicio';
import Login from './sections/login';
import Register from './sections/registro';
import { getSession, rolePath, VALID_ROLES } from './servicios/auth';

function RolePortal() {
  const { role } = useParams();
  const session = getSession();

  if (!session) return <Navigate to="/login" replace />;
  if (!VALID_ROLES.includes(role)) {
    return <Navigate to="/" replace />;
  }
  if (session.rol !== role) return <Navigate to={rolePath(session.rol)} replace />;
  return <AdminDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<Register />} />
        <Route path="/panel/:role" element={<RolePortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
