# Copybuffer Setup Guide

This guide will help you install and set up Copybuffer on your Ubuntu system with minimal friction.

## System Requirements

- **Operating System**: Ubuntu 18.04 or later (also works on other Linux distributions)
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **System Package**: xclip (for clipboard access)

## Step-by-Step Installation

### Step 1: Install Node.js and npm

If you don't have Node.js installed or need to upgrade:

```bash
# Check your current version
node --version
npm --version

# If Node.js is not installed or version is below 18.x, install it:

# Option 1: Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Option 2: Using nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

### Step 2: Install System Dependencies

Copybuffer requires `xclip` for clipboard access on Linux:

```bash
# Update package list
sudo apt-get update

# Install xclip
sudo apt-get install -y xclip

# Verify installation
xclip -version
```

### Step 3: Clone the Repository

```bash
# Navigate to your preferred directory
cd ~

# Clone the repository
git clone https://github.com/dev31sanghvi/Copybuffer.git

# Enter the directory
cd Copybuffer

# Verify you're in the right place
ls -la
# You should see: package.json, src/, README.md, etc.
```

### Step 4: Install Dependencies

```bash
# Install all npm dependencies
npm install

# This will download and install all required packages
# It may take 1-2 minutes depending on your internet speed
```

**Expected output:**
```
added 157 packages, and audited 158 packages in 18s
found 0 vulnerabilities
```

### Step 5: Build the Project

```bash
# Compile TypeScript to JavaScript
npm run build

# This creates the dist/ directory with compiled code
```

**Expected output:**
```
> copybuffer@1.0.0 build
> tsc
```

**Verify the build:**
```bash
ls dist/
# You should see: cli.js, index.js, and other compiled files
```

### Step 6: Test the Installation

Before installing globally, test that everything works:

```bash
# Test the help command
node dist/cli.js --help

# You should see the list of available commands
```

**Expected output:**
```
Usage: copybuffer [options] [command]

Smart clipboard manager with history, search and sync

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  start                     Start clipboard monitoring in background
  stop                      Stop clipboard monitoring
  list [options]            List clipboard history
  ...
```

### Step 7: Install Globally (Optional but Recommended)

This allows you to use `copybuffer` command from anywhere:

```bash
# Install globally using npm link
sudo npm link

# Now you can use 'copybuffer' from any directory
copybuffer --help
```

**Alternative without sudo:**
```bash
# If you don't want to use sudo, you can configure npm to install globally without root:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Now install without sudo
npm link
```

### Step 8: Verify Installation

```bash
# Check version
copybuffer --version

# View configuration
copybuffer config

# Try listing (should be empty initially)
copybuffer list
```

## Quick Start

Once installed, here's how to start using Copybuffer:

### 1. Start the Clipboard Monitor

Open a terminal and run:

```bash
copybuffer start
```

**What you'll see:**
```
Starting Copybuffer...
Clipboard monitor started
Hotkey manager initialized
Copybuffer is now running. Press Ctrl+C to stop.
Hotkeys: F9 (show history), F10 (search)
```

Keep this terminal open while using Copybuffer. You can minimize it.

### 2. Copy Some Text

Go to any application and copy some text (Ctrl+C). The text will automatically be saved to your clipboard history.

### 3. View Your History

Open a new terminal (keep the monitor running) and run:

```bash
copybuffer list
```

You should see your copied text listed with timestamps.

### 4. Search Your History

```bash
copybuffer search "text you're looking for"
```

### 5. Stop the Monitor

In the terminal where the monitor is running, press `Ctrl+C`.

## Running in Background

To run Copybuffer in the background without keeping a terminal open:

### Using nohup

```bash
# Start in background
nohup copybuffer start > ~/.copybuffer/copybuffer.log 2>&1 &

# Check if it's running
ps aux | grep copybuffer

# To stop it
pkill -f "copybuffer start"
```

### Using systemd (Recommended for permanent installation)

Create a systemd service file:

```bash
# Create service file
sudo nano /etc/systemd/system/copybuffer.service
```

Add this content (replace `YOUR_USERNAME` with your actual username):

```ini
[Unit]
Description=Copybuffer Clipboard Manager
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/home/YOUR_USERNAME/Copybuffer
ExecStart=/usr/local/bin/node /home/YOUR_USERNAME/Copybuffer/dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable copybuffer

# Start the service
sudo systemctl start copybuffer

# Check status
sudo systemctl status copybuffer

# View logs
sudo journalctl -u copybuffer -f
```

To stop the service:

```bash
sudo systemctl stop copybuffer
```

## Troubleshooting Common Issues

### Issue 1: "command not found: copybuffer"

**Solution:**
```bash
# If you used npm link, try:
sudo npm link

# Or use the full path:
node ~/Copybuffer/dist/cli.js --help

# Or add an alias to ~/.bashrc:
echo 'alias copybuffer="node ~/Copybuffer/dist/cli.js"' >> ~/.bashrc
source ~/.bashrc
```

### Issue 2: "Cannot find module 'clipboardy'"

**Solution:**
```bash
# Reinstall dependencies
cd ~/Copybuffer
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 3: Clipboard monitoring not working

**Solution:**
```bash
# Ensure xclip is installed
sudo apt-get install -y xclip

# Test xclip
echo "test" | xclip -selection clipboard
xclip -selection clipboard -o
# Should output: test

# If xclip works but copybuffer doesn't, check permissions
ls -la ~/.copybuffer/
```

### Issue 4: "Error: EACCES: permission denied"

**Solution:**
```bash
# Fix permissions on .copybuffer directory
mkdir -p ~/.copybuffer
chmod 755 ~/.copybuffer

# Or remove and let copybuffer recreate it
rm -rf ~/.copybuffer
```

### Issue 5: Node.js version too old

**Solution:**
```bash
# Check version
node --version

# If below v18, upgrade:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
```

### Issue 6: Hotkeys not working

**Note:** Hotkeys require special permissions and may not work in all environments.

**Solutions:**
- Use the CLI commands instead (`copybuffer list`, `copybuffer search`)
- Run with appropriate permissions (not recommended for regular use)
- Some desktop environments block global hotkeys by default

### Issue 7: Build errors during `npm run build`

**Solution:**
```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules dist
npm install
npm run build

# If still failing, check TypeScript version
npx tsc --version
```

## Updating Copybuffer

To update to the latest version:

```bash
# Navigate to the Copybuffer directory
cd ~/Copybuffer

# Pull latest changes
git pull origin main

# Reinstall dependencies (if package.json changed)
npm install

# Rebuild
npm run build

# If installed globally, relink
sudo npm link
```

## Uninstalling

To completely remove Copybuffer:

```bash
# If installed as systemd service, stop and disable it
sudo systemctl stop copybuffer
sudo systemctl disable copybuffer
sudo rm /etc/systemd/system/copybuffer.service
sudo systemctl daemon-reload

# Unlink global command
sudo npm unlink -g copybuffer

# Remove the repository
rm -rf ~/Copybuffer

# Remove data directory (optional, this deletes your clipboard history)
rm -rf ~/.copybuffer

# Remove alias if you added one
# Edit ~/.bashrc and remove the copybuffer alias line
```

## Configuration

### Basic Configuration

View current configuration:
```bash
copybuffer config
```

Change settings:
```bash
# Increase history size
copybuffer config-set maxHistorySize 2000

# Change data directory
copybuffer config-set dataDir /custom/path

# Change hotkeys
copybuffer config-set hotkeys.toggleHistory F11
```

### GitHub Gist Setup (Optional)

To sync your clipboard across devices:

1. **Create a GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "Copybuffer"
   - Select the `gist` scope
   - Click "Generate token"
   - Copy the token (you won't see it again!)

2. **Configure Copybuffer:**
   ```bash
   copybuffer config-set gist.enabled true
   copybuffer config-set gist.token YOUR_TOKEN_HERE
   ```

3. **Sync your clipboard:**
   ```bash
   # Upload to GitHub
   copybuffer sync-to-gist

   # Download from GitHub (on another machine)
   copybuffer sync-from-gist
   ```

## Testing Your Installation

Run the included test suite to verify everything works:

```bash
cd ~/Copybuffer
./test.sh
```

**Expected output:**
```
======================================
   Copybuffer Comprehensive Test
======================================
...
Tests Passed: 26
Tests Failed: 0

All tests passed!
```

Run the demo to see features in action:

```bash
./demo.sh
```

## Getting Help

- **Documentation**: See [README.md](README.md) for full documentation
- **Examples**: See [EXAMPLES.md](EXAMPLES.md) for usage examples
- **Quick Reference**: See [QUICKSTART.md](QUICKSTART.md) for command reference
- **Issues**: Report bugs at https://github.com/dev31sanghvi/Copybuffer/issues

## Next Steps

Now that Copybuffer is installed:

1. Read [QUICKSTART.md](QUICKSTART.md) for a command reference
2. Check [EXAMPLES.md](EXAMPLES.md) for practical usage scenarios
3. Configure GitHub Gist sync if you want cloud backup
4. Set up the systemd service for automatic startup

Enjoy using Copybuffer! 🎉
