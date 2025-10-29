# Contributing to Copybuffer

Thank you for your interest in contributing to Copybuffer! This project is primarily for personal use, but contributions are welcome.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Ubuntu/Linux (for full clipboard and hotkey support)
- Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Copybuffer.git
   cd Copybuffer
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Development Workflow

### Project Structure

```
Copybuffer/
├── src/
│   ├── clipboard/       # Clipboard monitoring logic
│   ├── config/          # Configuration management
│   ├── hotkeys/         # Global hotkey handling
│   ├── search/          # Search functionality
│   ├── storage/         # JSON file storage
│   ├── sync/            # GitHub Gist sync
│   ├── cli.ts           # CLI interface
│   ├── index.ts         # Main entry point
│   ├── types.ts         # TypeScript type definitions
│   └── exports.ts       # Public API exports
├── dist/                # Compiled JavaScript (gitignored)
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # Documentation
```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Build and test:
   ```bash
   npm run build
   npm run lint
   ```

4. Test your changes:
   ```bash
   # Test CLI commands
   node dist/cli.js --help
   node dist/cli.js list
   
   # Run the demo
   ./demo.sh
   ```

### Code Style

- Follow existing code style
- Use TypeScript for all new code
- Run linter before committing:
  ```bash
  npm run lint
  ```
- Format code with Prettier:
  ```bash
  npm run format
  ```

### Commit Messages

Use clear, descriptive commit messages:

```
Add feature: Brief description

Detailed explanation of what changed and why.
```

Examples:
- `Add clipboard image support`
- `Fix: Handle empty clipboard gracefully`
- `Docs: Update installation instructions`

## Testing

Currently, the project uses manual testing. To test your changes:

1. Build the project:
   ```bash
   npm run build
   ```

2. Test CLI commands:
   ```bash
   node dist/cli.js config
   node dist/cli.js list
   node dist/cli.js search "test"
   ```

3. Test monitoring (in a safe environment):
   ```bash
   node dist/cli.js start
   # Copy some text
   # Ctrl+C to stop
   node dist/cli.js list
   ```

4. Run the demo script:
   ```bash
   ./demo.sh
   ```

## Pull Request Process

1. Ensure your code builds without errors:
   ```bash
   npm run build
   npm run lint
   ```

2. Update documentation if needed:
   - README.md for user-facing changes
   - EXAMPLES.md for new features
   - Code comments for complex logic

3. Create a pull request with:
   - Clear title describing the change
   - Detailed description of what and why
   - Any related issues referenced

4. Wait for review and address feedback

## Areas for Contribution

### High Priority
- Cross-platform support (macOS, Windows)
- Automated tests
- Better hotkey support with modifier keys
- Clipboard image/file support

### Medium Priority
- GUI interface
- Encrypted clipboard entries
- Plugin system
- Advanced search filters

### Documentation
- More usage examples
- Video tutorials
- Troubleshooting guides
- API documentation

## Questions or Issues?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed information:
  - OS and version
  - Node.js version
  - Steps to reproduce (for bugs)
  - Expected vs actual behavior

## Code of Conduct

### Be Respectful
- Treat everyone with respect
- Be constructive in feedback
- Focus on the code, not the person

### Be Collaborative
- Help others learn
- Share knowledge
- Welcome newcomers

### Be Professional
- Use inclusive language
- Stay on topic
- Keep discussions productive

## License

By contributing to Copybuffer, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make Copybuffer better for everyone!
