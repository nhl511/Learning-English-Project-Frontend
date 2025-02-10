"use server"
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";
import {ResponseData, Vocabulary} from "@/types";
import {cookies} from "next/headers";

export const getAllVocabularies = async ({ page, pageSize}:{page: number, pageSize: number}):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.get(ENDPOINTS.vocabularies.base, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        params: {
            page,
            pageSize,
        }
    })
    return result
}

export const createVocabulary = async({word, definition, transcription, unitId, notes}:{word: string, definition: string, transcription: string, unitId: string, notes: string}):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.post(ENDPOINTS.vocabularies.base, {
        word,
        definition,
        transcription,
        unitId,
        notes,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const createMultipleVocabulary = async(vocabularies: Vocabulary[]):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.post(ENDPOINTS.vocabularies.addManyVocabulary, vocabularies,{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateVocabularyStatus = async({id, active}:{id: string, active: boolean}):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.vocabularies.updateVocabularyStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateVocabulary = async({id, word, definition, transcription, unitId, notes}:{id: string, word: string, definition: string, transcription: string | undefined, unitId: string, notes: string}):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.vocabularies.base + `/${id}`, {
        word,
        definition,
        transcription,
        unitId,
        notes,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deleteVocabulary = async(id: string):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.vocabularies.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}