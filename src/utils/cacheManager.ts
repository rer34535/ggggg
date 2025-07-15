/**
 * نظام إدارة التخزين المؤقت المتقدم
 * Advanced Cache Management System
 */

interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  totalItems: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;
  private defaultTTL: number;
  private stats = {
    hits: 0,
    misses: 0
  };

  constructor(maxSize: number = 1000, defaultTTL: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    
    // تنظيف دوري كل 5 دقائق
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  // إضافة عنصر للتخزين المؤقت
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const itemTTL = ttl || this.defaultTTL;
    
    // إزالة عناصر قديمة إذا وصلنا للحد الأقصى
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      value,
      timestamp: now,
      ttl: itemTTL,
      accessCount: 0,
      lastAccessed: now
    });
  }

  // الحصول على عنصر من التخزين المؤقت
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    const now = Date.now();
    
    // التحقق من انتهاء الصلاحية
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // تحديث إحصائيات الوصول
    item.accessCount++;
    item.lastAccessed = now;
    this.stats.hits++;
    
    return item.value;
  }

  // التحقق من وجود مفتاح
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;
    
    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // حذف عنصر
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // مسح جميع العناصر
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  // إزالة العنصر الأقل استخداماً (LRU)
  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // تنظيف العناصر المنتهية الصلاحية
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // الحصول على إحصائيات التخزين المؤقت
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    const missRate = totalRequests > 0 ? (this.stats.misses / totalRequests) * 100 : 0;
    
    // تقدير استخدام الذاكرة (تقريبي)
    let memoryUsage = 0;
    for (const [key, item] of this.cache.entries()) {
      memoryUsage += key.length * 2; // Unicode characters
      memoryUsage += JSON.stringify(item.value).length * 2;
      memoryUsage += 64; // metadata overhead
    }
    
    return {
      totalItems: this.cache.size,
      hitRate,
      missRate,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      memoryUsage
    };
  }

  // الحصول على العناصر الأكثر استخداماً
  getMostUsed(limit: number = 10): Array<{key: string, accessCount: number}> {
    const items = Array.from(this.cache.entries())
      .map(([key, item]) => ({ key, accessCount: item.accessCount }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
    
    return items;
  }

  // تصدير البيانات
  export(): Record<string, any> {
    const data: Record<string, any> = {};
    
    for (const [key, item] of this.cache.entries()) {
      data[key] = {
        value: item.value,
        timestamp: item.timestamp,
        ttl: item.ttl,
        accessCount: item.accessCount
      };
    }
    
    return data;
  }

  // استيراد البيانات
  import(data: Record<string, any>): void {
    const now = Date.now();
    
    for (const [key, item] of Object.entries(data)) {
      // التحقق من عدم انتهاء الصلاحية
      if (now - item.timestamp < item.ttl) {
        this.cache.set(key, {
          value: item.value,
          timestamp: item.timestamp,
          ttl: item.ttl,
          accessCount: item.accessCount || 0,
          lastAccessed: now
        });
      }
    }
  }
}

// إنشاء مدراء تخزين مؤقت متخصصين
export const apiCache = new CacheManager(500, 10 * 60 * 1000); // 10 دقائق للـ API
export const calculationCache = new CacheManager(1000, 30 * 60 * 1000); // 30 دقيقة للحسابات
export const uiCache = new CacheManager(200, 5 * 60 * 1000); // 5 دقائق للواجهة

// دالات مساعدة للاستخدام السهل
export const cacheApiResponse = (key: string, response: any, ttl?: number) => {
  apiCache.set(key, response, ttl);
};

export const getCachedApiResponse = (key: string) => {
  return apiCache.get(key);
};

export const cacheCalculation = (key: string, result: any, ttl?: number) => {
  calculationCache.set(key, result, ttl);
};

export const getCachedCalculation = (key: string) => {
  return calculationCache.get(key);
};

// مفاتيح التخزين المؤقت المعيارية
export const CacheKeys = {
  // مفاتيح API
  AI_RESPONSE: (model: string, prompt: string) => 
    `ai_response_${model}_${btoa(prompt).slice(0, 50)}`,
  
  // مفاتيح الحسابات
  GEMATRIA: (text: string, method: string) => 
    `gematria_${method}_${btoa(text)}`,
  
  JAFAR: (name: string, motherName: string, date: string) => 
    `jafar_${btoa(name)}_${btoa(motherName)}_${date}`,
  
  ZODIAC: (name: string, motherName: string, date: string) => 
    `zodiac_${btoa(name)}_${btoa(motherName)}_${date}`,
  
  // مفاتيح الواجهة
  USER_PREFERENCES: (userId: string) => `user_prefs_${userId}`,
  THEME_SETTINGS: 'theme_settings',
  LANGUAGE_SETTINGS: 'language_settings'
};

// تصدير إحصائيات شاملة
export const getAllCacheStats = () => {
  return {
    api: apiCache.getStats(),
    calculations: calculationCache.getStats(),
    ui: uiCache.getStats()
  };
};

// تنظيف شامل
export const clearAllCaches = () => {
  apiCache.clear();
  calculationCache.clear();
  uiCache.clear();
};

export default CacheManager;