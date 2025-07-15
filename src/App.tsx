import { useState } from 'react';
import Navigation from './components/Navigation';
import WordGenerator from './components/WordGenerator';
import ZodiacCalculator from './components/ZodiacCalculator';
import GematriCalculator from './components/GematriCalculator';
import { JafarCalculator } from './components/JafarCalculator';
import AIChat from './components/AIChat';
import MysticalBackground from './components/MysticalBackground';

type Section = 'words' | 'zodiac' | 'gematria' | 'jafar' | 'ai';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('words');

  const renderSection = () => {
    switch (activeSection) {
      case 'words':
        return <WordGenerator />;
      case 'zodiac':
        return <ZodiacCalculator />;
      case 'gematria':
        return <GematriCalculator />;
      case 'jafar':
        return (
          <JafarCalculator
            analysisRequest={{
              type: 'person',
              text: '',
              timeType: 'general',
              originalNumber: 0,
              reducedNumber: 0
            }}
            onAnalysisChange={() => {}}
          />
        );
      case 'ai':
        return <AIChat />;
      default:
        return <WordGenerator />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <MysticalBackground />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="relative z-10">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;