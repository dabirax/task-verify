import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastContainer from './components/Toast'
import Landing from './pages/Landing'
import Finance from './pages/Finance'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Services from './pages/Services'
import TaskDetails from './pages/TaskDetails'
import Workers from './pages/Workers'
import WorkerDetails from './pages/WorkerDetails'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Inbox from './pages/Inbox'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public/Home Route */}
            <Route
              path="/"
              element={isAuthenticated ? <Dashboard /> : <Landing />}
            />

            {/* Auth Routes */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />

            {/* Protected Routes */}
            <Route
              path="/finance"
              element={
                <ProtectedRoute>
                  <Finance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/:id"
              element={
                <ProtectedRoute>
                  <TaskDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workers"
              element={
                <ProtectedRoute>
                  <Workers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workers/:id"
              element={
                <ProtectedRoute>
                  <WorkerDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirects to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
