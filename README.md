# Softcom

The Softcom website, rebuilt so photographs and copy can be changed without a developer in the loop.

The public site covers the company story, solutions, enterprise products, case studies, insights, careers, alumni and contact. The studio at `/studio` is the CMS.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Change a photograph

1. Open [http://127.0.0.1:4317/studio](http://127.0.0.1:4317/studio).
2. Sign in. The starting password is `softcom`.
3. On **Photographs**, choose **Replace image**, or drop a file onto the card.
4. Go back to the page. The new image is already there.

While you are signed in, every photograph on the public site also shows a **Replace** button.

Words are on the **Words** tab. A field saves when you click away from it. From the same tab you can add an insight, a case study, an open role, or a leader, and remove one you no longer want.

Content lives in `content/site.json`. Uploaded images land in `public/media/uploads/`. Both are ordinary files, so a change can be kept in git.

Set a different studio password before you share the site:

```bash
CMS_PASSWORD=your-password
CMS_SECRET=a-long-random-string
```

Messages from the contact and alumni forms are stored in `content/messages.json` on the machine running the app. That file is not committed.

## Pages

- `/` Home
- `/solutions`
- `/enterprise-products` and each product
- `/case-studies`
- `/insights`
- `/about`
- `/careers`
- `/alumni`
- `/contact`
- `/studio`
