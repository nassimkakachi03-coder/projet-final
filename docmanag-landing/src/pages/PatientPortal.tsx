import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import {
  CalendarDays,
  CreditCard,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LogOut,
  Plus,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import WeeklyCalendar from '../components/WeeklyCalendar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MOTIFS = [
  'Douleur dentaire',
  'Probleme de gencives',
  'Detartrage',
  'Caries',
  'Sensibilites dentaires',
  'Orthodontie',
  'Controle / Prevention',
  'Mauvaise haleine',
  'Autres',
];

const GENERAL_AVAILABLE_DAYS = [0, 1, 2, 3, 4, 6];
const ORTHODONTIC_AVAILABLE_DAYS = [2, 6];
const START_MINUTES = 10 * 60;
const END_MINUTES = 18 * 60;

const normalizeReason = (reason: string) =>
  reason
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const isOrthodonticReason = (reason: string) => {
  const normalized = normalizeReason(reason);
  return normalized.includes('orthodont') || normalized.includes('orthodent');
};

const validateAppointmentSlot = (dateValue: string, reason: string) => {
  const appointmentDate = new Date(dateValue);

  if (Number.isNaN(appointmentDate.getTime())) {
    return 'Date de rendez-vous invalide.';
  }

  if (appointmentDate <= new Date()) {
    return 'La date doit etre dans le futur.';
  }

  const totalMinutes = appointmentDate.getHours() * 60 + appointmentDate.getMinutes();
  if (totalMinutes < START_MINUTES || totalMinutes > END_MINUTES) {
    return 'Les rendez-vous en ligne sont disponibles de 10h00 a 18h00.';
  }

  const day = appointmentDate.getDay();
  if (isOrthodonticReason(reason)) {
    if (!ORTHODONTIC_AVAILABLE_DAYS.includes(day)) {
      return 'Le motif Orthodontie est disponible uniquement le mardi et le samedi, entre 10h00 et 18h00.';
    }
    return '';
  }

  if (!GENERAL_AVAILABLE_DAYS.includes(day)) {
    return 'Les rendez-vous en ligne sont disponibles du samedi au jeudi.';
  }

  return '';
};

const statusLabel = (status?: string) => {
  const map: Record<string, string> = {
    EnCours: 'En cours',
    Termine: 'Termine',
    Scheduled: 'En cours',
    Pending: 'En cours',
    Completed: 'Termine',
    Cancelled: 'Annule',
    Paid: 'Payee',
    Overdue: 'En retard',
  };
  return map[status || ''] || status || 'Non renseigne';
};

const timelineLabel = (type: string) => {
  const map: Record<string, string> = {
    appointment: 'Soin / rendez-vous',
    prescription: 'Ordonnance',
    invoice: 'Facture',
    payment: 'Paiement',
  };
  return map[type] || type;
};

