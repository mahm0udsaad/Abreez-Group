import "@/app/[lng]/globals.css";
import { dir } from "i18next";
import { languages } from "@/app/i18n/settings";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/component/footer";
import NavBar from "@/components/component/navBar";
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata = {
  title: "ABREEZ GROUP",
  description: "Generate Your Resume",
};

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <link rel="icon" href="/fav.jpg" />
      <body className="min-h-screen bg-gray-50">
        <NavBar />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
