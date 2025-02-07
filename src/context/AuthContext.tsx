"use client"
import React, {ReactNode, useRef} from 'react';
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {AuthContextType, Jwt} from "@/types";
import {logout} from "@/services/apis/auth.service";
import {CODE} from "@/constant/constant";

const AuthContext = React.createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isExpired, setIsExpired] = React.useState(false);
    const router = useRouter()
    const timerId = useRef<NodeJS.Timeout | null>(null)
    const [haveJustLogin, setHaveJustLogin] = React.useState(false);


    const getCookie = (cname: string) => {
        const name = cname + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const scheduleLogout = () => {
        const token = getCookie("access-token");

        if (token) {
            try {
                const decoded = jwtDecode<Jwt>(token);
                const expirationTime = decoded.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();
                const remainingTime = expirationTime - currentTime;

                if (remainingTime <= 0) {
                    logoutUser();
                } else {
                    timerId.current = setTimeout(logoutUser, remainingTime - 3 * 1000);
                }
            } catch {
                logoutUser(); // If decoding fails, assume expired
            }
        }
    };

    const logoutUser = async () => {
        const res = await logout();
        if (res.code === CODE.SUCCESS) {
            setIsExpired(true);
            router.push("/dang-nhap");
            window.dispatchEvent(new Event("refreshNavbar")); // ✅ Trigger UI update
            setHaveJustLogin(false);
        }
    };

    React.useEffect(() => {
        scheduleLogout();

        return () => {
            if (timerId.current) clearTimeout(timerId.current);
        };
    }, []);

    React.useEffect(()=>{
        if(haveJustLogin){
            scheduleLogout();
        }
        return () => {
            if (timerId.current) clearTimeout(timerId.current);
        };
    }, [haveJustLogin])


    return (
        <AlertDialog open={isExpired} onOpenChange={setIsExpired}>
            <AuthContext.Provider value={{setHaveJustLogin, timerId}}>
                {children}
            </AuthContext.Provider>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Thông báo</AlertDialogTitle>
                    <AlertDialogDescription>
                        Phiên đăng nhập của bạn đã hết hạn vui lòng đăng nhập lại.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default AuthContext;