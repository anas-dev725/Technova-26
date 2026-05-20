/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Technova'26 - Connect, Create, & Conquer
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EarlyBirdBanner from './components/EarlyBirdBanner';
import Footer from './components/Footer';
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Register from './pages/Register';
import Sponsors from './pages/Sponsors';
import About from './pages/About';
import Legacy from './pages/Legacy';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';
import Chatbot from './components/Chatbot';
import { ThemeProvider } from './components/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route path="/register/:moduleId" element={<Register />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/about" element={<About />} />
              <Route path="/legacy" element={<Legacy />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}
