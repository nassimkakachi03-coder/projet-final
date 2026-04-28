import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PatientLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/patient-auth/login`, form);
      localStorage.setItem('patient_token', data.token);
      localStorage.setItem('patient_user', JSON.stringify(data.user));
      navigate('/espace-patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f5_48%,#ffffff_100%)] flex items-center justify-center px-4 py-8">
      <div className="w-full mx-auto grid max-w-6xl overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        <section className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 p-10 text-white lg:block">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-200">Espace patient</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Retrouvez votre historique clinique dans un espace privé et protégé.</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Après connexion, vous accédez à vos soins, ordonnances, factures et radios sans dépendre d'échanges papier.
          </p>
        </section>

        <section className="p-8 sm:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-teal-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Connexion sécurisée
            </div>
            <h2 className="mt-4 text-3xl font-black text-slate-900">Se connecter</h2>
            <p className="mt-2 text-sm text-slate-500">Entrez votre email et votre mot de passe pour ouvrir votre espace patient.</p>
          </div>

          {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email *</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="patient@email.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Mot de passe *</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Connexion...' : 'Accéder à mon espace'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Pas encore de compte ?
            {' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:underline">
              Créer mon compte
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
