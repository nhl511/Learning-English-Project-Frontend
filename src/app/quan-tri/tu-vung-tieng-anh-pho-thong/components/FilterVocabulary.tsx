import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import useSWR from "swr";
import {Curriculum, DataList, Grade, ResponseData, Unit} from "@/types";
import {getActiveCurriculums} from "@/services/apis/curriculums.servicee";
import {Button} from "@/components/ui/button";
import {getActiveGrades} from "@/services/apis/grades.service";
import {getActiveUnits} from "@/services/apis/units.service";

const FormSchema = z.object({
    curriculumId: z.string(),
    gradeId: z.string(),
    unitId: z.string()
})

const FilterVocabulary = ({setCurriculumId, setGradeId, setUnitId}:{setCurriculumId: (value: string | null)=>void, setGradeId: (value: string | null)=>void, setUnitId: (value: string|null)=>void}) => {
    const {data: curriculumsData} = useSWR<ResponseData>("api/curriculums/active", getActiveCurriculums)
    const [selectedCurriculumId, setSelectedCurriculumId] = React.useState<string>("");
    const [gradesData, setGradesData] = React.useState<Grade[]>([])
    const [unitsData, setUnitsData] = React.useState<Unit[]>([])
    const [selectedGradeId, setSelectedGradeId] = React.useState<string>("")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            curriculumId: "",
            gradeId: "",
            unitId: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setCurriculumId(data.curriculumId ? data.curriculumId : null)
        setGradeId(data.gradeId ? data.gradeId : null)
        setUnitId(data.unitId ? data.unitId : null)
    }

    React.useEffect(()=>{
        if(selectedCurriculumId){
            getActiveGrades(selectedCurriculumId).then((result: ResponseData)=>{
                setGradesData((result.data as DataList).grades)
            })
        }
    },[selectedCurriculumId])

    React.useEffect(()=>{
        if(selectedGradeId){
            getActiveUnits(selectedGradeId).then((result: ResponseData)=>{
                setUnitsData((result.data as DataList).units)
            })
        }
    },[selectedGradeId])
        return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <FormField
                    control={form.control}
                    name="curriculumId"
                    render={({ field }) => (
                        <Select
                            onValueChange={(selectValue)=> {
                                setSelectedCurriculumId(selectValue)
                                field.onChange(selectValue)
                                form.setValue("gradeId", "")
                                form.setValue("unitId", "")
                                setUnitsData([])

                            }}
                            value={field.value}
                        >
                            <SelectTrigger className="w-[180px]">
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
                    )}
                />
                <FormField
                    control={form.control}
                    name="gradeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Select
                                    onValueChange={(selectValue)=> {
                                        setSelectedGradeId(selectValue)
                                        field.onChange(selectValue)
                                        form.setValue("unitId", "")
                                    }}
                                    value={field.value}
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
                <FormField
                    control={form.control}
                    name="unitId"
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
                                        <SelectValue placeholder="Chọn unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Chọn unit</SelectLabel>
                                            {
                                                unitsData.map((item: Unit, index: number)=>(
                                                    <SelectItem key={index} value={item.ID}>Unit {item.UNIT_NUMBER} - {item.UNIT_NAME}</SelectItem>
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
                <Button variant="outline" className="w-max" type="submit">Tìm kiếm</Button>
                <Button variant="outline" className="w-max" onClick={()=> {
                    form.reset()
                    setGradesData([])
                    setUnitsData([])
                    setSelectedCurriculumId("")
                    setSelectedGradeId("")
                }}>Reset</Button>

            </form>
        </Form>
    );
};

export default FilterVocabulary;