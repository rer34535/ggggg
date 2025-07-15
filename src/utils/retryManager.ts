/**
 * نظام إدارة إعادة المحاولة المتقدم
 * Advanced Retry Management System
 */

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
  retryCondition?: (error: any) => boolean;
}

interface RetryAttempt {
  attempt: number;
  timestamp: Date;
  error: any;
  delay: number;
}

interface RetryResult<T> {
  success: boolean;
  result?: T;
  error?: any;
  attempts: RetryAttempt[];
  totalTime: number;
}

class RetryManager {
  private defaultConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2,
    jitter: true,
    retryCondition: this.defaultRetryCondition
  };

  // شرط إعادة المحاولة الافتراضي
  private defaultRetryCondition(error: any): boolean {
    // إعادة المحاولة للأخطاء المؤقتة
    if (error?.status) {
      const retryableStatuses = [408, 429, 500, 502, 503, 504];
      return retryableStatuses.includes(error.status);
    }
    
    if (error?.message) {
      const retryableMessages = [
        'timeout',
        'network',
        'connection',
        'rate limit',
        'server error',
        'service unavailable'
      ];
      
      const message = error.message.toLowerCase();
      return retryableMessages.some(msg => message.includes(msg));
    }
    
    return false;
  }

  // تنفيذ العملية مع إعادة المحاولة
  async execute<T>(
    operation: () => Promise<T>,
    config?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const attempts: RetryAttempt[] = [];
    const startTime = Date.now();
    
    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        const result = await operation();
        
        return {
          success: true,
          result,
          attempts,
          totalTime: Date.now() - startTime
        };
        
      } catch (error) {
        const attemptRecord: RetryAttempt = {
          attempt,
          timestamp: new Date(),
          error,
          delay: 0
        };
        
        attempts.push(attemptRecord);
        
        // التحقق من إمكانية إعادة المحاولة
        const shouldRetry = finalConfig.retryCondition!(error);
        const isLastAttempt = attempt === finalConfig.maxAttempts;
        
        if (!shouldRetry || isLastAttempt) {
          return {
            success: false,
            error,
            attempts,
            totalTime: Date.now() - startTime
          };
        }
        
        // حساب تأخير إعادة المحاولة
        const delay = this.calculateDelay(attempt, finalConfig);
        attemptRecord.delay = delay;
        
        // انتظار قبل إعادة المحاولة
        await this.sleep(delay);
      }
    }
    
    // هذا لن يحدث أبداً، لكن TypeScript يتطلبه
    throw new Error('Unexpected end of retry loop');
  }

  // حساب تأخير إعادة المحاولة
  private calculateDelay(attempt: number, config: RetryConfig): number {
    // Exponential backoff
    let delay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
    
    // تطبيق الحد الأقصى
    delay = Math.min(delay, config.maxDelay);
    
    // إضافة jitter لتجنب thundering herd
    if (config.jitter) {
      const jitterAmount = delay * 0.1; // 10% jitter
      delay += (Math.random() - 0.5) * 2 * jitterAmount;
    }
    
    return Math.max(delay, 0);
  }

  // دالة النوم
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // إعادة محاولة مخصصة للـ API
  async retryApiCall<T>(
    apiCall: () => Promise<T>,
    options?: {
      maxAttempts?: number;
      baseDelay?: number;
      includeNetworkErrors?: boolean;
    }
  ): Promise<RetryResult<T>> {
    const config: Partial<RetryConfig> = {
      maxAttempts: options?.maxAttempts || 3,
      baseDelay: options?.baseDelay || 2000,
      maxDelay: 15000,
      backoffFactor: 1.5,
      jitter: true,
      retryCondition: (error) => {
        // أخطاء API قابلة للإعادة
        if (error?.status) {
          const retryableStatuses = [408, 429, 500, 502, 503, 504];
          return retryableStatuses.includes(error.status);
        }
        
        // أخطاء الشبكة إذا كانت مطلوبة
        if (options?.includeNetworkErrors && error?.message) {
          const networkErrors = ['network', 'timeout', 'connection'];
          return networkErrors.some(err => 
            error.message.toLowerCase().includes(err)
          );
        }
        
        return false;
      }
    };
    
    return this.execute(apiCall, config);
  }

  // إعادة محاولة مخصصة للحسابات
  async retryCalculation<T>(
    calculation: () => Promise<T>,
    options?: {
      maxAttempts?: number;
      fastRetry?: boolean;
    }
  ): Promise<RetryResult<T>> {
    const config: Partial<RetryConfig> = {
      maxAttempts: options?.maxAttempts || 2,
      baseDelay: options?.fastRetry ? 500 : 1000,
      maxDelay: 5000,
      backoffFactor: 1.2,
      jitter: false,
      retryCondition: (error) => {
        // إعادة المحاولة للأخطاء المؤقتة فقط
        const retryableErrors = [
          'timeout',
          'memory',
          'resource',
          'temporary'
        ];
        
        if (error?.message) {
          const message = error.message.toLowerCase();
          return retryableErrors.some(err => message.includes(err));
        }
        
        return false;
      }
    };
    
    return this.execute(calculation, config);
  }

  // إعادة محاولة مع circuit breaker
  async retryWithCircuitBreaker<T>(
    operation: () => Promise<T>,
    circuitBreakerKey: string,
    config?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    // التحقق من حالة circuit breaker
    if (this.isCircuitOpen(circuitBreakerKey)) {
      throw new Error(`Circuit breaker is open for ${circuitBreakerKey}`);
    }
    
    try {
      const result = await this.execute(operation, config);
      
      if (result.success) {
        this.recordSuccess(circuitBreakerKey);
      } else {
        this.recordFailure(circuitBreakerKey);
      }
      
      return result;
      
    } catch (error) {
      this.recordFailure(circuitBreakerKey);
      throw error;
    }
  }

  // إدارة Circuit Breaker
  private circuitStates = new Map<string, {
    failures: number;
    lastFailure: Date;
    state: 'closed' | 'open' | 'half-open';
  }>();

  private isCircuitOpen(key: string): boolean {
    const state = this.circuitStates.get(key);
    if (!state) return false;
    
    const now = Date.now();
    const timeSinceLastFailure = now - state.lastFailure.getTime();
    
    // إعادة فتح الدائرة بعد 60 ثانية
    if (state.state === 'open' && timeSinceLastFailure > 60000) {
      state.state = 'half-open';
      return false;
    }
    
    return state.state === 'open';
  }

  private recordSuccess(key: string): void {
    const state = this.circuitStates.get(key);
    if (state) {
      state.failures = 0;
      state.state = 'closed';
    }
  }

  private recordFailure(key: string): void {
    let state = this.circuitStates.get(key);
    if (!state) {
      state = { failures: 0, lastFailure: new Date(), state: 'closed' };
      this.circuitStates.set(key, state);
    }
    
    state.failures++;
    state.lastFailure = new Date();
    
    // فتح الدائرة بعد 5 فشل متتالي
    if (state.failures >= 5) {
      state.state = 'open';
    }
  }

  // إحصائيات إعادة المحاولة
  getCircuitBreakerStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [key, state] of this.circuitStates.entries()) {
      stats[key] = {
        failures: state.failures,
        lastFailure: state.lastFailure,
        state: state.state,
        isOpen: this.isCircuitOpen(key)
      };
    }
    
    return stats;
  }

  // إعادة تعيين circuit breaker
  resetCircuitBreaker(key: string): void {
    this.circuitStates.delete(key);
  }

  // إعادة تعيين جميع circuit breakers
  resetAllCircuitBreakers(): void {
    this.circuitStates.clear();
  }
}

// إنشاء مثيل واحد
export const retryManager = new RetryManager();

// دالات مساعدة للاستخدام السهل
export const retryApiCall = <T>(
  apiCall: () => Promise<T>,
  options?: Parameters<typeof retryManager.retryApiCall>[1]
) => {
  return retryManager.retryApiCall(apiCall, options);
};

export const retryCalculation = <T>(
  calculation: () => Promise<T>,
  options?: Parameters<typeof retryManager.retryCalculation>[1]
) => {
  return retryManager.retryCalculation(calculation, options);
};

export const retryWithBackoff = <T>(
  operation: () => Promise<T>,
  config?: Partial<RetryConfig>
) => {
  return retryManager.execute(operation, config);
};

export default RetryManager;