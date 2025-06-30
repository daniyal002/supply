import { axiosClassic, axiosWidthAuth } from "@/api/interseptors";
import { ILoginRequest, ILoginResponse, IRefreshRequest } from "@/interface/auth";
import { removeAccessTokenFromStorage, removeRefreshTokenFromStorage, saveAccessToken, saveRefreshToken } from "./auth-token.service";
import { userService } from "./user.service";
import { deleteGetMe } from "@/db/db";

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
        try {
            const response = await axiosWidthAuth.post("/auth/logout");

            // Если ответ успешный, просто очищаем токены и данные пользователя
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            await deleteGetMe(); // Предполагается, что это асинхронная функция

            console.log("Logout successful");
          } catch (error) {
            console.error("Logout failed", error);

            // Всё равно очищаем данные локально, даже если запрос не прошёл
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            await deleteGetMe();

            // Можно также показать пользователю уведомление об ошибке
            // message.error('Не удалось выйти. Попробуйте позже.');
          }
    },

    async refresh(body:IRefreshRequest){
      const response =  await axiosWidthAuth.post<ILoginResponse>(`/auth/refresh?refresh_token=${body.refresh_token}`)

      if(response.data.access_token){
        saveAccessToken(response.data.access_token)
    }

    if(response.data.refresh_token){
        saveRefreshToken(response.data.refresh_token)
    }
    if(response.status === 401){
        removeAccessTokenFromStorage()
        removeRefreshTokenFromStorage()
        window.location.replace("/login");
    }


      return response.data
    }

}