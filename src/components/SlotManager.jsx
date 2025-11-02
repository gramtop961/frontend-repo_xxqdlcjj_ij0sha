import React, { useMemo, useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function SlotManager({ subjects, slots, onAdd, onRemove }) {
  const [subjectId, setSubjectId] = useState('');
  const [day, setDay] = useState('Mon');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');

  const hasSubjects = subjects.length > 0;

  const subjectMap = useMemo(() => Object.fromEntries(subjects.map(s => [s.id, s])), [subjects]);

  const submit = (e) => {
    e.preventDefault();
    if (!subjectId) return;
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    if (endMin <= startMin) return;
    onAdd({ id: crypto.randomUUID(), subjectId, day, start, end });
    // keep previous values to speed up adding more slots
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Class Slots</h2>
        <p className="text-sm text-gray-500">Pick a subject, day and time range.</p>
      </div>

      {!hasSubjects ? (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Add at least one subject before creating slots.
        </p>
      ) : (
        <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Subject</span>
            <select
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              <option value="" disabled>Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Day</span>
            <select
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Start</span>
            <input
              type="time"
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              step="300"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">End</span>
            <input
              type="time"
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              step="300"
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
          >
            Add Slot
          </button>
        </form>
      )}

      {slots.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Slots</h3>
          <ul className="divide-y divide-gray-200">
            {slots.map((slot) => (
              <li key={slot.id} className="py-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full inline-block"
                    style={{ backgroundColor: subjectMap[slot.subjectId]?.color || '#94a3b8' }}
                  />
                  <span className="text-gray-800">
                    {subjectMap[slot.subjectId]?.name || 'Unknown'} — {slot.day} {slot.start} - {slot.end}
                  </span>
                </div>
                <button
                  onClick={() => onRemove(slot.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
