"use client"
import React from 'react';
import {useRouter} from "next/navigation";

const RefreshAuth = () => {
    const router = useRouter();

    React.useEffect(() => {
        const handleLoginSuccess = () => {
            router.refresh(); // 🔄 Refresh the server component after login
        };

        // Listen for login success event
        window.addEventListener("refreshNavbar", handleLoginSuccess);

        return () => {
            window.removeEventListener("refreshNavbar", handleLoginSuccess);
        };
    }, [router]);

    return null;
};

export default RefreshAuth;