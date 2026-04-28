import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/patient-auth/register`, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('patient_token', data.token);
      localStorage.setItem('patient_user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => navigate('/espace-patient'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de créer le compte. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f5_48%,#ffffff_100%)] px-4">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
            <CheckCircle2 className="h-10 w-10 text-teal-700" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-900">Compte créé avec succès</h2>
          <p className="mt-3 text-sm text-slate-600">Redirection vers votre espace patient privé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f5_48%,#ffffff_100%)] flex items-center justify-center px-4 py-8">
      <div className="w-full mx-auto grid max-w-6xl overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        <section className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 p-10 text-white lg:block">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-200">Compte patient</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Gardez vos informations de santé liées à votre email et à votre mot de passe.</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Une fois connecté, vous retrouvez votre historique, vos ordonnances, vos factures et vos radios dans un espace privé.
          </p>
        </section>

        <section className="p-8 sm:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-teal-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Inscription sécurisée
            </div>
            <h2 className="mt-4 text-3xl font-black text-slate-900">Créer mon compte patient</h2>
            <p className="mt-2 text-sm text-slate-500">Les informations saisies ici restent privées et rattachées à votre dossier.</p>
          </div>

          {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: 'Prénom', name: 'firstName', placeholder: 'Ex: Lina' },
                { label: 'Nom', name: 'lastName', placeholder: 'Ex: Bensaïd' },
              ].map(({ label, name, placeholder }) => (
                <div key={name} className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">{label} *</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      name={name}
                      value={(form as any)[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Téléphone *</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0550 00 00 00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>
            </div>

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

            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: 'Mot de passe', name: 'password', placeholder: 'Minimum 6 caractères' },
                { label: 'Confirmer le mot de passe', name: 'confirmPassword', placeholder: 'Répétez le mot de passe' },
              ].map(({ label, name, placeholder }) => (
                <div key={name} className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">{label} *</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      name={name}
                      value={(form as any)[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
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
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Déjà un compte ?
            {' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
