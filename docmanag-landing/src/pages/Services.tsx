import { Stethoscope, Activity, Heart, ShieldCheck, Microscope, Zap, CheckCircle2, Cpu, Waves, TrendingUp, Users, Award, Star } from "lucide-react";
import surgerySrc from "../assets/surgery.png";
import orthoSrc from "../assets/ortho.png";
import generalSrc from "../assets/general.png";

export default function Services() {
  const specializedServices = [
    {
      title: "Chirurgie Bucco-Dentaire",
      description: "Interventions expertes pour les cas complexes : extractions de dents de sagesse incluses, chirurgie pré-prothétique et reconstructions osseuses.",
      features: ["Extractions complexes", "Chirurgie gingivale", "Traitement des kystes", "Implantologie avancée"],
      icon: <Microscope className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: "border-red-100 bg-red-50 text-red-600",
      image: surgerySrc
    },
    {
      title: "Chirurgie Orthodontique",
      description: "Correction des malformations des mâchoires en collaboration étroite avec les orthodontistes pour un alignement fonctionnel et esthétique parfait.",
      features: ["Ostéotomies maxillaires", "Correction du prognathisme", "Chirurgie ortho-faciale", "Expansion palatine"],
      icon: <Zap className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: "border-amber-100 bg-amber-50 text-amber-600",
      image: orthoSrc
    },
    {
      title: "Soins Dentaires Généraux",
      description: "Traitement complet des caries, dévitalisations et soins conservateurs pour maintenir une santé bucco-dentaire optimale au quotidien.",
      features: ["Détartrage & Polissage", "Traitement des caries", "Endodontie", "Prévention & Bilan"],
      icon: <Stethoscope className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: "border-teal-100 bg-teal-50 text-teal-600",
      image: generalSrc
    },
  ];

  const outcomes = [
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />,
      stat: "+1 200",
      label: "Patients Traités",
      description: "Une patientèle fidèle et satisfaite depuis l'ouverture du cabinet.",
      accent: "bg-teal-50 border-teal-100",
    },
    {
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />,
      stat: "98%",
      label: "Taux de Satisfaction",
      description: "Nos patients recommandent le cabinet à leur entourage.",
      accent: "bg-amber-50 border-amber-100",
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />,
      stat: "15+",
      label: "Années d'Expérience",
      description: "Une expertise chirurgicale reconnue et constamment mise à jour.",
      accent: "bg-red-50 border-red-100",
    },
    {
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
      stat: "4.9/5",
      label: "Note Moyenne",
      description: "Évaluations authentiques de nos patients sur chaque prestation.",
      accent: "bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-900 py-16 px-4 text-center text-white relative overflow-hidden sm:py-24 sm:px-6 lg:py-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl font-black mb-4 tracking-tight leading-tight sm:text-4xl sm:mb-6 md:text-7xl md:mb-8">Expertise & <span className="text-teal-400">Haute Technologie</span></h1>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto sm:text-lg md:text-2xl">
            Le cabinet du Dr Kakachi combine savoir-faire chirurgical et équipements de pointe pour une excellence dentaire sans compromis.
          </p>
        </div>
      </section>

      {/* Detailed Services Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 border-b border-slate-50 sm:py-24 sm:px-6 lg:py-32">
        <div className="text-center mb-12 sm:mb-16 lg:mb-24">
          <h2 className="text-sm font-black text-teal-600 uppercase tracking-[0.3em] mb-3 sm:mb-4">Nos Spécialités</h2>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl lg:text-4xl">Une approche clinique d'élite</h3>
          <div className="w-16 h-1.5 bg-teal-500 mx-auto mt-6 rounded-full sm:w-24 sm:mt-8" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-12">
          {specializedServices.map((service, index) => (
            <div key={index} className="group relative flex flex-col rounded-[28px] border border-slate-100 bg-white overflow-hidden hover:border-teal-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 sm:rounded-[40px]">
              <div className="h-44 overflow-hidden relative sm:h-56">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute top-4 left-4 p-3 rounded-2xl border backdrop-blur-md transition-transform duration-700 sm:top-6 sm:left-6 sm:p-4 ${service.color}`}>
                  {service.icon}
                </div>
              </div>
              <div className="p-6 flex-1 sm:p-8 lg:p-10">
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight sm:text-2xl sm:mb-6">{service.title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium sm:mb-8">
                  {service.description}
                </p>
                <div className="space-y-3 sm:space-y-4">
                  {service.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 text-sm font-bold text-slate-700 sm:gap-4">
                      <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 sm:w-6 sm:h-6">
                          <CheckCircle2 className="w-3 h-3 text-teal-500 sm:w-3.5 sm:h-3.5" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results Section — Stats */}
      <section className="py-16 bg-slate-50 overflow-hidden sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-24">
            <h2 className="text-sm font-black text-teal-600 uppercase tracking-[0.3em] mb-3 sm:mb-4">Nos Résultats</h2>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl lg:text-4xl">Un bilan qui parle de lui-même</h3>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm leading-relaxed font-medium sm:text-base sm:mt-6 lg:text-lg">
              Des années d'expertise au service d'une patientèle exigeante. Nos chiffres reflètent l'engagement du Dr Kakachi envers l'excellence.
            </p>
            <div className="w-16 h-1.5 bg-teal-500 mx-auto mt-6 rounded-full sm:w-24 sm:mt-8" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {outcomes.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center text-center p-5 rounded-[24px] border sm:p-8 sm:rounded-[40px] lg:p-10 ${item.accent} group hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500`}
              >
                <div className="mb-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300 sm:mb-6 sm:p-4">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-slate-900 mb-1 tracking-tight sm:text-4xl sm:mb-2 lg:text-5xl">{item.stat}</span>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2 sm:text-sm sm:mb-4">{item.label}</span>
                <p className="text-xs text-slate-500 leading-relaxed font-medium hidden sm:block sm:text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Decorative quote */}
          <div className="mt-12 bg-slate-900 rounded-[24px] p-8 text-center text-white sm:mt-16 sm:rounded-[40px] sm:p-12 lg:mt-20">
            <ShieldCheck className="w-8 h-8 text-teal-400 mx-auto mb-4 sm:w-10 sm:h-10 sm:mb-6" />
            <p className="text-lg font-black italic tracking-tight max-w-3xl mx-auto leading-snug sm:text-xl lg:text-2xl">
              "Notre priorité absolue est votre sourire et votre bien-être. Chaque traitement est pensé avec précision et humanité."
            </p>
            <span className="mt-4 inline-block text-teal-400 font-bold text-xs uppercase tracking-widest sm:mt-6 sm:text-sm">— Dr Kakachi, Chirurgien-Dentiste</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-sm font-black text-teal-600 uppercase tracking-[0.3em] mb-3 sm:mb-4">Avis Patients</h2>
            <h3 className="text-2xl font-black text-slate-900 mb-3 sm:text-3xl sm:mb-4">Ce que disent nos patients</h3>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto sm:text-base">La satisfaction de nos patients est notre plus belle réussite. Découvrez leurs retours d'expérience sur notre prise en charge et le professionnalisme de notre équipe.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow sm:p-8">
              <div className="flex text-yellow-400 mb-3 cursor-default sm:mb-4">
                {"★★★★★"}
              </div>
              <p className="text-sm text-slate-600 italic mb-4 font-medium sm:text-base sm:mb-6">
                "Excellent accueil, l'équipe est très professionnelle. Les prix sont franchement abordables comparés à d'autres, et la qualité des soins est irréprochable. Je recommande vivement le cabinet à mes proches."
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-lg sm:w-12 sm:h-12 sm:text-xl">
                  K
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Karim B.</h4>
                  <p className="text-xs text-slate-500 sm:text-sm">Patient depuis 2 ans</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow sm:p-8">
              <div className="flex text-yellow-400 mb-3 cursor-default sm:mb-4">
                {"★★★★★"}
              </div>
              <p className="text-sm text-slate-600 italic mb-4 font-medium sm:text-base sm:mb-6">
                "J'avais très peur du dentiste, mais le Dr Kakachi a su me mettre à l'aise direct. La prise de rendez-vous est rapide et tout est très propre et rassurant. Niveau tarif, c'est super correct."
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center font-bold text-lg sm:w-12 sm:h-12 sm:text-xl">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Amira S.</h4>
                  <p className="text-xs text-slate-500 sm:text-sm">Première consultation</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow sm:p-8">
              <div className="flex text-yellow-400 mb-3 cursor-default sm:mb-4">
                {"★★★★★"}
              </div>
              <p className="text-sm text-slate-600 italic mb-4 font-medium sm:text-base sm:mb-6">
                "Travail impeccable ! J'ai fait une pose de couronne et le résultat est magnifique. Le professionnalisme de l'équipe et les prix compétitifs font de cette clinique mon seul choix. Merci à tous."
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold text-lg sm:w-12 sm:h-12 sm:text-xl">
                  Y
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Yacine D.</h4>
                  <p className="text-xs text-slate-500 sm:text-sm">Patient régulier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment & Quality Section - Simplified */}
      <section className="py-16 px-4 bg-white sm:py-24 sm:px-6 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-10 items-center sm:gap-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight uppercase sm:text-3xl sm:mb-8">Équipement de Pointe</h2>
              <p className="text-base text-slate-500 leading-relaxed mb-8 sm:text-lg sm:mb-10">
                Nous investissons continuellement dans les dernières technologies médicales pour assurer une précision diagnostique et un confort opératoire optimal.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all sm:p-8 sm:rounded-[30px]">
                  <div className="w-12 h-12 rounded-2xl bg-white border shadow-sm flex items-center justify-center mb-4 sm:w-14 sm:h-14 sm:mb-6">
                    <Cpu className="w-6 h-6 text-teal-600 sm:w-7 sm:h-7" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2 text-base sm:text-lg sm:mb-3">Scanner 3D (CBCT)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium sm:text-sm">Imagerie haute résolution pour une planification chirurgicale millimétrée.</p>
                </div>
                <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all sm:p-8 sm:rounded-[30px]">
                  <div className="w-12 h-12 rounded-2xl bg-white border shadow-sm flex items-center justify-center mb-4 sm:w-14 sm:h-14 sm:mb-6">
                    <Waves className="w-6 h-6 text-teal-600 sm:w-7 sm:h-7" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2 text-base sm:text-lg sm:mb-3">Laser Dentaire</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium sm:text-sm">Traitements mini-invasifs pour une cicatrisation accélérée et sans douleur.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[28px] p-8 text-white shadow-2xl sm:rounded-[40px] sm:p-12">
              <h2 className="text-2xl font-black mb-8 tracking-tight uppercase sm:text-3xl sm:mb-10">Qualité & Sécurité</h2>
              <ul className="space-y-6 sm:space-y-8">
                <li className="flex gap-4 sm:gap-5">
                  <div className="p-2.5 bg-teal-500/20 rounded-xl h-fit border border-teal-500/20 sm:p-3">
                    <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1.5 sm:text-xl sm:mb-2">Stérilisation Norme CE</h5>
                    <p className="text-slate-400 text-xs leading-relaxed sm:text-sm">Protocoles de décontamination rigoureux et traçabilité complète de l'instrumentation.</p>
                  </div>
                </li>
                <li className="flex gap-4 sm:gap-5">
                  <div className="p-2.5 bg-teal-500/20 rounded-xl h-fit border border-teal-500/20 sm:p-3">
                    <Activity className="w-5 h-5 text-teal-400 flex-shrink-0 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1.5 sm:text-xl sm:mb-2">Expertise Clinique</h5>
                    <p className="text-slate-400 text-xs leading-relaxed sm:text-sm">Une formation continue sur les nouvelles techniques de chirurgie bucco-dentaire mondiale.</p>
                  </div>
                </li>
                <li className="flex gap-4 sm:gap-5">
                  <div className="p-2.5 bg-teal-500/20 rounded-xl h-fit border border-teal-500/20 sm:p-3">
                    <Heart className="w-5 h-5 text-teal-400 flex-shrink-0 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1.5 sm:text-xl sm:mb-2">Accompagnement Patient</h5>
                    <p className="text-slate-400 text-xs leading-relaxed sm:text-sm">Une prise en charge personnalisée pour une expérience sereine et rassurante.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
