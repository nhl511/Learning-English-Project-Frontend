"use server"
import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";
import {cookies} from "next/headers";

export const getAllCurriculums = async({page, pageSize}:{page: number, pageSize: number}): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
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

export const createCurriculum = async(name: string): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.post(ENDPOINTS.curriculums.base, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateCurriculum = async ({id, name}:{id: string, name: string}) => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.curriculums.base + `/${id}`, {
        name
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateCurriculumStatus = async({id, active}:{id: string, active: boolean}) => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.curriculums.updateCurriculumStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deleteCurriculum = async(id: string): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.curriculums.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}