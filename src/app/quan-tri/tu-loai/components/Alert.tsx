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
import {deletePartsOfSpeech} from "@/services/apis/partsOfSpeech.service";

const Alert = ({id, mutate}:{id: string, mutate: any}) => {
    const {toast} = useToast();

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chắn chứ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Hành động này sẽ xoá từ loại vĩnh viến
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={async()=>{
                    const result = await deletePartsOfSpeech({id: id, jwt: localStorage.getItem("access-token")});
                    switch (result?.code) {
                        case CODE.SUCCESS: toast(
                            {description: "Xoá từ loại thành công"}
                        ); mutate(); break;
                    }
                }}>Xoá từ loại</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
};

export default Alert;