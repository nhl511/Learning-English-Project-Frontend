"use client"
import React from 'react';
import GradesTable from "@/app/quan-tri/lop/components/GradesTable";
import AddGrade from "@/app/quan-tri/lop/components/AddGrade";

const GradeWrapper = () => {
    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddGrade/>
            </div>
            <div className="col-span-8">
                <GradesTable/>
            </div>
        </div>
    );
};

export default GradeWrapper;