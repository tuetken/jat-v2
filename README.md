# JAT v2 - Job Application Tracker

A modern, secure job application tracking system built with Next.js 16, Supabase, and TypeScript.

## Features

- 🔐 **Secure Authentication** - Email/password auth powered by Supabase
- 🛡️ **Row Level Security** - Database-enforced data isolation
- 📝 **Application Management** - Track job applications with status, dates, and notes
- 🎨 **Modern UI** - Responsive design with dark mode support
- ⚡ **Server Components** - Fast, SEO-friendly rendering with Next.js 16
- 🔒 **Type-Safe** - Full TypeScript coverage with Zod validation

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth & Database:** Supabase (PostgreSQL + Auth)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel

## Quick Start

### Prerequisites

- Node.js 20+ installed
- A Supabase project ([create one free](https://supabase.com))

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd jat-v2
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from your Supabase project: **Settings** > **API**

4. **Set up the database**

- Go to your Supabase dashboard
- Navigate to **SQL Editor**
- Run the migration file: `supabase_migration_applications.sql`

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Protected routes (dashboard, applications)
│   ├── (public)/          # Public routes (login, signup)
│   └── api/               # API routes
├── components/            # React components
│   ├── applications/      # Application-specific components
│   ├── auth/             # Auth forms
│   └── ui/               # Reusable UI primitives
└── lib/
    ├── db/               # Database access layer
    ├── supabase/         # Supabase client setup
    ├── types/            # TypeScript types
    └── validations/      # Zod schemas
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Security

- ✅ Row Level Security (RLS) enforced at database level
- ✅ Server-side authentication checks on all protected routes
- ✅ No service role key used (prevents RLS bypass)
- ✅ Client-side Supabase client only for auth operations
- ✅ All data queries use authenticated context

## Documentation

- [Project Context](./project-context.md) - Architecture and development guidelines
- [Architecture](./ARCHITECTURE.md) - Detailed system design
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment checklist
- [RLS Verification](./RLS_VERIFICATION_CHECKLIST.md) - Security testing procedures

## License

MIT
