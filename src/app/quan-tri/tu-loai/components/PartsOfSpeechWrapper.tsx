"use client"
import React from 'react';
import AddParsOfSpeech from "@/app/quan-tri/tu-loai/components/AddParsOfSpeech";
import PartsOfSpeechTable from "@/app/quan-tri/tu-loai/components/PartsOfSpeechTable";

const PartsOfSpeechWrapper = () => {
    return (
        <div className="grid grid-cols-12 mt-5 space-x-8">
            <div className="col-span-4">
                <AddParsOfSpeech/>
            </div>
            <div className="col-span-8">
                <PartsOfSpeechTable/>
            </div>
        </div>
    );
};

export default PartsOfSpeechWrapper;