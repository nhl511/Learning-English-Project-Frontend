import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";
import {ResponseData, Vocabulary} from "@/types";

export const getAllVocabularies = async (jwt: string | null):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.vocabularies.base, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}

export const createVocabulary = async({word, definition, transcription, partsOfSpeechId, unitId, notes, jwt}:{word: string, definition: string, transcription: string, partsOfSpeechId: string | undefined, unitId: string, notes: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.vocabularies.base, {
        word,
        definition,
        transcription,
        partsOfSpeechId,
        unitId,
        notes,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const createMultipleVocabulary = async({vocabularies, jwt}:{vocabularies: Vocabulary[], jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.vocabularies.addManyVocabulary, vocabularies,{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateVocabularyStatus = async({id, active, jwt}:{id: string, active: boolean, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.vocabularies.updateVocabularyStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateVocabulary = async({id, word, definition, transcription, partsOfSpeechId, unitId, notes, jwt}:{id: string, word: string, definition: string, transcription: string | undefined, partsOfSpeechId: string | undefined, unitId: string, notes: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.vocabularies.base + `/${id}`, {
        word,
        definition,
        transcription,
        partsOfSpeechId,
        unitId,
        notes,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deleteVocabulary = async({id, jwt}:{id: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.vocabularies.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}