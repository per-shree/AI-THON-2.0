import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'

// Public Pages
import Home from './pages/Home'
import Registration from './pages/Registration'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminParticipants from './pages/admin/AdminParticipants'
import AdminParticipantDetail from './pages/admin/AdminParticipantDetail'
import AdminTeams from './pages/admin/AdminTeams'
import AdminTeamDetail from './pages/admin/AdminTeamDetail'
import AdminSubmissions from './pages/admin/AdminSubmissions'
import AdminSubmissionDetail from './pages/admin/AdminSubmissionDetail'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/participants" element={<AdminParticipants />} />
          <Route path="/admin/participants/:id" element={<AdminParticipantDetail />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/teams/:id" element={<AdminTeamDetail />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/submissions/:id" element={<AdminSubmissionDetail />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}
