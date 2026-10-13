# KjepphestStevne

Competition entry app built with Next.js, React and TypeScript, with Tailwind CSS for responsive styling and Supabase for the database.

## Getting started

1. Create a project at https://supabase.com.
2. Copy `.env.example` to `.env.local` and fill in your project URL and publishable key
   (Supabase dashboard → Project Settings → API Keys).
3. Install and run:

```bash
npm install
npm run dev
```

## Supabase clients

- `src/lib/supabase/server.ts` – use in Server Components, Server Actions and Route Handlers
- `src/lib/supabase/client.ts` – use in Client Components (`"use client"`)
- `src/proxy.ts` – keeps login sessions fresh on every request

Open http://localhost:3000. To test on a phone on the same Wi-Fi, use `http://<your-computer-ip>:3000`.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – production build
- `npm start` – run the production build
- `npm run lint` – lint the code
