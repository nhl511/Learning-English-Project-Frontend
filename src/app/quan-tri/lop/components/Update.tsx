import React from 'react';
import {z} from "zod";
import {useToast} from "@/hooks/use-toast";
import useSWR from "swr";
import {getActiveCurriculums} from "@/services/apis/curriculums.servicee";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Curriculum} from "@/types";
import {updateGrade} from "@/services/apis/grades.service";
import {CODE} from "@/constant/constant";

const FormSchema = z.object({
    grade: z.coerce.number()
        .min(1, {
            message: "Tối thiểu 1"
        })
        .max(12, {
            message: "Tối đa 12"
        }),
    curriculumId: z.string({
        required_error: "Chọn giáo trình"
    })
})

const Update = ({id, grade, curriculumId, mutate, isDialogOpen, setIsDialogOpen}:{id: string, grade: number, curriculumId: string, mutate: any, isDialogOpen: boolean, setIsDialogOpen: any}) => {
    const {toast} = useToast();
    const {data, isLoading} = useSWR("api/curriculums/active", getActiveCurriculums)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            grade: 0,
        },
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await updateGrade({id, grade: data.grade, curriculumId: data.curriculumId, jwt: localStorage.getItem("access-token")})
        switch (result.code) {
            case CODE.SUCCESS:
                mutate();
                setIsDialogOpen(false)
                toast({
                    description: "Cập nhật lớp thành công"
                })
                break;
            case CODE.CONFLICT:
                form.setError("grade", {
                    type: "manual",
                    message: "Lớp đã tồn tại",
                });
                break;

        }
    }

    React.useEffect(()=>{
        if(isDialogOpen){
            form.setValue("grade", grade)
            form.setValue("curriculumId", curriculumId)
        }else{
            form.reset()
        }

    },[isDialogOpen])

        return (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa lớp</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="number" placeholder="Nhập lớp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="curriculumId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn giáo trình"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Chọn giáo trình</SelectLabel>
                                                    {
                                                        data?.data && "curriculums" in data.data &&
                                                        data?.data.curriculums.map((item: Curriculum, index: number)=>(
                                                            <SelectItem key={index} value={item.ID}>{item.NAME}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
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