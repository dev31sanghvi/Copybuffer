#!/bin/bash

# Comprehensive test script for Copybuffer
# This script tests all major features to ensure they work correctly

# Don't exit on error - we want to count failures
# set -e  # Exit on error

echo "======================================"
echo "   Copybuffer Comprehensive Test"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local command="$2"
    
    echo -n "Testing: $test_name... "
    
    if eval "$command" > /tmp/test_output.log 2>&1; then
        echo -e "${GREEN}PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        echo "  Error output:"
        cat /tmp/test_output.log | head -5
        ((TESTS_FAILED++))
    fi
}

# Function to verify output contains text
verify_output() {
    local test_name="$1"
    local command="$2"
    local expected="$3"
    
    echo -n "Testing: $test_name... "
    
    if eval "$command" 2>&1 | grep -q "$expected"; then
        echo -e "${GREEN}PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        echo "  Expected to find: $expected"
        ((TESTS_FAILED++))
    fi
}

# Ensure clean state
rm -rf ~/.copybuffer
rm -f /tmp/test-*.json

echo "1. Build Tests"
echo "--------------"
run_test "TypeScript compilation" "npm run build"
run_test "ESLint validation" "npm run lint"
echo ""

echo "2. CLI Tests"
echo "------------"
run_test "CLI help command" "node dist/cli.js --help"
run_test "CLI version command" "node dist/cli.js --version"
echo ""

echo "3. Configuration Tests"
echo "---------------------"
verify_output "Default config creation" "node dist/cli.js config" "dataDir"
verify_output "Config contains maxHistorySize" "node dist/cli.js config" "maxHistorySize"
verify_output "Config contains hotkeys" "node dist/cli.js config" "hotkeys"
run_test "Set config value" "node dist/cli.js config-set maxHistorySize 500"
verify_output "Verify config update" "node dist/cli.js config" '"maxHistorySize": "500"'
echo ""

echo "4. Storage Tests"
echo "---------------"

# Create test data
cat > /tmp/test-import.json << 'EOF'
[
  {
    "id": "test-001",
    "content": "Test entry 1",
    "timestamp": 1698601200000,
    "type": "text"
  },
  {
    "id": "test-002",
    "content": "Test entry 2 with keyword",
    "timestamp": 1698601260000,
    "type": "text"
  },
  {
    "id": "test-003",
    "content": "Another test entry",
    "timestamp": 1698601320000,
    "type": "text",
    "tags": ["test", "example"]
  }
]
EOF

run_test "Import history" "node dist/cli.js import /tmp/test-import.json"
verify_output "List shows entries" "node dist/cli.js list" "Test entry 1"
run_test "Export history" "node dist/cli.js export /tmp/test-export.json"
run_test "Exported file exists" "test -f /tmp/test-export.json"
echo ""

echo "5. Search Tests"
echo "--------------"
verify_output "Search finds entry" "node dist/cli.js search 'keyword'" "Test entry 2"
verify_output "Search with limit" "node dist/cli.js search 'test' --limit 2" "Test entry"
verify_output "Search no results" "node dist/cli.js search 'nonexistent'" "No results found"
echo ""

echo "6. Delete Tests"
echo "--------------"
run_test "Delete entry" "node dist/cli.js delete test-001"
verify_output "Entry deleted" "node dist/cli.js search 'Test entry 1'" "No results found"
echo ""

echo "7. List Tests"
echo "------------"
verify_output "List default limit" "node dist/cli.js list" "Showing"
verify_output "List with custom limit" "node dist/cli.js list --limit 5" "Showing"
echo ""

echo "8. Clear Tests"
echo "-------------"
run_test "Clear history" "node dist/cli.js clear --yes"
verify_output "History cleared" "node dist/cli.js list" "No clipboard history found"
echo ""

echo "9. File Structure Tests"
echo "----------------------"
run_test "Config directory exists" "test -d ~/.copybuffer"
run_test "Config file exists" "test -f ~/.copybuffer/config.json"
run_test "History file exists" "test -f ~/.copybuffer/history.json"
echo ""

echo "10. Module Tests"
echo "---------------"

# Create a simple test script to verify imports
cat > /tmp/test-imports.js << 'EOF'
const path = require('path');
const projectDir = '/home/runner/work/Copybuffer/Copybuffer';
const { storageManager, searchManager, configManager } = require(path.join(projectDir, 'dist/exports'));

// Test that modules export correctly
console.log('storageManager:', typeof storageManager);
console.log('searchManager:', typeof searchManager);
console.log('configManager:', typeof configManager);

// Test basic functionality
const config = configManager.getConfig();
console.log('Config loaded:', config.dataDir ? 'yes' : 'no');

const history = storageManager.loadHistory();
console.log('History loaded:', Array.isArray(history) ? 'yes' : 'no');

const recent = searchManager.getRecent(10);
console.log('Recent retrieved:', Array.isArray(recent) ? 'yes' : 'no');
EOF

run_test "Module imports work" "node /tmp/test-imports.js"
echo ""

echo "11. Hotkey Manager Tests"
echo "------------------------"

# Create a test script to verify hotkey manager handles unsupported OS gracefully
cat > /tmp/test-hotkey.js << 'EOF'
const path = require('path');
const projectDir = '/home/runner/work/Copybuffer/Copybuffer';
const { hotkeyManager } = require(path.join(projectDir, 'dist/hotkeys/HotkeyManager'));

// Capture console output
let consoleOutput = '';
const originalLog = console.log;
console.log = (...args) => {
  consoleOutput += args.join(' ') + '\n';
  originalLog(...args);
};

// Test initialization (should not throw)
try {
  hotkeyManager.initialize();
  
  // Check if initialization failed gracefully
  if (consoleOutput.includes('could not be initialized') || consoleOutput.includes('initialized')) {
    console.log = originalLog;
    console.log('Hotkey manager handled initialization correctly');
    process.exit(0);
  } else {
    console.log = originalLog;
    console.error('Unexpected console output:', consoleOutput);
    process.exit(1);
  }
} catch (error) {
  console.log = originalLog;
  console.error('Hotkey manager should not throw errors during initialization:', error);
  process.exit(1);
}
EOF

run_test "Hotkey manager initialization gracefully handles unsupported OS" "node /tmp/test-hotkey.js"
echo ""

echo "======================================"
echo "   Test Summary"
echo "======================================"
echo ""
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
