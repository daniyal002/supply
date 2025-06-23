import { Modal, Select } from "antd";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import style from "./EmployeeModal.module.scss";
import {useParlorData} from "@/hook/parlorHook";
import { usePostData } from "@/hook/postHook";
import {
  useCreateEmployeeMutation,
  useEmployeeData,
  useUpdateEmployeeMutation,
} from "@/hook/employeeHook";
import { IEmployee, IEmployeeFormValues } from "@/interface/employee";
import { IPost } from "@/interface/post";
import { useStorageData } from "@/hook/storageHook";

interface Props {
  type: "Добавить" | "Изменить";
  employeeId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function EmployeeModal({
  type,
  employeeId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    getValues,
  } = useForm<IEmployeeFormValues>({ mode: "onChange" });
  const { employeeData } = useEmployeeData();
  const { parlorData } = useParlorData();
  const { postData } = usePostData();

  const { mutate: createEmployeeMutation } = useCreateEmployeeMutation();
  const { mutate: updateEmployeeMutation } = useUpdateEmployeeMutation();
  const {storageData} = useStorageData()

  const watchBuyerType = watch("buyer_type")

  const onSubmit: SubmitHandler<IEmployeeFormValues> = (data) => {
    const itemParlorData = parlorData?.filter((parlor) =>
      data.parlor?.some((selectedParlor) => selectedParlor.value === parlor.parlor_id)
    );
    const itemStorageData = storageData?.filter((storage) =>
      data.storages?.some((selectedStorage) => selectedStorage.value === storage.storage_id)
    );

    const itemPostData = postData?.find(
      (post) => post.post_id === data.post?.value
    );
    const updateParlor: IEmployee = {
      ...data,
      buyer_type:data.buyer_type.value,
      parlors: itemParlorData,
      post: itemPostData as IPost,
      storages: itemStorageData,
    };
    type === "Добавить"
      ? createEmployeeMutation(updateParlor)
      : updateEmployeeMutation(updateParlor);
    reset();
    setIsModalOpen(false);
  };

  const itemEmployeeData = employeeData?.find(
    (employee) => employee.buyer_id === employeeId
  );


  useEffect(() => {
    if (employeeId === undefined) {
      reset({
        buyer_name: undefined,
        buyer_type: undefined,
        post: undefined,
        parlor: undefined,
        storages:undefined
      });
    } else if (type === "Изменить" && itemEmployeeData) {
      reset({
        buyer_id: itemEmployeeData?.buyer_id,
        buyer_name: itemEmployeeData.buyer_name,
        buyer_type: {value:itemEmployeeData.buyer_type},
        post: {
          value: itemEmployeeData?.post?.post_id,
          label: itemEmployeeData?.post?.post_name,
        },
        parlor: itemEmployeeData?.parlors?.map(parlor => ({
          value: parlor?.parlor_id,
          label: parlor.parlor_name,
        })),
        storages:itemEmployeeData.storages?.map(storage => ({
          value:storage.storage_id,
          label:storage.storage_name,
        }))
      });
    }
  }, [reset, type, employeeId, itemEmployeeData]);

  const optionsParlor = parlorData?.map((parlor) => ({
    value: parlor.parlor_id as number,
    label: parlor.parlor_name as string,
  }));

  const optionsPost = postData?.map((post) => ({
    value: post.post_id as number,
    label: post.post_name as string,
  }));

  const optionsStorage = storageData?.map((storage) => ({
    value: storage.storage_id as number,
    label: storage.storage_name as string,
  }));

  const optionBuyerType = [
    {
      label: "Сотрудник",
      value: "employee",
    },
    {
      label: "Кабинет",
      value: "parlor",
    },
  ];

  return (
    <Modal
      title={`${type} кабинет`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.employeeForm}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Сотрудник или кабинет</label>
          <input
            type="text"
            placeholder="Сотрудник или кабинет"
            className={style.employeeName}
            {...register("buyer_name", {
              required: {
                message: "Введите сотрудника или кабинета",
                value: true,
              },
            })}
          />
        </div>

        {errors && <p className={style.error}>{errors.buyer_name?.message}</p>}

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите кабинет</label>
          <Controller
            control={control}
            name="parlor"
            rules={{
              required: { message: "Выберите кабинет", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsParlor}
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange(option)
                }
                mode="multiple"
                placeholder="Кабинет"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                showSearch
              />
            )}
          />
        </div>

        {errors && <p className={style.error}>{errors.parlor?.message}</p>}

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите вид</label>
          <Controller
            control={control}
            name="buyer_type"
            rules={{
              required: { message: "Выберите вид", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionBuyerType}
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label })
                }
                placeholder="Вид"
              />
            )}
          />
        </div>

        {errors && <p className={style.error}>{errors.buyer_type?.message}</p>}

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите склад</label>
          <Controller
            control={control}
            name="storages"
            rules={{
              // required: { message: "Выберите склад", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsStorage}
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange(option)
                }
                mode="multiple"
                placeholder="Склад"
              />
            )}
          />
        </div>

        {errors && <p className={style.error}>{errors.parlor?.message}</p>}


        {getValues("buyer_type.value") === "employee" && (
          <>
            <div className={style.formItem}>
              <label className={style.formItemLabel}>Выберите должность</label>
              <Controller
                control={control}
                name="post"
                rules={{
                  required: { message: "Выберите должность", value: getValues("buyer_type.value") === "employee" ? true : false },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={optionsPost}
                    onChange={(value, option) =>
                      // @ts-ignore: Unreachable code error
                      field.onChange({ value: value, label: option.label })
                    }
                    placeholder="Должность"
                  />
                )}
              />
            </div>

            {errors && <p className={style.error}>{errors.post?.message}</p>}
          </>
        )}

        <button type="submit" className={style.employeeNameSubmit}>
          {type}
        </button>
      </form>
    </Modal>
  );
}
