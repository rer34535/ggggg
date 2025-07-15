// src/types/jafr.ts

// طلب التحليل
export interface AnalysisRequest {
  type: 'person' | 'country'; // نوع التحليل (شخص أو دولة)
  text: string;               // النص المدخل (اسم الشخص أو الدولة)
  timeType: 'general' | 'yearly' | 'monthly' | 'weekly' | 'daily'; // نوع الفترة الزمنية
  timeValue?: string;         // قيمة الوقت (مثل السنة، الشهر، إلخ)
  originalNumber: number;     // الرقم الجفري الأصلي
  reducedNumber: number;      // الرقم المختصر
}

// تحليل الشخص
export interface PersonAnalysis {
  general: string;           // تحليل عام
  yearly: string;            // تحليل سنوي
  monthly: string;           // تحليل شهري
  weekly: string;            // تحليل أسبوعي
  daily: string;             // تحليل يومي
  physicalTraits: string;    // الصفات البدنية
  moneyIncome: string;       // الدخل المالي
  career: string;            // المسار المهني
  emotions: string;          // المشاعر والعواطف
  ambition: string;          // الطموح والأهداف
  health: string;            // الصحة واللياقة
  family: string;            // العلاقات الأسرية
  friends: string;           // العلاقات الاجتماعية
  reputation: string;        // السمعة والصورة
  thinking: string;          // التفكير والقرار
  secrets: string;           // الأسرار والثقة
  crises: string;            // التعامل مع الأزمات
  spirituality: string;      // الروحانية والاتصال
  fame: string;              // الشهرة والتأثير
}

// تحليل الدولة
export interface CountryAnalysis {
  general: string;           // تحليل عام
  yearly: string;            // تحليل سنوي
  monthly: string;           // تحليل شهري
  weekly: string;            // تحليل أسبوعي
  daily: string;             // تحليل يومي
  ruler: string;             // الحاكم والقيادة
  people: string;            // الشعب والمجتمع
  economy: string;           // الاقتصاد والمال
  reputation: string;        // السمعة الدولية
  military: string;          // القوات المسلحة
  police: string;            // الأجهزة الأمنية
  infrastructure: string;    // البنية التحتية
  internet: string;          // الاتصالات والإنترنت
  debts: string;             // الديون والالتزامات
  crises: string;            // الأزمات والتحديات
  obstacles: string;         // العقبات والصعوبات
  successes: string;         // النجاحات والإنجازات
  hiddenPower: string;       // القوة الخفية
  foreignRelations: string;  // العلاقات الخارجية
  warsConflicts: string;     // الحروب والصراعات
}

// نتيجة التحليل
export interface AnalysisResult {
  request: AnalysisRequest;   // طلب التحليل الأصلي
  originalNumber: number;     // الرقم الجفري الأصلي
  reducedNumber: number;      // الرقم المختصر
  analysisType: 'person' | 'country'; // نوع التحليل
  timeType: 'general' | 'yearly' | 'monthly' | 'weekly' | 'daily'; // نوع الفترة الزمنية
  timeValue?: string;         // قيمة الوقت
  analysis: PersonAnalysis | CountryAnalysis; // التحليل الرئيسي
  predictions: string[];      // التوقعات المستقبلية
  spiritualMessages: string[]; // الرسائل الروحية
  recommendations: string[];  // التوصيات العملية
}