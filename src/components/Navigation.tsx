"use server"
import React from 'react';
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Auth from "@/components/Auth";
import {Data, Jwt, NavigationItem} from "@/types";
import {jwtDecode} from "jwt-decode";
import {getUserById} from "@/services/apis/users.service";
import {cookies} from "next/headers";
import RefreshAuth from "@/components/RefreshAuth";

const Navigation = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value
    const decoded = token ? jwtDecode<Jwt>(token) : null
    const response = decoded ? await getUserById(decoded?.userId) : undefined;

    const publicLinks: NavigationItem[] = [{
        title: "Trang chủ",
        path: "/"
    },{
        title: "Khoá học",
        path: "/khoa-hoc"
    }]

    const userLinks: NavigationItem[] = [{
        title: "Thông tin người dùng",
        path: "/nguoi-dung"
    }]

    const adminLinks: NavigationItem[] = [{
        title: "Quản trị",
        path: "/quan-tri"
    }]

    return (
        <div className="h-[60px] flex items-center bg-white fixed top-0 left-0 right-0 z-50">
            <div className="xl:container mx-auto h-full flex justify-between items-center">
                <div>logo</div>
                <div className="flex items-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {
                                publicLinks.map((item: NavigationItem, index: number)=>(
                                    <NavigationMenuItem  key={index}>
                                        <Link href={item.path ?? ""} legacyBehavior passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                {item.title}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))
                            }
                            {
                                (response?.data as Data)?.user?.ADMIN && (
                                    adminLinks.map((item: NavigationItem, index: number)=>(
                                        <NavigationMenuItem  key={index}>
                                            <Link href={item.path ?? ""} legacyBehavior passHref>
                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                    {item.title}
                                                </NavigationMenuLink>
                                            </Link>
                                        </NavigationMenuItem>
                                    ))
                                )
                            }
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Auth userLinks={userLinks} user={(response?.data as Data)?.user} />
                </div>
            </div>
            <RefreshAuth/>
        </div>
    );
};

export default Navigation;