"use client"
import React from 'react';
import AddUnit from "@/app/quan-tri/unit/components/AddUnit";
import UnitsTable from "@/app/quan-tri/unit/components/UnitsTable";
import useSWR from "swr";
import {getAllUnits} from "@/services/apis/units.service";

const UnitWrapper = () => {
    const {data, isLoading, mutate} = useSWR("api/units", () => getAllUnits(localStorage.getItem("access-token")));
    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddUnit mutate={mutate}/>
            </div>
            <div className="col-span-8">
                <UnitsTable data={data} isLoading={isLoading} mutate={mutate}/>
            </div>
        </div>
    );
};

export default UnitWrapper;