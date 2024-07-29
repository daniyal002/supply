import { axiosWidthAuth } from "@/api/interseptors"
import { IRoleResponse, IRole, IRoleAddResponse } from "@/interface/role"

export const roleService = {
    async getRole (){
        const response = await axiosWidthAuth.get<IRoleResponse>('/role/get_role')
        return response.data.detail
    },

    async addRole(data:IRole){
        const response = await axiosWidthAuth.post<IRoleAddResponse>('role/add_role',data)
        return response.data
    },

    async updateRole(data:IRole){
        const response = await axiosWidthAuth.put<string>('role/update_role',data)
        return response.data
    },

    async deleteRoleById(data:IRole){
        const response = await axiosWidthAuth.delete<string>('role/delete_role',{data:data},)
        return response.data
    }
}