import { clipboardMonitor } from './clipboard/ClipboardMonitor';
import { hotkeyManager } from './hotkeys/HotkeyManager';
import { searchManager } from './search/SearchManager';

export function startClipboardManager(): void {
  console.log('Starting Copybuffer clipboard manager...');
  
  // Initialize hotkey manager
  hotkeyManager.initialize();
  
  // Register default hotkeys (simple key names since modifiers aren't supported in the way we'd like)
  hotkeyManager.registerHotkey('F9', () => {
    console.log('Hotkey triggered (F9): Show clipboard history');
    const recent = searchManager.getRecent(10);
    console.log('Recent clipboard entries:', recent.length);
  });
  
  hotkeyManager.registerHotkey('F10', () => {
    console.log('Hotkey triggered (F10): Search clipboard');
  });
  
  // Start clipboard monitoring
  clipboardMonitor.start();
  
  console.log('Copybuffer is now running. Press Ctrl+C to stop.');
  console.log('Hotkeys: F9 (show history), F10 (search)');
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down Copybuffer...');
    clipboardMonitor.stop();
    hotkeyManager.destroy();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nShutting down Copybuffer...');
    clipboardMonitor.stop();
    hotkeyManager.destroy();
    process.exit(0);
  });
}

// Start if run directly
if (require.main === module) {
  startClipboardManager();
}

export { clipboardMonitor, hotkeyManager, searchManager, storageManager } from './exports';

