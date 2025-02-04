import React from 'react';
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";
import {deleteGrade} from "@/services/apis/grades.service";
import {KeyedMutator} from "swr";
import {ResponseData} from "@/types";

const Alert = ({id, mutate}:{id: string, mutate: KeyedMutator<ResponseData>}) => {
    const {toast} = useToast();

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chắn chứ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Hành động này sẽ xoá lớp vĩnh viến
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={async()=>{
                    const result = await deleteGrade({id: id, jwt: localStorage.getItem("access-token")});
                    switch (result?.code) {
                        case CODE.SUCCESS: toast(
                            {description: "Xoá lớp thành công"}
                        ); mutate(); break;
                    }
                }}>Xoá lớp</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
};

export default Alert;