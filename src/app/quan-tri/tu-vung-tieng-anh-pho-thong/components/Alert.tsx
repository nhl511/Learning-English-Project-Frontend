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
import {deleteVocabulary} from "@/services/apis/vocabularies.service";

const Alert = ({id, mutate}:{id: string, mutate: any}) => {
    const {toast} = useToast();

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chắn chứ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Hành động này sẽ xoá từ vựng vĩnh viến
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={async()=>{
                    const result = await deleteVocabulary({id: id, jwt: localStorage.getItem("access-token")});
                    switch (result?.code) {
                        case CODE.SUCCESS: toast(
                            {description: "Xoá từ vựng thành công"}
                        ); mutate(); break;
                    }
                }}>Xoá từ vựng</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
};

export default Alert;