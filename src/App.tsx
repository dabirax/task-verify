import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastContainer from './components/Toast'
import Landing from './pages/Landing'
import Ecosystem from './pages/Ecosystem'
import Workers from './pages/Workers'
import Tasks from './pages/Tasks'
import Finance from './pages/Finance'
import Analytics from './pages/Analytics'
import Admin from './pages/Admin'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
