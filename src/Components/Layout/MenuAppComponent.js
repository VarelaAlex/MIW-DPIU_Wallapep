import React from "react";
import {Link} from "react-router-dom";
import {Menu} from 'antd';
import {FireOutlined, LoginOutlined} from '@ant-design/icons';

let MenuAppComponent = () => {

    return (
        <div>
            <div className="logo"/>
            <Menu theme="dark" mode="horizontal" items={[
                {key: "logo", label: <img src="/logo.png" width="40" height="40"/>},
                {key: "menuItems", icon: <FireOutlined/>, label: <Link to="/">Home</Link>},
                {key: "menuLogin", icon: <LoginOutlined/>, label: <Link to="/login">Login</Link>},
                {key: "menuRegister", label: <Link to="/register">Register</Link>},
                {key: "menuProducts", label: <Link to="/products">Products</Link>},
            ]}>
            </Menu>
        </div>
    );
}

export default MenuAppComponent;