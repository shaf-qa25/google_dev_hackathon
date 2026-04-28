import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage'; // Abhi banayenge
import Dashboard from './pages/Dashboard';
import ComparisonPage from './pages/ComparisonPage';
import { useState } from 'react';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [csvUrl, setCsvUrl] = useState("");

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-bg">
        <Navbar />
        <main className="flex-grow container mx-auto px-6 py-10">
          <Routes>
            {/* 1. Public Route */}
            <Route
              path="/"
              element={<UploadPage setCsvUrl={setCsvUrl} setGlobalData={setAnalysisData} />}
            />

            {/* 2. Protected Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                analysisData ? (
                  <Dashboard data={analysisData} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* 3. Protected Comparison Route */}
            <Route
              path="/comparison"
              element={
                analysisData ? (
                  <ComparisonPage data={analysisData} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;