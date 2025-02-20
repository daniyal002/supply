import { axiosWidthAuth } from "@/api/interseptors"

export const onecService = {
    async uploadAndUpdateProducts1с(){
        const response = await axiosWidthAuth.post<string>('/unf/upload_and_update_products_1с')
        return response.data
    }
}