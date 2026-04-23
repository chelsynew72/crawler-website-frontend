import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Landing   from './pages/Landing';
import Auth      from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Campaign  from './pages/Campaign';
import SidebarLayout from './components/SidebarLayout';
import { AllPages, InsightsPage, SettingsPage } from './pages/Otherpages';



export default function App() {
  return (
    <BrowserRouter>
      <div className="grid-bg" />
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/auth"          element={<Auth />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/campaign/:id"  element={<Campaign />} />
        <Route path="/pages"         element={<AllPages />} />
        <Route path="/insights"      element={<InsightsPage />} />
        <Route path="/settings"      element={<SettingsPage />} />
        <Route path="*"              element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
