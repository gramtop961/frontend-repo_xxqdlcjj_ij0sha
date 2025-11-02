import React, { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import SubjectManager from './components/SubjectManager.jsx';
import SlotManager from './components/SlotManager.jsx';
import Timetable from './components/Timetable.jsx';

export default function App() {
  const [subjects, setSubjects] = useState([]);
  const [slots, setSlots] = useState([]);

  // Basic local persistence for convenience
  React.useEffect(() => {
    try {
      const s = localStorage.getItem('timetable_subjects');
      const sl = localStorage.getItem('timetable_slots');
      if (s) setSubjects(JSON.parse(s));
      if (sl) setSlots(JSON.parse(sl));
    } catch {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem('timetable_subjects', JSON.stringify(subjects));
  }, [subjects]);

  React.useEffect(() => {
    localStorage.setItem('timetable_slots', JSON.stringify(slots));
  }, [slots]);

  const addSubject = (subject) => setSubjects((prev) => [...prev, subject]);
  const removeSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    // Also remove slots for that subject
    setSlots((prev) => prev.filter((sl) => sl.subjectId !== id));
  };

  const addSlot = (slot) => setSlots((prev) => [...prev, slot]);
  const removeSlot = (id) => setSlots((prev) => prev.filter((s) => s.id !== id));

  const resetAll = () => {
    if (confirm('Clear all subjects and slots?')) {
      setSubjects([]);
      setSlots([]);
      localStorage.removeItem('timetable_subjects');
      localStorage.removeItem('timetable_slots');
    }
  };

  const canExport = slots.length > 0 || subjects.length > 0;

  const exportData = () => {
    const data = JSON.stringify({ subjects, slots }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4">
        <Header />

        <div className="flex items-center justify-end gap-3 mb-4">
          <button
            onClick={resetAll}
            className="text-sm px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            onClick={exportData}
            disabled={!canExport}
            className="text-sm px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Export JSON
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubjectManager
            subjects={subjects}
            onAdd={addSubject}
            onRemove={removeSubject}
          />

          <SlotManager
            subjects={subjects}
            slots={slots}
            onAdd={addSlot}
            onRemove={removeSlot}
          />
        </div>

        <div className="mt-6">
          <Timetable subjects={subjects} slots={slots} />
        </div>

        <footer className="py-10 text-center text-xs text-gray-500">
          Tip: Drag-select your JSON export when sharing with friends, or take a screenshot of the timetable below.
        </footer>
      </div>
    </div>
  );
}
