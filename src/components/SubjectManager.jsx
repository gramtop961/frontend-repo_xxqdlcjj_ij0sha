import React, { useState } from 'react';

export default function SubjectManager({ subjects, onAdd, onRemove }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ id: crypto.randomUUID(), name: name.trim(), color });
    setName('');
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Subjects</h2>
        <p className="text-sm text-gray-500">Create subjects with an optional color.</p>
      </div>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mathematics"
          className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-14 rounded-lg p-1 border border-gray-300"
          aria-label="Subject color"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
        >
          Add Subject
        </button>
      </form>

      {subjects.length === 0 ? (
        <p className="text-sm text-gray-500">No subjects yet. Add your first one above.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {subjects.map((s) => (
            <li key={s.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full inline-block"
                  style={{ backgroundColor: s.color }}
                  aria-hidden
                />
                <span className="font-medium text-gray-800">{s.name}</span>
              </div>
              <button
                onClick={() => onRemove(s.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
