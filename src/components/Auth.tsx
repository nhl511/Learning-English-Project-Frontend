"use client"
import React from 'react';
import Link from "next/link";
import AuthContext from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {NavigationItem} from "@/types";
import {useRouter} from "next/navigation";

const Auth = ({userLinks}:{userLinks: NavigationItem[]}) => {
    const authContext = React.useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        authContext.setToken(null)
        authContext.setUser(null)
        localStorage.removeItem("access-token");
        document.cookie = "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        router.push("/");
    }

    React.useEffect(() => {
        if(authContext.token)
            authContext.fetchUserData();
    }, [authContext.token]);


    return (
        <div className="flex gap-[26px]">
            {
                authContext.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                {authContext.user.EMAIL}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {
                                        userLinks.map((link: NavigationItem, index: number) => (
                                            <Link key={index} href={link.path ?? ""}>
                                                <DropdownMenuItem key={index}>{link.title}</DropdownMenuItem>
                                            </Link>
                                        ))
                                    }
                                </DropdownMenuGroup>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                ):(
                    <>
                        <Link href="/dang-nhap">
                            <div className="py-3 px-6 flex items-center justify-center rounded-3xl text-base]">
                                Đăng nhập
                            </div>
                        </Link>
                        <Link href="/dang-ky">
                            <div className="py-3 px-6 flex items-center justify-center rounded-3xl text-base">
                                Đăng ký
                            </div>
                        </Link>
                    </>
                )
            }

        </div>
    );
};

export default Auth;