import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Curriculum, DataList, Grade, ResponseData} from "@/types";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useSWR, {useSWRConfig} from "swr";
import {getActiveCurriculums} from "@/services/apis/curriculums.servicee";
import {getActiveGrades} from "@/services/apis/grades.service";
import {createUnit} from "@/services/apis/units.service";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";


const FormSchema = z.object({
    unitNumber: z.coerce.number()
        .min(1, {
            message: "Tối thiểu 1"
        })
        .max(99, {
            message: "Tối đa 99"
        }),
    unitName: z.string()
        .min(1, {
            message: "Tối thiểu 1 kí tự"
        })
        .max(64, {
            message: "Tối đa 64 kí tự"
        }),
    curriculumId: z.string({
        required_error: "Chọn giáo trình"
    }),
    gradeId: z.string({
        required_error: "Chọn lớp"
    }).min(1, {message: "Chọn lớp"})
})

const AddUnit = () => {
    const {data: curriculumsData} = useSWR("api/curriculums/active", getActiveCurriculums)
    const [curriculumId, setCurriculumId] = React.useState<string>("")
    const [gradesData, setGradesData] = React.useState<Grade[]>([])
    const {toast} = useToast();
    const { mutate } = useSWRConfig();


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            unitNumber: 0,
            unitName: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await createUnit({unitNumber: data.unitNumber, unitName: data.unitName, gradeId: data.gradeId})
        switch (result.code) {
            case CODE.CREATED:
                await mutate((key: string) => key.startsWith('api/units?page='));
                toast({
                    description: "Tạo unit thành công"
                })
                form.resetField("unitNumber")
                form.resetField("unitName")
                break;
            case CODE.CONFLICT:
                form.setError("unitNumber", {
                    type: "manual",
                    message: "Unit đã tồn tại",
                });
                break;
        }
    }

    React.useEffect(()=>{
        if(curriculumId){
            getActiveGrades(curriculumId).then((result: ResponseData)=>{
                setGradesData((result.data as DataList).grades)
            })
        }
    },[curriculumId])
    return (
        <Card className="pt-5 w-full">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="unitNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="number" placeholder="Nhập unit" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unitName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="text" placeholder="Nhập tiêu đề" {...field} />
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
                                        <Select
                                            onValueChange={(selectValue)=> {
                                                setCurriculumId(selectValue)
                                                field.onChange(selectValue)
                                                form.setValue("gradeId", "")

                                            }}
                                            value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn giáo trình" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Chọn giáo trình</SelectLabel>
                                                    {
                                                        curriculumsData?.data && "curriculums" in curriculumsData.data &&
                                                        curriculumsData?.data.curriculums.map((item: Curriculum, index: number)=>(
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
                        <FormField
                            control={form.control}
                            name="gradeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn lớp" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Chọn lớp</SelectLabel>
                                                    {
                                                        gradesData.map((item: Grade, index: number)=>(
                                                            <SelectItem key={index} value={item.ID}>Lớp {item.GRADE_NUMBER}</SelectItem>
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

export default AddUnit;