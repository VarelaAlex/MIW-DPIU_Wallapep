import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {useNavigate} from "react-router-dom";

let LoginFormComponent = () => {
    let navigate = useNavigate();

    let [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    let clickLogin = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json "},
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            let responseBody = await response.json();
            if (responseBody.apiKey && responseBody.email) {
                localStorage.setItem("apiKey", responseBody.apiKey)
                localStorage.setItem("email", responseBody.email)
            }
            console.log("ok " + responseBody)
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    return (
        <div>
            <h2>Login User</h2>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)
            }} type="text" name="email"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)
            }} type="password" name="password"/>

            <button onClick={clickLogin}>Login User</button>
        </div>
    )
}

export default LoginFormComponent;