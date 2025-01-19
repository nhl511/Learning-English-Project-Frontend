"use client"
import React from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Eye, EyeClosed, MailCheck} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";
import {register} from "@/services/apis/auth.service";
import {CODE} from "@/constant/constant";

const FormSchema = z.object({
    email: z.string().email({message: 'Email không hợp lệ'}),
    password: z.string()
        .min(6, {
            message: "Tối thiểu 6 kí tự"
        })
        .max(64, {
            message: "Tối đa 64 kí tự"
        }),
    repeatPassword: z.string(),
})
    .refine((data) => data.password === data.repeatPassword, {
        message: "Mật khẩu không khớp",
        path: ["repeatPassword"],
    });

const RegisterForm = () => {

    const [isShowPassword, setIsShowPassword] = React.useState(false);
    const [isShowRepeatPassword, setIsShowRepeatPassword] = React.useState(false);
    const [isOpenDialog, setIsOpenDialog] = React.useState(false);
    const [toEmail, setToEmail] = React.useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            repeatPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await register({email: data.email, password: data.password, firstName: "", lastName: ""})
        switch (result.code) {
            case CODE.CONFLICT:
                form.setError("email", {
                    type: "manual",
                    message: "Email đã tồn tại",
                });
                break;
            case CODE.CREATED:
                setIsOpenDialog(true);
                break;
        }
        setToEmail(data.email)
    }

    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
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
                                                ):(
                                                    <Eye onClick={()=>setIsShowPassword(true)} size={18} className="absolute top-1/2 right-7 -translate-y-1/2 cursor-pointer"/>
                                                )
                                            }
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="repeatPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-normal">Nhập lại mật khẩu <span
                                        className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={isShowRepeatPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu của bạn" {...field} className="rounded-full border-primary h-[54px] py-4 pl-[31px] mt-3" />
                                            {
                                                isShowRepeatPassword ? (
                                                    <EyeClosed onClick={()=> setIsShowRepeatPassword(false)} size={18} className="absolute top-1/2 right-7 -translate-y-1/2 cursor-pointer"/>

                                                ):(
                                                    <Eye onClick={()=> setIsShowRepeatPassword(true)} size={18} className="absolute top-1/2 right-7 -translate-y-1/2 cursor-pointer"/>
                                                )
                                            }
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full flex flex-col items-end mt-[22px]">
                        <Button type="submit" className="mt-[62px] w-1/2 rounded-full text-base font-normal h-[49px] py-3">Đăng ký</Button>
                    </div>
                </form>
            </Form>
            <DialogContent className="sm:max-w-[425px] xl:max-w-[700px] flex flex-col items-center">
                <div className="w-20 h-20 bg-primary rounded-full flex justify-center items-center text-white">
                    <MailCheck size={28} />
                </div>
                <div>
                    <DialogTitle className="text-xl text-center font-semibold">Xác nhận Email của bạn</DialogTitle>
                    <DialogDescription className="mt-4 text-center font-normal">{`Hệ thống đã gửi một email đến ${toEmail} để xác nhận địa chỉ email và kích hoạt tài khoản của bạn. Đường dẫn trong email sẽ hết hạn trong 24 giờ`}</DialogDescription>
                </div>
                <DialogFooter>
                        <Button onClick={()=>setIsOpenDialog(false)}>OK</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
};

export default RegisterForm;