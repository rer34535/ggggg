/**
 * نظام مراقبة الأداء المتقدم
 * Advanced Performance Monitoring System
 */

interface PerformanceMetric {
  timestamp: Date;
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

interface ErrorLog {
  timestamp: Date;
  error: string;
  context: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAgent?: string;
  url?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorLog[] = [];
  private maxMetrics = 1000;
  private maxErrors = 500;

  // بدء قياس العملية
  startOperation(operation: string): () => void {
    const startTime = performance.now();
    
    return (success: boolean = true, error?: string, metadata?: Record<string, any>) => {
      const duration = performance.now() - startTime;
      
      this.addMetric({
        timestamp: new Date(),
        operation,
        duration,
        success,
        error,
        metadata
      });
    };
  }

  // إضافة مقياس أداء
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // الاحتفاظ بحد أقصى من المقاييس
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  // تسجيل خطأ
  logError(error: string, context: string, severity: ErrorLog['severity'] = 'medium'): void {
    this.errors.push({
      timestamp: new Date(),
      error,
      context,
      severity,
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // الاحتفاظ بحد أقصى من الأخطاء
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // إرسال الأخطاء الحرجة فوراً
    if (severity === 'critical') {
      this.sendCriticalError(error, context);
    }
  }

  // إحصائيات الأداء
  getPerformanceStats(timeRange: number = 24 * 60 * 60 * 1000): {
    totalOperations: number;
    successRate: number;
    averageResponseTime: number;
    slowestOperations: PerformanceMetric[];
    operationBreakdown: Record<string, {count: number, avgTime: number, successRate: number}>;
  } {
    const cutoff = new Date(Date.now() - timeRange);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    const totalOperations = recentMetrics.length;
    const successfulOperations = recentMetrics.filter(m => m.success).length;
    const successRate = totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0;
    
    const totalTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0);
    const averageResponseTime = totalOperations > 0 ? totalTime / totalOperations : 0;

    // أبطأ العمليات
    const slowestOperations = recentMetrics
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    // تفصيل العمليات
    const operationBreakdown: Record<string, {count: number, avgTime: number, successRate: number}> = {};
    
    recentMetrics.forEach(metric => {
      if (!operationBreakdown[metric.operation]) {
        operationBreakdown[metric.operation] = {
          count: 0,
          avgTime: 0,
          successRate: 0
        };
      }
      
      const breakdown = operationBreakdown[metric.operation];
      breakdown.count++;
      breakdown.avgTime = (breakdown.avgTime * (breakdown.count - 1) + metric.duration) / breakdown.count;
    });

    // حساب معدل النجاح لكل عملية
    Object.keys(operationBreakdown).forEach(operation => {
      const operationMetrics = recentMetrics.filter(m => m.operation === operation);
      const successful = operationMetrics.filter(m => m.success).length;
      operationBreakdown[operation].successRate = (successful / operationMetrics.length) * 100;
    });

    return {
      totalOperations,
      successRate,
      averageResponseTime,
      slowestOperations,
      operationBreakdown
    };
  }

  // إحصائيات الأخطاء
  getErrorStats(timeRange: number = 24 * 60 * 60 * 1000): {
    totalErrors: number;
    errorsBySeverity: Record<string, number>;
    errorsByContext: Record<string, number>;
    recentErrors: ErrorLog[];
    errorTrends: Array<{hour: number, count: number}>;
  } {
    const cutoff = new Date(Date.now() - timeRange);
    const recentErrors = this.errors.filter(e => e.timestamp >= cutoff);

    const totalErrors = recentErrors.length;

    // تجميع الأخطاء حسب الشدة
    const errorsBySeverity: Record<string, number> = {};
    recentErrors.forEach(error => {
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    });

    // تجميع الأخطاء حسب السياق
    const errorsByContext: Record<string, number> = {};
    recentErrors.forEach(error => {
      errorsByContext[error.context] = (errorsByContext[error.context] || 0) + 1;
    });

    // اتجاهات الأخطاء بالساعة
    const errorTrends: Array<{hour: number, count: number}> = [];
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(Date.now() - (i + 1) * 60 * 60 * 1000);
      const hourEnd = new Date(Date.now() - i * 60 * 60 * 1000);
      const hourErrors = recentErrors.filter(e => 
        e.timestamp >= hourStart && e.timestamp < hourEnd
      ).length;
      
      errorTrends.unshift({hour: 23 - i, count: hourErrors});
    }

    return {
      totalErrors,
      errorsBySeverity,
      errorsByContext,
      recentErrors: recentErrors.slice(-20), // آخر 20 خطأ
      errorTrends
    };
  }

