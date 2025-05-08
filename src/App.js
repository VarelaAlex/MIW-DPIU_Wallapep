import React, {useEffect, useState} from "react";
import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import EditProductComponent from "./Components/Products/EditProductComponent";
import {Avatar, Col, Image, Layout, Menu, Row, Typography} from 'antd';
import FooterAppComponent from "./Components/Layout/FooterAppComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";
import {LoginOutlined} from "@ant-design/icons";

let App = () => {

    let navigate = useNavigate()
    let [login, setLogin] = useState(false);

    let {Header, Content} = Layout;

    useEffect(() => {
        let checkLoginIsActive = async () => {
            if (localStorage.getItem("apiKey") == null) {
                setLogin(false);
                return;
            }

            let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/users/isActiveApiKey", {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

            if (response.ok) {
                let jsonData = await response.json();
                setLogin(jsonData.activeApiKey)

                if (!jsonData.activeApiKey) {
                    navigate("/login")
                }
            } else {
                setLogin(false)
                navigate("/login")
            }
        }

        checkLoginIsActive()
    }, [navigate]);

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

    const {Text} = Typography;
    return (<Layout className="layout" style={{minHeight: "100vh"}}>
        <Header>
            <Row>
                <Col xs={18} sm={19} md={20} lg={21} xl={22}>
                    {!login && <Menu theme="dark" mode="horizontal" items={[{
                        key: "logo", label: <Image src="/logo.png" width="40px" height="40px"/>
                    }, {key: "menuLogin", icon: <LoginOutlined/>, label: <Link to="/login">Login</Link>}, {
                        key: "menuRegister", label: <Link to="/register">Register</Link>
                    },]}>
                    </Menu>}

                    {login && <Menu theme="dark" mode="horizontal" items={[{
                        key: "logo", label: <Image src="/logo.png" width="40px" height="40px"/>
                    }, {key: "menuProducts", label: <Link to="/products">Products</Link>}, {
                        key: "menuDisconnect", label: <Link to="#" onClick={disconnect}>Disconnect</Link>
                    },]}>
                    </Menu>}
                </Col>
                <Col xs={6} sm={5} md={4} lg={3} xl={2} style={{display: 'flex', flexDirection: 'row-reverse'}}>
                    {login ? (<Avatar size="large"
                                              style={{
                                                  backgroundColor: "#ff0000", verticalAlign: 'middle', marginTop: 12
                                              }}>
                        {localStorage.getItem("email")?.charAt(0)}
                    </Avatar>) : (<Link to="/login"> <Text style={{color: "#ffffff"}}>Login</Text></Link>)}
                </Col>
            </Row>

        </Header>
        <Content style={{padding: "20px 50px"}}>
            <div className="site-layout-content">
                <Routes>
                    <Route path="/" element={<h1>Index</h1>}/>
                    <Route path="/register" element={<CreateUserComponent/>}/>
                    <Route path="/login" element={<LoginFormComponent setLogin={setLogin}/>}/>
                    <Route path="/products" element={<ListProductsComponent/>}/>
                    <Route path="/products/edit/:id" element={<EditProductComponent/>}></Route>
                    <Route path="/products/:id" element={<DetailsProductComponent/>}/>
                </Routes>
            </div>
        </Content>
        <FooterAppComponent/>
    </Layout>)
}

export default App;