
import React from 'react';
import type { LanguageOption } from '../types';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
  languages: LanguageOption[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  selectedLanguage,
  languages,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="language-select" className="block text-sm font-medium text-slate-300">
        Select Language for Transcription
      </label>
      <select
        id="language-select"
        name="language"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base bg-slate-700 border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-slate-100 appearance-none"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value} className="bg-slate-700 text-slate-100">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
