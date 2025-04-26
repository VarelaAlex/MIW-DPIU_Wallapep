import React from "react";
import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import {Link, Route, Routes} from "react-router-dom";
import EditProductComponent from "./Components/Products/EditProductComponent";

let App = () => {

    return (
        <div className="App">
            <h1>Wallapep</h1>

            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/products">Products</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={
                    <h1>Index</h1>
                }/>
                <Route path="/register" element={
                    <CreateUserComponent/>
                }/>
                <Route path="/login" element={
                    <LoginFormComponent/>
                }/>
                <Route path="/products" element={
                    <ListProductsComponent/>
                }/>
                <Route path="/products/edit/:id" element={
                    <EditProductComponent/>
                }></Route>
            </Routes>
        </div>
    )
}

export default App;