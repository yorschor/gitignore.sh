# [gitignore.sh](https://gitignore.sh)

A static, client-side `.gitignore` builder.

Select templates, merge them in the browser, and download a ready-to-use `.gitignore` file.


---

## Usage

1. Search for templates.
2. Select the ones you need.
3. Copy, download, or share the generated `.gitignore`.

---

## ✨ Features

* 🔍 Fuzzy search (Fuse.js)
* 🧩 Combine multiple templates
* 🔗 Shareable URLs (`?templates=...`)
* 📋 Copy to clipboard
* ⬇️ Download as `.gitignore`
* ⚡ Fully static (no backend)

---

## 🌍 Community & Contributions

This project relies on accurate, up-to-date .gitignore templates. Their quality improves over time through community contributions.

If you notice something missing, outdated, or incorrect, consider contributing to improve it for everyone.

You can help by:

* adding missing rules
* fixing incorrect or outdated entries
* supporting new languages, tools, or frameworks

Templates are intentionally simple to edit, and even small fixes make a meaningful difference.

Open a pull request with your changes or improvements.

---

## 📁 Project Structure

```
gitignore.sh/
  app/                # Frontend (Preact + Vite)
    src/
    dist/             # Build output (deployed)
    scripts/
      build-template-index.ts
  templates/          # Source templates
```

---

## ➕ Adding Templates

Templates live in the `/templates` folder and follow this structure:

```
templates/
  <group>/
    <template-id>/
      meta.json
      template.gitignore
```

### Example

```
templates/
  dotnet/
    csharp/
      meta.json
      template.gitignore
```

---

### `meta.json` format

```json
{
  "id": "csharp",
  "name": "C#",
  "aliases": ["csharp"],
  "category": "language",
  "tags": ["dotnet", "c#", "runtime"],
  "description": ""
}
```

### Rules

* `id` **must be unique** (used in URLs)
* `category` controls grouping in UI (e.g. `language`, `framework`, `ide`, `os`)
* `aliases` are used for search only (not URLs)
* `template.gitignore` must exist next to `meta.json`

---

## 🏗️ Build Process

Templates are processed at build time:

1. All `meta.json` files are collected
2. Validated and normalized
3. `template.gitignore` files are copied
4. A combined `index.json` is generated

### Output

```
dist/
  index.html
  index.json
  templates/**        # copied template files
```

The frontend loads `index.json` and fetches templates on demand.

---

## 🚀 Development

Install dependencies:

```bash
cd app
bun install
```

Run dev server:

```bash
bun run dev
```

> Note: Dev mode does not generate `index.json`.
> Use preview for full functionality.

---

## 🔨 Build

```bash
bun run build
```

This will:

* build the frontend with Vite
* generate `index.json`
* copy templates into `dist/`

Preview production build:

```bash
bunx vite preview
```

---


## 🔗 URL Format

Selections are encoded in the URL:

```
?templates=csharp,node,vscode
```

Rules:

* order is preserved
* unknown IDs are ignored
* duplicates are removed

---

## 🧠 Architecture

* **lib/** → pure logic (merge, validation, search)
* **adapters/** → browser + HTTP
* **services/** → orchestration service
* **ui/** → Preact components

## Credits

The initial batch of `.gitignore` templates was adapted from GitHub’s public `.gitignore` repository:
https://github.com/github/gitignore

## License

- Application code is licensed under MIT.
- Templates in `/templates` are licensed under CC0 (public domain).

By contributing templates, you agree to release them under CC0.