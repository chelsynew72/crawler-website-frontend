import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Landing  from './pages/Landing';
import Auth     from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Campaign from './pages/Campaign';

export default function App() {
  return (
    <BrowserRouter>
      <div className="grid-bg" />
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/auth"       element={<Auth />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/campaign/:id" element={<Campaign />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}