import { axiosWidthAuth } from "@/api/interseptors"
import { IDepartment, IDepartmentRequest, IDepartmentResponse,IDepartmentAddResponse } from "@/interface/department"

export const departmentService = {
    async getDepartment (){
        const response = await axiosWidthAuth.get<IDepartmentResponse>('/department/get_department')
        return response.data.detail
    },

    async addDepartment(data:IDepartmentRequest){
        const response = await axiosWidthAuth.post<IDepartmentAddResponse>('department/add_department',data)
        return response.data
    },

    async updateDepartment(data:IDepartmentRequest){
        const response = await axiosWidthAuth.put<string>('department/update_department',data)
        return response.data
    },

    async deleteDepartmentById(data:IDepartmentRequest){
        const response = await axiosWidthAuth.delete<string>('department/delete_department',{data:data},)
        return response.data
    }
}