import { axiosClassic, axiosWidthAuth } from "@/api/interseptors";
import { ILoginRequest, ILoginResponse, IRefreshRequest } from "@/interface/auth";
import { removeAccessTokenFromStorage, removeRefreshTokenFromStorage, saveAccessToken, saveRefreshToken } from "./auth-token.service";
import { removeGetME } from "./user-getMe.service";
import { userService } from "./user.service";
 
export const authService = {
    async login (body:ILoginRequest){
        const response = await axiosClassic.post<ILoginResponse>('/auth/login',body)

        if(response.data.access_token){
            saveAccessToken(response.data.access_token)
            await userService.getMe()
        }

        if(response.data.refresh_token){
            saveRefreshToken(response.data.refresh_token)
        }

        return response
    },


    async logout(){
        await axiosWidthAuth.post('/auth/logout')
        removeAccessTokenFromStorage()
        removeRefreshTokenFromStorage()
        removeGetME()
    },

    async refresh(body:IRefreshRequest){
      const response =  await axiosWidthAuth.post<ILoginResponse>(`/auth/refresh?refresh_token=${body.refresh_token}`)

      if(response.data.access_token){
        saveAccessToken(response.data.access_token)
    }

    if(response.data.refresh_token){
        saveRefreshToken(response.data.refresh_token)
    }

      return response.data
    }

} 