// app/layout.tsx or app/layout.jsx
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata = {
  title: "My App",
  description: "A beautiful dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
