import { axiosWidthAuth } from "@/api/interseptors"
import { IRoleResponse, IRole, IRoleAddResponse, IPermissionRequest, IPermission, IPermissionResponse } from "@/interface/role"

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
    },

    async archiveRole(data:IRole){
        const response = await axiosWidthAuth.put<string>('role/archive_role',data)
        return response.data
    },

     async getPermission(){
        const response = await axiosWidthAuth.get<IPermissionResponse>('role/get_permission')
        return response.data.detail
    },

    async addRolePermission(data:IPermissionRequest){
        const response = await axiosWidthAuth.post<string>('role/add_role_permission',data)
        return response.data
    },

    async deleteRolePermission(data:IPermissionRequest){
        const response = await axiosWidthAuth.delete<string>('role/delete_role_permission',{data:data})
        return response.data
    }

}