export default function PatientPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'prescriptions' | 'billing' | 'profile'>('timeline');

  const [showRdv, setShowRdv] = useState(false);
  const [rdvForm, setRdvForm] = useState({ date: '', reason: '', notes: '' });
  const [rdvOtherReason, setRdvOtherReason] = useState('');
  const [rdvLoading, setRdvLoading] = useState(false);
  const [rdvError, setRdvError] = useState('');
  const [rdvMsg, setRdvMsg] = useState('');
  const [editingAppt, setEditingAppt] = useState<any>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  const [profileForm, setProfileForm] = useState({ medicalHistory: '', xRayUrl: '', prescriptionUrl: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const token = localStorage.getItem('patient_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const [historyRes, apptRes] = await Promise.all([
          axios.get(`${API_URL}/patient-auth/me/history`, { headers }),
          axios.get(`${API_URL}/patient-auth/appointments`, { headers })
        ]);
        
        setData(historyRes.data);
        if (historyRes.data?.patient) {
          setProfileForm({
            medicalHistory: historyRes.data.patient.medicalHistory || '',
            xRayUrl: historyRes.data.patient.xRayUrl || '',
            prescriptionUrl: historyRes.data.patient.prescriptionUrl || '',
          });
        }
        
        if (Array.isArray(apptRes.data)) {
          setTakenSlots(apptRes.data.map((a: any) => a.date));
        }
      } catch (requestError: any) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem('patient_token');
          localStorage.removeItem('patient_user');
          navigate('/login');
        } else {
          setError(requestError.response?.data?.message || 'Impossible de charger votre historique.');
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const logout = () => {
    localStorage.removeItem('patient_token');
    localStorage.removeItem('patient_user');
    navigate('/');
  };

  const patient = data?.patient;
  const account = data?.account;
  const prescriptions = data?.prescriptions || [];
  const invoices = data?.invoices || [];
  const careTimeline = data?.careTimeline || [];
  const stats = data?.stats || {};

  const summaryCards = useMemo(
    () => [
      { label: 'Soins / RDV', value: stats.appointmentCount || 0, icon: CalendarDays },
      { label: 'Ordonnances', value: stats.prescriptionCount || 0, icon: FileText },
      { label: 'Factures', value: stats.invoiceCount || 0, icon: CreditCard },
      { label: 'Total regle', value: `${(stats.totalPaid || 0).toLocaleString('fr-DZ')} DZD`, icon: ShieldCheck },
    ],
    [stats]
  );

  const activeAppointments = useMemo(() => {
    return careTimeline.filter((item: any) => 
      item.type === 'appointment' && ['EnCours', 'Scheduled', 'Pending'].includes(item.status)
    );
  }, [careTimeline]);

  const hasActiveAppointment = activeAppointments.length > 0;

  const historiqueItems = useMemo(() => {
    return careTimeline.filter((item: any) => {
      if (item.type === 'appointment') {
        return !['EnCours', 'Scheduled', 'Pending'].includes(item.status);
      }
      return true;
    });
  }, [careTimeline]);

  const filteredTakenSlots = useMemo(() => {
    if (!editingAppt) return takenSlots;
    try {
      const editingDateStr = new Date(editingAppt.date).toISOString();
      return takenSlots.filter(t => t !== editingDateStr);
    } catch {
      return takenSlots;
    }
  }, [takenSlots, editingAppt]);

  const finalRdvReason = rdvForm.reason === 'Autres' ? rdvOtherReason.trim() : rdvForm.reason;
  const slotValidationMessage = rdvForm.date && finalRdvReason ? validateAppointmentSlot(rdvForm.date, finalRdvReason) : '';

  const handleRdv = async (event: React.FormEvent) => {
    event.preventDefault();
    setRdvLoading(true);
    setRdvError('');
    setRdvMsg('');

    if (!finalRdvReason) {
      setRdvError('Veuillez preciser le motif.');
      setRdvLoading(false);
      return;
    }

    if (slotValidationMessage) {
      setRdvError(slotValidationMessage);
      setRdvLoading(false);
      return;
    }

    try {
      if (editingAppt) {
        await axios.put(`${API_URL}/patient-auth/appointment/${editingAppt.id}`, { ...rdvForm, reason: finalRdvReason }, { headers });
        setRdvMsg('Rendez-vous modifié avec succès.');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        await axios.post(`${API_URL}/patient-auth/appointment`, { ...rdvForm, reason: finalRdvReason }, { headers });
        setRdvMsg('Rendez-vous cree. Le cabinet vous contactera pour confirmer.');
        setRdvForm({ date: '', reason: '', notes: '' });
        setRdvOtherReason('');
        
        const newTakenDate = new Date(rdvForm.date).toISOString();
        setTakenSlots(prev => [...prev, newTakenDate]);

        setTimeout(() => {
          setShowRdv(false);
          setRdvMsg('');
          window.location.reload();
        }, 1500);
      }
    } catch (requestError: any) {
      setRdvError(requestError.response?.data?.message || 'Erreur lors de l\'operation.');
    } finally {
      setRdvLoading(false);
    }
  };

  const openEditModal = (item: any) => {
    const reasonRaw = item.label.replace('Rendez-vous : ', '').trim();
    const isOther = !MOTIFS.includes(reasonRaw as any);
    setRdvForm({
      date: item.date,
      reason: isOther ? 'Autres' : reasonRaw,
      notes: item.note || ''
    });
    setRdvOtherReason(isOther ? reasonRaw : '');
    setEditingAppt(item);
    setShowRdv(true);
  };

  const cancelAppointment = async (id: string) => {
    if (!confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
    try {
      await axios.delete(`${API_URL}/patient-auth/appointment/${id}`, { headers });
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const handleProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');

    try {
      await axios.put(`${API_URL}/patient-auth/me/medical-profile`, profileForm, { headers });
      setProfileMsg('Dossier mis a jour.');
      setData((current: any) =>
        current
          ? {
              ...current,
              patient: {
                ...current.patient,
                medicalHistory: profileForm.medicalHistory,
                xRayUrl: profileForm.xRayUrl,
                prescriptionUrl: profileForm.prescriptionUrl,
              },
            }
          : current
      );
    } catch {
      setProfileMsg('Erreur lors de la mise a jour.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'xRayUrl' | 'prescriptionUrl') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === 'string') {
        setProfileForm((current) => ({ ...current, [field]: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-lg rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-black text-slate-900">{error}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800">
              Se connecter
            </Link>
            <Link to="/register" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
              Creer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f5_46%,#ffffff_100%)] py-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 p-6 text-white shadow-xl sm:rounded-[34px] sm:p-8">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.22),_transparent_60%)]" />
          <div className="relative flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-200">Espace patient prive</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:mt-3 sm:text-3xl">
                Bonjour {patient?.firstName} {patient?.lastName}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:mt-3">Retrouvez ici votre historique, vos documents et vos paiements.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowRdv(true)} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-400">
                <Plus className="h-4 w-4" /> Prendre rendez-vous
              </button>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
                <LogOut className="h-4 w-4" /> Deconnexion
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700 sm:rounded-2xl sm:p-3">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xl font-black text-slate-900 sm:text-2xl">{value}</span>
              </div>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 sm:mt-4 sm:text-xs">{label}</p>
            </article>
          ))}
        </section>

        {showRdv && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => { setShowRdv(false); setEditingAppt(null); }}>
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[28px] bg-white p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">{editingAppt ? 'Modifier le rendez-vous' : 'Prendre rendez-vous'}</h2>
                <button onClick={() => { setShowRdv(false); setEditingAppt(null); }} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {hasActiveAppointment && !editingAppt ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <CalendarDays className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-black text-amber-900">Rendez-vous déjà en cours</h3>
                  <p className="mt-3 text-sm font-medium text-amber-700 leading-relaxed">
                    Vous avez déjà un rendez-vous planifié. Veuillez attendre que celui-ci soit terminé ou l'annuler depuis l'onglet Rendez-vous avant d'en prendre un nouveau.
                  </p>
                  <button onClick={() => { setShowRdv(false); setEditingAppt(null); }} className="mt-6 w-full rounded-2xl bg-amber-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-700">
                    Fermer
                  </button>
                </div>
              ) : (
                <>
                  {rdvMsg && <div className="mb-4 rounded-2xl bg-teal-50 p-3 text-sm font-bold text-teal-700">{rdvMsg}</div>}
                  {rdvError && <div className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{rdvError}</div>}
                  <form onSubmit={handleRdv} className="space-y-4">
                {/* Weekly Calendar Display instead of date input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Date et heure *</label>
                  {!rdvForm.reason ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 text-center">
                      Veuillez d'abord sélectionner un motif pour voir les horaires disponibles.
                    </div>
                  ) : (
                    <WeeklyCalendar 
                      selectedDate={rdvForm.date} 
                      onSelect={(date) => setRdvForm({ ...rdvForm, date })} 
                      reason={finalRdvReason} 
                      takenSlots={filteredTakenSlots} 
                    />
                  )}
                  {rdvForm.date && (
                    <p className="text-sm font-bold text-teal-700 mt-2">
                      Sélection : {new Date(rdvForm.date).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Motif *</label>
                  <select
                    required
                    value={rdvForm.reason}
                    onChange={(event) => setRdvForm({ ...rdvForm, reason: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  >
                    <option value="">Selectionner un motif...</option>
                    {MOTIFS.map((motif) => (
                      <option key={motif} value={motif}>
                        {motif}
                      </option>
                    ))}
                  </select>
                </div>

                {rdvForm.reason === 'Autres' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Precisez votre motif *</label>
                    <textarea
                      required
                      rows={2}
                      value={rdvOtherReason}
                      onChange={(event) => setRdvOtherReason(event.target.value)}
                      placeholder="Decrivez votre probleme..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Notes (optionnel)</label>
                  <textarea
                    rows={3}
                    value={rdvForm.notes}
                    onChange={(event) => setRdvForm({ ...rdvForm, notes: event.target.value })}
                    placeholder="Precisions..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                {rdvForm.reason === 'Orthodontie' && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                    Le motif Orthodontie est disponible uniquement le mardi et le samedi, entre 10h00 et 18h00.
                  </div>
                )}

                {slotValidationMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {slotValidationMessage}
                  </div>
                )}

                <button type="submit" disabled={rdvLoading} className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60">
                  {rdvLoading ? 'Envoi...' : 'Confirmer le rendez-vous'}
                </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.6fr)_380px]">
          <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm sm:rounded-[30px]">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 p-3 sm:p-4">
              {([
                { key: 'timeline', label: 'Historique' },
                { key: 'appointments', label: 'Rendez-vous' },
                { key: 'prescriptions', label: 'Ordonnances' },
                { key: 'billing', label: 'Factures' },
                { key: 'profile', label: 'Mon Dossier' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-xl px-3 py-2.5 text-xs font-bold transition sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm ${
                    activeTab === tab.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-5">
              {activeTab === 'timeline' && (
                <div className="space-y-3">
                  {historiqueItems.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Aucun element d'historique pour le moment.</p>
                  ) : (
                    historiqueItems.map((item: any) => (
                      <article key={`${item.type}-${item.id}`} className="rounded-[20px] border border-slate-200 p-4 sm:rounded-[26px]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-600">{timelineLabel(item.type)}</p>
                            <h2 className="mt-1.5 text-sm font-black text-slate-900 sm:mt-2 sm:text-base">{item.label}</h2>
                            {item.note && <p className="mt-1.5 text-sm text-slate-600">{item.note}</p>}
                          </div>
                          <div className="text-xs text-slate-500 sm:text-right sm:text-sm">
                            <p className="font-semibold text-slate-900">
                              {new Date(item.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            {item.status && <p className="mt-1">{statusLabel(item.status)}</p>}
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className="space-y-3">
                  {activeAppointments.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Aucun rendez-vous prevu.</p>
                  ) : (
                    activeAppointments.map((item: any) => (
                      <article key={`${item.type}-${item.id}`} className="rounded-[20px] border border-slate-200 p-4 sm:rounded-[26px]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <CalendarDays className="h-4 w-4 text-teal-600" />
                              <h2 className="text-sm font-black text-slate-900 sm:text-base">{item.label}</h2>
                            </div>
                            {item.note && <p className="text-sm text-slate-600">{item.note}</p>}
                          </div>
                          <div className="text-xs text-slate-500 sm:text-right sm:text-sm flex flex-col items-end">
                            <p className="font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl inline-block">
                              {new Date(item.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            {item.status && <p className="mt-2 text-right">{statusLabel(item.status)}</p>}
                            
                            {['EnCours', 'Scheduled', 'Pending'].includes(item.status) && (
                              <div className="flex items-center gap-2 mt-3">
                                <button onClick={() => openEditModal(item)} className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition text-xs">
                                  Modifier
                                </button>
                                <button onClick={() => cancelAppointment(item.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition text-xs">
                                  Annuler
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'prescriptions' && (
                <div className="space-y-3">
                  {prescriptions.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Aucune ordonnance disponible.</p>
                  ) : (
                    prescriptions.map((prescription: any) => (
                      <article key={prescription._id} className="rounded-[20px] border border-slate-200 p-4 sm:rounded-[26px]">
                        <h2 className="text-sm font-black text-slate-900 sm:text-base">
                          Ordonnance du {new Date(prescription.date || prescription.createdAt).toLocaleDateString('fr-FR')}
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(prescription.medications || []).map((medication: any, index: number) => (
                            <div key={`${prescription._id}-${index}`} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 sm:rounded-2xl">
                              <p className="font-bold">{medication.name}</p>
                              <p className="text-xs text-slate-500">
                                {medication.dosage}
                                {medication.frequency ? ` - ${medication.frequency}` : ''}
                                {medication.duration ? ` - ${medication.duration}` : ''}
                              </p>
                            </div>
                          ))}
                        </div>
                        {prescription.notes && <p className="mt-3 text-sm text-slate-600">{prescription.notes}</p>}
                      </article>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-3">
                  {invoices.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Aucune facture disponible.</p>
                  ) : (
                    invoices.map((invoice: any) => (
                      <article key={invoice._id} className="rounded-[20px] border border-slate-200 p-4 sm:rounded-[26px]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2 className="text-sm font-black text-slate-900 sm:text-base">
                              {invoice.items?.map((item: any) => item.description).join(', ') || 'Facture'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">{statusLabel(invoice.status)}</p>
                          </div>
                          <div className="text-xs text-slate-500 sm:text-right sm:text-sm">
                            <p className="font-semibold text-slate-900">{new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</p>
                            <p className="mt-1 font-black text-slate-900">{(invoice.totalAmount || 0).toLocaleString('fr-DZ')} DZD</p>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-teal-50 p-4 sm:p-5">
                    <h2 className="text-sm font-black text-teal-900 sm:text-base">Completer votre dossier medical</h2>
                    <p className="mt-1 text-xs text-teal-700 sm:text-sm">Ces informations aideront le praticien a mieux preparer votre rendez-vous.</p>
                  </div>

                  {profileMsg && <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3 text-sm font-bold text-teal-700">{profileMsg}</div>}

                  <form onSubmit={handleProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Antecedents medicaux (allergies, maladies...)</label>
                      <textarea
                        rows={4}
                        value={profileForm.medicalHistory}
                        onChange={(event) => setProfileForm({ ...profileForm, medicalHistory: event.target.value })}
                        placeholder="Aucun antecedent particulier..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Photo de votre radio (Image)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleFileChange(event, 'xRayUrl')}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 file:mr-4 file:rounded-full file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
                        />
                        {profileForm.xRayUrl && <p className="text-xs font-bold text-teal-600">Image selectionnee</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Ordonnance / Lettre (PDF)</label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(event) => handleFileChange(event, 'prescriptionUrl')}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 file:mr-4 file:rounded-full file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
                        />
                        {profileForm.prescriptionUrl && <p className="text-xs font-bold text-teal-600">Fichier selectionne</p>}
                      </div>
                    </div>

                    <button type="submit" disabled={profileLoading} className="w-full rounded-2xl bg-teal-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60">
                      {profileLoading ? 'Enregistrement...' : 'Mettre a jour mon dossier'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-teal-600" />
                <h2 className="text-base font-black text-slate-900">Mes informations</h2>
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-600 sm:mt-4 sm:space-y-3">
                <p><span className="font-bold text-slate-900">Nom:</span> {patient?.firstName} {patient?.lastName}</p>
                <p><span className="font-bold text-slate-900">Telephone:</span> {patient?.phone || account?.phone || 'Non renseigne'}</p>
                <p><span className="font-bold text-slate-900">Email:</span> {patient?.email || account?.email || 'Non renseigne'}</p>
                <p><span className="font-bold text-slate-900">Compte cree le:</span> {account?.createdAt ? new Date(account.createdAt).toLocaleDateString('fr-FR') : 'Non disponible'}</p>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <h2 className="text-base font-black text-slate-900">Resume du dossier</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4">{patient?.caseSummary || patient?.medicalHistory || 'Aucune information medicale resumee.'}</p>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-teal-600" />
                <h2 className="text-base font-black text-slate-900">Documents</h2>
              </div>

              <div className="mt-4 space-y-4">
                {patient?.xRayUrl ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Radiographie</p>
                    <img src={patient.xRayUrl} alt="Radiographie" className="h-32 w-full rounded-[18px] border border-slate-200 object-cover sm:h-40 sm:rounded-[24px]" />
                    <a href={patient.xRayUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:underline">
                      Ouvrir la radio <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Aucune radiographie.</p>
                )}

                {patient?.prescriptionUrl && (
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Ordonnance patient</p>
                    <a href={patient.prescriptionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:underline">
                      Voir le document <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
