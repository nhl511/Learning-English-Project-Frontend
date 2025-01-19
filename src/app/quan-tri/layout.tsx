import {SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar from "@/app/quan-tri/components/AppSidebar";

export default function AuthLayout({children}: { children: React.ReactNode }) {
    return(
        <SidebarProvider>
            <AppSidebar/>
            <div className="mt-[100px] w-full">
                {children}
            </div>
        </SidebarProvider>
    )
}