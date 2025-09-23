import { axiosWidthAuth } from "@/api/interseptors";
import { IHelpResponse } from "@/interface/help";

export const helpService = {
    async getHelp(){
        const response = await axiosWidthAuth.get<IHelpResponse>('/help/get_help')
        return response.data.detail
    }
}