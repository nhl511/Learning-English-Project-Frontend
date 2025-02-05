"use client"
import React from 'react';
import AddCurriculum from "@/app/quan-tri/khung-chuong-trinh/components/AddCurriculum";
import CurriculumsTable from "@/app/quan-tri/khung-chuong-trinh/components/CurriculumsTable";

const CurriculumsWrapper = () => {

    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddCurriculum/>
            </div>
            <div className="col-span-8">
                <CurriculumsTable/>
            </div>
        </div>
    );
};

export default CurriculumsWrapper;