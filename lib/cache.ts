"use client"

// Simple cache to avoid unnecessary API calls
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private TTL = 5 * 60 * 1000; // 5 minutes cache TTL

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if cache is expired
    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  has(key: string) {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check if cache is expired
    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const apiCache = new SimpleCache();
