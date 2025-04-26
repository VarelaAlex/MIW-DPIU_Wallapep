import {useRef, useState} from "react";

let LoginFormComponent = (props) => {

    let [formData, setFormData] = useState({
        email: '- empty email -',
        password: '- empty password -',
    });

    let [counter, setCounter] = useState(0);
    let counterRef = useRef(0);

    let clickLogin = () => {
        props.callBackOnFinishLogin(formData);
    }

    let onChangeEmail = (e) => {
        let currentCounter = counter;
        currentCounter += 1;
        currentCounter += 1;
        setCounter(currentCounter);

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

    return (
        <div>
                <input onChange={onChangeEmail} type="text" name="email"/>
                <input onChange={onChangePassword} type="password" name="password"/>
                <button onClick={clickLogin}>Accept</button>
            <p> {formData.email} </p>
            <p> {formData.password} </p>
            <p> {counter} </p>
            <p>CounterRef: {counterRef.current} </p>
        </div>

    )
}

export default LoginFormComponent;