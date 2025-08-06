import { Button, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import style from "./UserModal.module.scss";
import { IUser, IUserFormValues } from "@/interface/user";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUserData,
} from "@/hook/userHook";
import { useEmployeeData } from "@/hook/employeeHook";
import { useRoleData } from "@/hook/roleHook";
import { IEmployee } from "@/interface/employee";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { generateSixDigitString } from "@/helper/generateSixDigitString";
import { generateLoginFromName } from "@/helper/transliterate";

interface Props {
  type: "Добавить" | "Изменить";
  userId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function UserModal({
  type,
  userId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm<IUserFormValues>({ mode: "onChange" });
  const { userData } = useUserData();
  const { employeeData } = useEmployeeData();
  const { roleData } = useRoleData();

  const { mutate: createUserMutation } = useCreateUserMutation();
  const { mutate: updateUserMutation } = useUpdateUserMutation();

  const onSubmit: SubmitHandler<IUserFormValues> = (data) => {
    const itemEmployeeData = employeeData?.find(
      (employee) => employee.buyer_id === data.employee.value
    );

    const itemRoleData = roleData?.find(
      (role) => role.role_id === data.role.value
    );

    const { password, ...updateUserWithoutPassword } = {
      ...data,
      employee: itemEmployeeData as IEmployee,
      role: itemRoleData,
    };

    const updateUser =
      password === ""
        ? updateUserWithoutPassword
        : { ...updateUserWithoutPassword, password };

    type === "Добавить"
      ? createUserMutation(updateUser)
      : updateUserMutation(updateUser);
    reset();
    setIsModalOpen(false);
  };

  const itemUserData = userData?.find((user) => user.user_id === userId);

  useEffect(() => {
    if (userId === undefined) {
      reset({
        login: undefined,
        password: undefined,
        employee: undefined,
        role: {
          value: 6,
          label: 'user',
        },
      });
    } else if (type === "Изменить" && itemUserData) {
      reset({
        user_id: itemUserData?.user_id,
        login: itemUserData?.login,
        password: itemUserData?.password,
        employee: {
          value: itemUserData?.employee.buyer_id,
          label: itemUserData?.employee?.buyer_name,
        },
        role: {
          value: itemUserData?.role?.role_id,
          label: itemUserData?.role?.role_name,
        },
      });
    }
  }, [reset, type, userId, itemUserData]);

  const optionsEmployee = employeeData?.map((employee) => ({
    value: employee.buyer_id as number,
    label: employee.buyer_name as string,
  }));

  const optionsRole = roleData?.map((role) => ({
    value: role.role_id as number,
    label: role.role_name as string,
  }));

  const [showPassword, setShowPassword] = useState<boolean>(false); // Состояние для видимости пароля

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal
      title={`${type} пользователя`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset({
          login: undefined,
        password: undefined,
        employee: undefined,
        role:   {
          value: 6,
          label: 'user',
        },
        });
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.userForm}>
      <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите сотрудника</label>
          <Controller
            control={control}
            name="employee"
            rules={{
              required: { message: "Выберите сотрудника", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsEmployee}
                onChange={(value, option: any) =>{
                  field.onChange({ value: value, label: option.label })
                  const login = generateLoginFromName(option.label);
                  setValue("login", login)}
                }
                placeholder="Сотрудник"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }

                showSearch
              />
            )}
          />
        </div>

        {errors && <p className={style.error}>{errors.employee?.message}</p>}

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Логин</label>
          <input
            type="text"
            placeholder="Логин"
            className={style.userName}
            {...register("login", {
              required: { message: "Введите логин", value: true },
            })}
          />
        </div>

        {errors && <p className={style.error}>{errors.login?.message}</p>}

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Пароль</label>
          <div className={style.passwordInputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              className={style.userPassword}
              {...register("password", {
                // required: { message: "Введите пароль", value: true },
                minLength: {
                  message: "Пароль должен быть не менее 6 символов",
                  value: 6,
                },
              })}
            />
            <button
              type="button"
              className={style.showPasswordButton}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOutlined style={{ fontSize: "25px" }} />
              ) : (
                <EyeInvisibleOutlined style={{ fontSize: "25px" }} />
              )}
            </button>
          </div>
          <Button className={style.buttonGeneratePassword} onClick={() => setValue('password',generateSixDigitString())}>
            Сгенерировать пароль
          </Button>
        </div>

        {errors && <p className={style.error}>{errors.password?.message}</p>}



        <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите роль</label>
          <Controller
            control={control}
            name="role"
            rules={{
              required: { message: "Выберите роль", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsRole}
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label })
                }
                placeholder="Роль"
                defaultValue={{label:"user",value:6}}
                />
            )}
          />
        </div>

        {errors && <p className={style.error}>{errors.role?.message}</p>}

        <button type="submit" className={style.userNameSubmit}>
          {type}
        </button>
      </form>
    </Modal>
  );
}
