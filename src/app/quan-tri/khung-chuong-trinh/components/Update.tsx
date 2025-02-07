import React from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {updateCurriculum} from "@/services/apis/curriculums.servicee";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {KeyedMutator} from "swr";
import {ResponseData} from "@/types";

const FormSchema = z.object({
    name: z.string()
        .min(1, {
            message: "Tối thiểu 1 kí tự"
        })
        .max(64, {
            message: "Tối đa 64 kí tự"
        })
})

const Update = ({id, name, mutate, isDialogOpen, setIsDialogOpen}:{id: string, name: string, mutate: KeyedMutator<ResponseData>, isDialogOpen: boolean, setIsDialogOpen: (value: boolean)=>void}) => {
    const {toast} = useToast();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await updateCurriculum({id, name: data.name})
        switch (result.code) {
            case 200:
                toast({description: "Cập nhật giáo trình thành công"});
                await mutate();
                setIsDialogOpen(false);
                break;
        }
    }

    React.useEffect(()=>{
        if(isDialogOpen)
            form.setValue("name", name)
        else{
            form.reset()
        }

    }, [isDialogOpen])


    return (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa giáo trình</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="text" placeholder="Nhập tên giáo trình" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                                <Button type="submit" className="mt-4">Lưu thay đổi</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        );
    }
export default Update;