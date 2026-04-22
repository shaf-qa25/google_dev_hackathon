import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage'; // Abhi banayenge

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/dashboard" element={<div>Dashboard Page (Step 2)</div>} />
          </Routes>
        </main>
        <footer className="py-6 text-center text-slate-500 text-xs border-t border-slate-800">
          © 2026 AI Bias Audit Tool • Build for Hackathon
        </footer>
      </div>
    </Router>
  );
}

export default App;