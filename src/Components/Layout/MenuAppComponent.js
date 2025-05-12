import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {Image, Menu} from 'antd';
import {
    EuroCircleOutlined, LoginOutlined, LogoutOutlined, ProductOutlined, ShoppingOutlined, UserAddOutlined
} from '@ant-design/icons';

let MenuAppComponent = ({login, setLogin}) => {

    let navigate = useNavigate();
    let disconnect = async () => {
        await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/users/disconnect", {
            method: "GET", headers: {
                "apikey": localStorage.getItem("apiKey")
            }
        });

        localStorage.removeItem("apiKey");
        setLogin(false)
        navigate("/login")
    }

    return (<>
        {!login && <Menu theme="dark" mode="horizontal" items={[{
            key: "logo", label: <Image src="/logo.png" width="40px" height="40px" preview={false}
                                       onClick={() => navigate("/")}/>
        }, {key: "menuLogin", icon: <LoginOutlined/>, label: <Link to="/login">Login</Link>}, {
            key: "menuRegister", icon: <UserAddOutlined/>, label: <Link to="/register">Register</Link>
        },]}>
        </Menu>}

        {login && <Menu theme="dark" mode="horizontal" items={[{
            key: "logo", label: <Image src="/logo.png" width="40px" height="40px" preview={false}
                                       onClick={() => navigate("/")}/>
        }, {key: "menuProducts", icon: <ProductOutlined/>, label: <Link to="/products">Products</Link>}, {
            key: "menuMyProduct", label: <Link to="/products/own">My Products</Link>
        }, {
            key: "menuTransactions",
            icon: <EuroCircleOutlined/>,
            label: <Link to="/transactions/own">My Transactions</Link>
        }, {
            key: "menuCreateProduct", icon: <ShoppingOutlined/>, label: <Link to="/products/create">Sell</Link>
        }, {
            key: "menuDisconnect", icon: <LogoutOutlined/>, label: <Link to="#" onClick={disconnect}>Disconnect</Link>
        },]}>
        </Menu>}</>);
}

export default MenuAppComponent;