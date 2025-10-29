import { GlobalKeyboardListener } from 'node-global-key-listener';

export class HotkeyManager {
  private listener?: GlobalKeyboardListener;
  private callbacks: Map<string, () => void> = new Map();

  public initialize(): void {
    try {
      this.listener = new GlobalKeyboardListener();
      console.log('Hotkey manager initialized');
      this.setupDefaultHotkeys();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Note: Hotkey manager could not be initialized -', errorMessage);
      console.log('Hotkeys are disabled, but clipboard monitoring will continue to work normally.');
      console.log('For hotkey support, ensure you are running on a supported OS with proper permissions.');
    }
  }

  private setupDefaultHotkeys(): void {
    if (!this.listener) return;
    
    this.listener.addListener((e) => {
      if (e.state === 'DOWN' && e.name) {
        const callback = this.callbacks.get(e.name);
        if (callback) {
          callback();
        }
      }
    });
  }

  public registerHotkey(hotkey: string, callback: () => void): void {
    this.callbacks.set(hotkey, callback);
    console.log(`Registered hotkey: ${hotkey}`);
  }

  public unregisterHotkey(hotkey: string): void {
    this.callbacks.delete(hotkey);
    console.log(`Unregistered hotkey: ${hotkey}`);
  }

  public destroy(): void {
    if (this.listener) {
      this.listener.kill();
      this.listener = undefined;
    }
    this.callbacks.clear();
    console.log('Hotkey manager destroyed');
  }
}

export const hotkeyManager = new HotkeyManager();

