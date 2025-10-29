// Map key names to key codes
const KEY_MAP: Record<string, number> = {
  F1: 59,
  F2: 60,
  F3: 61,
  F4: 62,
  F5: 63,
  F6: 64,
  F7: 65,
  F8: 66,
  F9: 67,
  F10: 68,
  F11: 87,
  F12: 88,
};

export class HotkeyManager {
  private isInitialized = false;
  private callbacks: Map<number, () => void> = new Map();
  private uIOhook: any = null;

  public initialize(): void {
    // Check if we're on Linux and DISPLAY is not set
    if (process.platform === 'linux' && !process.env.DISPLAY) {
      console.log('Note: Hotkey manager requires X11 display server.');
      console.log('Hotkeys are disabled, but clipboard monitoring will continue to work normally.');
      console.log('Tip: Ensure you are running in a graphical environment (not headless).');
      return;
    }

    try {
      // Dynamically import uiohook-napi only when needed to avoid initialization errors
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { uIOhook } = require('uiohook-napi');
      this.uIOhook = uIOhook;
      
      // Set up the keyboard event listener
      this.uIOhook.on('keydown', (e: { keycode: number }) => {
        const callback = this.callbacks.get(e.keycode);
        if (callback) {
          callback();
        }
      });

      // Start listening for keyboard events
      // Note: This may fail if X11 display is not available or permissions are insufficient
      this.uIOhook.start();
      this.isInitialized = true;
      console.log('Hotkey manager initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Note: Hotkey manager could not be initialized -', errorMessage);
      console.log('Hotkeys are disabled, but clipboard monitoring will continue to work normally.');
      console.log('Tip: On Linux, ensure X11 is running and you have proper permissions.');
    }
  }

  public registerHotkey(hotkey: string, callback: () => void): void {
    if (!this.isInitialized) {
      // Silently skip if not initialized - hotkeys are optional
      return;
    }
    
    const keycode = KEY_MAP[hotkey];
    if (!keycode) {
      console.log(`Warning: Unknown hotkey "${hotkey}". Supported keys: ${Object.keys(KEY_MAP).join(', ')}`);
      return;
    }
    
    this.callbacks.set(keycode, callback);
    console.log(`Registered hotkey: ${hotkey}`);
  }

  public unregisterHotkey(hotkey: string): void {
    const keycode = KEY_MAP[hotkey];
    if (!keycode) {
      return;
    }
    
    this.callbacks.delete(keycode);
    console.log(`Unregistered hotkey: ${hotkey}`);
  }

  public destroy(): void {
    if (this.isInitialized && this.uIOhook) {
      try {
        this.uIOhook.stop();
        this.isInitialized = false;
      } catch (error) {
        // Ignore errors during shutdown
      }
    }
    this.callbacks.clear();
    if (this.isInitialized || this.callbacks.size > 0) {
      console.log('Hotkey manager destroyed');
    }
  }
}

export const hotkeyManager = new HotkeyManager();

