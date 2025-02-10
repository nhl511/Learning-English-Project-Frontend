"use client"
import React, {useContext} from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from "zod"
import {AlertCircle, Eye, EyeClosed} from "lucide-react";
import Link from "next/link";
import {login} from "@/services/apis/auth.service";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useRouter} from "next/navigation";
import AuthContext from "@/context/AuthContext";



const FormSchema = z.object({
    email: z.string().email({message: 'Email không hợp lệ'}),
    password: z.string()
        .min(6, {
            message: "Tối thiểu 6 kí tự"
        })
        .max(64, {
            message: "Tối đa 64 kí tự"
        })
})

const LoginForm = () => {
    const { toast } = useToast()
    const [errorMessage, setErrorMessage] = React.useState<string>("")
    const [isShowPassword, setIsShowPassword] = React.useState<boolean>(false)
    const router = useRouter()
    const authContext = useContext(AuthContext)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await login({email: data.email, password: data.password})
        switch (result.code) {
            case CODE.SUCCESS:
                toast({
                    description: "Đăng nhập thành công!",
                })
                router.push("/")
                window.dispatchEvent(new Event("refreshNavbar"));
                authContext?.setHaveJustLogin(true)
                break;
            case CODE.WRONG_CREDENTIALS:
                setErrorMessage("Sai Email hoặc mật khẩu")
                break;
            case CODE.FORBIDDEN:
                setErrorMessage("Tài khoản chưa xác nhận email")
                break;
            case CODE.BANNED:
                setErrorMessage("Tài khoản của bạn đã bị chặn. Vui lòng liên hệ quản trị viên để được hỗ trợ.")
                break;

        }
    }

    React.useEffect(()=>{
        if(authContext?.timerId.current)
        clearTimeout(authContext?.timerId.current);
        authContext?.setHaveJustLogin(false)
    },[])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="space-y-[30px]">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-normal">Email <span
                                    className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="email" placeholder="Nhập email của bạn" {...field} className="rounded-full border-primary h-[54px] py-4 pl-[31px] mt-3" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-normal">Mật khẩu <span
                                    className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type={isShowPassword ? "text" : "password"} placeholder="Nhập mật khẩu của bạn" {...field} className="rounded-full border-primary h-[54px] py-4 pl-[31px] mt-3" />
                                        {
                                            isShowPassword ? (
                                                <EyeClosed onClick={()=>setIsShowPassword(false)} size={18} className="absolute top-1/2 right-7 -translate-y-1/2 cursor-pointer"/>

                                            ) : (
                                                <Eye onClick={()=>setIsShowPassword(true)} size={18} className="absolute top-1/2 right-7 -translate-y-1/2 cursor-pointer"/>
                                            )
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {
                    errorMessage && (
                        <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Đăng nhập thất bại</AlertTitle>
                            <AlertDescription>
                                {errorMessage}
                            </AlertDescription>
                        </Alert>
                    )
                }
                <div className="w-full flex flex-col items-end mt-[22px]">
                    <Link href="" className="font-light text-xs">Quên mật khẩu?</Link>
                    <Button type="submit" className="mt-[62px] w-1/2 rounded-full text-base font-normal h-[49px] py-3">Đăng nhập</Button>
                </div>
            </form>
        </Form>
    );
};

export default LoginForm;