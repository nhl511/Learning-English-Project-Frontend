"use server"
import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";
import {cookies} from "next/headers";

export const getAllPartsOfSpeech = async ({page, pageSize}:{page: number, pageSize: number}): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.get(ENDPOINTS.partsOfSpeech.base, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        params: {
            page,
            pageSize,
        }
    })
    return result;
}

export const getPartsOfSpeechActive = async(): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.partsOfSpeech.activePartsOfSpeech)
    return result;
}

export const createPartsOfSpeech = async (name: string):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.post(ENDPOINTS.partsOfSpeech.base, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updatePartsOfSpeech = async ({id, name}:{id: string, name: string}):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.partsOfSpeech.base + `/${id}`, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updatePartsOfSpeechStatus = async({id, active}:{id: string, active: boolean}):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.partsOfSpeech.updatePartsOfSpeechStatus + `/${id}`,{
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deletePartsOfSpeech = async(id: string):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.partsOfSpeech.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}
