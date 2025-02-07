"use server"
import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";
import {cookies } from "next/headers";

export const getUserById = async(id: string): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.get(ENDPOINTS.users.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}

export const getAllUsers = async(): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.get(ENDPOINTS.users.base, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result;
}

export const updateUserStatus = async({active, id}:{active: boolean, id: string}): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.users.updateUserStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    return result;
}

export const updateUserAdmin = async({admin, id}:{admin: boolean, id: string}): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.put(ENDPOINTS.users.updateUserAdmin + `/${id}`, {
        admin
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}

export const deleteUser = async(id: string): Promise<ResponseData> => {
    const cookieStore= await cookies();
    const jwt = cookieStore.get("access-token")?.value;
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.users.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}