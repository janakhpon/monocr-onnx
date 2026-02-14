# Publishing Guide (MonOCR-ONNX)

This guide documents the modern, secure publishing workflows for the MonOCR-ONNX multi-language SDKs.

## 🛡️ Modern Best Practices

We prioritize **Trusted Publishing** (OIDC) to eliminate the need for long-lived tokens/passwords in GitHub Secrets.

### 1. Python (PyPI)

We use `uv` for building and **Trusted Publishing** for security.

#### Configuration

- Register the project on PyPI under the name `monocr-onnx`.
- Set up **Trusted Publishing** on PyPI:
  - **Publisher**: GitHub Actions
  - **Owner**: `MonDevHub`
  - **Repository**: `monocr-onnx`
  - **Workflow name**: `release-python.yml`

#### Workflow (`.github/workflows/release-python.yml`)

```yaml
name: Release Python
on:
  push:
    tags: ["python-v*"]
permissions:
  id-token: write
  contents: read
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v4
      - name: Build and Publish
        run: |
          cd python
          uv build
          uv publish --trusted-publishing always
```

### 2. JavaScript (npm)

We use **OIDC** and **Provenance** for verified builds.

#### Configuration

- On npmjs.com, configure the `monocr` package to use **GitHub Actions** as a trusted publisher.
- Ensure `package.json` has `repository` and `homepage` pointing to the correct GitHub URL.

#### Workflow (`.github/workflows/release-js.yml`)

```yaml
name: Release JS
on:
  push:
    tags: ["js-v*"]
permissions:
  id-token: write
  contents: read
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org"
      - run: |
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: |
          cd js
          pnpm install
          pnpm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Note: npm is currently rolling out Trusted Publishing. If not yet available for your account, use a granular access token.

### 3. Go

Go "publishing" is simply git tagging.

1. Ensure `go/go.mod` module path is correct.
2. Tag the repository: `git tag go/v0.x.y`.
3. Push the tag: `git push origin go/v0.x.y`.

Users can then `go get github.com/MonDevHub/monocr-onnx/go@v0.x.y`.

---

## 🏗️ Local Development / Manual Release

If manual publishing is required:

### Python

```bash
cd python
rm -rf dist/
pip install uv
uv build
uv publish
```

### JS

```bash
cd js
pnpm login
pnpm publish --access public
```

### Go

```bash
cd go
go mod tidy
# commit and push
```
