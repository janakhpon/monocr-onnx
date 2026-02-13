# MonOCR-ONNX Publishing Setup Plan

## Goal

Set up professional, automated build and publishing pipelines for the `monocr-onnx` multi-language package.

## Strategy

We will use **GitHub Actions** for CI/CD and **automated versioning**. Each language binding will have its own build configuration and publishing step.

### 1. Repository Configuration

- **`.gitignore`**: Ensure `model/` is ignored generally, but we need a strategy for distributing the model.
  - _Decision_: We will **NOT bundle** the model in the packages (due to size limits: npm ~unlimited but bad practice, PyPI ~60MB limit, Crates.io 10MB limit).
  - _Solution_: The packages will require the user to provide the model path (current API design) OR download it separately. We will add a `download_model` script/CLI to each package.

### 2. Package Configuration Updates

#### JavaScript (npm)

- **`js/package.json`**:
  - Add `repository`, `homepage`, `bugs`.
  - Add `files`: `["index.js", "README.md", "LICENSE"]`.
  - Add `scripts`: `prepublishOnly` (test).
  - Add `bin`: `monocr-download` script?

#### Python (PyPI)

- **`python/pyproject.toml`**:
  - Add `project.urls`.
  - Add `classifiers`.
  - Add `cli` for downloading model if needed.

#### Rust (crates.io)

- **`rust/Cargo.toml`**:
  - Add `repository`, `license`, `description`, `keywords`.
  - Exclude `model/` from package via `exclude` or `include`.

#### Go

- Ensure `go.mod` module path is `github.com/janakh/monocr-onnx/go` (or root).
- Go publishing is just Git tagging.

### 3. Build & Publish Automation (GitHub Actions)

Create `.github/workflows/main.yml` (CI) and `.github/workflows/release.yml` (CD).

#### CI Workflow (Pull Requests)

- **JS**: `npm ci` && `npm test`
- **Python**: `pip install .` && `pytest`
- **Rust**: `cargo test`
- **Go**: `go test ./...`

#### Release Workflow (Tags `v*`)

1. **Prepare**: Extract version from tag.
2. **Publish JS**:
   - `npm publish --access public` (requires `NPM_TOKEN`)
3. **Publish Python**:
   - Build wheel/sdist.
   - `twine upload` (requires `PYPI_TOKEN`).
4. **Publish Rust**:
   - `cargo publish` (requires `CARGO_REGISTRY_TOKEN`).
5. **Publish Go**:
   - Just creates a GitHub Release with artifacts (if binaries) or just exists.

### 4. Code Changes Required

- **JS**: Add `.npmignore` (ignore `model/`).
- **Python**: Ensure `MANIFEST.in` excludes `model/`.
- **Rust**: Update `Cargo.toml` exclude.
- **Go**: No changes needed if just source.

## Implementation Steps

1.  **Update Configs**: Modify `package.json`, `pyproject.toml`, `Cargo.toml`.
2.  **Ignore Files**: Create `.npmignore`, `MANIFEST.in`.
3.  **CI/CD**: Create `.github/workflows/` files.
4.  **Documentation**: Update `README.md` with "How to Release" section (for maintainers).

## Senior Engineer Details

- **Idempotency**: Workflows should fail gracefully if version exists.
- **Security**: Use OIDC for PyPI (if possible) or Secrets.
- **Provenance**: Enable npm provenance.
- **Verification**: checksums for downloaded models (future).

Let's start by updating the package configurations.
