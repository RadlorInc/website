This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment variables

Copy `.env.example` to `.env.local` and fill it in. Two variables are required for the waitlist
form at `/waitlist` to store anything:

| Variable | What it is | Where it comes from |
|---|---|---|
| `SUPABASE_URL` | The project's REST origin, **no trailing slash** — `app/api/waitlist/route.ts` builds `${SUPABASE_URL}/rest/v1/waitlist` | Supabase dashboard → **Project Settings → Data API → Project URL** |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key; bypasses RLS | Supabase dashboard → **Project Settings → API Keys → `service_role`** (click Reveal) |

`NEXT_PUBLIC_SITE_URL` is optional and defaults to `https://radlor.com`; set it for a preview
deployment.

Without the two Supabase variables the site builds and every page works, but a valid signup 303s
to `/waitlist/problem` and logs `SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set`. It fails
visibly rather than silently, but it does fail.

⚠️ **Never prefix either with `NEXT_PUBLIC_`.** That inlines the value into the browser bundle, and
a `service_role` key there gives every visitor write access to every table in the project. The
browser is never meant to talk to Supabase at all — see the header comment in
`app/api/waitlist/route.ts` and the claim on `/privacy` that depends on it.

⚠️ **The service key must belong to the radlor-site project, not the product's**
(`qaymxunzlarwusogwyak`). That one holds children's data.

**On Vercel:** Settings → Environment Variables, added to **Production and Preview**. Environment
variables are read at build and run time, so adding them does not change an existing deployment —
**redeploy after adding them.**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3021](http://localhost:3021) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
