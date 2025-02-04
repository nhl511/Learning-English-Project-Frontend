"use client"
import React from 'react';
import useSWR from "swr";
import {getAllPartsOfSpeech} from "@/services/apis/partsOfSpeech.service";
import AddParsOfSpeech from "@/app/quan-tri/tu-loai/components/AddParsOfSpeech";
import PartsOfSpeechTable from "@/app/quan-tri/tu-loai/components/PartsOfSpeechTable";
import {ResponseData} from "@/types";

const PartsOfSpeechWrapper = () => {
    const {data, isLoading, mutate} = useSWR<ResponseData>("api/parts-of-speech", () => getAllPartsOfSpeech(localStorage.getItem("access-token")));

    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddParsOfSpeech mutate={mutate}/>
            </div>
            <div className="col-span-8">
                <PartsOfSpeechTable data={data} isLoading={isLoading} mutate={mutate}/>
            </div>
        </div>
    );
};

export default PartsOfSpeechWrapper;