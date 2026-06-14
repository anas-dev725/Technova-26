import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram, Mail, MapPin, ExternalLink, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { logoBase64 } from '../assets/logoBase64';
import { motion } from 'motion/react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src={logoBase64} alt="Technova'26" className="w-10 h-10 rounded-xl bg-white/5 p-1 border border-white/10 group-hover:border-blue-500/50 transition-colors" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter text-white uppercase">
                  TECHNOVA<span className="text-blue-500">'26</span>
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] -mt-1">Connect • Create • Conquer</span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The premier platform for university innovators, builders, and dreamers. TechNova is where Pakistani students unite to solve global challenges through code and creativity.
            </p>

            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "https://www.instagram.com/technova_iobm/" },
                { icon: Linkedin, href: "https://www.linkedin.com/showcase/technova-iobm/" },
                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61574719920764" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xs text-blue-500 uppercase tracking-[0.2em] mb-6">Explore</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Modules', path: '/modules' },
                { name: 'Team', path: '/team' },
                { name: 'Legacy', path: '/legacy' },
                { name: 'About', path: '/#about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-xs text-blue-500 uppercase tracking-[0.2em] mb-6">Flagship Modules</h3>
            <ul className="space-y-4">
              {[
                { name: 'Capture The Flag', path: '/modules/capture-the-flag' },
                { name: 'Webforces', path: '/modules/webforces' },
                { name: 'Digital Dash', path: '/modules/digital-dash' },
                { name: 'Startup Launchpad', path: '/modules/startup-launchpad' },
                { name: 'Esports', path: '/modules/esports-competition' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                    <span className="text-gray-600 group-hover:text-blue-500 transition-colors">/</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="font-display font-bold text-xs text-blue-500 uppercase tracking-[0.2em] mb-6">Contact Arena</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-gray-400 text-sm leading-relaxed">
                    IOBM, Korangi Creek Road,<br />Karachi, Sindh, Pakistan
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <a href="mailto:technova@iobm.edu.pk" className="text-gray-400 hover:text-white text-sm transition-colors">
                    technova@iobm.edu.pk
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.761.458 3.475 1.332 4.992L2 22l5.176-1.356c1.474.805 3.136 1.229 4.821 1.229h.005c5.512 0 9.993-4.483 9.993-9.993C21.995 6.483 17.514 2 12.004 2zm5.253 14.187c-.23.649-1.341 1.259-1.847 1.322-.496.062-.992.083-2.903-.687-2.443-.984-4.015-3.468-4.137-3.633-.12-.165-1.001-1.331-1.001-2.535 0-1.204.629-1.796.856-2.033.227-.236.495-.298.66-.298.165 0 .33.001.474.007.155.006.362-.058.567.443.216.527.742 1.805.804 1.93.062.124.103.268.02.433-.082.165-.124.268-.247.412-.124.145-.262.324-.375.438-.124.124-.253.258-.108.505.144.247.643 1.058 1.378 1.711.948.841 1.748 1.103 2 .29.135-.124.253-.258.413-.413.165-.155.33-.052.515.02.186.072 1.176.551 1.382.654.206.103.344.155.396.242.052.088.052.505-.178 1.154z" />
                    </svg>
                  </div>
                  <a href="https://wa.me/923202845350" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                    +92 320 2845350
                  </a>
                </li>
              </ul>
            </div>


          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-[0.1em]">
              © 2026 Technova'26. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
                <Cpu className="w-3 h-3" />
                Developed by{" "}
                <a 
                  href="https://www.linkedin.com/in/muhammad-anas804/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group/developer"
                >
                  Muhammad Anas
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/developer:translate-x-0.5 group-hover/developer:-translate-y-0.5 group-hover/developer:opacity-100 transition-all" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/legacy" className="text-gray-500 hover:text-blue-500 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
              Legacy TechNova <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            <a href="#" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
