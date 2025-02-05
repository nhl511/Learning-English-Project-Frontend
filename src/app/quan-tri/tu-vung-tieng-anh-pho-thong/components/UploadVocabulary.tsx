import React from 'react';
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import * as XLSX from "xlsx";
import { Vocabulary} from "@/types";
import {Button} from "@/components/ui/button";
import {createMultipleVocabulary} from "@/services/apis/vocabularies.service";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";
import {useSWRConfig} from "swr";

const UploadVocabulary = ({isDialogOpen, setIsDialogOpen}:{isDialogOpen: boolean, setIsDialogOpen: (value: boolean)=>void}) => {
    const [excelData, setExcelData] = React.useState<Vocabulary[]>([]);
    const {toast} = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const { mutate } = useSWRConfig();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    const data = new Uint8Array(e.target.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: "array" });

                    // Assuming the data is in the first sheet
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    // Convert sheet data to JSON
                    const jsonData: Vocabulary[] = XLSX.utils.sheet_to_json(worksheet);
                    setExcelData(jsonData);
                }
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleSubmit = async() => {
        if (excelData.length !== 0) {
            setIsLoading(true)
            const result = await createMultipleVocabulary({vocabularies: excelData, jwt: localStorage.getItem("access-token")});
            switch (result.code){
                case CODE.CREATED:
                    await mutate((key: string) => key.startsWith('api/vocabularies?page='));
                    setIsLoading(false);
                    setIsDialogOpen(false)
                    toast({
                        description: "Upload từ vựng thành công"
                    })
            }
        }
    }

    React.useEffect(()=>{
        if(!isDialogOpen){
            setExcelData([])
        }
    },[isDialogOpen])


    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Thêm từ vựng</DialogTitle>
            </DialogHeader>
            <div className="">
                <Input id="Excel File" type="file" accept=".xls,.xlsx,.csv" onChange={handleFileUpload}/>
            </div>
            <DialogFooter>
                <Button type="submit" className="mt-4" disabled={excelData.length === 0 || isLoading} onClick={handleSubmit}>Tải lên</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default UploadVocabulary;