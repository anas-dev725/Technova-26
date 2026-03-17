import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/Technova%20logo.png" alt="Technova'26" className="w-8 h-8 rounded-full" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                TECHNOVA<span className="text-blue-500">'26</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier university hackathon and tech festival. Innovate, compete, and build the future with us.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/modules" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">All Modules</Link>
              </li>
              <li>
                <a href="/#about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">About Event</a>
              </li>
              <li>
                <a href="/#sponsors" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Sponsors</a>
              </li>
              <li>
                <a href="/#faq" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Modules */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Popular Modules</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/modules" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Speed Programming</Link>
              </li>
              <li>
                <Link to="/modules" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Capture The Flag</Link>
              </li>
              <li>
                <Link to="/modules" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Website Designing</Link>
              </li>
              <li>
                <Link to="/modules" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Startup Launchpad</Link>
              </li>
              <li>
                <Link to="/modules" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Esports</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  IOBM, Korangi Creek Road<br />
                  Karachi, Sindh, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="mailto:contact@technova26.edu" className="text-gray-400 hover:text-white text-sm transition-colors">
                  contact@technova26.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Technova'26. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
