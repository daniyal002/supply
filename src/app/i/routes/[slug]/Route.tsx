'use client'
import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Input, Select, Button, Form } from 'antd';
import styles from './Route.module.scss';
import { IAddRouterRequest } from '@/interface/orderRoute';
import { useEmployeeData } from '@/hook/employeeHook';
import { useDepartmentData } from '@/hook/departmentHook';
import { useOderStatusData } from '@/hook/orderHook';
import { useProductGroupData } from '@/hook/productHook';
import { useCreateOrderRouteMutation, useOrderRouteByIdData, useUpdateOrderRouteMutation } from '@/hook/orderRouterHook';
import { usePathname } from 'next/navigation';

const { Option } = Select;

interface Props {
  routeId: string;
}

export default function Route({ routeId }: Props) {
  const pathname = usePathname()
  const { employeeData } = useEmployeeData();
  const { departmentData } = useDepartmentData();
  const { oderStatusData } = useOderStatusData();
  const { productGroupData } = useProductGroupData();
  const { mutate:createOrderRouteMutation } = useCreateOrderRouteMutation();
  const { mutate:updateOrderRouteMutation } = useUpdateOrderRouteMutation();
  const { orderRouteByIdData } = useOrderRouteByIdData(Number(routeId));

  const { control, handleSubmit, watch, setValue,reset,getValues } = useForm<IAddRouterRequest>({ mode: "onChange" });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const watchSteps = watch('steps');



  useEffect(()=>{
    if(orderRouteByIdData && routeId !== "newRoute"){
      reset({
        route_name: orderRouteByIdData.route_name,
        department_id:orderRouteByIdData.department?.department_id,
        route_id:orderRouteByIdData.route_id,
        steps: orderRouteByIdData.steps.map(orderRoute => ({
          employee_id: orderRoute.employee.buyer_id,
          free_or_paid:orderRoute.free_or_paid,
          step_number:orderRoute.step_number,
          status_agreed_id:orderRoute.status_agreed_id.order_status_id,
          status_reject_id:orderRoute.status_reject_id.order_status_id,
          product_group_ids:orderRoute.product_group_ids.map(pg => pg.product_group_id),
        }))
      })
    }else{
      reset({
        route_id:undefined,
        route_name:undefined,
        department_id:undefined,
        steps:[]
      })
    }
  },[orderRouteByIdData, routeId])

  const onStepNumberChange = (index: number, value: number) => {
    if (!watchSteps || !watchSteps.length) return; // Add this check
    const updatedSteps = [...watchSteps];
    updatedSteps[index].step_number = value;
    updatedSteps.sort((a, b) => a.step_number - b.step_number);
    updatedSteps.forEach((step, idx) => update(idx, step));
  };

  const onSubmit = (data: any) => {
    if (routeId === "newRoute") {
      createOrderRouteMutation(data)
    }else{
      updateOrderRouteMutation({...data, route_id:Number(routeId)})
    }
  };

  return (
    <Form
      onFinish={handleSubmit(onSubmit)}
      className={styles.routeForm}
      style={{ padding: "20px" }}
    >
      <div className={styles.formHeader}>
        <h2>Настройка маршрута</h2>
      </div>

      <Form.Item label="Название маршрута">
        <Controller
          name="route_name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item label="Подразделение">
        <Controller
          name="department_id"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Выберите подразделение">
              {departmentData?.map((department) => (
                <Option
                  key={department.department_id}
                  value={department.department_id}
                >
                  {department.department_name}
                </Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      {fields.map((item, index) => (
        <div key={item.id} className={styles.stepContainer}>
          <div className={styles.stepHeader}>
            {watchSteps && watchSteps[index] ? (
              <span>Шаг {watchSteps[index].step_number}</span>
            ) : (
              <span>Шаг {index + 1}</span>
            )}
            <Button
              type="text"
              onClick={() => remove(index)}
              className={styles.removeButton}
            >
              ✖
            </Button>
          </div>

          <Form.Item label="Согласующий сотрудник">
            <Controller
              name={`steps.${index}.employee_id`}
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {employeeData?.map((employee) => (
                    <Option key={employee.buyer_id} value={employee.buyer_id}>
                      {employee.buyer_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Номер шага">
            <Controller
              name={`steps.${index}.step_number`}
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      field.onChange(value);
                      onStepNumberChange(index, value);
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="ОМС или ПУ">
            <Controller
              name={`steps.${index}.free_or_paid`}
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <Option value="free">ОМС</Option>
                  <Option value="paid">ПУ</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Статус отклонения">
            <Controller
              name={`steps.${index}.status_reject_id`}
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {oderStatusData?.map((status) => (
                    <Option
                      key={status.order_status_id}
                      value={status.order_status_id}
                    >
                      {status.order_status_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Статус согласования">
            <Controller
              name={`steps.${index}.status_agreed_id`}
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {oderStatusData?.map((status) => (
                    <Option
                      key={status.order_status_id}
                      value={status.order_status_id}
                    >
                      {status.order_status_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Группа продуктов">
            <Controller
              name={`steps.${index}.product_group_ids`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  mode="multiple"
                  placeholder="Выберите группу продуктов"
                >
                  {productGroupData?.map((productGroup) => (
                    <Option
                      key={productGroup.product_group_id}
                      value={productGroup.product_group_id}
                    >
                      {productGroup.product_group_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
        </div>
      ))}

      <Button
        type="dashed"
        onClick={() =>
          append({
            employee_id: 0,
            step_number: fields.length + 1,
            free_or_paid: "free",
            status_reject_id: 0,
            status_agreed_id: 0,
            product_group_ids: [],
          })
        }
        className={styles.addButton}
      >
        Добавить шаг
      </Button>

      <Button type="primary" htmlType="submit" className={styles.submitButton}>
        {routeId === "newRoute" ? "Сохранить" : "Изменить"}
      </Button>
    </Form>
  );
}