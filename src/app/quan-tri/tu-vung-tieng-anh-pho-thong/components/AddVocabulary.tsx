import React from 'react';
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import useSWR, {KeyedMutator} from "swr";
import {getPartsOfSpeechActive} from "@/services/apis/partsOfSpeech.service";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Curriculum, DataList, Grade, PartsOfSpeech, ResponseData, Unit} from "@/types";
import {getActiveCurriculums} from "@/services/apis/curriculums.servicee";
import {getActiveGrades} from "@/services/apis/grades.service";
import {getActiveUnits} from "@/services/apis/units.service";
import {Button} from "@/components/ui/button";
import {createVocabulary} from "@/services/apis/vocabularies.service";
import {CODE} from "@/constant/constant";
import {toast} from "@/hooks/use-toast";

const FormSchema = z.object({
    word: z.string()
        .min(1, {
            message: "Tối thiểu 1 kí tự"
        })
        .max(100, {
            message: "Tối đa 100 kí tự"
        }),
    definition: z.string()
        .min(1, {
            message: "Tối thiểu 1 kí tự"
        })
        .max(100, {
            message: "Tối đa 100 kí tự"
        }),
    transcription: z.string()
        .max(100, {
            message: "Tối đa 100 kí tự"
        }),
    partsOfSpeechId: z.string().optional(),
    curriculumId: z.string({
        required_error: "Chọn giáo trình"
    }).min(1, {message: "Chọn giáo trình"}),
    gradeId: z.string({
        required_error: "Chọn lớp"
    }).min(1, {message: "Chọn lớp"}),
    unitId: z.string({
        required_error: "Chọn unit"
    }).min(1, {message: "Chọn unit"}),
    notes: z.string().max(255, {message: "Tối đa 255 kí tự"})
})

const AddVocabulary = ({isDialogOpen, setIsDialogOpen, mutate}:{isDialogOpen: boolean, setIsDialogOpen: (value: boolean)=>void, mutate: KeyedMutator<ResponseData>}) => {
    const {data: activePartsOfSpeechData} = useSWR<ResponseData>("api/parts-of-speech/active", getPartsOfSpeechActive)
    const {data: activeCurriculumData} = useSWR<ResponseData>("api/curriculums/active", getActiveCurriculums)
    const [curriculumId, setCurriculumId] = React.useState<string>("")
    const [gradeId, setGradeId] = React.useState<string>("")

    const [gradesData, setGradesData] = React.useState<Grade[]>([])
    const [unitsData, setUnitsData] = React.useState<Unit[]>([])


    React.useEffect(()=>{
        if(curriculumId){
            getActiveGrades(curriculumId).then((result: ResponseData)=>{
                setGradesData((result.data as DataList).grades)
            })
        }
    },[curriculumId])

    React.useEffect(()=>{
        if(gradeId){
            getActiveUnits(gradeId).then((result: ResponseData)=>{
                setUnitsData((result.data as DataList).units)
            })
        }
    },[gradeId])

    React.useEffect(()=>{
        if(!isDialogOpen){
            form.reset()
        }
    }, [isDialogOpen]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            word: "",
            definition: "",
            transcription: "",
            notes: ""

        },
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await createVocabulary({
            word: data.word,
            definition: data.definition,
            transcription: data.transcription,
            partsOfSpeechId: data.partsOfSpeechId,
            unitId: data.unitId,
            notes: data.notes,
            jwt: localStorage.getItem("access-token"),
        })
        switch (result.code) {
            case CODE.CREATED:
                form.reset();
                await mutate();
                setIsDialogOpen(false);
                toast({description: "Thêm từ vựng mới thành công"})
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Thêm từ vựng</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="word"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập từ vựng" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="definition"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập định nghĩa" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="transcription"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập phiên âm (Không bắt buộc)" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="partsOfSpeechId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                            <SelectValue placeholder="Chọn từ loại (Không bắt buộc)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Chọn từ loại</SelectLabel>
                                                {
                                                    activePartsOfSpeechData?.data && "partsOfSpeeches" in activePartsOfSpeechData.data &&
                                                    activePartsOfSpeechData?.data.partsOfSpeeches.map((item: PartsOfSpeech, index: number)=>(
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
                        name="curriculumId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select
                                        onValueChange={(selectValue)=> {
                                            setCurriculumId(selectValue)
                                            field.onChange(selectValue)
                                            form.setValue("gradeId", "")
                                            form.setValue("unitId", "")
                                            setUnitsData([])
                                        }}
                                        value={field.value}                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn giáo trình"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Chọn giáo trình</SelectLabel>
                                                {
                                                    activeCurriculumData?.data && "curriculums" in activeCurriculumData.data &&
                                                    activeCurriculumData?.data.curriculums.map((item: Curriculum, index: number)=>(
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
                                        onValueChange={(selectValue)=> {
                                            setGradeId(selectValue)
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
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập ghi chú (Không bắt buộc)" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" className="mt-4">Thêm từ vựng</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
);
};

export default AddVocabulary;