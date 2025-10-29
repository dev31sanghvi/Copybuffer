import { ClipboardEntry, SearchOptions } from '../types';
import { storageManager } from '../storage/StorageManager';

export class SearchManager {
  public search(options: SearchOptions): ClipboardEntry[] {
    const history = storageManager.loadHistory();
    let results = history;

    // Filter by query
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter((entry) =>
        entry.content.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((entry) =>
        entry.tags?.some((tag) => options.tags!.includes(tag))
      );
    }

    // Filter by date range
    if (options.dateFrom) {
      results = results.filter(
        (entry) => entry.timestamp >= options.dateFrom!.getTime()
      );
    }

    if (options.dateTo) {
      results = results.filter(
        (entry) => entry.timestamp <= options.dateTo!.getTime()
      );
    }

    // Limit results
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  public searchByPattern(pattern: RegExp, limit?: number): ClipboardEntry[] {
    const history = storageManager.loadHistory();
    const results = history.filter((entry) => pattern.test(entry.content));
    
    return limit ? results.slice(0, limit) : results;
  }

  public getRecent(limit: number = 10): ClipboardEntry[] {
    const history = storageManager.loadHistory();
    return history.slice(0, limit);
  }

  public getByTag(tag: string): ClipboardEntry[] {
    const history = storageManager.loadHistory();
    return history.filter((entry) => entry.tags?.includes(tag));
  }
}

export const searchManager = new SearchManager();
