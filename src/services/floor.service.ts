import { axiosWidthAuth } from "@/api/interseptors"
import { IFloorRespone } from "@/interface/floor"

export const floorService = {
    async getFloor (){
        const response = await axiosWidthAuth.get<IFloorRespone>('/floor/get_floor')
        return response.data.detail
    },
}