import { Menu } from "antd";
import {
  HomeOutlined,
  CarOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const CompMenuList = ({ darkTheme, setActiveContent }) => {
  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      onClick: () => setActiveContent("dashboard"),
    },
    {
      key: "Perfil",
      icon: <UserSwitchOutlined />,
      label: "Perfil",
      onClick: () => setActiveContent("perfil"),
    },

    {
      key: "Cars",
      icon: <CarOutlined />,
      label: "Cars",
      children: [
        {
          key: "listarCarros",
          label: "Listar Carros",
          onClick: () => setActiveContent("listarCarros"),
        },
        {
          key: "registrarCarros",
          label: "Registrar Carros",
          onClick: () => setActiveContent("registrarCarros"),
        },
      ],
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => setActiveContent("logout"),
    },
  ];

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      className={darkTheme ? "menu_bardark" : "menu_barlight"}
      items={menuItems}
    />
  );
};

export default CompMenuList;
