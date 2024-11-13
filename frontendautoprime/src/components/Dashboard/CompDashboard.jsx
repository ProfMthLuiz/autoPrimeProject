import React, { useState } from "react";

// Import ant-design
import { Button, Layout, theme } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

// Styles
import "./CompDashboard.css";

// Components
import CompLogo from "./CompLogo";
import CompMenuList from "./CompMenuList";
import CompToggleTheme from "./CompToggleTheme";

// Import pages
import RegisterCars from "../../pages/RegisterCars/RegisterCars";
import CompListCars from "../ListCars/CompListCars";

const { Header, Sider, Content } = Layout;

const CompDashboard = ({ handleLogout }) => {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeContent, setActiveContent] = useState(null);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderContent = () => {
    switch (activeContent) {
      case "registrarCarros":
        return <RegisterCars />;
      case "perfil":
        return (
          <div>
            <h1>Perfil do usuário</h1>
          </div>
        );
      case "listarCarros":
        return <CompListCars />;
      case "logout":
        return alert("LOGOUT");
      default:
        return (
          <div>
            <h1>Welcome to the dashboard Auto Prime!</h1>
          </div>
        );
    }
  };

  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className={darkTheme ? "dark" : "light"}
      >
        <CompLogo darkTheme={darkTheme} />
        <CompMenuList
          darkTheme={darkTheme}
          setActiveContent={setActiveContent}
          handleLogout={handleLogout}
        />
        <CompToggleTheme darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
          }}
        >
          {renderContent()} {/* Renderiza o conteúdo com base no estado */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CompDashboard;
