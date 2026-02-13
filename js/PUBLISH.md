# Publishing monocr-onnx to npm

Quick reference for publishing new versions.

## Quick Steps

1. **Ensure everything works**

   ```bash
   npm install
   node examples/simple.js
   ```

2. **Bump version**

   ```bash
   npm version patch   # 0.1.0 -> 0.1.1
   npm version minor   # 0.1.0 -> 0.2.0
   npm version major   # 0.1.0 -> 1.0.0
   ```

3. **Dry run**

   ```bash
   npm publish --dry-run
   ```

4. **Publish**

   ```bash
   npm publish --access public
   ```

5. **Push to GitHub**
   ```bash
   git push origin main --tags
   ```

## First Time Setup

```bash
# Login to npm
npm login

# Verify
npm whoami
```

## Files Included

The package.json `files` field controls what gets published:

- `src/` - All source code
- `bin/` - CLI tools
- `README.md` - Documentation
- `LICENSE` - License file

Model files are excluded (too large for npm).

## See Full Guide

For detailed instructions, see [PUBLISHING.md](PUBLISHING.md)
