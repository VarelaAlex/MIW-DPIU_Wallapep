import React from "react";
import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";

let App = () => {

    let callBackOnFinishLogin = (loginUser) => {
        console.log("Cambiado " + loginUser.email);
        console.log("Cambiado " + loginUser.password);
    }

    return (
        <div className="App">
            <h1>Wallapep</h1>
            <CreateUserComponent/>
            <LoginFormComponent callBackOnFinishLogin={callBackOnFinishLogin}/>
        </div>
    )
}

export default App;