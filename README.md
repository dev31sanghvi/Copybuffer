# Copybuffer

A Smart Clipboard Manager for Ubuntu using TypeScript/Node.js that stores clipboard history in JSON files (no database needed), with hotkeys, search, and GitHub Gist sync.

## Features

- 📋 **Clipboard History**: Automatically saves clipboard content to JSON files
- 🔍 **Search**: Search through your clipboard history with powerful query options
- ⌨️ **Hotkeys**: Global keyboard shortcuts for quick access (Ctrl+Shift+V, Ctrl+Shift+F)
- 🔄 **GitHub Gist Sync**: Backup and sync your clipboard history to GitHub Gist
- 💾 **JSON Storage**: All data stored in simple JSON files - no database required
- 🚀 **CLI Interface**: Full command-line interface for all operations
- 🔒 **Privacy**: All data stored locally, sync is optional

## Installation

### Prerequisites

- Node.js 18+ and npm
- Ubuntu/Linux (for clipboard and hotkey support)

### Install from source

```bash
# Clone the repository
git clone https://github.com/dev31sanghvi/Copybuffer.git
cd Copybuffer

# Install dependencies
npm install

# Build the project
npm run build

# Optional: Install globally
npm link
```

## Usage

### Start Clipboard Monitoring

Start the clipboard monitor to automatically save clipboard history:

```bash
copybuffer start
```

This will run in the foreground. Press Ctrl+C to stop.

### List Clipboard History

View your recent clipboard entries:

```bash
# Show last 10 entries (default)
copybuffer list

# Show last 20 entries
copybuffer list --limit 20
```

### Search Clipboard History

Search for specific content:

```bash
copybuffer search "your search query"

# Limit results
copybuffer search "query" --limit 5
```

### Copy from History

Copy a previous clipboard entry back to your clipboard:

```bash
copybuffer copy <entry-id>
```

### Delete Entry

Remove an entry from history:

```bash
copybuffer delete <entry-id>
```

### Clear All History

Clear all clipboard history:

```bash
# With confirmation
copybuffer clear --yes
```

### Export/Import History

Export your clipboard history:

```bash
copybuffer export ~/clipboard-backup.json
```

Import clipboard history:

```bash
copybuffer import ~/clipboard-backup.json
```

### GitHub Gist Sync

#### Setup Gist Sync

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `gist` scope
   
2. Configure Copybuffer:

```bash
# Enable gist sync
copybuffer config-set gist.enabled true

# Set your GitHub token
copybuffer config-set gist.token YOUR_GITHUB_TOKEN
```

#### Sync to Gist

Upload your clipboard history to GitHub Gist:

```bash
copybuffer sync-to-gist
```

#### Sync from Gist

Download and merge clipboard history from GitHub Gist:

```bash
copybuffer sync-from-gist
```

### Configuration

View current configuration:

```bash
copybuffer config
```

Set configuration values:

```bash
# Set max history size
copybuffer config-set maxHistorySize 2000

# Set data directory
copybuffer config-set dataDir /path/to/data

# Configure hotkeys (use simple keys like F9, F10)
copybuffer config-set hotkeys.toggleHistory "F11"
```

## Configuration File

Configuration is stored at `~/.copybuffer/config.json`:

```json
{
  "dataDir": "~/.copybuffer",
  "maxHistorySize": 1000,
  "autoSave": true,
  "hotkeys": {
    "toggleHistory": "F9",
    "search": "F10"
  },
  "gist": {
    "enabled": false,
    "token": "",
    "gistId": ""
  }
}
```

## Data Storage

All clipboard data is stored in JSON format at `~/.copybuffer/`:

- `config.json` - Configuration settings
- `history.json` - Clipboard history

### History Entry Format

```json
{
  "id": "unique-uuid",
  "content": "clipboard content",
  "timestamp": 1234567890123,
  "type": "text",
  "source": "optional-source",
  "tags": ["optional", "tags"]
}
```

## Hotkeys

Default hotkeys (configurable):

- `F9` - Toggle clipboard history
- `F10` - Search clipboard

**Note**: The current implementation uses simple key bindings (like F9, F10) due to limitations in cross-platform global hotkey support. Complex key combinations (like Ctrl+Shift+V) are not currently supported but may be added in future versions. Hotkeys require proper permissions on Ubuntu.

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## API Usage

You can also use Copybuffer programmatically:

```typescript
import { clipboardMonitor, searchManager, storageManager } from 'copybuffer';

// Start monitoring
clipboardMonitor.start();

// Search clipboard
const results = searchManager.search({ query: 'test', limit: 10 });

// Get recent entries
const recent = searchManager.getRecent(20);

// Load history
const history = storageManager.loadHistory();
```

## Troubleshooting

### Clipboard monitoring not working

Ensure you have the required permissions for clipboard access:

```bash
# Install xclip if needed
sudo apt-get install xclip
```

### Hotkeys not working

Hotkeys require proper system permissions. On some Ubuntu configurations, you may need to:

1. Run with sudo (not recommended for regular use)
2. Configure your desktop environment to allow global hotkeys
3. Use the CLI commands instead

### Gist sync fails

- Verify your GitHub token has the `gist` scope
- Check your internet connection
- Ensure the token is correctly set in config

## Privacy & Security

- All clipboard data is stored locally by default
- GitHub Gist sync is optional and disabled by default
- Use private gists (default) to keep your data secure
- Your GitHub token is stored in plain text in the config file - keep it secure
- Consider using encryption for sensitive clipboard data

## Contributing

This project is for personal use, but feel free to fork and modify for your own needs!

## License

MIT License - See LICENSE file for details

## Author

Created for personal use by Ubuntu developers who want a simple, powerful clipboard manager.

## Roadmap

- [ ] Add clipboard type detection (images, files, etc.)
- [ ] Implement clipboard categories/tags
- [ ] Add GUI interface
- [ ] Support for encrypted clipboard entries
- [ ] Cross-platform support (macOS, Windows)
- [ ] Plugin system for custom clipboard processors
