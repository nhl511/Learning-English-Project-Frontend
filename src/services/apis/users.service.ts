import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";

export const getUserById = async({id, jwt}: {id: string, jwt: string}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.users.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}

export const getAllUsers = async(jwt: string | null): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.get(ENDPOINTS.users.base, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}

export const updateUserStatus = async({active, id, jwt}:{active: boolean, id: string, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.users.updateUserStatus + `/${id}`, {
        active
    },{
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    return result;
}

export const updateUserAdmin = async({admin, id, jwt}:{admin: boolean, id: string, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.put(ENDPOINTS.users.updateUserAdmin + `/${id}`, {
        admin
    },{
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}

export const deleteUser = async({id, jwt}:{ id: string, jwt: string | null}): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.delete(ENDPOINTS.users.base + `/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    })
    return result
}