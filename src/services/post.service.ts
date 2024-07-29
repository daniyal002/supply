import { axiosWidthAuth } from "@/api/interseptors"
import { IPostResponse, IPost, IPostAddResponse } from "@/interface/post"

export const postService = {
    async getPost (){
        const response = await axiosWidthAuth.get<IPostResponse>('/post/get_post')
        return response.data.detail
    },

    async addPost(data:IPost){
        const response = await axiosWidthAuth.post<IPostAddResponse>('post/add_post',data)
        return response.data
    },

    async updatePost(data:IPost){
        const response = await axiosWidthAuth.put<string>('post/update_post',data)
        return response.data
    },

    async deletePostById(data:IPost){
        const response = await axiosWidthAuth.delete<string>('post/delete_post',{data:data},)
        return response.data
    }
}