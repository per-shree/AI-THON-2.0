import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public Pages
import Home from './pages/Home'
import Registration from './pages/Registration'
import FinalePayment from './pages/FinalePayment'
import ScrollToHash from './components/ScrollToHash'
import NoticePopup from './components/NoticePopup'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <NoticePopup />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />

        {/* Unlisted Finalist Payment Route (Access strictly via acceptance email) */}
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
