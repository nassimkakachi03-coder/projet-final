import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Activity, LogIn, Menu, ShieldCheck, UserCircle, X } from 'lucide-react';

export default function NavBar() {
  const location = useLocation();
  const [patientUser, setPatientUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('patient_user');
      setPatientUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setPatientUser(null);
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('patient_token');
    localStorage.removeItem('patient_user');
    setPatientUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/services', label: 'Soins' },
    ...(patientUser ? [
      { to: '/contact', label: 'Contact' },
      { to: '/espace-patient', label: 'Mon espace' }
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-2.5 text-white shadow-lg shadow-teal-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">Cabinet Dr Kakachi</p>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 sm:block">Santé dentaire privée</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex lg:gap-3">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                location.pathname === to ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="mx-1 h-6 w-px bg-slate-200" />

          {patientUser ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <UserCircle className="h-4 w-4" />
                {patientUser.firstName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <LogIn className="h-4 w-4" />
                Connexion
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <ShieldCheck className="h-4 w-4" />
                Créer un compte
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-2xl p-2.5 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                location.pathname === to ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="my-2 h-px bg-slate-100" />

          {patientUser ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2">
                <UserCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">{patientUser.firstName} {patientUser.lastName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <LogIn className="h-4 w-4" />
                Connexion
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <ShieldCheck className="h-4 w-4" />
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
