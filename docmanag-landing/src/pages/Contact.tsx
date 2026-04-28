import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('patient_token');
    if (t) {
      setIsLoggedIn(true);
      // Fetch user data to pre-fill
      axios.get(`${API_URL}/patient-auth/me`, { headers: { Authorization: `Bearer ${t}` } })
        .then(res => {
          setFormData(prev => ({
            ...prev,
            firstName: res.data.firstName || '',
            lastName: res.data.lastName || '',
            email: res.data.email || '',
            phone: res.data.phone || ''
          }));
        })
        .catch(() => setIsLoggedIn(false)); // token might be invalid
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const finalSubject = 'Message depuis le site';
    try {
      await axios.post(`${API_URL}/contact`, { ...formData, subject: finalSubject });
      setSuccess(true);
      setFormData(prev => ({ ...prev, message: '', subject: '' }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f5_46%,#ffffff_100%)] py-10 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:px-8">
        <section className="rounded-[24px] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl sm:rounded-[32px] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-200">Contact cabinet</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:mt-4 sm:text-4xl">Posez votre question, nous relions votre message à votre dossier quand c'est possible.</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:mt-4">
            Les messages envoyés ici sont visibles côté dashboard, avec vos coordonnées et un lien direct vers le dossier patient si celui-ci existe déjà.
          </p>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl sm:rounded-[32px] sm:p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-teal-100 p-5">
                <CheckCircle2 className="h-10 w-10 text-teal-700" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-900">Message envoyé</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                Votre message a bien été transmis au cabinet. Il pourra maintenant être lu depuis le dashboard.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

              {!isLoggedIn ? (
                <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-50 p-8 text-center border-2 border-dashed border-slate-200">
                  <div className="rounded-full bg-white p-4 shadow-sm mb-4">
                    <ShieldCheck className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Connexion requise</h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">
                    Pour nous envoyer un message, vous devez être connecté à votre espace patient.
                  </p>
                  <a
                    href="/login"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Se connecter
                  </a>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-teal-50/50 p-4 border border-teal-100/50 mb-6">
                    <p className="text-xs font-bold text-teal-700 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                      Connecté en tant que {formData.firstName} {formData.lastName}
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Message *</label>
                      <textarea
                        required
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Expliquez votre besoin ou votre question..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
                    >
                      {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
