"use client"
import React from 'react';
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Auth from "@/components/Auth";
import AuthContext from "@/context/AuthContext";
import {NavigationItem} from "@/types";

const Navigation = () => {
    const authContext = React.useContext(AuthContext)


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
                                authContext?.user?.ADMIN && (
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
                    <Auth userLinks={userLinks}/>
                </div>
            </div>
        </div>
    );
};

export default Navigation;