# Personal Resume Site

Simple static site with 3 tabs (`Software`, `Band`, `Hobby`) that renders markdown content.

## Edit Content

- Update tab content in:
  - `content/software.md`
  - `content/band.md`
  - `content/hobby.md`
- Add images to `content/images/` and reference them from markdown:

```md
![Alt text](./images/your-image.png)
```

## Edit Contact Info

Update `contactInfo` in `app.js`.

## Run Locally

Serve the folder with any static server (important: do not open `index.html` directly via `file://`).

Examples:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploy To Cloudflare Pages

- Build command: *(leave empty)*
- Build output directory: `/` (project root)
- Framework preset: `None` / static site

Cloudflare will serve `index.html` and static assets directly.
