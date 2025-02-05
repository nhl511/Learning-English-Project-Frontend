"use client"
import React from 'react';
import AddUnit from "@/app/quan-tri/unit/components/AddUnit";
import UnitsTable from "@/app/quan-tri/unit/components/UnitsTable";

const UnitWrapper = () => {
    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddUnit/>
            </div>
            <div className="col-span-8">
                <UnitsTable/>
            </div>
        </div>
    );
};

export default UnitWrapper;