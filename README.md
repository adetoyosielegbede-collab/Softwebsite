# Softcom

Marketing site for [Softcom](https://softcom.xyz), rebuilt so copy and images can be changed without a developer in the loop.

The public site covers Home, About, Solutions, Enterprise Products (Lift, Reckon, Sentinel, Useforms), Case Studies, Insights, Careers and Contact. Everything on those pages — headlines, body copy, and every image — lives in JSON files under `content/` and is edited through the built-in CMS.

## Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:4317](http://localhost:4317).

## Edit the site

Go to [/admin](http://localhost:4317/admin). Locally the password is `softcom` until you set `ADMIN_PASSWORD`.

Two ways to change an image:

- **On the page.** While you are signed in, a bar sits at the bottom left of the public site. Hover any image and choose **Replace**. Empty slots (a hero with no photo, a case study with no picture) show up when you turn on **Show image slots**.
- **All at once.** In the CMS, **All images** lists every image on the site. Click one to upload a replacement, and edit its alt text in the field underneath.

Text, lists, stats, open roles and articles are edited from the page list in the same CMS. **Save changes** writes the JSON and the live site updates immediately. Insight articles are the **Insight articles** entry: set `published` to show one, and `featured` to pin it.

The homepage hero has an **Image mode** switch under **Home → Hero**. Off, the portal opens onto the Progress for Society headline and sentence. On, it opens onto the **Background image** uploaded just below the switch.

Fonts are set under **Header, footer & shared → Typography**: a font, weight and style for headings, and the same for body text. The choices are General Sans, Inter, DM Sans, Manrope, Space Grotesk, IBM Plex Sans, Fraunces and Source Serif. General Sans ships in Regular and Medium only, so other weights and italic in that font are drawn by the browser.

Font sizes live under **Typography → Sizes**: a desktop and a mobile size in pixels for each text style (Display, Headline, Title, Lede, Body). Changing one updates every heading or paragraph that uses that style across the site. The Solutions intro also has its own **Text style** and **Font size** under Solutions → Intro; leave the font size at 0 to follow the chosen style.

Contact-form messages are listed under **Messages**.

## Content files

| File | What it drives |
| --- | --- |
| `content/site.json` | Logo, menu, footer, address, partner logos, stats |
| `content/home.json` | Home page |
| `content/about.json` | About, including leadership photos |
| `content/solutions.json` | Solutions |
| `content/enterprise-products.json` | Product index and partner platforms |
| `content/products/*.json` | Lift, Reckon, Sentinel, Useforms |
| `content/case-studies.json` | Case studies |
| `content/insights.json` | Insights page framing |
| `content/posts.json` | Insight articles |
| `content/careers.json` | Careers, including open roles |
| `content/contact.json` | Contact page and form labels |

An image is an object: `{ "src": "/images/example.jpg", "alt": "What it shows" }`. `src` is a path in `public/` or a full URL. Uploads land in `public/uploads/`.

## Deploying

The site is a Next.js app and deploys to Vercel as-is (`npm run build`).

Vercel's filesystem is read-only, so the CMS cannot save files there on its own. To keep editing after deploy, set:

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | A real password. Required in production; there is no default. |
| `CMS_SECRET` | Any long random string. Signs the session cookie. |
| `CMS_STORAGE` | `github` |
| `GITHUB_TOKEN` | A token with permission to write file contents. |
| `GITHUB_REPO` | `owner/name` |
| `GITHUB_BRANCH` | Branch to commit to, usually `main` |
| `NEXT_PUBLIC_SITE_URL` | The public URL, used for links and social cards. |

With those set, every save and upload is committed to the repository, and the next deployment serves it. Without them the CMS still opens, but a banner explains that saves will not persist.

Copy `.env.example` to `.env.local` for local overrides. `.env.local` is not committed.
