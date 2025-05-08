import React from "react";
import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import {Route, Routes} from "react-router-dom";
import EditProductComponent from "./Components/Products/EditProductComponent";
import {Layout} from 'antd';
import MenuAppComponent from "./Components/Layout/MenuAppComponent";
import FooterAppComponent from "./Components/Layout/FooterAppComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";

let App = () => {

    let {Header, Content} = Layout;
    return (<Layout className="layout" style={{minHeight: "100vh"}}>
            <Header>
                <MenuAppComponent/>
            </Header>
            <Content style={{padding: "20px 50px"}}>
                <div className="site-layout-content">
                    <Routes>
                        <Route path="/" element={<h1>Index</h1>}/>
                        <Route path="/register" element={<CreateUserComponent/>}/>
                        <Route path="/login" element={<LoginFormComponent/>}/>
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