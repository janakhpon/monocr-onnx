# Publishing Guide: monocr-onnx (npm)

Guide for publishing the JavaScript SDK to npm registry.

## Prerequisites

1. **npm Account**
   - Create account at https://www.npmjs.com/signup
   - Verify email address

2. **Login to npm**

   ```bash
   npm login
   ```

   Enter username, password, and email when prompted.

3. **Verify Login**
   ```bash
   npm whoami
   ```

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass
- [ ] Examples work correctly
- [ ] README.md is up to date
- [ ] Version number is incremented in package.json
- [ ] CHANGELOG updated (if maintained)
- [ ] No sensitive data in package files

## Version Bumping

Use npm's built-in version commands:

```bash
# Patch release (0.1.0 -> 0.1.1)
npm version patch

# Minor release (0.1.0 -> 0.2.0)
npm version minor

# Major release (0.1.0 -> 1.0.0)
npm version major
```

This automatically:

- Updates version in package.json
- Creates a git commit
- Creates a git tag

## Dry Run

Test the publishing process without actually publishing:

```bash
npm publish --dry-run
```

This shows what files will be included in the package.

## Publishing

### First Time (Scoped Package)

If package name is scoped (e.g., `@username/monocr-onnx`):

```bash
npm publish --access public
```

### Subsequent Publishes

For public unscoped packages:

```bash
npm publish
```

## Post-Publishing

1. **Verify on npm**
   - Visit https://www.npmjs.com/package/monocr-onnx
   - Check version, README display, and file list

2. **Test Installation**

   ```bash
   # In a clean directory
   mkdir test-install
   cd test-install
   npm install monocr-onnx
   ```

3. **Create GitHub Release**
   ```bash
   git push origin main
   git push origin --tags
   ```

   - Go to GitHub Releases
   - Create release from the version tag
   - Add release notes

## Updating an Existing Package

1. Make changes
2. Bump version: `npm version patch|minor|major`
3. Publish: `npm publish`
4. Push to GitHub: `git push origin main --tags`

## Unpublishing (Emergency Only)

Unpublish is only possible within 72 hours:

```bash
# Specific version
npm unpublish monocr-onnx@0.1.0

# Entire package (use with extreme caution)
npm unpublish monocr-onnx --force
```

**Note**: Unpublishing is discouraged. Use `npm deprecate` instead:

```bash
npm deprecate monocr-onnx@0.1.0 "Use version 0.1.1 instead"
```

## Automation with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"

      - run: npm ci

      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Setup**:

1. Generate npm token: https://www.npmjs.com/settings/tokens
2. Add to GitHub Secrets as `NPM_TOKEN`
3. Push a version tag: `git push origin v0.1.0`

## Troubleshooting

**Error: Package already exists**

- Version already published
- Bump version and try again

**Error: 402 Payment Required**

- Package name conflicts with paid private package
- Choose different name

**Error: 403 Forbidden**

- Not logged in: `npm login`
- No publish permission
- Package name already taken

## Best Practices

1. **Semantic Versioning**
   - MAJOR: Breaking changes
   - MINOR: New features, backward compatible
   - PATCH: Bug fixes

2. **Package Size**
   - Keep package small
   - Use `.npmignore` or `files` in package.json
   - Check with: `npm pack --dry-run`

3. **Documentation**
   - Comprehensive README
   - Examples included
   - API documentation clear

4. **Dependencies**
   - Pin major versions
   - Avoid unnecessary dependencies
   - Use `peerDependencies` when appropriate

## Package Maintenance

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Update package-lock.json
npm install
```

### Security Audit

```bash
npm audit

# Auto-fix vulnerabilities
npm audit fix
```

## Quick Reference

```bash
# Login
npm login

# Version bump
npm version patch

# Publish
npm publish

# Check package
npm view monocr-onnx

# Install globally
npm install -g monocr-onnx
```
