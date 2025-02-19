"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import style from "./Login.module.scss";
import { useLogin } from "@/hook/useAuth";
import { ILoginRequest } from "@/interface/auth";
import { toast, Toaster } from "sonner";
import { Alert } from "antd";
import { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({ mode: "onChange" });
  const { mutate, error } = useLogin();
  const onSubmit: SubmitHandler<ILoginRequest> = (data) => mutate(data);

  const [showPassword, setShowPassword] = useState<boolean>(false); // Состояние для видимости пароля

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={`${style.formLogin}`}>
        <div className={style.formItem}>
          <label htmlFor="login" className={style.formItemLabel}>
            Логин
          </label>
          <input
            type="text"
            placeholder="Логин"
            className={style.usernameInput}
            {...register("login", {
              required: { message: "Введите логин", value: true },
            })}
          />
        </div>
        {errors.login && <p className={style.error}>{errors.login.message}</p>}
        <div className={style.formItem}>
          <label htmlFor="password" className={style.formItemLabel}>
            Пароль
          </label>
          <div className={style.passwordInputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              className={style.passwordInput}
              {...register("password", {
                required: { message: "Введите пароль", value: true },
              })}
            />
            <button
              type="button"
              className={style.showPasswordButton}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOutlined style={{fontSize:"25px"}}/> : <EyeInvisibleOutlined style={{fontSize:"25px"}} />}
            </button>
          </div>
          {errors.password && (
            <p className={style.error}>{errors.password.message}</p>
          )}
        </div>
        <div className={style.loginForgotPassword}>
          <Toaster />

          <button
            className={style.loginForgotPasswordText}
            onClick={() =>
              toast(
                "Обратитесь в отдел разработки по внутренему номеру 194, 195"
              )
            }
            type="button"
          >
            Забыли пароль ?
          </button>
        </div>
        <button className={style.loginSubmit} type="submit">
          Войти
        </button>
      </form>

      {error && (
        <Alert
          message="Ошибка"
          description={`${error.response?.data.detail} `}
          type="error"
          showIcon
        />
      )}
    </>
  );
}
