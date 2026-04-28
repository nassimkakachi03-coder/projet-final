import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  reason: string;
  takenSlots: string[];
}

const HOURS = [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5];

const formatHour = (h: number) => {
  const hr = Math.floor(h);
  const min = h % 1 === 0 ? '00' : '30';
  return `${hr}h${min}`;
};

export default function WeeklyCalendar({ selectedDate, onSelect, reason, takenSlots }: WeeklyCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const isOrthodontic = reason.toLowerCase().includes('orthodont') || reason.toLowerCase().includes('orthodent');

  const { startOfWeek, days } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat
    
    // Find the nearest past Saturday
    const diffToSat = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    const start = new Date(today);
    start.setDate(today.getDate() - diffToSat + (weekOffset * 7));

    // Sat to Thu = 6 days
    const d = [];
    for (let i = 0; i < 6; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      d.push(current);
    }

    return { startOfWeek: start, days: d };
  }, [weekOffset]);

  const nextWeek = () => setWeekOffset(prev => prev + 1);
  const prevWeek = () => setWeekOffset(prev => prev - 1);

  const getSlotState = (day: Date, hour: number) => {
    const slotTime = new Date(day);
    slotTime.setHours(Math.floor(hour), hour % 1 === 0 ? 0 : 30, 0, 0);

    const now = new Date();
    if (slotTime < now) return 'past';

    // Check Orthodontie
    if (isOrthodontic) {
      if (day.getDay() !== 6 && day.getDay() !== 2) {
        return 'unavailable_reason'; // Not Sat or Tue
      }
    }

    // Check taken
    const slotTimeStr = slotTime.toISOString();
    const isTaken = takenSlots.some(t => {
      const tDate = new Date(t);
      return Math.abs(tDate.getTime() - slotTime.getTime()) < 60000; // within 1 min
    });

    if (isTaken) return 'taken';

    return 'available';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-3 bg-slate-50">
        <button type="button" onClick={prevWeek} disabled={weekOffset <= 0} className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-slate-700">
          Semaine du {days[0].toLocaleDateString('fr-FR')}
        </span>
        <button type="button" onClick={nextWeek} className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="space-y-5">
          {days.filter(d => {
            const endOfDay = new Date(d);
            endOfDay.setHours(23, 59, 59, 999);
            return endOfDay >= new Date();
          }).map((d, i) => {
            const hoursToRender = HOURS.filter(h => {
              const state = getSlotState(d, h);
              return state !== 'past' && state !== 'unavailable_reason';
            });

            return (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-700 capitalize">
                    {d.toLocaleDateString('fr-FR', { weekday: 'long' })}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
                
                {hoursToRender.length === 0 ? (
                  <p className="text-xs font-medium italic text-slate-400 bg-slate-50 py-3 px-4 rounded-xl border border-slate-100">
                    Aucun créneau disponible ce jour.
                  </p>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
                    {hoursToRender.map(h => {
                      const state = getSlotState(d, h);
                      const slotDate = new Date(d);
                      slotDate.setHours(Math.floor(h), h % 1 === 0 ? 0 : 30, 0, 0);
                      const isSelected = selectedDate === slotDate.toISOString();

                      if (state === 'taken') {
                        return (
                          <div key={h} className="min-w-[72px] shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center py-2.5 opacity-60 cursor-not-allowed">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Occupé</span>
                            <span className="text-xs font-semibold text-slate-400">{formatHour(h)}</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => onSelect(slotDate.toISOString())}
                          className={`min-w-[72px] shrink-0 rounded-xl flex flex-col items-center justify-center py-2.5 transition ${
                            isSelected 
                              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 border border-teal-500' 
                              : 'bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 hover:scale-105'
                          }`}
                        >
                          <span className="text-xs font-black">{formatHour(h)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
