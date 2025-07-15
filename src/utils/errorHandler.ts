/**
 * نظام معالجة الأخطاء الشامل
 * Comprehensive Error Handling System
 */

import { logError } from './performanceMonitor';

export enum ErrorType {
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  UI_ERROR = 'UI_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  context?: string;
  timestamp: Date;
  userMessage: string;
  actionable: boolean;
  retryable: boolean;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: AppError[] = [];
  private maxQueueSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // معالجة الخطأ الرئيسية
  handle(error: any, context: string = 'unknown'): AppError {
    const appError = this.categorizeError(error, context);
    
    // تسجيل الخطأ
    this.logError(appError);
    
    // إضافة للطابور
    this.addToQueue(appError);
    
    // إشعار المستخدم إذا لزم الأمر
    this.notifyUser(appError);
    
    return appError;
  }

  // تصنيف الخطأ
  private categorizeError(error: any, context: string): AppError {
    const timestamp = new Date();
    
    // أخطاء API
    if (this.isApiError(error)) {
      return {
        type: ErrorType.API_ERROR,
        message: error.message || 'API request failed',
        originalError: error,
        context,
        timestamp,
        userMessage: this.getApiErrorMessage(error),
        actionable: true,
        retryable: this.isRetryableApiError(error)
      };
    }
    
    // أخطاء الشبكة
    if (this.isNetworkError(error)) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network connection failed',
        originalError: error,
        context,
        timestamp,
        userMessage: 'مشكلة في الاتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى.',
        actionable: true,
        retryable: true
      };
    }
    
    // أخطاء التحقق
    if (this.isValidationError(error)) {
      return {
        type: ErrorType.VALIDATION_ERROR,
        message: error.message || 'Validation failed',
        originalError: error,
        context,
        timestamp,
        userMessage: this.getValidationErrorMessage(error),
        actionable: true,
        retryable: false
      };
    }
    
    // أخطاء الحسابات
    if (context.includes('calculation') || context.includes('gematria') || context.includes('jafar')) {
      return {
        type: ErrorType.CALCULATION_ERROR,
        message: error.message || 'Calculation failed',
        originalError: error,
        context,
        timestamp,
        userMessage: 'حدث خطأ في الحسابات. يرجى التحقق من البيانات المدخلة.',
        actionable: true,
        retryable: true
      };
    }
    
    // أخطاء واجهة المستخدم
    if (context.includes('ui') || context.includes('component')) {
      return {
        type: ErrorType.UI_ERROR,
        message: error.message || 'UI error occurred',
        originalError: error,
        context,
        timestamp,
        userMessage: 'حدث خطأ في الواجهة. يرجى إعادة تحميل الصفحة.',
        actionable: true,
        retryable: false
      };
    }
    
    // خطأ غير معروف
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || 'Unknown error occurred',
      originalError: error,
      context,
      timestamp,
      userMessage: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.',
      actionable: false,
      retryable: true
    };
  }

  // التحقق من نوع الخطأ
  private isApiError(error: any): boolean {
    return error?.response || 
           error?.status || 
           error?.message?.includes('API') ||
           error?.message?.includes('key') ||
           error?.message?.includes('rate limit');
  }

  private isNetworkError(error: any): boolean {
    return error?.code === 'NETWORK_ERROR' ||
           error?.message?.includes('network') ||
           error?.message?.includes('timeout') ||
           error?.message?.includes('connection') ||
           !navigator.onLine;
  }

  private isValidationError(error: any): boolean {
    return error?.name === 'ValidationError' ||
           error?.message?.includes('validation') ||
           error?.message?.includes('invalid') ||
           error?.message?.includes('required');
  }

  private isRetryableApiError(error: any): boolean {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error?.status) ||
           error?.message?.includes('timeout') ||
           error?.message?.includes('rate limit');
  }

  // رسائل خطأ API مخصصة
  private getApiErrorMessage(error: any): string {
    if (error?.message?.includes('API key') || error?.status === 401) {
      return 'مفتاح API غير صحيح أو منتهي الصلاحية. يرجى التحقق من المفتاح في الإعدادات.';
    }
    
    if (error?.message?.includes('rate limit') || error?.status === 429) {
      return 'تم تجاوز حد الاستخدام المسموح. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.';
    }
    
    if (error?.status === 404) {
      return 'الخدمة المطلوبة غير متاحة حالياً. يرجى المحاولة لاحقاً.';
    }
    
    if (error?.status >= 500) {
      return 'مشكلة في الخادم. يرجى المحاولة مرة أخرى بعد قليل.';
    }
    
    return 'حدث خطأ في الاتصال بالخدمة. يرجى المحاولة مرة أخرى.';
  }

  // رسائل خطأ التحقق مخصصة
  private getValidationErrorMessage(error: any): string {
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('arabic') || message.includes('عربي')) {
      return 'يرجى إدخال نص عربي صحيح فقط.';
    }
    
    if (message.includes('empty') || message.includes('required')) {
      return 'يرجى ملء جميع الحقول المطلوبة.';
    }
    
    if (message.includes('date')) {
      return 'يرجى إدخال تاريخ صحيح.';
    }
    
    if (message.includes('name')) {
      return 'يرجى إدخال اسم صحيح باللغة العربية.';
    }
    
    return 'البيانات المدخلة غير صحيحة. يرجى المراجعة والمحاولة مرة أخرى.';
  }

  // تسجيل الخطأ
  private logError(appError: AppError): void {
    const severity = this.getSeverity(appError);
    logError(appError.message, appError.context || 'unknown', severity);
    
    // طباعة تفاصيل إضافية في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${appError.type} in ${appError.context}`);
      console.error('Message:', appError.message);
      console.error('User Message:', appError.userMessage);
      console.error('Original Error:', appError.originalError);
      console.error('Timestamp:', appError.timestamp);
      console.groupEnd();
    }
  }

  // تحديد شدة الخطأ
  private getSeverity(appError: AppError): 'low' | 'medium' | 'high' | 'critical' {
    switch (appError.type) {
      case ErrorType.VALIDATION_ERROR:
        return 'low';
      case ErrorType.UI_ERROR:
        return 'medium';
      case ErrorType.NETWORK_ERROR:
        return 'medium';
      case ErrorType.API_ERROR:
        return 'high';
      case ErrorType.CALCULATION_ERROR:
        return 'high';
      case ErrorType.UNKNOWN_ERROR:
        return 'critical';
      default:
        return 'medium';
    }
  }

  // إضافة للطابور
  private addToQueue(appError: AppError): void {
    this.errorQueue.push(appError);
    
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  // إشعار المستخدم
  private notifyUser(appError: AppError): void {
    // يمكن تخصيص هذا حسب نظام الإشعارات المستخدم
    if (appError.actionable) {
      // عرض toast أو modal للمستخدم
      this.showUserNotification(appError);
    }
  }

  // عرض إشعار للمستخدم
  private showUserNotification(appError: AppError): void {
    // يمكن استخدام مكتبة toast أو نظام إشعارات مخصص
    console.warn('User Notification:', appError.userMessage);
    
    // مثال على استخدام alert بسيط (يمكن تحسينه)
    if (appError.type === ErrorType.UNKNOWN_ERROR) {
      alert(appError.userMessage);
    }
  }

  // الحصول على إحصائيات الأخطاء
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    recent: AppError[];
    retryableCount: number;
  } {
    const byType = {} as Record<ErrorType, number>;
    let retryableCount = 0;
    
    this.errorQueue.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
      if (error.retryable) retryableCount++;
    });
    
    return {
      total: this.errorQueue.length,
      byType,
      recent: this.errorQueue.slice(-10),
      retryableCount
    };
  }

  // مسح طابور الأخطاء
  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  // إعادة المحاولة للأخطاء القابلة للإعادة
  getRetryableErrors(): AppError[] {
    return this.errorQueue.filter(error => error.retryable);
  }
}

// إنشاء مثيل واحد
export const errorHandler = ErrorHandler.getInstance();

// دالات مساعدة للاستخدام السهل
export const handleError = (error: any, context?: string): AppError => {
  return errorHandler.handle(error, context);
};

export const getErrorStats = () => {
  return errorHandler.getErrorStats();
};

// React Error Boundary
export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{error: Error}> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleError(error, 'react-error-boundary');
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

// مكون خطأ افتراضي
const DefaultErrorFallback: React.FC<{error: Error}> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900/50 to-pink-900/50">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30 max-w-md w-full mx-4">
      <h2 className="text-2xl font-bold text-red-300 mb-4">حدث خطأ غير متوقع</h2>
      <p className="text-gray-300 mb-6">
        نعتذر، حدث خطأ في التطبيق. يرجى إعادة تحميل الصفحة أو الاتصال بالدعم إذا استمرت المشكلة.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
        >
          إعادة تحميل الصفحة
        </button>
        <details className="text-xs text-gray-400">
          <summary className="cursor-pointer">تفاصيل الخطأ (للمطورين)</summary>
          <pre className="mt-2 p-2 bg-black/20 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  </div>
);

export default ErrorHandler;