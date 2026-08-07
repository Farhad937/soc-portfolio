# SOC Analyst Portfolio

Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Deploys to Netlify via `@netlify/plugin-nextjs`.

## Local development

```
npm install
npm run dev
```

## Editing content

All portfolio content lives in plain TypeScript files under `src/lib/` — no CMS, no MDX build step:

- `src/lib/site.ts` — your name, tagline, bio, social links
- `src/lib/projects.ts` — project cards + detail pages (add an object, get a page for free)
- `src/lib/writeups.ts` — write-up cards + detail pages
- `src/lib/data.ts` — skills, certifications, learning journey timeline, TryHackMe paths

Add a `resume.pdf` to `public/` to make the Resume page's download button work — it currently ships as an empty placeholder file.

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: "Add new site" → "Import an existing project" → select the repo.
3. Netlify auto-detects `netlify.toml` (build command `npm run build`, publish `.next`, and the Next.js runtime plugin). No manual config needed.
4. Deploy.

## Not built yet (intentionally)

Site search and a stats dashboard were in the original plan but were left out of v1 — they're more valuable once there's real project/write-up content to search and count. The data layer (`src/lib/`) is structured so both can be added later without restructuring the app.
