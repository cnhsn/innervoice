'use client';

import { useLanguage } from '@/lib/language-context';
import { Language } from '@/lib/translations';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-md px-3 py-2 border border-gray-200 dark:border-gray-600">
        <Globe size={16} className="text-gray-600 dark:text-gray-300" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
