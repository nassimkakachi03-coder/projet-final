import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react';
import Modal from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router';

const API = import.meta.env.VITE_API_URL;

const MOTIFS = [
  'Douleur dentaire',
  'Problème de gencives',
  'Détartrage',
  'Caries',
  'Sensibilités dentaires',
  'Orthodontie',
  'Contrôle / Prévention',
  'Mauvaise haleine',
  'Autres',
];

const emptyForm = {
  patientId: '',
  reason: '',
  otherReason: '',
  date: '',
  time: '',
  status: 'EnCours' as 'EnCours' | 'Termine',
  notes: '',
};

const statusLabels: Record<string, string> = {
  EnCours: 'En cours',
  Termine: 'Terminé',
  // legacy
  Scheduled: 'En cours',
  Pending: 'En cours',
  Completed: 'Terminé',
  Cancelled: 'Annulé',
};

const statusStyles: Record<string, string> = {
  EnCours: 'bg-amber-50 text-amber-700 border-amber-200',
  Termine: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function Agenda() {
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const { weekDays } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat
    const diffToSat = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    const start = new Date(today);
    start.setDate(today.getDate() - diffToSat + (weekOffset * 7));

    const d = [];
    for (let i = 0; i < 6; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      d.push(current);
    }
    return { weekDays: d };
  }, [weekOffset]);

  const fetchData = async () => {
    try {
      const [aRes, pRes] = await Promise.all([
        axios.get(`${API}/appointments`, { headers }),
        axios.get(`${API}/patients`, { headers }),
      ]);
      setAppointments(Array.isArray(aRes.data) ? aRes.data : []);
      setPatients(Array.isArray(pRes.data) ? pRes.data : []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { if (token) void fetchData(); }, [token]);

  const weekAppointments = useMemo(() => {
    const filtered = appointments.filter(a => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      return d >= weekDays[0] && d <= weekDays[5];
    });
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return filtered;
  }, [appointments, weekDays]);

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments.filter(a => new Date(a.date).toDateString() === today);
  }, [appointments]);

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const openCreateModal = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };

  const openEditModal = (appointment: any) => {
    const d = new Date(appointment.date);
    const rawStatus = appointment.status || 'EnCours';
    const normalizedStatus: 'EnCours' | 'Termine' =
      ['Completed', 'Termine'].includes(rawStatus) ? 'Termine' : 'EnCours';
    setEditing(appointment);
    setForm({
      patientId: appointment.patientId?._id || appointment.patientId || '',
      reason: MOTIFS.includes(appointment.reason) ? appointment.reason : 'Autres',
      otherReason: MOTIFS.includes(appointment.reason) ? '' : (appointment.reason || ''),
      date: d.toISOString().slice(0, 10),
      time: d.toTimeString().slice(0, 5),
      status: normalizedStatus,
      notes: appointment.notes || '',
    });
    setModalOpen(true);
  };

  const toggleStatus = async (appointment: any) => {
    const next = ['EnCours', 'Scheduled', 'Pending'].includes(appointment.status) ? 'Termine' : 'EnCours';
    try {
      await axios.put(`${API}/appointments/${appointment._id}`, { status: next }, { headers });
      await fetchData();
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!form.patientId || !form.date || !form.time) {
      alert('Veuillez renseigner le patient, la date et l\'heure.');
      setLoading(false); return;
    }
    const finalReason = form.reason === 'Autres' ? form.otherReason.trim() : form.reason;
    if (!finalReason) { alert('Veuillez préciser le motif.'); setLoading(false); return; }
    const selectedPatient = patients.find(p => p._id === form.patientId);
    const doctorId = typeof user?.id === 'string' && /^[a-fA-F0-9]{24}$/.test(user.id) ? user.id : undefined;
    try {
      const payload = {
        patientId: form.patientId,
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
        reason: finalReason,
        date: new Date(`${form.date}T${form.time}`).toISOString(),
        status: form.status,
        notes: form.notes,
        ...(doctorId ? { doctorId } : {}),
      };
      if (editing) {
        await axios.put(`${API}/appointments/${editing._id}`, payload, { headers });
      } else {
        await axios.post(`${API}/appointments`, payload, { headers });
      }
      closeModal();
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Impossible d'enregistrer ce rendez-vous.");
    } finally { setLoading(false); }
  };

  const removeAppointment = async (id: string) => {
    if (!window.confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await axios.delete(`${API}/appointments/${id}`, { headers });
      await fetchData();
    } catch (error: any) { alert(error.response?.data?.message || 'Suppression impossible.'); }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 p-8 text-white shadow-xl">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_60%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-3xl font-black tracking-tight">Agenda Clinique</h1>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-teal-50">
            <Plus className="h-4 w-4" /> Nouveau rendez-vous
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Rendez-vous totaux', value: appointments.length, icon: CalendarDays },
          { label: "Aujourd'hui", value: todayAppointments.length, icon: Clock3 },
          { label: 'Patients concernés', value: new Set(appointments.map(a => a.patientId?._id || a.patientId)).size, icon: UserRound },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-teal-50 p-3 text-teal-700"><Icon className="h-5 w-5" /></div>
              <span className="text-3xl font-black text-slate-900">{value}</span>
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between bg-slate-50">
          <h2 className="text-lg font-black text-slate-900">Programme de la semaine</h2>
          <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
            <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-slate-700 px-2">
              Du {weekDays[0].toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} au {weekDays[5].toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-8">
          {weekDays.filter(d => {
            const endOfDay = new Date(d);
            endOfDay.setHours(23, 59, 59, 999);
            return endOfDay >= new Date();
          }).map((day, i) => {
            const dayAppts = weekAppointments.filter(a => new Date(a.date).toDateString() === day.toDateString());
            
            return (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <h3 className="text-base font-black text-slate-800 capitalize">{day.toLocaleDateString('fr-FR', { weekday: 'long' })}</h3>
                  <span className="text-sm font-bold text-slate-400">{day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                  <span className="ml-auto text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{dayAppts.length} RDV</span>
                </div>

                {dayAppts.length === 0 ? (
                  <p className="text-sm font-medium italic text-slate-400 bg-slate-50 py-4 px-5 rounded-2xl border border-slate-100">
                    Aucun rendez-vous prévu ce jour.
                  </p>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {dayAppts.map(appointment => (
                      <div key={appointment._id} className="min-w-[280px] sm:min-w-[320px] shrink-0 snap-start rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-300">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl">
                            {new Date(appointment.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button onClick={() => toggleStatus(appointment)} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold transition hover:opacity-80 ${statusStyles[appointment.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {['EnCours', 'Scheduled', 'Pending'].includes(appointment.status) ? <Circle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                            {statusLabels[appointment.status] || appointment.status}
                          </button>
                        </div>
                        
                        <div className="mb-4">
                          {appointment.patientId ? (
                            <Link 
                              to={`/patients/${appointment.patientId._id || appointment.patientId}/history`}
                              className="text-base font-black text-teal-700 hover:underline flex items-center gap-2"
                            >
                              <UserRound className="h-5 w-5" />
                              {appointment.patientName || `${appointment.patientId?.firstName || ''} ${appointment.patientId?.lastName || ''}`}
                            </Link>
                          ) : (
                            <span className="text-base font-black text-slate-700 flex items-center gap-2">
                              <UserRound className="h-5 w-5" />
                              {appointment.patientName || 'Inconnu'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-3 border-t border-slate-100 pt-4">
                          <div>
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                              appointment.reason.toLowerCase().includes('orthodon') || appointment.reason.toLowerCase().includes('orthoden')
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {appointment.reason}
                            </span>
                            {appointment.notes && <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">{appointment.notes}</p>}
                          </div>
                          
                          <div className="flex shrink-0 gap-1.5">
                            <button onClick={() => openEditModal(appointment)} className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => removeAppointment(appointment._id)} className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Patient *</label>
            <select required value={form.patientId} onChange={e => setForm(c => ({ ...c, patientId: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10">
              <option value="">Sélectionner un patient...</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Motif *</label>
            <select required value={form.reason} onChange={e => setForm(c => ({ ...c, reason: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10">
              <option value="">Sélectionner un motif...</option>
              {MOTIFS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {form.reason === 'Autres' && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Précisez le motif *</label>
              <textarea required rows={2} value={form.otherReason} onChange={e => setForm(c => ({ ...c, otherReason: e.target.value }))} placeholder="Décrivez..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Date *</label>
              <input required type="date" value={form.date} onChange={e => setForm(c => ({ ...c, date: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Heure *</label>
              <input required type="time" value={form.time} onChange={e => setForm(c => ({ ...c, time: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Statut</label>
            <div className="flex gap-3">
              {(['EnCours', 'Termine'] as const).map(s => (
                <button key={s} type="button" onClick={() => setForm(c => ({ ...c, status: s }))}
                  className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-bold transition ${form.status === s ? (s === 'Termine' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-amber-300 bg-amber-50 text-amber-700') : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  {s === 'EnCours' ? '🔵 En cours' : '✅ Terminé'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Notes de consultation</label>
            <textarea rows={3} value={form.notes} onChange={e => setForm(c => ({ ...c, notes: e.target.value }))} placeholder="Précisions..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={closeModal} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200">Annuler</button>
            <button type="submit" disabled={loading} className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60">
              {loading ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer le rendez-vous'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
