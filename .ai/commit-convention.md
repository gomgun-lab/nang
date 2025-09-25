# Commit Convention

## Format

```
<action> <description>

<optional detailed description>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Actions

Use one of the following action words to start your commit message:

### Primary Actions

- **Add** - New features, files, or functionality
- **Update** - Modifications to existing functionality
- **Remove** - Deletion of code, files, or features
- **Fix** - Bug fixes and corrections

### Secondary Actions

- **Improve** - Enhancements to existing functionality
- **Refactor** - Code restructuring without changing functionality
- **Configure** - Configuration changes
- **Setup** - Initial project setup or tooling

## Guidelines

### Subject Line

- Start with an action word (Add, Update, Remove, Fix, etc.)
- Use present tense and imperative mood
- Keep it concise but descriptive
- No period at the end
- 50 characters or less recommended

### Body (Optional)

- Use bullet points for multiple changes
- Explain what and why, not how
- Separate from subject with blank line
- Wrap at 72 characters

### Examples

**Good:**

```
Add end-to-end testing support and TypeScript configuration for NestJS

- Configure Jest presets for both unit and e2e tests
- Add NestJS-specific TypeScript configuration
- Set up test scripts and turbo tasks
```

**Good:**

```
Remove unused dependencies and improve project structure

- Remove unused dependencies from API package (@jest/globals, source-map-support, tsconfig-paths)
- Clean up jest-presets package by removing unnecessary dependencies
- Add comprehensive API application with NestJS setup and proper TypeScript configuration
```

**Good:**

```
Update .gitignore and add VSCode settings for formatting
```

## Attribution

All commits should include the Claude Code attribution footer:

```
🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
