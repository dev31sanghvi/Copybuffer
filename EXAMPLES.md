# Copybuffer Examples

This document provides examples of using Copybuffer in different scenarios.

## Basic Usage Examples

### 1. Start Clipboard Monitoring

```bash
# Start monitoring in foreground
copybuffer start

# The application will now monitor your clipboard and save any copied text
# Press Ctrl+C to stop
```

### 2. Working with Clipboard History

```bash
# Copy some text to clipboard (use Ctrl+C in any application)
# Then list your clipboard history
copybuffer list

# Output example:
# Showing 3 most recent clipboard entries:
# 
# 1. [10/29/2024, 2:53:46 PM] abc123-def-456
#    Hello, this is my first clipboard entry
#
# 2. [10/29/2024, 2:52:30 PM] xyz789-ghi-012
#    console.log("Some code I copied");
#
# 3. [10/29/2024, 2:51:15 PM] mno345-pqr-678
#    https://github.com/dev31sanghvi/Copybuffer
```

### 3. Search Your Clipboard History

```bash
# Search for text containing "github"
copybuffer search "github"

# Search with a limit
copybuffer search "console" --limit 5
```

### 4. Restore Previous Clipboard Entry

```bash
# First, list your history to get the entry ID
copybuffer list

# Then copy a specific entry back to clipboard
copybuffer copy abc123-def-456

# Now you can paste it anywhere with Ctrl+V
```

### 5. Managing History

```bash
# Delete a specific entry
copybuffer delete abc123-def-456

# Clear all history (with confirmation)
copybuffer clear --yes

# Export your history for backup
copybuffer export ~/backups/clipboard-backup-2024.json

# Import history from backup
copybuffer import ~/backups/clipboard-backup-2024.json
```

## Advanced Usage Examples

### 6. GitHub Gist Sync

```bash
# Step 1: Configure GitHub token
copybuffer config-set gist.enabled true
copybuffer config-set gist.token ghp_YOUR_GITHUB_TOKEN_HERE

# Step 2: Sync your clipboard to GitHub Gist
copybuffer sync-to-gist

# The first sync will create a new private gist
# Subsequent syncs will update the same gist

# Step 3: On another machine, pull your clipboard history
copybuffer config-set gist.enabled true
copybuffer config-set gist.token ghp_YOUR_GITHUB_TOKEN_HERE
copybuffer config-set gist.gistId YOUR_GIST_ID
copybuffer sync-from-gist
```

### 7. Customizing Configuration

```bash
# Increase history limit to 2000 entries
copybuffer config-set maxHistorySize 2000

# Change data directory
copybuffer config-set dataDir /path/to/custom/location

# Change hotkeys (F9 for history, F10 for search by default)
copybuffer config-set hotkeys.toggleHistory F11
copybuffer config-set hotkeys.search F12

# View your configuration
copybuffer config
```

## Practical Workflow Examples

### Developer Workflow

```bash
# 1. Start copybuffer in a terminal
copybuffer start

# 2. During coding, copy various snippets, URLs, commands

# 3. Later, search for that API endpoint you copied
copybuffer search "api.example.com"

# 4. Restore and paste it
copybuffer copy <entry-id>
```

### Content Writing Workflow

```bash
# 1. Start monitoring
copybuffer start

# 2. As you research and copy quotes, sources, references

# 3. List recent copies
copybuffer list --limit 20

# 4. Search for a specific quote
copybuffer search "important quote"

# 5. Restore it when needed
copybuffer copy <entry-id>
```

### Team Collaboration Workflow

```bash
# Developer A:
copybuffer start
# Copy important configs, commands, etc.
copybuffer sync-to-gist

# Developer B:
copybuffer config-set gist.token YOUR_TOKEN
copybuffer config-set gist.gistId SHARED_GIST_ID
copybuffer sync-from-gist
copybuffer list
# Now has access to shared clipboard history
```

## Programmatic Usage

### Using Copybuffer in Node.js Applications

```typescript
import { 
  clipboardMonitor, 
  searchManager, 
  storageManager,
  configManager 
} from 'copybuffer';

// Start monitoring
clipboardMonitor.start();

// Search clipboard
const results = searchManager.search({ 
  query: 'test', 
  limit: 10 
});
console.log('Found:', results);

// Get recent entries
const recent = searchManager.getRecent(20);
console.log('Recent:', recent);

// Get configuration
const config = configManager.getConfig();
console.log('Config:', config);

// Copy to clipboard
await clipboardMonitor.copyToClipboard('Hello World');

// Stop monitoring when done
clipboardMonitor.stop();
```

### Custom Clipboard Processing

```typescript
import { storageManager, ClipboardEntry } from 'copybuffer';

// Load history
const history = storageManager.loadHistory();

// Filter by date
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayEntries = history.filter(
  entry => entry.timestamp >= today.getTime()
);

// Save a custom entry
const customEntry: ClipboardEntry = {
  id: 'custom-123',
  content: 'Custom clipboard content',
  timestamp: Date.now(),
  type: 'text',
  tags: ['important', 'custom'],
};
storageManager.saveEntry(customEntry);

// Search by tag
const importantEntries = history.filter(
  entry => entry.tags?.includes('important')
);
```

## Tips and Tricks

### 1. Quick Access to Recent Copies

```bash
# Create an alias in your .bashrc or .zshrc
alias cb='copybuffer list'
alias cbs='copybuffer search'

# Now you can use:
cb           # List history
cbs "text"   # Search
```

### 2. Automated Backups

```bash
# Add to crontab for daily backups
0 0 * * * copybuffer export ~/backups/clipboard-$(date +\%Y\%m\%d).json

# Or use a simple script
#!/bin/bash
DATE=$(date +%Y%m%d)
copybuffer export ~/backups/clipboard-$DATE.json
echo "Clipboard backed up to ~/backups/clipboard-$DATE.json"
```

### 3. Sync Workflow

```bash
# Morning routine: Pull latest from gist
copybuffer sync-from-gist

# During work: Everything is saved automatically

# Evening routine: Push to gist
copybuffer sync-to-gist
```

### 4. Search Patterns

```bash
# Find URLs
copybuffer search "http"

# Find code snippets
copybuffer search "function"
copybuffer search "const"

# Find commands
copybuffer search "sudo"
copybuffer search "npm"

# Find file paths
copybuffer search "/home"
copybuffer search "~/Documents"
```

## Troubleshooting Examples

### Check if monitoring is working

```bash
# Start in one terminal
copybuffer start

# In another terminal, copy something and then:
copybuffer list

# You should see your recent copy
```

### Verify configuration

```bash
# Check config location and content
copybuffer config

# Check if data directory exists
ls -la ~/.copybuffer/

# Check history file
cat ~/.copybuffer/history.json
```

### Test gist sync

```bash
# Verify token is set
copybuffer config | grep token

# Try syncing
copybuffer sync-to-gist

# Check the gist on GitHub
# https://gist.github.com/YOUR_USERNAME
```
