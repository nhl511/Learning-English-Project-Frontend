import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";
import {ResponseData} from "@/types";

export const getAllUnits = async(jwt: string | null): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.units.base, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}

export const getActiveUnits = async(gradeId: string | undefined): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.units.activeUnit, {
        params: {
            gradeId
        }
    })
    return result
}

export const createUnit = async({unitNumber, unitName, gradeId, jwt}:{unitNumber: number, unitName: string, gradeId: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.units.base,{
        unitNumber,
        unitName,
        gradeId,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateUnit = async({id, unitNumber, unitName, gradeId, jwt}:{id: string, unitNumber: number, unitName: string, gradeId: string, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.units.base + `/${id}`, {
        unitNumber,
        unitName,
        gradeId,
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateUnitStatus = async({id, active, jwt}:{id: string, active: boolean, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.units.updateUnitStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deleteUnit = async({id, jwt}:{id: string, jwt: string | null}):Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.units.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}