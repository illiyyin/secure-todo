# Secure Todo App

A simple todo application built with Next.js and LibSQL (SQLite) featuring local encryption at rest.

## Features

- **Local SQLite Database**: All data is stored locally using LibSQL
- **Encryption at Rest**: Database is encrypted using user-provided encryption key
- **User-Defined Database Location**: Choose where to store your database file
- **Full CRUD Operations**: Create, read, update, and delete todos
- **Secure Configuration**: Encryption key is never stored in plain text
- **No External Dependencies**: Everything runs locally

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## First Time Setup

When you first access the application, you'll be prompted to:

1. **Set an Encryption Key**: Choose a strong password (minimum 8 characters) that will be used to encrypt your database
2. **Choose Database Location**: Specify where to store your encrypted database file (default: `./todos.db`)

⚠️ **Important**: Remember your encryption key! If you lose it, you won't be able to access your todos.

## Usage

After setup, you can:
- Add new todos by typing in the input field and clicking "Add"
- Mark todos as complete by clicking the checkbox
- Edit todos by clicking the edit icon
- Delete todos by clicking the trash icon
- Logout to clear your configuration (you'll need to set up again)

## Security Features

- Database encryption using LibSQL's built-in encryption (SQLCipher)
- Encryption key stored in browser's localStorage (client-side only)
- Server-side configuration stored in secure HTTP-only cookies
- No data is sent to external servers

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Database**: LibSQL (SQLite fork with encryption support)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Development

The project structure:
```
simple-todo/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── setup/       # Setup page
│   └── page.tsx     # Main todo page
├── components/       # React components
├── lib/             # Utility functions
└── public/          # Static assets
```

## License

MIT
