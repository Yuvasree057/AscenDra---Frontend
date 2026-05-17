import { Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Welcome from './pages/Welcome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/onboarding/Onboarding';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import Roadmap from './pages/Roadmap';
import Internships from './pages/Internships';
import Learning from './pages/Learning';
import Settings from './pages/Settings';
import Chatbot from './components/Chatbot';
import { useAppContext } from './context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAppContext();
  
  if (isLoading) {
    return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/internships" element={<ProtectedRoute><Internships /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
      <Chatbot />
      <SpeedInsights />
    </div>
  );
}

export default App;