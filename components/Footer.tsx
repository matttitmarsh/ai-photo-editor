import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800/50 border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-slate-400 text-sm">
        <p>
          Built with React, Tailwind CSS, and the Google Gemini API.
        </p>
      </div>
    </footer>
  );
};
