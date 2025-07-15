import React, { useState } from 'react';
import { Star, Calendar, Sparkles, Bot, Zap } from 'lucide-react';
import OpenAI from 'openai';

const ZodiacCalculator: React.FC = () => {
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const zodiacSigns = {
    'الحمل': { dates: '21 مارس - 19 أبريل', element: 'النار', planet: 'المريخ', traits: ['شجاع', 'قائد', 'متحمس', 'مندفع'] },
    'الثور': { dates: '20 أبريل - 20 مايو', element: 'الأرض', planet: 'الزهرة', traits: ['صبور', 'عملي', 'مخلص', 'عنيد'] },
    'الجوزاء': { dates: '21 مايو - 20 يونيو', element: 'الهواء', planet: 'عطارد', traits: ['ذكي', 'متكيف', 'فضولي', 'متقلب'] },
    'السرطان': { dates: '21 يونيو - 22 يوليو', element: 'الماء', planet: 'القمر', traits: ['حساس', 'حنون', 'حدسي', 'متقلب المزاج'] },
    'الأسد': { dates: '23 يوليو - 22 أغسطس', element: 'النار', planet: 'الشمس', traits: ['كريم', 'واثق', 'مبدع', 'متكبر'] },
    'العذراء': { dates: '23 أغسطس - 22 سبتمبر', element: 'الأرض', planet: 'عطارد', traits: ['منظم', 'تحليلي', 'مفيد', 'ناقد'] },
    'الميزان': { dates: '23 سبتمبر - 22 أكتوبر', element: 'الهواء', planet: 'الزهرة', traits: ['متوازن', 'دبلوماسي', 'جميل', 'متردد'] },
    'العقرب': { dates: '23 أكتوبر - 21 نوفمبر', element: 'الماء', planet: 'المريخ/بلوتو', traits: ['عميق', 'شغوف', 'غامض', 'انتقامي'] },
    'القوس': { dates: '22 نوفمبر - 21 ديسمبر', element: 'النار', planet: 'المشتري', traits: ['مغامر', 'فلسفي', 'صادق', 'متهور'] },
    'الجدي': { dates: '22 ديسمبر - 19 يناير', element: 'الأرض', planet: 'زحل', traits: ['طموح', 'منضبط', 'مسؤول', 'متشائم'] },
    'الدلو': { dates: '20 يناير - 18 فبراير', element: 'الهواء', planet: 'زحل/أورانوس', traits: ['مبتكر', 'مستقل', 'إنساني', 'منعزل'] },
    'الحوت': { dates: '19 فبراير - 20 مارس', element: 'الماء', planet: 'المشتري/نبتون', traits: ['حالم', 'رحيم', 'فني', 'هارب من الواقع'] }
  };

  const spiritualZodiacs = [
    'الطائر الأزرق', 'الذئب الفضي', 'التنين الذهبي', 'الفراشة البنفسجية', 'الأسد الأبيض',
    'النسر الأحمر', 'الحوت الكريستالي', 'الثعبان الزمردي', 'الغزال الوردي', 'العنقاء المقدسة',
    'الدب القطبي', 'الفيل الحكيم', 'القط الأسود', 'الحصان المجنح', 'السلحفاة الذهبية'
  ];

  const akashicGates = [
    'بوابة النور الأزرق', 'بوابة الحكمة الذهبية', 'بوابة الحب الوردي', 'بوابة القوة الحمراء',
    'بوابة السلام الأخضر', 'بوابة الحدس البنفسجي', 'بوابة التحول الفضي', 'بوابة الشفاء الكريستالي'
  ];

  const calculateZodiac = async () => {
    if (!name || !motherName || !birthDate) return;
    
    setIsCalculating(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let zodiacSign = '';
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiacSign = 'الحمل';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiacSign = 'الثور';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiacSign = 'الجوزاء';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiacSign = 'السرطان';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiacSign = 'الأسد';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiacSign = 'العذراء';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiacSign = 'الميزان';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiacSign = 'العقرب';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiacSign = 'القوس';
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiacSign = 'الجدي';
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiacSign = 'الدلو';
    else zodiacSign = 'الحوت';
    
    const zodiacInfo = zodiacSigns[zodiacSign as keyof typeof zodiacSigns];
    
    // حساب البرج الروحاني بناءً على الاسم واسم الأم
    const nameValue = (name + motherName).length;
    const spiritualZodiac = spiritualZodiacs[nameValue % spiritualZodiacs.length];
    const akashicGate = akashicGates[(nameValue + day) % akashicGates.length];
    
    setResult({
      name,
      motherName,
      zodiacSign,
      spiritualZodiac,
      akashicGate,
      ...zodiacInfo,
      spiritualNumber: Math.floor(Math.random() * 9) + 1,
      luckyColor: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'بنفسجي', 'برتقالي'][Math.floor(Math.random() * 6)],
      cosmicVibration: ['عالية', 'متوسطة', 'منخفضة'][Math.floor(Math.random() * 3)],
      prediction: 'تنتظرك فترة من التحولات الإيجابية والنمو الروحي. الكواكب تشير إلى فرص جديدة في الأفق، وبوابتك الطاقية تفتح أمام ذبذبات عالية من الحكمة والنور.'
    });
    
    setIsCalculating(false);
  };

  const getAIAnalysis = async (calculationResult: any) => {
    if (!apiKey.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        defaultHeaders: {
          "HTTP-Referer": window.location.origin,
          "X-Title": "Al-Araf - Zodiac Calculator",
        },
        dangerouslyAllowBrowser: true
      });

      const prompt = `أنت خبير في علم الهيئة والأبراج الروحانية. قم بتحليل هذا الملف الفلكي:

الاسم: ${calculationResult.name}
اسم الوالدة: ${calculationResult.motherName}
البرج الفلكي: ${calculationResult.zodiacSign}
البرج الروحاني: ${calculationResult.spiritualZodiac}
البوابة الأكاشية: ${calculationResult.akashicGate}
العنصر: ${calculationResult.element}
الكوكب الحاكم: ${calculationResult.planet}
الرقم الروحاني: ${calculationResult.spiritualNumber}

قدم تحليلاً فلكياً وروحانياً شاملاً يشمل:
1. تفسير مفصل للبرج الفلكي والروحاني
2. تأثير البوابة الأكاشية على الشخصية
3. التوافق مع الأبراج الأخرى
4. التوقعات والتوجيهات للمستقبل
5. الأوقات المناسبة للقرارات المهمة
6. الألوان والأحجار المناسبة
7. النصائح الروحانية والعملية

استخدم لغة فلكية عميقة ومفهومة.`;

      const completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 2000
      });

      setAiAnalysis(completion.choices[0].message.content || 'لم أتمكن من الحصول على تحليل.');
    } catch (error) {
      console.error('Error:', error);
      setAiAnalysis('حدث خطأ في الحصول على التحليل الذكي. تأكد من صحة مفتاح API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            <Star className="inline-block w-12 h-12 ml-4" />
            🔮 البرج الروحاني (الباطني)
          </h2>
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              اكتب اسمك الكامل واسم والدتك وتاريخ ميلادك بالميلادي، وسنكشف لك برجك الروحاني (الباطني) الحقيقي من خلال أسرار علم الهيئة، وذبذبات الروح المرتبطة بالسجل الأكاشي.
            </p>
            <p className="text-cyan-300 mt-3 font-medium">
              🔍 استعد لكشف الطيف الخفي لهويتك الكونية، ومعرفة البوابة الطاقية التي وُلدت منها.
            </p>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-cyan-300 flex items-center gap-3">
            <Bot className="w-6 h-6" />
            التحليل الفلكي الذكي
          </h3>
          
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3 text-cyan-300">
              مفتاح OpenRouter API (اختياري للتحليل الذكي)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="أدخل مفتاح API للحصول على تحليل فلكي ذكي مفصل"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-lg font-medium mb-3 text-cyan-300">
                <Calendar className="inline-block w-5 h-5 ml-2" />
                الاسم الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            
            <div>
              <label className="block text-lg font-medium mb-3 text-cyan-300">
                <Calendar className="inline-block w-5 h-5 ml-2" />
                اسم الوالدة
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="أدخل اسم والدتك"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-lg font-medium mb-3 text-cyan-300">
                <Calendar className="inline-block w-5 h-5 ml-2" />
                تاريخ الميلاد (بالميلادي)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={calculateZodiac}
            disabled={isCalculating || !name || !motherName || !birthDate}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className={`w-6 h-6 ${isCalculating ? 'animate-spin' : ''}`} />
              {isCalculating ? 'جارٍ كشف الأسرار الكونية...' : 'اكشف برجي الروحاني'}
            </div>
          </button>
        </div>

        {result && (
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 animate-fadeIn">
            <h3 className="text-3xl font-bold text-center mb-8 text-purple-300">
              الكشف الروحاني لـ {result.name}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">البرج الفلكي</h4>
                  <p className="text-2xl font-bold text-yellow-400">{result.zodiacSign}</p>
                  <p className="text-gray-300 mt-2">{result.dates}</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-6 border border-purple-400/30">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">🔮 البرج الروحاني (الباطني)</h4>
                  <p className="text-2xl font-bold text-purple-300">{result.spiritualZodiac}</p>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-2xl p-6 border border-cyan-400/30">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">🌌 البوابة الأكاشية</h4>
                  <p className="text-xl text-cyan-300">{result.akashicGate}</p>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">العنصر الحاكم</h4>
                  <p className="text-xl text-orange-400">{result.element}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">الكوكب الحاكم</h4>
                  <p className="text-xl text-green-400">{result.planet}</p>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">الذبذبة الكونية</h4>
                  <p className="text-xl text-yellow-400">{result.cosmicVibration}</p>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">الصفات الشخصية</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.traits.map((trait: string, index: number) => (
                      <span key={index} className="bg-purple-500/30 px-3 py-1 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">الرقم الروحاني</h4>
                  <p className="text-3xl font-bold text-yellow-400">{result.spiritualNumber}</p>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-3 text-cyan-300">اللون المحظوظ</h4>
                  <p className="text-xl text-pink-400">{result.luckyColor}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-2xl p-6 border border-cyan-500/30">
              <h4 className="text-xl font-bold mb-3 text-cyan-300">الكشف الروحاني والتوقعات</h4>
              <p className="text-gray-300 leading-relaxed">{result.prediction}</p>
            </div>
            
            {/* AI Analysis Button and Results */}
            {apiKey.trim() && (
              <div className="mt-8">
                <button
                  onClick={() => getAIAnalysis(result)}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-6"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Zap className={`w-6 h-6 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    {isAnalyzing ? 'جارٍ التحليل الفلكي الذكي...' : 'احصل على التحليل الفلكي الذكي'}
                  </div>
                </button>
                
                {aiAnalysis && (
                  <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 border border-purple-500/30">
                    <h4 className="text-xl font-bold mb-4 text-purple-300 flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      التحليل الفلكي الذكي المتقدم
                    </h4>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {aiAnalysis}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZodiacCalculator;