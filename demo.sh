#!/bin/bash

# Demo script for Copybuffer
# This script demonstrates the basic features of Copybuffer

echo "======================================"
echo "   Copybuffer Demo Script"
echo "======================================"
echo ""

# Check if copybuffer is built
if [ ! -f "dist/cli.js" ]; then
    echo "Building Copybuffer..."
    npm run build
    echo ""
fi

echo "1. Checking configuration..."
node dist/cli.js config
echo ""

echo "2. Simulating some clipboard entries..."
# Since we can't actually copy to clipboard in this environment,
# we'll manually create some test entries

cat > /tmp/test-clipboard-import.json << 'EOF'
[
  {
    "id": "demo-001",
    "content": "Hello from Copybuffer! This is a test entry.",
    "timestamp": 1698601200000,
    "type": "text"
  },
  {
    "id": "demo-002",
    "content": "https://github.com/dev31sanghvi/Copybuffer",
    "timestamp": 1698601260000,
    "type": "text"
  },
  {
    "id": "demo-003",
    "content": "const greeting = 'Hello World';",
    "timestamp": 1698601320000,
    "type": "text",
    "tags": ["code", "javascript"]
  },
  {
    "id": "demo-004",
    "content": "npm install copybuffer",
    "timestamp": 1698601380000,
    "type": "text",
    "tags": ["command"]
  },
  {
    "id": "demo-005",
    "content": "Smart clipboard manager for developers",
    "timestamp": 1698601440000,
    "type": "text"
  }
]
EOF

echo "3. Importing demo clipboard entries..."
node dist/cli.js import /tmp/test-clipboard-import.json
echo ""

echo "4. Listing clipboard history..."
node dist/cli.js list
echo ""

echo "5. Searching for 'github'..."
node dist/cli.js search "github"
echo ""

echo "6. Searching for 'npm'..."
node dist/cli.js search "npm"
echo ""

echo "7. Exporting clipboard history..."
node dist/cli.js export /tmp/copybuffer-export.json
echo "Exported to: /tmp/copybuffer-export.json"
echo ""

echo "8. Showing exported file..."
cat /tmp/copybuffer-export.json | head -20
echo "..."
echo ""

echo "======================================"
echo "   Demo Complete!"
echo "======================================"
echo ""
echo "Try these commands yourself:"
echo "  copybuffer list              - List clipboard history"
echo "  copybuffer search 'text'     - Search clipboard"
echo "  copybuffer start             - Start monitoring"
echo "  copybuffer --help            - Show all commands"
echo ""
echo "For more examples, see EXAMPLES.md"
