# Copybuffer Quick Reference

## Installation

```bash
git clone https://github.com/dev31sanghvi/Copybuffer.git
cd Copybuffer
npm install
npm run build
npm link  # Optional: for global command
```

## Quick Start

```bash
# Start monitoring
copybuffer start

# View history
copybuffer list

# Search
copybuffer search "text"

# Get help
copybuffer --help
```

## All Commands

| Command | Description | Example |
|---------|-------------|---------|
| `start` | Start clipboard monitoring | `copybuffer start` |
| `stop` | Stop clipboard monitoring | `copybuffer stop` |
| `list` | List clipboard history | `copybuffer list --limit 20` |
| `search <query>` | Search clipboard history | `copybuffer search "github"` |
| `copy <id>` | Copy entry to clipboard | `copybuffer copy abc123-def-456` |
| `delete <id>` | Delete an entry | `copybuffer delete abc123-def-456` |
| `clear` | Clear all history | `copybuffer clear --yes` |
| `export <file>` | Export history | `copybuffer export backup.json` |
| `import <file>` | Import history | `copybuffer import backup.json` |
| `sync-to-gist` | Sync to GitHub Gist | `copybuffer sync-to-gist` |
| `sync-from-gist` | Sync from GitHub Gist | `copybuffer sync-from-gist` |
| `config` | Show configuration | `copybuffer config` |
| `config-set <key> <value>` | Set config value | `copybuffer config-set maxHistorySize 2000` |

## Configuration Options

```bash
# Max history entries
copybuffer config-set maxHistorySize 2000

# Data directory
copybuffer config-set dataDir /path/to/data

# Hotkeys
copybuffer config-set hotkeys.toggleHistory F11
copybuffer config-set hotkeys.search F12

# Gist sync
copybuffer config-set gist.enabled true
copybuffer config-set gist.token YOUR_TOKEN
```

## Files and Directories

| Path | Description |
|------|-------------|
| `~/.copybuffer/` | Data directory |
| `~/.copybuffer/config.json` | Configuration file |
| `~/.copybuffer/history.json` | Clipboard history |

## Hotkeys (Default)

| Key | Action |
|-----|--------|
| F9 | Toggle clipboard history |
| F10 | Search clipboard |

## Common Workflows

### Basic Usage
```bash
copybuffer start     # Start in one terminal
# Use your system normally, copy things
copybuffer list      # View in another terminal
```

### Search and Restore
```bash
copybuffer search "important text"
copybuffer copy <entry-id>
# Now paste with Ctrl+V
```

### Backup and Sync
```bash
# Local backup
copybuffer export ~/backups/clipboard-$(date +%Y%m%d).json

# Cloud sync
copybuffer sync-to-gist    # Upload
copybuffer sync-from-gist  # Download
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Command not found | Run `npm link` or use `node dist/cli.js` |
| Clipboard not working | Install `xclip`: `sudo apt-get install xclip` |
| Hotkeys not working | Check permissions or use CLI commands |
| Gist sync fails | Verify token has `gist` scope |

## Environment Variables

Create `.env` file (optional):
```bash
GITHUB_TOKEN=your_token_here
GIST_ID=your_gist_id_here
```

## API Quick Reference

```typescript
import { clipboardMonitor, searchManager, storageManager } from './dist/exports';

// Monitor
clipboardMonitor.start();
clipboardMonitor.stop();

// Search
searchManager.search({ query: 'text', limit: 10 });
searchManager.getRecent(20);

// Storage
storageManager.loadHistory();
storageManager.saveEntry(entry);
storageManager.deleteEntry(id);
storageManager.clearHistory();
```

## Tips

- Use aliases in `.bashrc`: `alias cb='copybuffer list'`
- Set up cron jobs for automated backups
- Use tags in custom entries for better organization
- Sync regularly if using multiple machines

## Links

- [Full Documentation](README.md)
- [Examples](EXAMPLES.md)
- [Contributing](CONTRIBUTING.md)
- [GitHub Repository](https://github.com/dev31sanghvi/Copybuffer)

## License

MIT License - Free to use and modify for personal use.
