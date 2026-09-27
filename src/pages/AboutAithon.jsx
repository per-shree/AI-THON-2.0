import HeaderTop from '../components/HeaderTop'
import Navbar from '../components/Navbar'
import AnnouncementTicker from '../components/AnnouncementTicker'
import AboutSection from '../components/AboutSection'
import ChiefGuestSection from '../components/ChiefGuestSection'
import WhyAithon from '../components/WhyAithon'
import Footer from '../components/Footer'

export default function AboutAithon() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <HeaderTop />
      <Navbar />
      <AnnouncementTicker />

      <main className="flex-1">
        <AboutSection />
        <ChiefGuestSection />
        <WhyAithon />
      </main>

      <Footer />
    </div>
  )
}
