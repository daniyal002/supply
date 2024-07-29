import { axiosWidthAuth } from "@/api/interseptors"
import { IParlor, IParlorAddResponse, IParlorRequest, IParlorRespone } from "@/interface/parlor"

export const parlorService = {
    async getParlor (){
        const response = await axiosWidthAuth.get<IParlorRespone>('/parlor/get_parlor')
        return response.data.detail
    },

    async addParlor(data:IParlorRequest){
        const response = await axiosWidthAuth.post<IParlorAddResponse>('parlor/add_parlor',data)
        return response.data
    },

    async updateParlor(data:IParlorRequest){
        const response = await axiosWidthAuth.put<string>('parlor/update_parlor',data)
        return response.data
    },

    async deleteParlorById(data:IParlorRequest){
        const response = await axiosWidthAuth.delete<string>('parlor/delete_parlor',{data:data},)
        return response.data
    }
}