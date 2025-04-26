import {useState} from "react";

let CreateUserComponent = () => {

    let [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    let onChangeEmail = (e) => {
        setFormData({
            ...formData,
            email: e.target.value
        });
    }

    let onChangePassword = (e) => {
        setFormData({
            ...formData,
            password: e.target.value
        });
    }

    let clickCreate = async () => {
        let response = await fetch("http://localhost:4000/users", {
            method: "POST",
            headers: {"Content-Type": "application/json "},
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            let responseBody = await response.json();
            console.log("ok " + responseBody)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
        console.log(formData)
    }

    return (
        <div>
            <h2>Create User</h2>
            <input onChange={onChangeEmail} type="text" name="email"/>
            <input onChange={onChangePassword} type="password" name="password"/>
            <button onClick={clickCreate}>Create User</button>
        </div>
    )
}

export default CreateUserComponent;