  // تقرير شامل
  generateReport(): {
    performance: ReturnType<typeof this.getPerformanceStats>;
    errors: ReturnType<typeof this.getErrorStats>;
    recommendations: string[];
    healthScore: number;
  } {
    const performance = this.getPerformanceStats();
    const errors = this.getErrorStats();

    // توصيات بناءً على البيانات
    const recommendations: string[] = [];
    
    if (performance.successRate < 95) {
      recommendations.push('معدل النجاح منخفض - يحتاج تحسين معالجة الأخطاء');
    }
    
    if (performance.averageResponseTime > 3000) {
      recommendations.push('زمن الاستجابة بطيء - يحتاج تحسين الأداء');
    }
    
    if (errors.totalErrors > 50) {
      recommendations.push('عدد الأخطاء مرتفع - يحتاج مراجعة شاملة');
    }

    if (errors.errorsBySeverity.critical > 0) {
      recommendations.push('توجد أخطاء حرجة - تحتاج إصلاح فوري');
    }

    // حساب نقاط الصحة العامة
    let healthScore = 100;
    healthScore -= Math.max(0, (95 - performance.successRate) * 2); // خصم للنجاح
    healthScore -= Math.max(0, (performance.averageResponseTime - 2000) / 100); // خصم للسرعة
    healthScore -= errors.errorsBySeverity.critical * 10; // خصم للأخطاء الحرجة
    healthScore -= errors.errorsBySeverity.high * 5; // خصم للأخطاء العالية
    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
      performance,
      errors,
      recommendations,
      healthScore
    };
  }

  // إرسال خطأ حرج
  private async sendCriticalError(error: string, context: string): Promise<void> {
    try {
      // هنا يمكن إرسال الخطأ لخدمة مراقبة خارجية
      console.error('CRITICAL ERROR:', { error, context, timestamp: new Date() });
      
      // يمكن إضافة إرسال لخدمة مثل Sentry أو LogRocket
      // await fetch('/api/critical-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ error, context, timestamp: new Date() })
      // });
    } catch (e) {
      console.error('Failed to send critical error:', e);
    }
  }

  // تصدير البيانات
  exportData(): {
    metrics: PerformanceMetric[];
    errors: ErrorLog[];
    exportTime: Date;
  } {
    return {
      metrics: [...this.metrics],
      errors: [...this.errors],
      exportTime: new Date()
    };
  }

  // مسح البيانات القديمة
  cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoff);
    this.errors = this.errors.filter(e => e.timestamp >= cutoff);
  }
}

// إنشاء مثيل واحد للتطبيق
export const performanceMonitor = new PerformanceMonitor();

// دالات مساعدة للاستخدام السهل
export const trackOperation = (operation: string) => {
  return performanceMonitor.startOperation(operation);
};

export const logError = (error: string, context: string, severity?: ErrorLog['severity']) => {
  performanceMonitor.logError(error, context, severity);
};

export const getHealthReport = () => {
  return performanceMonitor.generateReport();
};

// تنظيف تلقائي كل ساعة
setInterval(() => {
  performanceMonitor.cleanup();
}, 60 * 60 * 1000);