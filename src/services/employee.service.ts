import { axiosWidthAuth } from "@/api/interseptors"
import { IEmployeeResponse, IEmployeeRequest, IEmployeeAddResponse, IEmployee } from "@/interface/employee"

export const employeeService = {
    async getEmployee (){
        const response = await axiosWidthAuth.get<IEmployeeResponse>('/employee/get_employee')
        return response.data.detail
    },

    async addEmployee(data:IEmployeeRequest){
        const response = await axiosWidthAuth.post<IEmployeeAddResponse>('employee/add_employee',data)
        return response.data
    },

    async updateEmployee(data:IEmployeeRequest){
        const response = await axiosWidthAuth.put<string>('employee/update_employee',data)
        return response.data
    },

    async deleteEmployeeById(data:IEmployee){
        const response = await axiosWidthAuth.delete<string>('employee/delete_employee',{data:data},)
        return response.data
    }
}