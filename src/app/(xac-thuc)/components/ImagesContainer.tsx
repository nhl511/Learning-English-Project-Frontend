"use client"
import React from 'react';
import Image from "next/image";
import {usePathname} from "next/navigation";

const ImagesContainer = () => {
    const pathname = usePathname()
    return (
        <div className="w-full h-[800px] relative">
            <Image src={ pathname === "/dang-nhap" ? `/login-background.png` : `/register-background.png`} alt="" fill objectFit="cover" className="rounded-3xl" />
        </div>
    );
};

export default ImagesContainer;