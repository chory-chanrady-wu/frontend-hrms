# HRM System Frontend By CHORY Chanrady

A modern Human Resource Management (HRM) system frontend built with Next.js, React, and TypeScript. This project provides a comprehensive UI for managing employees, departments, attendance, payroll, recruitment, and more.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (v16)
- **Language:** TypeScript, React 19
- **Styling:** Tailwind CSS, PostCSS
- **UI Components:** shadcn/ui, Radix UI, lucide-react
- **State/Data:** @tanstack/react-query
- **Utilities:** date-fns, clsx, xlsx, sweetalert2
- **Linting/Formatting:** ESLint, Prettier
- **Package Manager:** pnpm

---

## 🏗️ Project Structure

```
frontend/
├── components/           # Shared UI components
├── hooks/                # Custom React hooks for data fetching
├── lib/                  # API utilities, authentication, types
├── middleware/           # Middleware logic
├── public/               # Static assets
├── src/app/              # Next.js app directory (pages, layouts)
├── tailwind.config.js    # Tailwind CSS config
├── package.json          # Project metadata and scripts
└── ...
```

---

## 🌐 Hosting Architecture

- **Frontend:** Hosted on [Vercel](https://vercel.com/)
- **Backend:** Node.js/Express API hosted on a VPS (e.g., DigitalOcean, AWS EC2)
- **Database:** (e.g., PostgreSQL/MySQL) hosted on the same VPS as backend
- **Image Storage:** [Cloudinary](https://cloudinary.com/) (for user-uploaded images)

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd frontend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-url
```

### 4. Run the development server

```bash
pnpm dev
```

Visit [http://localhost:8888](http://localhost:8888) to view the app.

### 5. Build for production

```bash
pnpm build
pnpm start
```

---

## 🛠️ Available Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- `pnpm lint:fix` — Fix lint errors
- `pnpm format:check` — Check formatting
- `pnpm format:fix` — Format code
- `pnpm clean:deps` — Prune and dedupe dependencies

---

## 📚 Features

- User authentication (login, protected routes)
- Employee, department, and position management
- Attendance and leave tracking
- Payroll management
- Announcements and notifications
- Recruitment (job postings, candidates, interviews)
- Role-based access control
- Audit logs
- Responsive, modern UI

---

## 📦 API Integration

All data is fetched from the backend API defined by `NEXT_PUBLIC_API_BASE_URL`.

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Vercel](https://vercel.com/)

---
