#!/usr/bin/env node

import { Command } from 'commander';
import { clipboardMonitor } from './clipboard/ClipboardMonitor';
import { searchManager } from './search/SearchManager';
import { storageManager } from './storage/StorageManager';
import { gistSyncManager } from './sync/GistSyncManager';
import { configManager } from './config/ConfigManager';
import { hotkeyManager } from './hotkeys/HotkeyManager';

const program = new Command();

program
  .name('copybuffer')
  .description('Smart clipboard manager with history, search and sync')
  .version('1.0.0');

// Start monitoring command
program
  .command('start')
  .description('Start clipboard monitoring in background')
  .action(() => {
    console.log('Starting Copybuffer...');
    clipboardMonitor.start();
    hotkeyManager.initialize();
    
    // Keep the process running
    console.log('Press Ctrl+C to stop');
    process.on('SIGINT', () => {
      console.log('\nStopping Copybuffer...');
      clipboardMonitor.stop();
      hotkeyManager.destroy();
      process.exit(0);
    });
  });

// Stop monitoring command
program
  .command('stop')
  .description('Stop clipboard monitoring')
  .action(() => {
    clipboardMonitor.stop();
    hotkeyManager.destroy();
  });

// List history command
program
  .command('list')
  .description('List clipboard history')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .action((options) => {
    const limit = parseInt(options.limit);
    const recent = searchManager.getRecent(limit);
    
    if (recent.length === 0) {
      console.log('No clipboard history found');
      return;
    }

    console.log(`\nShowing ${recent.length} most recent clipboard entries:\n`);
    recent.forEach((entry, index) => {
      const date = new Date(entry.timestamp).toLocaleString();
      const preview = entry.content.substring(0, 100).replace(/\n/g, ' ');
      console.log(`${index + 1}. [${date}] ${entry.id}`);
      console.log(`   ${preview}${entry.content.length > 100 ? '...' : ''}\n`);
    });
  });

// Search command
program
  .command('search <query>')
  .description('Search clipboard history')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .action((query, options) => {
    const limit = parseInt(options.limit);
    const results = searchManager.search({ query, limit });
    
    if (results.length === 0) {
      console.log(`No results found for: ${query}`);
      return;
    }

    console.log(`\nFound ${results.length} matching entries:\n`);
    results.forEach((entry, index) => {
      const date = new Date(entry.timestamp).toLocaleString();
      const preview = entry.content.substring(0, 100).replace(/\n/g, ' ');
      console.log(`${index + 1}. [${date}] ${entry.id}`);
      console.log(`   ${preview}${entry.content.length > 100 ? '...' : ''}\n`);
    });
  });

// Copy command
program
  .command('copy <id>')
  .description('Copy an entry from history to clipboard')
  .action(async (id) => {
    const entry = storageManager.getEntry(id);
    
    if (!entry) {
      console.log(`Entry not found: ${id}`);
      return;
    }

    await clipboardMonitor.copyToClipboard(entry.content);
    console.log('Copied to clipboard');
  });

// Delete command
program
  .command('delete <id>')
  .description('Delete an entry from history')
  .action((id) => {
    const deleted = storageManager.deleteEntry(id);
    
    if (deleted) {
      console.log(`Deleted entry: ${id}`);
    } else {
      console.log(`Entry not found: ${id}`);
    }
  });

// Clear command
program
  .command('clear')
  .description('Clear all clipboard history')
  .option('-y, --yes', 'Skip confirmation')
  .action((options) => {
    if (!options.yes) {
      console.log('This will delete all clipboard history. Use --yes to confirm.');
      return;
    }

    storageManager.clearHistory();
    console.log('Clipboard history cleared');
  });

// Export command
program
  .command('export <file>')
  .description('Export clipboard history to a file')
  .action((file) => {
    try {
      storageManager.exportHistory(file);
      console.log(`Exported clipboard history to: ${file}`);
    } catch (error) {
      console.error('Error exporting history:', error);
    }
  });

// Import command
program
  .command('import <file>')
  .description('Import clipboard history from a file')
  .action((file) => {
    try {
      storageManager.importHistory(file);
      console.log(`Imported clipboard history from: ${file}`);
    } catch (error) {
      console.error('Error importing history:', error);
    }
  });

// Gist sync commands
program
  .command('sync-to-gist')
  .description('Sync clipboard history to GitHub Gist')
  .action(async () => {
    try {
      await gistSyncManager.syncToGist();
      console.log('Successfully synced to GitHub Gist');
    } catch (error) {
      const err = error as Error;
      console.error('Error syncing to gist:', err.message);
    }
  });

program
  .command('sync-from-gist')
  .description('Sync clipboard history from GitHub Gist')
  .action(async () => {
    try {
      await gistSyncManager.syncFromGist();
      console.log('Successfully synced from GitHub Gist');
    } catch (error) {
      const err = error as Error;
      console.error('Error syncing from gist:', err.message);
    }
  });

// Config commands
program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    const config = configManager.getConfig();
    console.log('\nCurrent configuration:\n');
    console.log(JSON.stringify(config, null, 2));
  });

program
  .command('config-set <key> <value>')
  .description('Set a configuration value (e.g., maxHistorySize, dataDir, gist.enabled)')
  .action((key, value) => {
    const config = configManager.getConfig();
    
    // Whitelist of allowed config paths to prevent prototype pollution
    const allowedPaths = [
      'dataDir',
      'maxHistorySize',
      'autoSave',
      'hotkeys.toggleHistory',
      'hotkeys.search',
      'gist.enabled',
      'gist.token',
      'gist.gistId',
    ];
    
    if (!allowedPaths.includes(key)) {
      console.error(
        `Error: Invalid config key. Allowed keys: ${allowedPaths.join(', ')}`
      );
      return;
    }
    
    // Safe key update using whitelist
    const keys = key.split('.');
    if (keys.length === 1) {
      // Top-level key
      (config as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      // Nested key (one level)
      if (!(config as any)[keys[0]]) {
        (config as any)[keys[0]] = {};
      }
      (config as any)[keys[0]][keys[1]] = value;
    } else {
      console.error('Error: Config key depth not supported');
      return;
    }
    
    configManager.saveConfig(config);
    console.log(`Set ${key} = ${value}`);
  });

program.parse(process.argv);
