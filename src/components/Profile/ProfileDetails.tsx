import { Descriptions, List, Typography } from "antd";
import styles from './Profile.module.scss';
import { IGetMe } from "@/interface/user";

const { Title } = Typography;


const ProfileDetails = ({employee,login,role,created_at,updated_at}:IGetMe) => {

return(
    <div className={styles.userInfo}>
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label="Логин">{login}</Descriptions.Item>
      <Descriptions.Item label="ФИО">{employee?.buyer_name}</Descriptions.Item>
      <Descriptions.Item label="Роль">{role?.role_name}</Descriptions.Item>
      <Descriptions.Item label="Дата создания">
        {new Date(created_at).toLocaleString('ru-RU')}
      </Descriptions.Item>
      <Descriptions.Item label="Последнее обновление">
        {new Date(updated_at).toLocaleString('ru-RU')}
      </Descriptions.Item>
    </Descriptions>

    <div className={styles.section}>
      <Title level={5}>Склады</Title>
      <List
        size="small"
        dataSource={employee?.storages}
        renderItem={(storage) => (
          <List.Item>
            {storage?.storage_name} ({storage?.storage_1c_code})
          </List.Item>
        )}
      />
    </div>

    <div className={styles.section}>
      <Title level={5}>Отделы</Title>
      {employee?.parlors?.map((parlor) => (
        <div key={parlor.parlor_id} className={styles.parlor}>
          <strong>{parlor.parlor_name}</strong>
          <p>
            Корпус: {parlor?.department?.housing?.housing_name}, {parlor?.floor?.floor_name}
          </p>
          <List
            size="small"
            dataSource={parlor.employees}
            renderItem={(emp) => ( emp.buyer_type === 'employee' &&
              <List.Item>
                {emp.buyer_name}
              </List.Item>
            )}
          />
        </div>
      ))}
    </div>
  </div>
)

}

export default ProfileDetails;