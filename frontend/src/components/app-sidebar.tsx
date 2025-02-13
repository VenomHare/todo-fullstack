import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutList, Plus } from "lucide-react"
import { NavUser } from "./nav-user"
import NewTodo from "./NewTodo"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { useState } from "react"

type Props = {
    addTask: (title: string, description: string, color:string) => Promise<string | -1>;
    username: string;
}

export function AppSidebar({addTask, username}:Props) {

    const [open, setOpen] = useState(false);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>

                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#" className="flex gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                                    <LayoutList className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-xl">Todos</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Todos</SidebarGroupLabel>
                    <SidebarGroupContent>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger className="w-full">
                                    <SidebarMenuButton className="w-full">
                                        <Plus /> 
                                        <span>Add New Todo</span>
                                    </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                    <NewTodo addTask={addTask} open={open} setOpen={setOpen}/>
                                </DialogContent>
                            </Dialog>
                    </SidebarGroupContent>
                </SidebarGroup >
            </SidebarContent>
            <SidebarFooter >
                <NavUser user={{ name: username, email: username, avatar: "https://t3.ftcdn.net/jpg/07/24/59/76/240_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg" }} />
            </SidebarFooter>
        </Sidebar>
    )
}