import { axiosWidthAuth } from "@/api/interseptors";
import { IHelpItemResponse, IHelpResponse } from "@/interface/help";

export const helpService = {
    async getHelp(){
        const response = await axiosWidthAuth.get<IHelpResponse>('/help/get_help')
        return response.data.detail
    },

    async registerHelpView(help_id:number){
        const response = await axiosWidthAuth.post<IHelpItemResponse>(`/help/register_help_view`,{help_id})
        return response.data
    }

}