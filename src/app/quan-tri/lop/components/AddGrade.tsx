import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import useSWR from "swr";
import {Curriculum} from "@/types";
import {getActiveCurriculums} from "@/services/apis/curriculums.servicee";
import {createGrade} from "@/services/apis/grades.service";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";


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

const AddGrade = ({mutate}:{mutate: any}) => {
    const {toast} = useToast();
    const {data, isLoading} = useSWR("api/curriculums/active", getActiveCurriculums)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            grade: 0,
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await createGrade({
            gradeNumber: data.grade,
            curriculumId: data.curriculumId,
            jwt: localStorage.getItem("access-token"),
        })
        switch (result.code) {
            case CODE.CREATED:
                mutate();
                form.resetField("grade")
                toast({
                    description: "Thêm lớp thành công"
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
        return (
        <Card className="pt-5 w-full">
            <CardContent>
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
                                                <SelectValue placeholder="Chọn giáo trình" />
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
                        <Button className="mt-4 w-max" type="submit">Tạo</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddGrade;