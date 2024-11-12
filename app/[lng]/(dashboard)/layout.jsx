import "@/app/[lng]/globals.css";
import SideBar from "@/components/component/sidebar";

export default async function DashboardLayout({ params: { lng }, children }) {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <SideBar lng={lng} />
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
