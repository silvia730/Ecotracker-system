import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import Sidebar from './components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuestsPage from './components/QuestsPage';
import NFTGalleryPage from './components/NFTGalleryPage';
import ReportLocationPage from './components/ReportLocationPage';
import BarChartPage from './components/BarChartPage';

function isAuthenticated() {
  return !!localStorage.getItem('ecotrackerToken');
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="App">
      {hideSidebar ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, background: '#f7fafc', position: 'relative' }}>
            <button
              style={{ position: 'absolute', top: 20, right: 30, zIndex: 10, background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              Logout
            </button>
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/quests" element={<ProtectedRoute><QuestsPage /></ProtectedRoute>} />
              <Route path="/nft-gallery" element={<ProtectedRoute><NFTGalleryPage /></ProtectedRoute>} />
              <Route path="/report-location" element={<ProtectedRoute><ReportLocationPage /></ProtectedRoute>} />
              <Route path="/bar-chart" element={<ProtectedRoute><BarChartPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
