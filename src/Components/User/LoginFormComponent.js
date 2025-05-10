import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Link, useNavigate} from "react-router-dom";
import {Alert, Card, Col, Form, Image, Input, Row, Typography} from "antd";
import DisabledButtonComponent from "../Buttons/DisabledButtonComponent";

let LoginFormComponent = ({setLogin}) => {

    const [form] = Form.useForm();
    let navigate = useNavigate();
    let [formData, setFormData] = useState({
        email: '', password: '',
    })
    let [errors, setErrors] = useState([]);

    let clickLogin = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`, {
            method: "POST", headers: {"Content-Type": "application/json "}, body: JSON.stringify(formData)
        })

        if (response.ok) {
            let responseBody = await response.json();
            if (responseBody.apiKey && responseBody.email) {
                localStorage.setItem("apiKey", responseBody.apiKey)
                localStorage.setItem("email", responseBody.email)
            }
            setLogin(true)
            console.log("ok " + responseBody)
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            })
            setErrors(serverErrors);
        }
    }

    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
        <Col xs={0} sm={0} md={12} lg={8} xl={6}>
            <Image src="/iniciar-sesion.png" width="100%" preview={false}/>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={10}>
            <Card title="Login" style={{width: "100%", margin: "15px"}}>
                {errors && errors.map((e) => <Alert style={{marginBottom: "2vh"}} type="error"
                                                    message={e.msg}/>)}
                <Form
                    form={form}
                    name="login"
                    initialValues={{remember: true}}
                    onFinish={clickLogin}
                    autoComplete="off"
                >
                    <Form.Item
                        label=""
                        name="email"
                        rules={[{required: true, message: "Please enter your email address"}, {
                            type: "email", message: "Please enter a valid email address"
                        },]}
                    >
                        <Input placeholder="Your email" onChange={(i) => {
                            modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)
                        }}/>
                    </Form.Item>
                    <Form.Item
                        label=""
                        name="password"
                        rules={[{required: true, message: "Please enter your password"}]}
                    >
                        <Input.Password placeholder="Your password" onChange={(i) => {
                            modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)
                        }}/>
                    </Form.Item>
                    <Form.Item>
                        <DisabledButtonComponent form={form} submit>Login user</DisabledButtonComponent>
                    </Form.Item>
                </Form>
                <Card.Meta description={<Typography.Text>Don't have an account yet? <Link to="/register">Sign up here</Link></Typography.Text>}></Card.Meta>
            </Card>
        </Col>
    </Row>)
}

export default LoginFormComponent;