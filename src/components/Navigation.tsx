import React from 'react';
import { Dices, Star, Hash, Calculator, Bot } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: 'words' | 'zodiac' | 'gematria' | 'jafar' | 'ai') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'words', label: 'عجلة الحظ', icon: Dices },
    { id: 'zodiac', label: 'البرج الروحاني', icon: Star },
    { id: 'gematria', label: 'حساب الجمل', icon: Hash },
    { id: 'jafar', label: 'حاسبة الجفر', icon: Calculator },
    { id: 'ai', label: 'الذكاء الصناعي', icon: Bot },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            العراف
          </h1>
          
          <div className="flex gap-2 flex-wrap">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;