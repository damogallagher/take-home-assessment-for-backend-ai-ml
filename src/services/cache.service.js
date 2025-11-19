class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value, ttl) {
    this.cache.set(key, { 
      data: value, 
      expiresAt: Date.now() + (ttl || this.defaultTTL) 
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data;
  }

  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0
      ? (this.hits / totalRequests).toFixed(2)
      : '0.00';

    return {
      size: this.size(),
      defaultTTL: this.defaultTTL,
      hits: this.hits,
      misses: this.misses,
      hitRate: hitRate,
      totalRequests: totalRequests,
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

export const cacheService = new CacheService();

export function destroyCacheService() {
  cacheService.destroy();
}
