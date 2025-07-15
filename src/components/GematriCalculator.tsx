import React, { useState } from 'react';
import { Hash, Calculator, Sparkles, Bot, Zap } from 'lucide-react';
import OpenAI from 'openai';

const GematriCalculator: React.FC = () => {
  const [text, setText] = useState('');
  const [gematriaType, setGematriaType] = useState('كبير');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const arabicGematriaKabir: { [key: string]: number } = {
    'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
    'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
    'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
  };

  const arabicGematriaSaghir: { [key: string]: number } = {
    'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
    'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 1, 'ك': 2, 'ل': 3, 'م': 4, 'ن': 5, 'س': 6, 'ع': 7, 'ف': 8, 'ص': 9,
    'ق': 1, 'ر': 2, 'ش': 3, 'ت': 4, 'ث': 5, 'خ': 6, 'ذ': 7, 'ض': 8, 'ظ': 9, 'غ': 1
  };

  const arabicGematriaMuqatta: { [key: string]: number } = {
    'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
    'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 11, 'ل': 12, 'م': 13, 'ن': 14, 'س': 15, 'ع': 16, 'ف': 17, 'ص': 18,
    'ق': 19, 'ر': 20, 'ش': 21, 'ت': 22, 'ث': 23, 'خ': 24, 'ذ': 25, 'ض': 26, 'ظ': 27, 'غ': 28
  };

  const getGematriaTable = () => {
    switch (gematriaType) {
      case 'صغير': return arabicGematriaSaghir;
      case 'مقطع': return arabicGematriaMuqatta;
      default: return arabicGematriaKabir;
    }
  };

  const calculateGematria = async () => {
    if (!text.trim()) return;
    
    setIsCalculating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const gematriaTable = getGematriaTable();
    let total = 0;
    const letterValues: { letter: string; value: number }[] = [];
    
    for (const char of text) {
      if (gematriaTable[char]) {
        total += gematriaTable[char];
        letterValues.push({ letter: char, value: gematriaTable[char] });
      }
    }
    
    const reducedNumber = total.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    
    const interpretations = {
      1: 'الوحدة والقيادة - طاقة البداية والإبداع',
      2: 'التعاون والشراكة - طاقة التوازن والدبلوماسية',
      3: 'الإبداع والتعبير - طاقة الفن والتواصل',
      4: 'الاستقرار والعمل الجاد - طاقة البناء والتنظيم',
      5: 'الحرية والمغامرة - طاقة التغيير والحركة',
      6: 'المسؤولية والرعاية - طاقة الحب والخدمة',
      7: 'الروحانية والحكمة - طاقة البحث والتأمل',
      8: 'القوة المادية والنجاح - طاقة الإنجاز والسلطة',
      9: 'الإنسانية والعطاء - طاقة الكمال والتضحية'
    };

    const energySymbols = [
      'رمز النور الأزرق', 'رمز الحكمة الذهبية', 'رمز الحب الوردي', 'رمز القوة الحمراء',
      'رمز السلام الأخضر', 'رمز الحدس البنفسجي', 'رمز التحول الفضي', 'رمز الشفاء الكريستالي'
    ];
    
    setResult({
      originalText: text,
      gematriaType,
      totalValue: total,
      reducedNumber,
      letterValues,
      interpretation: interpretations[reducedNumber as keyof typeof interpretations] || 'رقم خاص بطاقة فريدة ومميزة',
      energySymbol: energySymbols[reducedNumber % energySymbols.length],
      hiddenMeaning: 'هذه الأرقام ليست عشوائية، بل مفاتيح لبوابات غيبية لا تُفتح إلا بالنية والمعرفة.'
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
          "X-Title": "Al-Araf - Gematria Calculator",
        },
        dangerouslyAllowBrowser: true
      });

      const prompt = `أنت خبير في حساب الجُمّل والأرقام الروحانية. قم بتحليل هذه النتيجة:

النص: "${calculationResult.originalText}"
نوع الحساب: ${calculationResult.gematriaType}
القيمة الإجمالية: ${calculationResult.totalValue}
الرقم المختزل: ${calculationResult.reducedNumber}

قدم تحليلاً روحانياً مفصلاً يشمل:
1. المعنى الروحاني العميق للرقم
2. الطاقات والذبذبات المرتبطة
3. التأثيرات على الشخصية والحياة
4. النصائح والتوجيهات الروحانية
5. الأرقام المحظوظة والألوان المناسبة

استخدم لغة روحانية عميقة ومفهومة.`;

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1500
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
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            <Hash className="inline-block w-12 h-12 ml-4" />
            🔢 حساب الجُمّل
          </h2>
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              اكتب الاسم أو الجملة التي تريد كشف معناها، مع تحديد نوع الجُمّل (الكبير أو الصغير أو المقطّع)، وسنحسب لك القيمة العددية بدقة فائقة، ونكشف الرموز الطاقية الخفية المتصلة بعالم الأسماء والطبائع.
            </p>
            <p className="text-cyan-300 mt-3 font-medium">
              ✨ هذه الأرقام ليست عشوائية، بل مفاتيح لبوابات غيبية لا تُفتح إلا بالنية والمعرفة.
            </p>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-cyan-300 flex items-center gap-3">
            <Bot className="w-6 h-6" />
            التحليل الذكي المتقدم
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
              placeholder="أدخل مفتاح API للحصول على تحليل ذكي مفصل"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
          <div className="mb-6">
            <label className="block text-lg font-medium mb-3 text-cyan-300">
              <Calculator className="inline-block w-5 h-5 ml-2" />
              النص المراد حسابه
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              placeholder="أدخل النص أو الاسم المراد حساب قيمته العددية"
              rows={4}
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-3 text-cyan-300">
              نوع حساب الجُمّل
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['كبير', 'صغير', 'مقطع'].map((type) => (
                <button
                  key={type}
                  onClick={() => setGematriaType(type)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    gematriaType === type
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white/10 border border-white/30 text-white/80 hover:bg-white/20'
                  }`}
                >
                  الجُمّل ال{type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateGematria}
            disabled={isCalculating || !text.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className={`w-6 h-6 ${isCalculating ? 'animate-spin' : ''}`} />
              {isCalculating ? 'جارٍ كشف الرموز الطاقية...' : 'احسب القيمة العددية'}
            </div>
          </button>
        </div>

        {result && (
          <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 animate-fadeIn">
            <h3 className="text-3xl font-bold text-center mb-8 text-green-300">
              نتائج حساب الجُمّل
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-3 text-cyan-300">النص الأصلي</h4>
                <p className="text-lg text-yellow-400 font-medium">{result.originalText}</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-3 text-cyan-300">نوع الحساب</h4>
                <p className="text-lg text-purple-400">الجُمّل ال{result.gematriaType}</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-3 text-cyan-300">القيمة الإجمالية</h4>
                <p className="text-3xl font-bold text-green-400">{result.totalValue}</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-3 text-cyan-300">الرقم المختزل</h4>
                <p className="text-3xl font-bold text-purple-400">{result.reducedNumber}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-6 border border-purple-400/30">
                <h4 className="text-xl font-bold mb-3 text-cyan-300">🔮 الرمز الطاقي</h4>
                <p className="text-lg text-purple-300">{result.energySymbol}</p>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-2xl p-6 border border-cyan-400/30">
                <h4 className="text-xl font-bold mb-3 text-cyan-300">التفسير الروحاني</h4>
                <p className="text-lg text-cyan-300">{result.interpretation}</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6 mb-6">
              <h4 className="text-xl font-bold mb-4 text-cyan-300">تفصيل الحروف</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {result.letterValues.map((item: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-yellow-400">{item.letter}</div>
                    <div className="text-sm text-gray-300">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-2xl p-6 border border-yellow-500/30">
              <h4 className="text-xl font-bold mb-3 text-yellow-300">المعنى الخفي</h4>
              <p className="text-gray-300 leading-relaxed">{result.hiddenMeaning}</p>
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
                    {isAnalyzing ? 'جارٍ التحليل الذكي...' : 'احصل على التحليل الذكي المتقدم'}
                  </div>
                </button>
                
                {aiAnalysis && (
                  <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 border border-purple-500/30">
                    <h4 className="text-xl font-bold mb-4 text-purple-300 flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      التحليل الذكي المتقدم
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

export default GematriCalculator;