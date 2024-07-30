"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import style from './Login.module.scss'
import { useLogin } from "@/hook/useAuth";
import { ILoginRequest } from "@/interface/auth";
import { toast, Toaster } from "sonner";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>();
  const {mutate} = useLogin()
  const onSubmit: SubmitHandler<ILoginRequest> = (data) => mutate(data);


  return (
    <>
  <form onSubmit={handleSubmit(onSubmit)} 
        className={`${style.formLogin} ${errors ? style.error : ''}`}
        >
    <div className={style.formItem}>
      <label htmlFor="login" className={style.formItemLabel}>Логин</label>
      <input
        type="text"
        placeholder="Логин"
        className={style.usernameInput}
        {...register("login", {})}
      />
    </div>
    <div className={style.formItem}>
    <label htmlFor="login" className={style.formItemLabel}>Пароль</label>
      <input
        type="password"
        placeholder="Пароль"
        className={style.passwordInput}
        {...register("password", { required: true })}
      />
    </div>
    <div className={style.loginForgotPassword}>
    <Toaster />

          <button className={style.loginForgotPasswordText} onClick={() => toast('Обратитесь в отдел разработки по внутренему номеру 194, 195')} type="button">
            Забыли пароль ? 
          </button>
        </div>
    <button
    className={style.loginSubmit}
      type="submit"
    >
      Войти
    </button>
  </form>
</>

  );
}
