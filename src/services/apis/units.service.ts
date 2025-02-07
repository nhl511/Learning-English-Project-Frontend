"use server"
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";
import {ResponseData} from "@/types";
import {cookies} from "next/headers";

export const getAllUnits = async({page, pageSize}:{ page: number, pageSize: number}): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.get(ENDPOINTS.units.base, {
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

export const getActiveUnits = async(gradeId: string | undefined): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.units.activeUnit, {
        params: {
            gradeId
        }
    })
    return result
}

export const createUnit = async({unitNumber, unitName, gradeId}:{unitNumber: number, unitName: string, gradeId: string}):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
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

export const updateUnit = async({id, unitNumber, unitName, gradeId}:{id: string, unitNumber: number, unitName: string, gradeId: string}): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
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

export const updateUnitStatus = async({id, active}:{id: string, active: boolean}): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.units.updateUnitStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const deleteUnit = async(id: string):Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.units.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}