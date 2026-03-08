import type { Metadata } from "next";
import { Providers } from "./providers";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "HR Suite",
  description: "Modern HR Management System",
  icons: {
    icon: "../../public/assets/hrms.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
