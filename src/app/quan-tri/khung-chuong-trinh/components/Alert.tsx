import React from 'react';
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {deleteCurriculum} from "@/services/apis/curriculums.servicee";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";
import {KeyedMutator} from "swr";
import {ResponseData} from "@/types";

const Alert = ({id, mutate}:{id: string, mutate: KeyedMutator<ResponseData>}) => {
    const {toast} = useToast();
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chắn chứ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Hành động này sẽ xoá giáo trình vĩnh viến
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={async()=>{
                    const result = await deleteCurriculum(id);
                    switch (result?.code) {
                        case CODE.SUCCESS:
                            toast({description: "Xoá giáo trình thành công"});
                            await mutate();
                            break;
                    }
                }}>Xoá giáo trình</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
};

export default Alert;