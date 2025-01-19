
import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub, SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {Users, Newspaper, Gauge, Shapes} from "lucide-react"
import Link from "next/link";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {SideMenuItem} from "@/types";


const AppSidebar = () => {
    const sideMenuItems: SideMenuItem[] = [
        {
            title: "Bảng điều khiển",
            path: "/quan-tri",
            icon: Gauge
        },
        {
            title: "Người dùng",
            path: "/quan-tri/nguoi-dung",
            icon: Users
        },
        {
            title: "Từ vựng tiếng Anh phổ thông",
            icon: Newspaper,
            subMenuItems: [
                {
                    title: "Giáo trình",
                    path: "/quan-tri/khung-chuong-trinh",
                },
                {
                    title: "Lớp",
                    path: "/quan-tri/lop",
                },
                {
                    title: "Unit",
                    path: "/quan-tri/unit",
                },
                {
                    title: "Từ vựng",
                    path: "/quan-tri/tu-vung-tieng-anh-pho-thong",
                },
            ]
        },
        {
            title: "Từ loại",
            path: "/quan-tri/tu-loai",
            icon: Shapes
        },
    ]
    return (
        <Sidebar className="mt-[80px]">
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sideMenuItems.map((item) => (
                                item.subMenuItems ? (
                                    <SidebarMenuItem key={item.title}>
                                        <Collapsible defaultOpen className="group/collapsible">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <item.icon/>
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="ml-4">
                                                <SidebarMenuSub>
                                                    {
                                                        item.subMenuItems.map((subItem, index: number) => (
                                                            <SidebarMenuSubItem key={index}>
                                                                <SidebarMenuButton asChild>
                                                                    <Link href={subItem.path ?? ""}>
                                                                        <span>{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuButton>                                                          </SidebarMenuSubItem>

                                                        ))
                                                    }
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </SidebarMenuItem>
                                ):(
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.path ?? ""}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;