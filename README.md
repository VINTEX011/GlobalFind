# TraceLink

TraceLink is a premium missing-persons case intelligence platform built with Next.js, TypeScript, Tailwind CSS, Prisma, and NextAuth. It gives families, NGOs, and moderators a secure workflow for case intake, public tips, monitoring review, and sighting visualization.

## What is included

- Public landing page, case directory, and case detail pages
- Protected dashboard shell for case owners and moderators
- Case intake workflow with privacy settings and image upload placeholders
- Public tip submission with structured fields and safety messaging
- Monitoring queue, lead review drawer, sightings map panel, and admin overview
- Prisma schema covering users, cases, tips, leads, monitoring hits, audit logs, notifications, locations, and case updates
- Seed script with 5 cases, 20 tips, 15 monitoring hits, 3 admin users, and 3 family users
- Dark mode, polished reusable UI components, responsive layout, and route protection

## Safety boundaries

TraceLink does **not** identify random strangers across the internet.

- No “upload face -> reveal identity on social media” behavior
- Image similarity is limited to a single case context
- Similarity results are always labeled as possible leads only
- Manual moderator review remains required before any action

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn-style Radix UI primitives
- Framer Motion
- NextAuth credentials auth
- Prisma ORM + PostgreSQL
- React Hook Form + Zod
- Lucide icons
- Sonner toasts
- QR code support for printable case pages

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Generate the Prisma client:

```bash
npm run db:generate
```

4. Push the database schema:

```bash
npm run db:push
```

5. Seed realistic demo data:

```bash
npm run db:seed
```

6. Start the development server:

```bash
npm run dev
```

## Demo credentials

- Admin: `admin@tracelink.org` / `TraceLink!2026`
- Family: `amelia@family.tracelink.org` / `TraceLink!2026`

## Environment variables

Required:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Optional but recommended:

- `MAPBOX_ACCESS_TOKEN`
- UploadThing or S3-compatible storage credentials

## Notes

- The current implementation uses seeded demo data and API stubs for uploads and background monitoring workers.
- Map views are Mapbox-ready and fall back to a plotted preview surface until a token and live adapter are configured.
- Registration is scaffolded for database-backed deployment; local preview focuses on seeded secure accounts.
