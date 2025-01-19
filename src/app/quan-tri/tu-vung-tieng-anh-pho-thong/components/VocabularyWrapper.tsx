"use client"
import React from 'react';
import VocabulariesTable from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/VocabulariesTable";
import useSWR from "swr";
import {getAllVocabularies} from "@/services/apis/vocabularies.service";
import {Dialog} from "@/components/ui/dialog";
import AddVocabulary from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/AddVocabulary";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {FileUp, Plus} from "lucide-react";
import UploadVocabulary from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/UploadVocabulary";

const VocabularyWrapper = () => {
    const {data, isLoading, mutate} = useSWR("api/vocabularies", () => getAllVocabularies(localStorage.getItem("access-token")))
    const [isAddVocabularyDialogOpen, setIsAddVocabularyDialogOpen] = React.useState(false);
    const [isUploadVocabularyDialogOpen, setIsUploadVocabularyDialogOpen] = React.useState(false);
    return (
        <div>
                <DropdownMenu>
                    <div className="flex justify-end w-full gap-4 mb-5">
                        <DropdownMenuTrigger asChild>
                           <Button>Thêm từ vựng</Button>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setIsAddVocabularyDialogOpen(true)}><Plus/>Thêm từ vựng</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsUploadVocabularyDialogOpen(true)}><FileUp />Thêm từ vựng từ file excel</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            <Dialog open={isAddVocabularyDialogOpen} onOpenChange={setIsAddVocabularyDialogOpen}>
                <AddVocabulary isDialogOpen={isAddVocabularyDialogOpen} setIsDialogOpen={setIsAddVocabularyDialogOpen} mutate={mutate}/>
            </Dialog>
            <Dialog open={isUploadVocabularyDialogOpen} onOpenChange={setIsUploadVocabularyDialogOpen}>
                <UploadVocabulary isDialogOpen={isUploadVocabularyDialogOpen} setIsDialogOpen={setIsUploadVocabularyDialogOpen} mutate={mutate}/>
            </Dialog>
            <VocabulariesTable data={data} isLoading={isLoading} mutate={mutate}/>
        </div>
    );
};

export default VocabularyWrapper;