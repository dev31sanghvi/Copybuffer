import * as fs from 'fs';
import * as path from 'path';
import { ClipboardEntry } from '../types';
import { configManager } from '../config/ConfigManager';

export class StorageManager {
  private dataDir: string;
  private historyFile: string;

  constructor() {
    this.dataDir = configManager.getConfig().dataDir;
    this.historyFile = path.join(this.dataDir, 'history.json');
    this.ensureDataDir();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  public saveEntry(entry: ClipboardEntry): void {
    const history = this.loadHistory();
    
    // Check if content already exists (avoid duplicates)
    const existingIndex = history.findIndex((e) => e.content === entry.content);
    if (existingIndex !== -1) {
      // Move to top by removing and re-adding
      history.splice(existingIndex, 1);
    }

    history.unshift(entry);

    // Limit history size
    const maxSize = configManager.getConfig().maxHistorySize;
    if (history.length > maxSize) {
      history.splice(maxSize);
    }

    this.saveHistory(history);
  }

  public loadHistory(): ClipboardEntry[] {
    try {
      if (fs.existsSync(this.historyFile)) {
        const data = fs.readFileSync(this.historyFile, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
    return [];
  }

  private saveHistory(history: ClipboardEntry[]): void {
    fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
  }

  public deleteEntry(id: string): boolean {
    const history = this.loadHistory();
    const filteredHistory = history.filter((entry) => entry.id !== id);
    
    if (filteredHistory.length < history.length) {
      this.saveHistory(filteredHistory);
      return true;
    }
    return false;
  }

  public clearHistory(): void {
    this.saveHistory([]);
  }

  public getEntry(id: string): ClipboardEntry | undefined {
    const history = this.loadHistory();
    return history.find((entry) => entry.id === id);
  }

  public exportHistory(outputPath: string): void {
    const history = this.loadHistory();
    fs.writeFileSync(outputPath, JSON.stringify(history, null, 2));
  }

  public importHistory(inputPath: string): void {
    try {
      const data = fs.readFileSync(inputPath, 'utf-8');
      const importedHistory: ClipboardEntry[] = JSON.parse(data);
      
      const existingHistory = this.loadHistory();
      const mergedHistory = [...importedHistory, ...existingHistory];
      
      // Remove duplicates based on content
      const uniqueHistory = mergedHistory.filter(
        (entry, index, self) =>
          index === self.findIndex((e) => e.content === entry.content)
      );

      this.saveHistory(uniqueHistory);
    } catch (error) {
      console.error('Error importing history:', error);
      throw error;
    }
  }
}

export const storageManager = new StorageManager();
