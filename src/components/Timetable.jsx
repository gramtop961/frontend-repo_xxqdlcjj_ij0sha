import React, { useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToLabel(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(h)}:${pad(m)}`;
}

export default function Timetable({ subjects, slots, startHour = 8, endHour = 18 }) {
  const subjectMap = useMemo(() => Object.fromEntries(subjects.map(s => [s.id, s])), [subjects]);

  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);

  const daySlots = useMemo(() => {
    const map = Object.fromEntries(DAYS.map(d => [d, []]));
    for (const s of slots) {
      map[s.day].push(s);
    }
    // sort by start time
    for (const d of DAYS) {
      map[d].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    }
    return map;
  }, [slots]);

  const totalMinutes = (endHour - startHour) * 60;

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Weekly View</h2>
          <p className="text-sm text-gray-500">Visual layout of your schedule.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-8 text-sm">
            <div className="" />
            {DAYS.map((d) => (
              <div key={d} className="px-2 pb-2 text-center font-medium text-gray-700">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-8">
            {/* Time labels column */}
            <div className="relative">
              {hours.map((h, idx) => (
                <div key={h} className="h-16 relative">
                  <div className="absolute -top-2 right-2 text-xs text-gray-500">
                    {minutesToLabel(h * 60)}
                  </div>
                  <div className="absolute inset-x-0 top-0 border-t border-gray-200" />
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((day) => (
              <div key={day} className="relative">
                {/* hour grid lines */}
                {hours.map((h) => (
                  <div key={h} className="h-16 border-t border-gray-100" />
                ))}
                {/* slots */}
                <div className="absolute inset-0">
                  {daySlots[day].map((slot) => {
                    const start = Math.max(timeToMinutes(slot.start) - startHour * 60, 0);
                    const end = Math.min(timeToMinutes(slot.end) - startHour * 60, totalMinutes);
                    const top = (start / totalMinutes) * 100;
                    const height = Math.max(((end - start) / totalMinutes) * 100, 2);
                    const subj = subjectMap[slot.subjectId];
                    const bg = subj?.color || '#94a3b8';
                    return (
                      <div
                        key={slot.id}
                        className="absolute left-1 right-1 rounded-md shadow-sm text-xs text-white p-2 overflow-hidden"
                        style={{ top: `${top}%`, height: `${height}%`, backgroundColor: bg }}
                        title={`${subj?.name || 'Subject'} ${slot.start} - ${slot.end}`}
                      >
                        <div className="font-semibold truncate">{subj?.name || 'Subject'}</div>
                        <div className="opacity-90">{slot.start} - {slot.end}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {slots.length === 0 && (
        <p className="text-sm text-gray-500">No slots yet. Add some to see them here.</p>
      )}
    </section>
  );
}
