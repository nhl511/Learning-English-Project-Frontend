import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";

export const getAllCurriculums = async({jwt, page, pageSize}:{jwt: string | null, page: number, pageSize: number}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.curriculums.base, {
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        params: {
            page,
            pageSize,
        }
    })
    return result;
}

export const getActiveCurriculums = async (): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.curriculums.activeCurriculums)
    return result;
}

export const createCurriculum = async({name, jwt}:{name: string, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.curriculums.base, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateCurriculum = async ({id, name, jwt}:{id: string, name: string, jwt: string | null}) => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.curriculums.base + `/${id}`, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateCurriculumStatus = async({id, active, jwt}:{id: string, active: boolean, jwt: string | null}) => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.curriculums.updateCurriculumStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deleteCurriculum = async({id, jwt}:{id: string, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.curriculums.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}