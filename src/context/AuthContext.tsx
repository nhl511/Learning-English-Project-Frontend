"use client"
import React, {ReactNode} from 'react';
import {jwtDecode} from "jwt-decode";
import {getUserById} from "@/services/apis/users.service";
import {Jwt, User} from "@/types";
import {useRouter} from "next/navigation";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

const AuthContext = React.createContext<any>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const [isExpired, setIsExpired] = React.useState(false);
    const router = useRouter()

    React.useEffect(() => {
        if (!token) return;

        const decoded = jwtDecode<Jwt>(token);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const timeLeft = expirationTime - Date.now(); // Calculate time left

        if (timeLeft > 0) {
            // Set a timer to check when the token will expire
            const timerId = setTimeout(() => {
                setUser(null)
                localStorage.removeItem("access-token");
                document.cookie = "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                setIsExpired(true);
                router.push("/dang-nhap");
            }, timeLeft);

            // Clean up the timer when component unmounts
            return () => clearTimeout(timerId);
        } else {
            setToken(null);
            localStorage.removeItem("access-token");
            document.cookie = "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            setIsExpired(true)
            router.push("/dang-nhap");
        }
    }, [token]);


    React.useEffect(() => {
        const storedToken = localStorage.getItem("access-token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);


    const fetchUserData = async () => {
        if (!token) return;

        try {
            const decoded = jwtDecode<Jwt>(token)
            const response = await getUserById({id: decoded.userId, jwt: token});
            if(response.data)
                if ('user' in response.data) {
                    setUser(response.data.user)
                }


        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        }
    };

    return (
        <AlertDialog open={isExpired} onOpenChange={setIsExpired}>
            <AuthContext.Provider value={{ token, setToken, user, setUser, fetchUserData }}>
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