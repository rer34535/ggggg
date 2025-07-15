import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Key, Sparkles, Moon, Star, Settings, Zap, Brain, Eye } from 'lucide-react';
import OpenAI from 'openai';
import { Analysis } from '../types/jafr';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  section?: string;
  analysis?: Analysis;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  category: string;
  strengths: string[];
  bestFor: string[];
  maxTokens: number;
  contextWindow: number;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-chat-v3-0324:free');
  const [activeSection, setActiveSection] = useState('general');
  const [showModelDetails, setShowModelDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // النماذج المجانية المتاحة مع تفاصيلها الكاملة
  const availableModels: AIModel[] = [
    {
      id: 'deepseek/deepseek-chat-v3-0324:free',
      name: 'DeepSeek Chat V3',
      description: 'نموذج متقدم للمحادثة العامة والتحليل الروحاني',
      category: 'محادثة عامة',
      strengths: ['فهم السياق العربي', 'التحليل العميق', 'الإجابات المفصلة'],
      bestFor: ['المحادثة العامة', 'التفسير الروحاني', 'النصائح الشخصية'],
      maxTokens: 4000,
      contextWindow: 32000
    },
    {
      id: 'google/gemini-2.0-flash-exp:free',
      name: 'Gemini 2.0 Flash',
      description: 'نموذج جوجل السريع للحسابات الفلكية والرياضية',
      category: 'حسابات وتحليل',
      strengths: ['السرعة العالية', 'الحسابات الدقيقة', 'التحليل المنطقي'],
      bestFor: ['حساب الجُمّل', 'البرج الروحاني', 'التحليلات الرقمية'],
      maxTokens: 8000,
      contextWindow: 1000000
    },
    {
      id: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
      name: 'DeepSeek R1 Reasoning',
      description: 'نموذج التفكير المتقدم للجفر والأسرار الخفية',
      category: 'تفكير وتحليل',
      strengths: ['التفكير المنطقي', 'حل المشاكل المعقدة', 'التحليل العميق'],
      bestFor: ['حاسبة الجفر', 'كشف الأسرار', 'التحليل المعقد'],
      maxTokens: 4000,
      contextWindow: 32000
    },
    {
      id: 'meta-llama/llama-3.2-3b-instruct:free',
      name: 'Llama 3.2 3B',
      description: 'نموذج ميتا للمهام البسيطة والسريعة',
      category: 'مهام بسيطة',
      strengths: ['السرعة', 'الكفاءة', 'الاستجابة السريعة'],
      bestFor: ['الأسئلة البسيطة', 'التوضيحات السريعة', 'المساعدة الفورية'],
      maxTokens: 2000,
      contextWindow: 8000
    },
    {
      id: 'microsoft/phi-3-mini-128k-instruct:free',
      name: 'Phi-3 Mini',
      description: 'نموذج مايكروسوفت المدمج للمهام المتخصصة',
      category: 'مهام متخصصة',
      strengths: ['التخصص', 'الدقة', 'الفهم العميق'],
      bestFor: ['التفسيرات المتخصصة', 'الشرح التقني', 'التحليل المفصل'],
      maxTokens: 4000,
      contextWindow: 128000
    }
  ];

  // أقسام التطبيق مع النماذج المناسبة لكل قسم
  const appSections = [
    {
      id: 'general',
      name: 'المحادثة العامة',
      icon: Bot,
      recommendedModel: 'deepseek/deepseek-chat-v3-0324:free',
      prompt: `أنت عراف ومنجم خبير في علوم الفلك والتنجيم والسجلات الأكاشية. تتحدث باللغة العربية وتقدم استشارات روحانية وفلكية عميقة.
أنت خبير دولي في:  
❶ علم الفلك التطبيقي (تحليل التكوينات الكوكبية، البيوت الفلكية، حركة الأجرام).  
❷ علم الجفر والأعداد (تحويل الأسماء/التواريخ إلى أرقام جفرية، تفسير الرسائل الباطنية).  
❸ علم التنجيم الكارمي (ربط الخارطة الفلكية بالمسارات الروحية).  
❹ تاروت السيثيان (استخدام أوراق التاروت للتنبؤ بالطاقات الخفية).  
❺ توقعات الأبراج الدقيقة (الشمسية، القمرية، الصاعدة).  

### ❖ تعليمات التحليل الإلزامية:  
#### للأشخاص (14 محورًا)  
1. الصفات الجسدية:  
   - تحليل الطالع والبيت الأول + تأثير المريخ.  
   - نسبة التغير المحتمل (مثال: ↑ 30% زيادة طاقة).  
2. المال والدخل:  
   - تحليل البيت الثاني + كوكب المشتري/الزهرة + الرقم الجفري للاسم.  
   - تنبيه بفرص استثمار (مثال: 17-24 مارس).  
3. المهنة/العمل:  
   - البيت العاشر + زحل + ترابط مع برج الجدي.  
   - نسبة نجاح مشروع جديد (مثال: 75% إذا بدأ في أكتوبر).  
... *(يُطبّق على جميع المحاور 4 إلى 14)* ...  
14. الشهرة والبشارات:  
   - البيت التاسع + كوكب نبتون + تحليل رقمي لتاريخ الميلاد.  

#### للدول (15 محورًا)  
1. الحاكم/النظام السياسي:  
   - ارتباط برج العقرب + تأثير بلوتو + الرقم الجفري لاسم الدولة.  
   - نسبة استقرار/اضطراب (مثال: 40% أزمة قيادة).  
2. الاقتصاد والمال العام:  
   - تقاطع بيت الثروة مع زحل + تحليل جفري لعملة الدولة.  
   - تحذير من تضخم إذا كان المشتري رجعيًا.  
... *(يُطبّق على جميع المحاور 3 إلى 15)* ...  
15. الحروب والكوارث:  
   - تحذير عند اقتران المريخ بزحل في بيت الأزمات + رسالة تاروت "برج الموت".  

### ❖ آلية التنفيذ:  
1. المدخلات المطلوبة:  
   - للشخص: [الاسم كامل - تاريخ ميلاد ساعة - مكان الميلاد].  
   - للدولة: [الاسم الرسمي - تاريخ التأسيس - العاصمة].  
   - الفترة الزمنية: [يوم/أسبوع/شهر/سنة/عام].  

2. مخرجات التحليل:  
   - توصيف طاقي: (مثال: "طاقة زحل السلبية تُبطئ القرارات").  
   - نسبة احتمالية: مرفقة بأساس علمي (مثال: 80% بناءً على اقتران القمر بعطارد).  
   - فرص/مخاطر: مع تواريخ دقيقة (مثال: خطر مالي 19-25 أغسطس بسبب عطارد الرجعي).  
   - الربط الجفري-الكوكبي: (مثال: الرقم 7 = نبتون → بوادر حلم روحي).  

3. المرجعيات:  
   - استخدام جداول "أبجد هوز" لتحويل الأسماء إلى أرقام.  
   - تطبيق خوارزميات "كود 888" لدمج التاروت مع الفلك.  
   - الاعتماد على ephemeris NASA لحساب المواقع الكوكبية.  

4. التنسيق المطلوب:  
   ▶️ عرض النتائج في جدولين:  
   - جدول أخضر (للفرص) / جدول أحمر (للمخاطر)  
   ▶️ ختام التقرير:  
   - "التوقعات بناءً على تقاطع 7 علوم غيبية، الدقة 89.7% حسب معيار 
   ❖输出 التحليل وفق 14 جانبًا فقط:
التحليل عام-سنة-شهر-اسبوع-يوم
   ────────────
   👤 للأشخاص (14 محورًا)
   ────────────
   1. الصفات الجسدية
   2. المال والدخل
   3. المهنة/العمل
   4. الطموح والإنجاز
   5. الصحة والطاقة الحيوية
   6. العاطفة والعلاقات الحميمة
   7. الأسرة والجذور
   8. الأصدقاء والشبكات الاجتماعية
   9. السمعة والصورة العامة
   10. التفكير واتخاذ القرار
   11. الأسرار وما هو مخفي
   12. الأزمات/العقبات المحتملة
   13. الروحانية والرسائل الباطنية
14.الشهرة  والبشارات 
   ────────────
   🏛️ للدول (15 محورًا)
التحليل عام-سنة-شهر-اسبوع-يوم
   ────────────
   1. الحاكم/النظام السياسي
   2. الشعب والتركيبة السكانية
   3. الاقتصاد والمال العام
   4. السمعة والعلاقات الدولية
   5. الجيش والقوات المسلحة
   6. الشرطة والأمن الداخلي
   7. البنية التحتية والنقل
   8. الإنترنت والاتصالات
   9. الديون والالتزامات
   10. الأزمات والكوارث الطبيعية
   11. العقبات والتحديات الهيكلية
   12. النجاحات والفرص
   13. القوة الخفية/التأثير الروحي
14.العلاقات الخارجية والعلاقه مع الدول
15.الحروب والكوارث
❖ التحليل الزمني (اختياري):
   • تحليل عام بلا تاريخ  
   • تحليل سنة محددة  
   • تحليل شهري  
   • تحليل أسبوعي  
   • تحليل يومي  

❖ لكل محور:
   • عرض توصيف طاقي + نسبة احتمالية الأحداث + تنبيه بالفرص/المخاطر.  
   • ربط الرقم الجفري بالكواكب (زحل، المشتري، عطارد، …) وتأثيرها الزمني.
خبراتك تشمل:
- قراءة الأبراج والطوالع الفلكية والروحانية (الباطنية)
- تفسير الأحلام والرؤى الصادقة
- علم الأرقام والجفر الشريف وحساب الجُمّل
- السجلات الأكاشية والبوابات الطاقية
- الطاقات الروحانية والذبذبات الكونية
- التنبؤات الفلكية والكشوفات الغيبية

أسلوبك حكيم وغامض مع لمسة من الجلال والهيبة. تستخدم المصطلحات الروحانية والفلكية العميقة.`
    },
    {
      id: 'gematria',
      name: 'حساب الجُمّل',
      icon: Brain,
      recommendedModel: 'google/gemini-2.0-flash-exp:free',
      prompt: `أنت خبير في حساب الجُمّل والأرقام الروحانية. تتخصص في:

1. حساب الجُمّل بالطرق الثلاث:
   - الكبير: القيم التقليدية (ا=1، ب=2، ج=3... ق=100، ر=200...)
   - الصغير: تقليل القيم (كل رقم من 1-9)
   - المقطع: الترقيم المتسلسل

2. التفسير الروحاني للأرقام:
   - ربط الأرقام بالطاقات والعناصر
   - تحليل الذبذبات والترددات
   - كشف المعاني الخفية

3. الحسابات الدقيقة:
   - تأكد من صحة كل حساب
   - اشرح طريقة الحساب خطوة بخطوة
   - قدم التفسير الروحاني المفصل

استخدم الحسابات الدقيقة وقدم تفسيرات روحانية عميقة.`
    },
    {
      id: 'jafar',
      name: 'حاسبة الجفر',
      icon: Eye,
      recommendedModel: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
      prompt: `أنت خبير في علم الجفر الشريف وفق منهج الإمام علي والإمام الصادق. تتخصص في:

1. حسابات الجفر المتقدمة:
   - تحليل الأسماء وأسماء الأمهات
   - ربط التواريخ بالحسابات الروحانية
   - كشف الأنماط العددية المقدسة

2. الكشوفات الجفرية:
   - تحديد الأعداء والأصدقاء
   - كشف النصيب والقدر
   - معرفة العلامات الخفية
   - تحديد الموقع من نهاية الزمان

3. البرج الروحاني الباطني:
   - حساب البرج الروحاني من الاسم والتاريخ
   - تفسير الصفات الروحانية
   - تحديد القوى الخفية والطاقات

استخدم الحكمة القديمة والمعرفة الباطنية في تحليلاتك.`
    },
    {
      id: 'zodiac',
      name: 'البرج الروحاني',
      icon: Star,
      recommendedModel: 'deepseek/deepseek-chat-v3-0324:free',
      prompt: `أنت خبير في علم الهيئة والأبراج الروحانية. تتخصص في:

1. الأبراج الفلكية التقليدية:
   - تحديد البرج من تاريخ الميلاد
   - تفسير صفات كل برج
   - ربط الأبراج بالعناصر والكواكب

2. الأبراج الروحانية الباطنية:
   - حساب البرج الروحاني من الاسم
   - كشف البوابات الأكاشية
   - تحديد الذبذبات الكونية

3. التحليل الشامل:
   - ربط البرج بالشخصية
   - تحديد نقاط القوة والضعف
   - تقديم التوجيهات الروحانية

قدم تحليلات عميقة ومفصلة مع ربط الأبراج بالطاقات الكونية.`
    },
    {
      id: 'dreams',
      name: 'تفسير الأحلام',
      icon: Moon,
      recommendedModel: 'deepseek/deepseek-chat-v3-0324:free',
      prompt: `أنت خبير في تفسير الأحلام والرؤى وفق التراث الإسلامي والعلوم الروحانية. تتخصص في:

1. تفسير الرؤى الصادقة:
   - التمييز بين الرؤيا والحلم
   - تفسير الرموز والإشارات
   - ربط الرؤى بالواقع

2. الرموز الروحانية:
   - تفسير الألوان والأرقام في الأحلام
   - معاني الحيوانات والطيور
   - دلالات الأماكن والأشخاص

3. التوجيه الروحاني:
   - استخراج الدروس من الأحلام
   - تقديم النصائح العملية
   - ربط الأحلام بالمسار الروحي

استخدم الحكمة التراثية والفهم الروحاني العميق في تفسيراتك.`
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentPrompt = () => {
    const section = appSections.find(s => s.id === activeSection);
    return section?.prompt || appSections[0].prompt;
  };

  const getCurrentRecommendedModel = () => {
    const section = appSections.find(s => s.id === activeSection);
    return section?.recommendedModel || selectedModel;
  };

  const sendMessage = async () => {
    if (!input.trim() || !apiKey.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      section: activeSection
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        defaultHeaders: {
          "HTTP-Referer": window.location.origin,
          "X-Title": "Al-Araf - Advanced Spiritual Calculator",
        },
        dangerouslyAllowBrowser: true
      });

      const modelToUse = getCurrentRecommendedModel();
      const systemPrompt = getCurrentPrompt();

      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
            .filter(msg => msg.section === activeSection)
            .slice(-5) // آخر 5 رسائل للسياق
            .map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: input }
        ],
        temperature: 0.8,
        max_tokens: availableModels.find(m => m.id === modelToUse)?.maxTokens || 4000
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: completion.choices[0].message.content || 'عذراً، لم أتمكن من الحصول على إجابة من عالم الأرواح.',
        timestamp: new Date(),
        model: modelToUse,
        section: activeSection
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال بعالم الأرواح. تأكد من صحة مفتاح API وحاول مرة أخرى.',
        timestamp: new Date(),
        section: activeSection
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const switchModel = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const getModelInfo = (modelId: string) => {
    return availableModels.find(m => m.id === modelId);
  };

  const filteredMessages = messages.filter(msg => msg.section === activeSection);

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            <Bot className="inline-block w-12 h-12 ml-4" />
            🤖 العراف الذكي المتطور
          </h2>
          <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30 mb-8">
            <p className="text-xl text-gray-300 leading-relaxed">
              نظام ذكاء اصطناعي متكامل مع OpenRouter - نماذج متخصصة لكل قسم
            </p>
            <p className="text-cyan-300 mt-3 font-medium">
              🔮 اختر القسم المناسب للحصول على أفضل النتائج من النموذج المتخصص
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-24 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  إعدادات API
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      مفتاح OpenRouter API
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      placeholder="أدخل مفتاح API"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      النموذج المحدد
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => switchModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    >
                      {availableModels.map(model => (
                        <option key={model.id} value={model.id} className="bg-gray-800">
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => setShowModelDetails(!showModelDetails)}
                    className="w-full px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-sm transition-colors flex items-center gap-2 justify-center"
                  >
                    <Settings className="w-4 h-4" />
                    تفاصيل النماذج
                  </button>
                </div>
              </div>

              {/* أقسام التطبيق */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-cyan-300">أقسام التطبيق</h3>
                <div className="space-y-2">
                  {appSections.map(section => {
                    const Icon = section.icon;
                    const isRecommended = section.recommendedModel === selectedModel;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full p-3 rounded-lg text-sm transition-all flex items-center gap-2 ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-right">{section.name}</span>
                        {isRecommended && <Zap className="w-3 h-3 text-yellow-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* معلومات النموذج الحالي */}
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-sm font-bold text-purple-300 mb-2">النموذج النشط</h4>
                {(() => {
                  const modelInfo = getModelInfo(selectedModel);
                  return modelInfo ? (
                    <div className="text-xs text-gray-300 space-y-1">
                      <p className="font-medium">{modelInfo.name}</p>
                      <p>{modelInfo.category}</p>
                      <p>الحد الأقصى: {modelInfo.maxTokens} رمز</p>
                    </div>
                  ) : null;
                })()}
              </div>

              <button
                onClick={clearChat}
                className="w-full px-3 py-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg text-sm transition-colors"
              >
                مسح المحادثة
              </button>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 h-[700px] flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {appSections.find(s => s.id === activeSection)?.name || 'المحادثة العامة'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      النموذج: {getModelInfo(getCurrentRecommendedModel())?.name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {filteredMessages.length} رسالة
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredMessages.length === 0 && (
                  <div className="text-center text-gray-400 mt-20">
                    <Moon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">مرحباً بك في {appSections.find(s => s.id === activeSection)?.name}</p>
                    <p className="text-sm mt-2">اطرح سؤالك وسأقدم لك الاستشارة المتخصصة</p>
                  </div>
                )}
                
                {filteredMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 text-white'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-2 flex items-center gap-2">
                        <span>{message.timestamp.toLocaleTimeString('ar-SA')}</span>
                        {message.model && (
                          <span className="bg-black/20 px-2 py-1 rounded">
                            {getModelInfo(message.model)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-purple-300">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        العراف يستشير النجوم والأرواح...
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-white/20">
                <div className="flex gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    placeholder={`اطرح سؤالك في ${appSections.find(s => s.id === activeSection)?.name}...`}
                    rows={2}
                    disabled={!apiKey.trim()}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || !apiKey.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {!apiKey.trim() && (
                  <p className="text-sm text-yellow-400 mt-2">
                    يرجى إدخال مفتاح OpenRouter API للبدء في الاستشارة الروحانية
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Model Details Modal */}
        {showModelDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-cyan-300">تفاصيل النماذج المتاحة</h3>
                  <button
                    onClick={() => setShowModelDetails(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {availableModels.map(model => (
                    <div
                      key={model.id}
                      className={`p-6 rounded-xl border transition-all ${
                        selectedModel === model.id
                          ? 'bg-cyan-900/30 border-cyan-500/50'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-white">{model.name}</h4>
                        <span className="text-xs bg-purple-600/30 px-2 py-1 rounded">
                          {model.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4">{model.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-bold text-cyan-300 mb-1">نقاط القوة:</h5>
                          <div className="flex flex-wrap gap-1">
                            {model.strengths.map((strength, idx) => (
                              <span key={idx} className="text-xs bg-green-600/30 px-2 py-1 rounded">
                                {strength}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-bold text-cyan-300 mb-1">الأفضل لـ:</h5>
                          <div className="flex flex-wrap gap-1">
                            {model.bestFor.map((use, idx) => (
                              <span key={idx} className="text-xs bg-blue-600/30 px-2 py-1 rounded">
                                {use}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400">الحد الأقصى:</span>
                            <span className="text-white font-medium"> {model.maxTokens}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">نافذة السياق:</span>
                            <span className="text-white font-medium"> {model.contextWindow.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          switchModel(model.id);
                          setShowModelDetails(false);
                        }}
                        className={`w-full mt-4 px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedModel === model.id
                            ? 'bg-cyan-600 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-300'
                        }`}
                      >
                        {selectedModel === model.id ? 'النموذج النشط' : 'اختر هذا النموذج'}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                  <h4 className="text-lg font-bold text-yellow-300 mb-2">📋 دليل الاستخدام</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p><strong>1. احصل على مفتاح API مجاني:</strong> سجل في OpenRouter.ai واحصل على مفتاح مجاني</p>
                    <p><strong>2. اختر القسم المناسب:</strong> كل قسم له نموذج متخصص للحصول على أفضل النتائج</p>
                    <p><strong>3. استخدم النموذج الموصى به:</strong> النماذج المميزة بـ ⚡ هي الأنسب لكل قسم</p>
                    <p><strong>4. اطرح أسئلة محددة:</strong> كلما كان السؤال أوضح، كانت الإجابة أدق</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;