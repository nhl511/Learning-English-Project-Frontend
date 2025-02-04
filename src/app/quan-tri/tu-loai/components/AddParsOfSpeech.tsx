import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useToast} from "@/hooks/use-toast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CODE} from "@/constant/constant";
import {createPartsOfSpeech} from "@/services/apis/partsOfSpeech.service";
import {KeyedMutator} from "swr";
import {ResponseData} from "@/types";


const FormSchema = z.object({
    name: z.string()
        .min(1, {
            message: "Tối thiểu 1 kí tự"
        })
        .max(20, {
            message: "Tối đa 20 kí tự"
        })
})


const AddParsOfSpeech = ({mutate}:{mutate: KeyedMutator<ResponseData>}) => {
    const {toast} = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await createPartsOfSpeech({name: data.name, jwt: localStorage.getItem("access-token")});
        switch (result.code){
            case CODE.CREATED:
                mutate();
                form.reset();
                toast({
                    description: "Tạo từ loại thành công",
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
                                        <Input type="text" placeholder="Nhập tên từ loại" {...field} />
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

export default AddParsOfSpeech;