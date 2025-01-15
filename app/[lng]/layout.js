import "@/app/[lng]/globals.css";
import { dir } from "i18next";
import { languages } from "@/app/i18n/settings";
import { Toaster } from "@/components/ui/toaster";
import DirProvider from "@/components/wrappers/dir-provider";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata = {
  title: "ABREEZ GROUP",
  description: "Generate Your Resume",
};

export default function RootLayout({ children, params: { lng } }) {
  return (
    <DirProvider lng={lng}>
      <html lang={lng} dir={dir(lng)}>
        <link rel="icon" href="/fav.jpg" />
        <body className="min-h-screen bg-gray-50">
          {children}
          <Toaster />
        </body>
      </html>
    </DirProvider>
  );
}
