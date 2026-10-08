import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public Pages
import Home from './pages/Home'
import Registration from './pages/Registration'
import FinalePayment from './pages/FinalePayment'
import Results from './pages/Results'
import ScrollToHash from './components/ScrollToHash'
import GrandFinaleNoticeModal from './components/GrandFinaleNoticeModal'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <GrandFinaleNoticeModal />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/results" element={<Results />} />
        <Route path="/shortlist" element={<Results />} />
        <Route path="/shortlisted-teams" element={<Results />} />

        {/* Finalist Payment Route */}
        <Route path="/finale-payment" element={<FinalePayment />} />

        {/* Redirect any legacy admin paths back to home */}
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
