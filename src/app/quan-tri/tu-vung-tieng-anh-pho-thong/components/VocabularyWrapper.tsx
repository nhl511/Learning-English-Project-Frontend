"use client"
import React from 'react';
import VocabulariesTable from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/VocabulariesTable";
import {Dialog} from "@/components/ui/dialog";
import AddVocabulary from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/AddVocabulary";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {FileUp, Plus} from "lucide-react";
import UploadVocabulary from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/UploadVocabulary";
import FilterVocabulary from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/FilterVocabulary";

const VocabularyWrapper = () => {
    const [isAddVocabularyDialogOpen, setIsAddVocabularyDialogOpen] = React.useState(false);
    const [isUploadVocabularyDialogOpen, setIsUploadVocabularyDialogOpen] = React.useState(false);
    const [curriculumId, setCurriculumId] = React.useState<string | null>(null);
    const [gradeId, setGradeId] = React.useState<string | null>(null);
    const [unitId, setUnitId] = React.useState<string | null>(null);

    return (
        <div>
                <DropdownMenu>
                    <div className="flex justify-between w-full gap-4 mb-5">
                        <FilterVocabulary setCurriculumId={setCurriculumId} setGradeId={setGradeId} setUnitId={setUnitId} />
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
                <AddVocabulary isDialogOpen={isAddVocabularyDialogOpen} setIsDialogOpen={setIsAddVocabularyDialogOpen}/>
            </Dialog>
            <Dialog open={isUploadVocabularyDialogOpen} onOpenChange={setIsUploadVocabularyDialogOpen}>
                <UploadVocabulary isDialogOpen={isUploadVocabularyDialogOpen} setIsDialogOpen={setIsUploadVocabularyDialogOpen}/>
            </Dialog>
            <VocabulariesTable selectedCurriculumId={curriculumId} selectedGradeId={gradeId} selectedUnitId={unitId} />
        </div>
    );
};

export default VocabularyWrapper;