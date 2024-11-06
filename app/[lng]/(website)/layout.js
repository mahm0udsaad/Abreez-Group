import "@/app/[lng]/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/component/footer";
import NavBar from "@/components/component/navBar";

export const metadata = {
  title: "ABREEZ GROUP",
  description: "Generate Your Resume",
};

export default function RootLayout({ children, params: { lng } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lng={lng} />
      {children}
      <Toaster />
      <Footer lng={lng} />
    </div>
  );
}
