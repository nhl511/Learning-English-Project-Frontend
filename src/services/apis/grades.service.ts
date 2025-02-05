import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";

export const getAllGrades = async({jwt, page, pageSize}:{jwt: string | null, page: number, pageSize: number}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.grades.base, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        params: {
            page,
            pageSize,
        }
    });
    return result;
}


export const getActiveGrades = async(curriculumId: string | undefined): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.grades.activeGrades, {
        params: {
            curriculumId
        }
    })
    return result;
}

export const createGrade = async ({gradeNumber, curriculumId, jwt}:{gradeNumber: number, curriculumId: string, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.grades.base, {
        gradeNumber,
        curriculumId,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateGradeStatus = async({id, active, jwt}:{id: string, active: boolean, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.grades.updateGradeStatus + `/${id}`, {
        active,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateGrade = async({id, grade, curriculumId, jwt}:{id: string, grade: number, curriculumId: string, jwt: string | null }): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.grades.base + `/${id}`, {
        gradeNumber: grade,
        curriculumId: curriculumId
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deleteGrade = async({id, jwt}:{id: string, jwt: string | null}) => {
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.grades.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    return result;
}