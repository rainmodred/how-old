import { LRUCache } from 'lru-cache';

const options = {
  max: 50,
};

export const cache = new LRUCache(options);

// cache.set('key', 'value')
// cache.get('key') // "value"
