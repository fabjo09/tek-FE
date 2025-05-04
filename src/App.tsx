import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import LandingPage from "./pages/LandingPage"
import Quiz from "./pages/Quiz"
import DashboardLayout from "./pages/components/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import Career from "./pages/Career"
import University from "./pages/University"
import { Toaster } from "./components/ui/toaster"

import "./styles/globals.css"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="brilliant-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="career" element={<Career />} />
            <Route path="university" element={<University />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
