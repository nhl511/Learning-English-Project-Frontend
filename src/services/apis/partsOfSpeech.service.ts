import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";

export const getAllPartsOfSpeech = async ({jwt, page, pageSize}:{jwt: string | null, page: number, pageSize: number}): Promise<ResponseData> => {
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

export const createPartsOfSpeech = async ({name, jwt}:{name: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.partsOfSpeech.base, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updatePartsOfSpeech = async ({id, name, jwt}:{id: string, name: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.partsOfSpeech.base + `/${id}`, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updatePartsOfSpeechStatus = async({id, active, jwt}:{id: string, active: boolean, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.partsOfSpeech.updatePartsOfSpeechStatus + `/${id}`,{
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deletePartsOfSpeech = async({id, jwt}:{id: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.partsOfSpeech.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}
