"use client"
import React from 'react';
import useSWR from "swr";
import {getAllGrades} from "@/services/apis/grades.service";
import GradesTable from "@/app/quan-tri/lop/components/GradesTable";
import AddGrade from "@/app/quan-tri/lop/components/AddGrade";
import {ResponseData} from "@/types";

const GradeWrapper = () => {
    const {data, isLoading, mutate} = useSWR<ResponseData>("api/grades", () => getAllGrades(localStorage.getItem("access-token")));
    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddGrade mutate={mutate}/>
            </div>
            <div className="col-span-8">
                <GradesTable data={data} isLoading={isLoading} mutate={mutate}/>
            </div>
        </div>
    );
};

export default GradeWrapper;