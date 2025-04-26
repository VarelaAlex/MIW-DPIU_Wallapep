import {useState, useRef} from "react";

let LoginFormComponent = () => {

    let [formData, setFormData] = useState({
        email: '- empty email -',
        password: '- empty password -',
    });

    let [counter,setCounter] = useState(0);
    let counterRef = useRef(0);

    let onChangeEmail = (e) => {
        let currentCounter = counter;
        currentCounter +=1;
        currentCounter +=1;
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
            <form>
                <input onChange ={ onChangeEmail } type="text" name="email"/>
                <input onChange ={ onChangePassword } type="password" name="password" />
                <input type="submit" value="Login"/>
            </form>
            <p> {formData.email} </p>
            <p> {formData.password} </p>
            <p> { counter } </p>
            <p>CounterRef: { counterRef.current } </p>
        </div>

    )
}

export default LoginFormComponent;