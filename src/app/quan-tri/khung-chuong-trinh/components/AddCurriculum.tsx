import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {createCurriculum} from "@/services/apis/curriculums.servicee";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSWRConfig} from "swr";


const FormSchema = z.object({
    name: z.string()
        .min(1, {
            message: "Tối thiểu 1 kí tự"
        })
        .max(64, {
            message: "Tối đa 64 kí tự"
        })
})


const AddCurriculum = () => {
    const {toast} = useToast();
    const { mutate } = useSWRConfig();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await createCurriculum({name: data.name, jwt: localStorage.getItem("access-token")});
        switch (result.code){
            case CODE.CREATED:
                await mutate((key: string) => key.startsWith('api/curriculums?page='));
                form.reset();
                toast({
                    description: "Tạo giáo trình thành công",
                })
        }
    }

        return (
        <Card className="pt-5 w-full">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                            <Input type="text" placeholder="Nhập tên giáo trình" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="mt-4" type="submit">Tạo</Button>

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddCurriculum;