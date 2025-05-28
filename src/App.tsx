import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import NewEvent from "./pages/NewEvent"
import Dashboard from "./pages/OrganizerDashboard"
import Tickets from "./pages/Tickets"
import { WalletContextProvider } from "./contexts/WalletContext"

function App() {
  return (
    <Router>
      <WalletContextProvider>
        <div className="min-h-screen bg-white text-gray-900 font-mono">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-event" element={<NewEvent />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tickets" element={<Tickets />} />
            </Routes>
          </main>
        </div>
      </WalletContextProvider>
    </Router>
  )
}

export default App