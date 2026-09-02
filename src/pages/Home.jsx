import Navbar from '../components/Navbar'
import AnnouncementTicker from '../components/AnnouncementTicker'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProblemStatements from '../components/ProblemStatements'
import GuidelinesSection from '../components/GuidelinesSection'
import TimelineSection from '../components/TimelineSection'
import PrizesSection from '../components/PrizesSection'
import SponsorsSection from '../components/SponsorsSection'
import FaqSection from '../components/FaqSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import WaveTransition from '../components/WaveTransition'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Main Sticky Navigation Header */}
      <Navbar />

      {/* 3. Announcement Marquee Ticker */}
      <AnnouncementTicker />

      {/* 01 HOME (Warm White with Soft Skyline Silhouette) */}
      <div id="home">
        <HeroSection />
        <WaveTransition colorClass="text-[#f5ede4]" bgClass="bg-[#faf9f6]" />
      </div>

      {/* 02 ABOUT (Soft Professional Skin Tone) */}
      <div id="about">
        <AboutSection />
        <WaveTransition colorClass="text-white" bgClass="bg-[#f5ede4]" flip={true} />
      </div>

      {/* 03 PROBLEM STATEMENT (Crisp White) */}
      <div id="problem-statement">
        <ProblemStatements />
        <WaveTransition colorClass="text-[#f5ede4]" bgClass="bg-white" />
      </div>

      {/* 04 GUIDELINES (Soft Professional Skin Tone) */}
      <div id="guidelines">
        <GuidelinesSection />
        <WaveTransition colorClass="text-white" bgClass="bg-[#f5ede4]" flip={true} />
      </div>

      {/* 05 TIMELINE (Crisp White) */}
      <div id="timeline">
        <TimelineSection />
        <WaveTransition colorClass="text-[#f5ede4]" bgClass="bg-white" />
      </div>

      {/* 06 PRIZES & COUNTDOWN (Soft Professional Skin Tone) */}
      <div id="prizes">
        <PrizesSection />
        <WaveTransition colorClass="text-white" bgClass="bg-[#f5ede4]" flip={true} />
      </div>

      {/* 07 SPONSORS (Crisp White) */}
      <div id="sponsors">
        <SponsorsSection />
        <WaveTransition colorClass="text-[#f5ede4]" bgClass="bg-white" />
      </div>

      {/* 08 FAQ (Soft Professional Skin Tone) */}
      <div id="faq">
        <FaqSection />
        <WaveTransition colorClass="text-white" bgClass="bg-[#f5ede4]" flip={true} />
      </div>

      {/* 09 CONTACT (Crisp White) */}
      <div id="contact">
        <ContactSection />
        <WaveTransition colorClass="text-[#062b59]" bgClass="bg-white" isFooter={true} />
      </div>

      {/* Official Footer */}
      <Footer />
    </div>
  )
}
