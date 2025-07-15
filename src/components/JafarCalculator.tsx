import React, { useState } from 'react';
import { AnalysisRequest, AnalysisResult, PersonAnalysis, CountryAnalysis } from '../types/jafr';
import OpenAI from 'openai';

// حساب الرقم الجفري
export function calculateJafrNumber(text: string): number {
  const arabicLetters: Record<string, number> = {
    'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
    'ب': 2,
    'ج': 3,
    'د': 4,
    'ه': 5, 'ة': 5,
    'و': 6,
    'ز': 7,
    'ح': 8,
    'ط': 9,
    'ي': 10, 'ى': 10,
    'ك': 20,
    'ل': 30,
    'م': 40,
    'ن': 50,
    'س': 60,
    'ع': 70,
    'ف': 80,
    'ص': 90,
    'ق': 100,
    'ر': 200,
    'ش': 300,
    'ت': 400,
    'ث': 500,
    'خ': 600,
    'ذ': 700,
    'ض': 800,
    'ظ': 900,
    'غ': 1000
  };

  let total = 0;
  for (const char of text) {
    if (arabicLetters[char]) {
      total += arabicLetters[char];
    }
  }
  return total;
}

// تقليل الرقم إلى رقم أساسي
export function reduceNumber(num: number): number {
  if (num <= 9) return num;
  const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceNumber(sum);
}

// إنشاء prompt للذكاء الصناعي
export function createAnalysisPrompt(request: AnalysisRequest, originalNumber: number, reducedNumber: number): string {
  const type = request.type === 'person' ? 'شخصي' : 'وطني';
  const timeType = request.timeType;
  const timeValue = request.timeValue || '';

  return `قم بتحليل الرقم الجفري لل${type}.
  الرقم الأصلي: ${originalNumber}
  الرقم المختصر: ${reducedNumber}
  
  ${timeType === 'general' ? 'تحليل عام' :
    timeType === 'yearly' ? 'تحليل سنوي' :
    timeType === 'monthly' ? 'تحليل شهري' :
    timeType === 'weekly' ? 'تحليل أسبوعي' :
    'تحليل يومي'}
    
  ${timeValue ? `للعام/الشهر/الأسبوع: ${timeValue}` : ''}
  
  ركز على الجوانب التالية:
  - الشخصية والصفات
  - الوضع المالي
  - المسار المهني
  - العلاقات
  - الصحة
  - التوقعات المستقبلية
  - الرسائل الروحية
  - التوصيات العملية
  
  قدم التحليل باللغة العربية وفقاً للنظام الجفري التقليدي.
  
  يجب أن تقدم النتائج كـ JSON بالتنسيق التالي:
  {
    "analysis": {
      "general": "تحليل عام...",
      "yearly": "تحليل سنوي...",
      "monthly": "تحليل شهري...",
      "weekly": "تحليل أسبوعي...",
      "daily": "تحليل يومي...",
      "physicalTraits": "الصفات البدنية...",
      "moneyIncome": "الدخل المالي...",
      "career": "المسار المهني...",
      "emotions": "المشاعر والعواطف...",
      "ambition": "الطموح والأهداف...",
      "health": "الصحة واللياقة...",
      "family": "العلاقات الأسرية...",
      "friends": "العلاقات الاجتماعية...",
      "reputation": "السمعة والصورة...",
      "thinking": "التفكير والقرار...",
      "secrets": "الأسرار والثقة...",
      "crises": "التعامل مع الأزمات...",
      "spirituality": "الروحانية والاتصال...",
      "fame": "الشهرة والتأثير..."
    },
    "predictions": [
      "تنبؤ 1...",
      "تنبؤ 2..."
    ],
    "spiritualMessages": [
      "رسالة روحية 1...",
      "رسالة روحية 2..."
    ],
    "recommendations": [
      "توصية 1...",
      "توصية 2..."
    ]
  }`;
}

interface JafarCalculatorProps {
  analysisRequest: AnalysisRequest;
  onAnalysisChange: (result: AnalysisResult) => void;
}

export const JafarCalculator: React.FC<JafarCalculatorProps> = ({ analysisRequest, onAnalysisChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState(analysisRequest.text);
  const [originalNumber, setOriginalNumber] = useState(calculateJafrNumber(analysisRequest.text));
  const [reducedNumber, setReducedNumber] = useState(reduceNumber(calculateJafrNumber(analysisRequest.text)));

  const calculateAndAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!inputText) {
        throw new Error('الرجاء إدخال نص للتحليل');
      }

      // Calculate Jafr number
      const originalNum = calculateJafrNumber(inputText);
      const reducedNum = reduceNumber(originalNum);

      setOriginalNumber(originalNum);
      setReducedNumber(reducedNum);

      // Create prompt for analysis
      const prompt = createAnalysisPrompt(analysisRequest, originalNum, reducedNum);

      // Call OpenAI API
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      // Parse and update analysis result
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('لم يتم استلام محتوى من الذكاء الصناعي');
      }

      try {
        const result = JSON.parse(content);
        
        // Validate the result structure
        if (!result.analysis) {
          throw new Error('النتيجة لا تحتوي على تحليل');
        }

        const analysis = result.analysis as PersonAnalysis | CountryAnalysis;
        
        onAnalysisChange({
          request: analysisRequest,
          originalNumber: originalNum,
          reducedNumber: reducedNum,
          analysisType: analysisRequest.type,
          timeType: analysisRequest.timeType,
          analysis,
          predictions: result.predictions || [],
          spiritualMessages: result.spiritualMessages || [],
          recommendations: result.recommendations || []
        });
      } catch (err) {
        console.error('Error parsing AI response:', err);
        throw new Error('حدث خطأ في معالجة نتائج الذكاء الصناعي');
      }
    } catch (err) {
      console.error('Error in JafarCalculator:', err);
      setError('حدث خطأ أثناء التحليل');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setOriginalNumber(calculateJafrNumber(text));
    setReducedNumber(reduceNumber(calculateJafrNumber(text)));
  };

  const handleReset = () => {
    setInputText("");
    setOriginalNumber(0);
    setReducedNumber(0);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-2xl shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-center mb-8">التحليل الجفري</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">أدخل النص:</label>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              className="w-full p-4 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 h-32 resize-none"
              placeholder="أدخل النص الذي تريد تحليله"
              dir="rtl"
            />
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <span className="text-gray-700">الرقم الأصلي:</span>
            <span className="font-bold text-2xl text-purple-600">{originalNumber}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <span className="text-gray-700">الرقم المختصر:</span>
            <span className="font-bold text-2xl text-cyan-600">{reducedNumber}</span>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={calculateAndAnalyze}
              disabled={loading || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'تحليل'
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              تفريغ
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};