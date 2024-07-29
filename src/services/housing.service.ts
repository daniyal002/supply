import { axiosWidthAuth } from "@/api/interseptors"
import { IHousing, IHousingAddResponse, IHousingResponse } from "@/interface/housing"

export const housingService = {
    async getHousing (){
        const response = await axiosWidthAuth.get<IHousingResponse>('/housing/get_housing')
        return response.data.detail
    },

    async addHousing(housing_name:string){
        const response = await axiosWidthAuth.post<IHousingAddResponse>('housing/add_housing',{housing_name})
        return response.data
    },

    async updateHousing(data:IHousing){
        const response = await axiosWidthAuth.put<string>('housing/update_housing',data)
        return response.data
    },

    async deleteHousingById(data:IHousing){
        const response = await axiosWidthAuth.delete<string>('housing/delete_housing/',{data:data},)
        return response.data
    }
}