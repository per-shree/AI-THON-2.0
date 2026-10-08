import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnnouncementTicker from '../components/AnnouncementTicker'
import ShortlistedTeamsSection from '../components/ShortlistedTeamsSection'

export default function Results() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <AnnouncementTicker />
      <main className="flex-1">
        <ShortlistedTeamsSection id="results-page" />
      </main>
      <Footer />
    </div>
  )
}
