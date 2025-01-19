import React from 'react';
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
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
import {Curriculum, Grade} from "@/types";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {getActiveGrades} from "@/services/apis/grades.service";
import {CODE} from "@/constant/constant";
import useSWR from "swr";
import {getActiveCurriculums} from "@/services/apis/curriculums.servicee";
import {updateUnit} from "@/services/apis/units.service";
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

const Update = ({id, unitNumber, unitName, curriculumId, setCurriculumId, gradeId, isDialogOpen, setIsDialogOpen, mutate}:{id: string, unitNumber: number, unitName: string, curriculumId: string, setCurriculumId: any, gradeId: string, isDialogOpen: boolean, setIsDialogOpen: any, mutate: any}) => {
    const {data: curriculumsData} = useSWR("api/curriculums/active", getActiveCurriculums)
    const [gradesData, setGradesData] = React.useState<Grade[]>([])
    const {toast} = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            unitNumber: 0,
            unitName: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await updateUnit({
            id,
            unitNumber: data.unitNumber,
            unitName: data.unitName,
            gradeId: data.gradeId,
            jwt: localStorage.getItem("access-token"),
        })
        switch (result?.code) {
            case CODE.SUCCESS:
                toast({
                    description: "Cập nhật unit thành công"
                })
                mutate();
                setIsDialogOpen(false);
        }
    }

    React.useEffect(()=>{
        if(curriculumId){
            getActiveGrades(curriculumId)
                .then((result: any)=>{
                    setGradesData(result.data.grades)
                })
        }
    },[curriculumId])

    React.useEffect(()=>{
        if(isDialogOpen){
            form.setValue("unitNumber", unitNumber)
            form.setValue("unitName", unitName)
            form.setValue("curriculumId", curriculumId)
            form.setValue("gradeId", gradeId)
        }else{
            form.reset()
        }
    }, [isDialogOpen]);


    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Chỉnh sửa unit</DialogTitle>
            </DialogHeader>
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
                                        onValueChange={(selectValue) => {
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
                                        value={field.value || ""}
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
                                                    gradesData?.map((item: Grade, index: number)=>(
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
                    <DialogFooter>
                        <Button type="submit" className="mt-4">Lưu thay đổi</Button>
                    </DialogFooter>
                </form>
            </Form>

        </DialogContent>
    );
};

export default Update;