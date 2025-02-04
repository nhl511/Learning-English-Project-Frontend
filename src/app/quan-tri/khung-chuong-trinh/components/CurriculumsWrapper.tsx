"use client"
import React from 'react';
import AddCurriculum from "@/app/quan-tri/khung-chuong-trinh/components/AddCurriculum";
import CurriculumsTable from "@/app/quan-tri/khung-chuong-trinh/components/CurriculumsTable";
import useSWR from "swr";
import {getAllCurriculums} from "@/services/apis/curriculums.servicee";
import {ResponseData} from "@/types";

const CurriculumsWrapper = () => {
    const {data, isLoading, mutate} = useSWR<ResponseData>("api/curriculums", () => getAllCurriculums(localStorage.getItem("access-token")));

    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddCurriculum mutate={mutate}/>
            </div>
            <div className="col-span-8">
                <CurriculumsTable data={data} isLoading={isLoading} mutate={mutate}/>
            </div>
        </div>
    );
};

export default CurriculumsWrapper;