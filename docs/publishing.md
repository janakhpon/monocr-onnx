# MonOCR Release Runbook

> **Context**: We use a manual release process. Automation is great, but for this stage of the project, we want full control over exactly what bits assume the `latest` tag.
>
> **Golden Rule**: If it's not in `main`, it doesn't exist. If it's not tested, it's broken.

## Pre-Flight Checks

Before you even think about publishing, verify your environment matches our constraints.

| Runtime     | Requirement     | Check Commmand     |
| :---------- | :-------------- | :----------------- |
| **Python**  | `3.11` (Strict) | `python --version` |
| **Node.js** | `20+`           | `node -v`          |
| **pnpm**    | `9+` (Strict)   | `pnpm -v`          |
| **Go**      | `1.23+`         | `go version`       |

---

## Python (`monocr-onnx`)

We use `uv` because it's fast and correct. Don't use `setup.py`.

### 1. Build & verify

Clean slate first. We don't want stale artifacts.

```bash
cd python
rm -rf dist/
uv build
```

### 2. Smoke Test

Install the wheel we just built in a fresh venv to ensure we didn't miss a file in `include`.

```bash
uv venv .test-venv
source .test-venv/bin/activate
uv pip install dist/*.whl
python -c "import monocr_onnx; print(monocr_onnx.__version__)"
deactivate
rm -rf .test-venv
```

_(If that failed, fix your `pyproject.toml`)_

### 3. Ship it

```bash
uv publish
```

---

## JavaScript (`monocr`)

We use `pnpm`. It enforces strict dependency boundaries which saves us from "it works on my machine" phantom dependency issues.

### 1. Hard Reset

Ensure dependencies are exactly what the lockfile says.

```bash
cd js
pnpm install --frozen-lockfile
pnpm approve-builds # Build binaries (sharp, onnxruntime)
```

### 2. Verify

Run the batch example. It's our de-facto integration test.

```bash
node ../examples/js/batch-example.js
```

### 3. Version & Release

**Crucial**: `pnpm publish` checks for a clean git state. Commit your version bump _before_ running this.

```bash
pnpm version patch # or minor
git commit -am "chore(js): bump version"
pnpm publish --access public
```

---

## Go (`github.com/MonDevHub/monocr-onnx/go`)

Go modules are just git tags. But we have a mono-repo, so tags are namespaced.

### 1. Tidy Up

Never ship a `go.mod` that hasn't been tidied.

```bash
cd go
go mod tidy
go test -v ./...
```

### 2. Tag It

The tag **must** look like `go/vX.Y.Z`. If you tag it `vX.Y.Z`, Go won't find the module in the subdirectory.

```bash
# assuming you're in root
git tag go/v0.1.1
git push origin go/v0.1.1
```

### 3. Verify

Ask the proxy to index it immediately.

```bash
GOPROXY=proxy.golang.org go list -m github.com/MonDevHub/monocr-onnx/go@v0.1.1
```

---

## 🪄 Final Steps

1.  **Bump local versions**: Ensure `task.md` or internal docs reflect the new numbers.
2.  **Changelog**: If you didn't write a changelog, did the release really happen? (Update `CHANGELOG.md` if we have one, or release notes on GitHub).
