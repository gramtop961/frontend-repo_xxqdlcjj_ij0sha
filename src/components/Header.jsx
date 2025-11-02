import React from 'react';

export default function Header() {
  return (
    <header className="py-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Build Your Weekly Timetable
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Add your subjects, choose the days and times, and see your schedule laid out clearly.
          Everything happens in your browser.
        </p>
      </div>
    </header>
  );
}
