import clipboardy from 'clipboardy';
import { ClipboardEntry } from '../types';
import { storageManager } from '../storage/StorageManager';
import { v4 as uuidv4 } from 'uuid';

export class ClipboardMonitor {
  private lastContent: string = '';
  private isMonitoring: boolean = false;
  private intervalId?: NodeJS.Timeout;
  private checkInterval: number = 1000; // Check every 1 second

  public start(): void {
    if (this.isMonitoring) {
      console.log('Monitor is already running');
      return;
    }

    this.isMonitoring = true;
    console.log('Clipboard monitor started');

    this.intervalId = setInterval(() => {
      this.checkClipboard();
    }, this.checkInterval);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isMonitoring = false;
    console.log('Clipboard monitor stopped');
  }

  private async checkClipboard(): Promise<void> {
    try {
      const currentContent = await clipboardy.read();

      if (currentContent && currentContent !== this.lastContent) {
        this.lastContent = currentContent;
        this.saveToHistory(currentContent);
      }
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
  }

  private saveToHistory(content: string): void {
    const entry: ClipboardEntry = {
      id: uuidv4(),
      content,
      timestamp: Date.now(),
      type: 'text',
    };

    storageManager.saveEntry(entry);
    console.log('Saved to clipboard history');
  }

  public async copyToClipboard(content: string): Promise<void> {
    try {
      await clipboardy.write(content);
      this.lastContent = content;
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Error writing to clipboard:', error);
      throw error;
    }
  }

  public isRunning(): boolean {
    return this.isMonitoring;
  }
}

export const clipboardMonitor = new ClipboardMonitor();
