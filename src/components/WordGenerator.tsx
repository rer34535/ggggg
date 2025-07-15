import React, { useState } from 'react';
import { Dices, Hash, Type, Shuffle, RotateCcw, Sparkles } from 'lucide-react';

interface GenerationResult {
  items: (string | number)[];
  type: 'words' | 'numbers' | 'mixed';
}

const WordGenerator: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'words' | 'numbers' | 'mixed'>('words');
  const [results, setResults] = useState<(string | number)[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);

  const words = [
    'حب', 'فرح', 'حزن', 'غضب', 'أمل', 'يأس', 'شغف', 'حماس', 'خوف', 'طمأنينة',
    'نجاح', 'فشل', 'ثروة', 'فقر', 'صحة', 'مرض', 'عمل', 'دراسة', 'سفر', 'بيت',
    'عائلة', 'صديق', 'عدو', 'طبيعة', 'مدينة', 'قرية', 'شمس', 'قمر', 'نجوم', 'سماء',
    'أرض', 'بحر', 'نهر', 'جبل', 'صحراء', 'غابة', 'مطر', 'ثلج', 'رياح', 'عاصفة',
    'برق', 'رعد', 'ضباب', 'ندى', 'صقيع', 'حرارة', 'برودة', 'حيوان', 'طائر', 'سمك',
    'زهرة', 'شجرة', 'ثمرة', 'بذرة', 'جذر', 'ورقة', 'كتاب', 'قلم', 'مكتب', 'كرسي',
    'حاسوب', 'هاتف', 'كاميرا', 'تلفزيون', 'راديو', 'طعام', 'شراب', 'فاكهة', 'خضار',
    'لحم', 'سمك', 'خبز', 'أرز', 'حليب', 'عسل', 'رياضة', 'كرة', 'ملعب', 'سباق',
    'فريق', 'منافس', 'ميدالية', 'تحدي', 'انتصار', 'هزيمة', 'فن', 'رسم', 'موسيقى',
    'رقص', 'تمثيل', 'غناء', 'نحت', 'تصوير', 'كتابة', 'شعر', 'علم', 'بحث', 'اكتشاف'
  ];

  const getRandomNumbers = (count: number): number[] => {
    const numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * 1000));
    }
    return numbers;
  };

  const getRandomWords = (count: number): string[] => {
    const selectedWords = [];
    for (let i = 0; i < count; i++) {
      selectedWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    return selectedWords;
  };

  const getMixedResults = (count: number): (string | number)[] => {
    const results = [];
    for (let i = 0; i < count; i++) {
      if (Math.random() > 0.5) {
        results.push(Math.floor(Math.random() * 1000));
      } else {
        results.push(words[Math.floor(Math.random() * words.length)]);
      }
    }
    return results;
  };

  const spinWheel = async () => {
    setIsSpinning(true);
    setResults([]);

    await new Promise(resolve => setTimeout(resolve, 3000));

    let newResults: (string | number)[] = [];
    if (currentMode === 'numbers') {
      newResults = getRandomNumbers(10);
    } else if (currentMode === 'words') {
      newResults = getRandomWords(10);
    } else {
      newResults = getMixedResults(10);
    }

    setResults(newResults);
    setIsSpinning(false);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'numbers': return <Hash className="w-5 h-5" />;
      case 'words': return <Type className="w-5 h-5" />;
      case 'mixed': return <Shuffle className="w-5 h-5" />;
      default: return <Dices className="w-5 h-5" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'numbers': return 'وضع الأرقام';
      case 'words': return 'وضع الكلمات';
      case 'mixed': return 'وضع مختلط';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            <Sparkles className="inline-block w-12 h-12 ml-4" />
            عجلة الحظ العشوائية
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            اضغط على زر "دور العجلة" لتوليد 10 كلمات أو أرقام عشوائية
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {(['numbers', 'words', 'mixed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${
                currentMode === mode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 shadow-xl shadow-cyan-500/30 scale-105'
                  : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50'
              }`}
            >
              {getModeIcon(mode)}
              {getModeLabel(mode)}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-8">
            <div 
              className={`w-80 h-80 rounded-full border-8 border-white/30 shadow-2xl shadow-cyan-500/30 transition-transform duration-3000 ease-out ${
                isSpinning ? 'animate-spin' : ''
              }`}
              style={{
                background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff, #ff6b6b)',
                transform: isSpinning ? 'rotate(1080deg)' : 'rotate(0deg)'
              }}
            />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 text-6xl">
              ↓
            </div>
          </div>

          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center gap-4">
              <RotateCcw className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'جارٍ التدوير...' : 'دور العجلة'}
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-12 min-h-[200px]">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-6 text-center font-bold text-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-pulse"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: '0.6s',
                  animationFillMode: 'both'
                }}
              >
                {result}
              </div>
            ))
          ) : (
            Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center text-4xl flex items-center justify-center text-white/40"
              >
                ؟
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WordGenerator;