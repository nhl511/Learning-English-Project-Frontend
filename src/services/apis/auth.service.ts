import {ResponseData} from "@/types";
import {apiCaller} from "@/axios/client";
import {ENDPOINTS} from "@/services/apis/api-endpoints.service";

export const login = async({ email, password }:{ email: string, password: string }): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.auth.login, {email, password});
    return result;
}

export const register = async({ email, password, firstName, lastName }:{ email: string, password: string, firstName: string, lastName: string }): Promise<ResponseData> => {
    const result: ResponseData = await apiCaller.post(ENDPOINTS.auth.register, {email, password, firstName, lastName});
    return result;
}