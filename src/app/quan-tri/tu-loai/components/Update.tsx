import React from 'react';
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useToast} from "@/hooks/use-toast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updatePartsOfSpeech} from "@/services/apis/partsOfSpeech.service";

const FormSchema = z.object({
    name: z.string()
        .min(1, {
            message: "Tối thiểu 1 kí tự"
        })
        .max(20, {
            message: "Tối đa 20 kí tự"
        })
})

const Update = ({id, name, mutate, isDialogOpen, setIsDialogOpen}:{id: string, name: string, mutate: any, isDialogOpen: boolean, setIsDialogOpen: any}) => {
    const {toast} = useToast();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await updatePartsOfSpeech({id, name: data.name, jwt: localStorage.getItem("access-token")})
        switch (result.code) {
            case 200:
                toast({description: "Cập nhật từ loại thành công"});
                mutate();
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
                <DialogTitle>Chỉnh sửa từ loại</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập từ loại" {...field} />
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
};

export default Update;