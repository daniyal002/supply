import { axiosWidthAuth } from "@/api/interseptors"
import { IStorageResponse } from "@/interface/storage"

export const storageService = {
    async getAllStorage(){
        const response = await axiosWidthAuth.get<IStorageResponse>('/storage/get_all_storage')
        return response.data.detail
    }
}