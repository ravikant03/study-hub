import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RouteGuard } from "@/components/RouteGuard";

export const metadata = {
  title: "StudyHub",
  description: "Education platform for courses, instructors, enrollments, and payments."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>
            <RouteGuard>{children}</RouteGuard>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
