# SNU Front End

Next.js e-commerce frontend prepared for Vercel deployment.

## Getting Started

Use Node.js 20.11 or newer:

```bash
nvm use
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and add the same keys in Vercel Project Settings:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_API_BASE_URL=
```

For production, `NEXT_PUBLIC_API_BASE_URL` must be a deployed HTTPS API URL, not `localhost`.

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.

Vercel uses `npm ci` and `npm run build` from `vercel.json`.
