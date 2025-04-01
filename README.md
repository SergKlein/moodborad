# Moodboard - AI-Powered Interior Design Platform

![Moodboard Platform]

## Overview

Moodboard is an innovative AI-driven platform that empowers architects, interior designers, and real estate professionals to effortlessly create stunning, visually cohesive moodboards. Simply input your concept or initial inspiration, and our AI will generate curated moodboards tailored specifically to your architectural style, interior preferences, or real estate marketing needs.

## Features

### Core Functionality

* 🎨 **AI-Powered Generation**
  * Create professional moodboards in seconds
  * Multiple design variations per prompt
  * Smart style and color matching

* 🏗️ **Room Classification**
  * 2-level taxonomy system
  * Comprehensive room categorization
  * Intelligent space organization

* 📤 **Export & Share**
  * Multiple export formats (PDF/PNG/JPEG)
  * Image scaling capabilities
  * Easy sharing options

* 👥 **User Experience**
  * Intuitive project wizard
  * Real-time preview
  * Comprehensive history tracking

### Technical Features

* ⚡ Fast page loads (< 2s)
* 🎯 Quick generation (< 15s)
* 🔒 Secure authentication
* 📱 Responsive design
* ♿ Accessibility support

## Tech Stack

* **Frontend**
  * Next.js 14 (App Router)
  * Tailwind CSS + Shadcn UI
  * Zustand for state management

* **Backend**
  * Next.js API Routes
  * Node.js 20
  * PostgreSQL (Neon)

* **Infrastructure**
  * Vercel Platform
  * Vercel Blob Storage
  * Vercel Edge Network

## Getting Started

### Prerequisites

```bash
node >= 20.0.0
pnpm >= 8.0.0
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sergiiklein/moodboard.git
cd moodboard
```

1. Install dependencies:

```bash
pnpm install
```

1. Set up environment variables:

```bash
cp .env.example .env.local
```

1. Run the development server:

```bash
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=your-neon-database-url

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# AI Services
REPLICATE_API_TOKEN=your-replicate-token
OPENAI_API_KEY=your-openai-key
```

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router
├── components/         # React components
├── lib/               # Utility functions
├── styles/           # Global styles
└── types/            # TypeScript types
```

### Key Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm type-check   # Run TypeScript checks
```

### Database Management

```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push     # Push schema changes
pnpm db:studio   # Open Prisma Studio
```

## Documentation

* [API Documentation](./docs/api.md)
* [Database Schema](./docs/database.md)
* [Architecture Overview](./docs/architecture.md)
* [Development Guide](./docs/development.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please check our [documentation](./docs) or contact the development team.

## Roadmap

See our [project roadmap](./docs/project.md) for planned features and improvements.

_Last updated: 2024-03-27
