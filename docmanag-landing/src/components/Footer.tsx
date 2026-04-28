
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 md:grid-cols-2 lg:px-8">
        <div>
          <h3 className="text-lg font-black text-white">Cabinet Dr Kakachi</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            Prise en charge dentaire moderne, suivi patient privé et communication claire entre le cabinet et chaque patient.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-teal-300">Coordonnées</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400 sm:mt-4">
            <li>El Biar, Alger</li>
            <li>+213 555 12 34 56</li>
            <li>
              <a href="mailto:contact@drkakachi.com" className="transition hover:text-teal-300">
                contact@drkakachi.com
              </a>
            </li>
          </ul>
        </div>


      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-500 sm:px-6 sm:py-5 sm:text-sm lg:px-8">
        © {new Date().getFullYear()} Cabinet Dr Kakachi. Tous droits réservés.
      </div>
    </footer>
  );
}
