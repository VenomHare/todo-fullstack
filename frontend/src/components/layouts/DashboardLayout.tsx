import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../app-sidebar"

type Props = {
    children: React.ReactNode,
    addTask: (title: string, description: string, color:string) => Promise<string | -1>;
    username: string;

}

export default function DashboardLayout({ children, addTask, username }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar addTask={addTask} username={username} />
            <main className='w-full h-screen relative'>
                {children}
            </main>

        </SidebarProvider>
    )
}