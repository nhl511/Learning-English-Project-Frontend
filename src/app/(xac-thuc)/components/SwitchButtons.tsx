"use client"
import React from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";

const SwitchButtons = () => {
    const pathName = usePathname()
    return (
        <div className="flex justify-center items-center bg-secondary w-[100%] sm:w-[80%] h-[59px] rounded-full p-[10px]">
            <Link href="/dang-nhap" className={`${pathName === "/dang-nhap" && "bg-primary"} flex items-center justify-center w-full h-full rounded-full font-medium text-base text-primary-foreground cursor-pointer`}>
                <p>Đăng nhập</p>
            </Link>
            <Link href="/dang-ky" className={` ${pathName === "/dang-ky" && "bg-primary"} flex items-center justify-center w-full h-full rounded-full font-medium text-base text-primary-foreground cursor-pointer`}>
                <p>Đăng ký</p>
            </Link>
        </div>
    );
};

export default SwitchButtons;