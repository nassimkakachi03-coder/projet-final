import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function Home() {


  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('patient_token'));
  }, []);

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f5_48%,#ffffff_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.12),_transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:gap-10 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_460px] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-teal-700 shadow-sm sm:px-4 sm:py-2 sm:text-xs">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Cabinet dentaire privé à Alger
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:mt-6 sm:text-5xl md:text-6xl">
              Un parcours patient plus simple, plus clair et plus confidentiel.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg">
              Envoyez votre demande en quelques secondes, recevez un suivi humain au cabinet et créez ensuite votre compte patient pour garder vos informations privées.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">

              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Découvrir nos soins
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
              {[
                { title: 'Prise de contact rapide', text: 'Nom, prénom, téléphone et email suffisent pour lancer le dossier.', icon: CalendarDays },
                { title: 'Compte privé patient', text: 'Vos informations restent liées à votre email et mot de passe.', icon: ShieldCheck },
                { title: 'Historique disponible', text: 'Soins, ordonnances, factures et radios accessibles ensuite.', icon: CheckCircle2 },
              ].map(({ title, text, icon: Icon }) => (
                <article key={title} className="rounded-[28px] border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5">
                  <div className="inline-flex rounded-2xl bg-teal-50 p-2.5 text-teal-700 sm:p-3">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h2 className="mt-3 text-sm font-black text-slate-900 sm:mt-4 sm:text-base">{title}</h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:mt-2 sm:text-sm">{text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/60 sm:p-8">
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-teal-100 p-5">
                <ShieldCheck className="h-10 w-10 text-teal-700" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-900">Espace Patient Privé</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                Afin de garantir la confidentialité de vos données médicales, la prise de rendez-vous nécessite de vous connecter ou de créer un compte.
              </p>
              <div className="mt-8 flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
                {token ? (
                  <Link
                    to="/espace-patient"
                    className="rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 w-full sm:w-auto"
                  >
                    Accéder à mon espace patient
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 w-full sm:w-auto"
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 w-full sm:w-auto"
                    >
                      Créer un compte
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
