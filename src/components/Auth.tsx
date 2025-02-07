"use client"
import React from 'react';
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {NavigationItem, User} from "@/types";
import {useRouter} from "next/navigation";
import {logout} from "@/services/apis/auth.service";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";

const Auth = ({userLinks, user}:{userLinks: NavigationItem[], user: User}) => {
    const router = useRouter();
    const { toast } = useToast()

    const handleLogout = async () => {
        const result = await logout();
        switch (result.code) {
            case CODE.SUCCESS:
                router.push("/dang-nhap");
                window.dispatchEvent(new Event("refreshNavbar")); // ✅ Trigger UI update
                toast({
                    description: "Tài khoản của bạn đã đăng xuất",
                })
                break;
        }
    }

    return (
        <div className="flex gap-[26px]">
            {
                user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                {user.EMAIL}
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