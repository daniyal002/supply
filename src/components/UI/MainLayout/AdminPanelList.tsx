import { ApartmentOutlined, CalculatorOutlined, CompassOutlined, HomeOutlined, IdcardOutlined, MessageOutlined, ShopOutlined, TagsOutlined, TeamOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";

export const AdminPanelList = (push: (url:string) => void) => [
    {
      key: "4",
      label: "Пользователи",
      icon: <UserOutlined />,
      onClick: () => push("/i/users"),
    },
    {
      key: "5",
      label: "Роли",
      icon: <TeamOutlined />,
      onClick: () => push("/i/roles"),
    },
    {
      key: "6",
      label: "Сотрудники",
      icon: <IdcardOutlined />,
      onClick: () => push("/i/employees"),
    },
    {
      key: "7",
      label: "Кабинеты",
      icon: <HomeOutlined />,
      onClick: () => push("/i/parlors"),
    },
    {
      key: "8",
      label: "Подразделения",
      icon: <ApartmentOutlined />,
      onClick: () => push("/i/departments"),
    },
    {
      key: "9",
      label: "Корпуса",
      icon: <ShopOutlined />,
      onClick: () => push("/i/housings"),
    },
    {
      key: "10",
      label: "Должности",
      icon: <UserSwitchOutlined />,
      onClick: () => push("/i/posts"),
    },
    {
      key: "11",
      label: "Маршруты",
      icon: <CompassOutlined />,
      onClick: () => push("/i/routes"),
    },
    {
      key: "12",
      label: "Статусы заявок",
      icon: <TagsOutlined />,
      onClick: () => push("/i/orderStatus"),
    },
    {
      key: "13",
      label: "1C",
      icon: <CalculatorOutlined />,
      onClick: () => push("/i/oneC"),
    },
    {
      key: "14",
      label: "Broadcast",
      icon: <MessageOutlined />,
      onClick: () => push("/i/broadcast"),
    },
  ]