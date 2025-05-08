import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Card, Col, Form, Image, Input, Row} from "antd";

let LoginFormComponent = () => {

    let navigate = useNavigate();

    let [formData, setFormData] = useState({
        email: '', password: '',
    })
    let [error, setError] = useState(false);

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
            console.log("ok " + responseBody)
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            })
            setError(true);
        }
    }

    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
        <Col xs={0} sm={0} md={12} lg={8} xl={6}>
            <Image src="/iniciar-sesion.png" width="100%"/>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={10}>
            <Card title="Login" style={{width: "100%", margin: "15px"}}>
                {error && <Alert style={{marginBottom: "2vh"}} type="error"
                                 message="Algo ha ido mal, inténtelo más tarde"/>}
                <Form
                    name="login"
                    initialValues={{remember: true}}
                    onFinish={clickLogin}
                    autoComplete="off"
                >
                    <Form.Item
                        label=""
                        name="email"
                        rules={[{required: true, message: "Por favor, introduce el email"}, {
                            type: "email", message: "Por favor, introduce un email válido"
                        },]}
                    >
                        <Input placeholder="Tu email" onChange={(i) => {
                            modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)
                        }}/>
                    </Form.Item>
                    <Form.Item
                        label=""
                        name="password"
                        rules={[{required: true, message: "Por favor, introduce la contraseña"}]}
                    >
                        <Input.Password placeholder="Tu contraseña" onChange={(i) => {
                            modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)
                        }}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Login User</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
    </Row>)
}

export default LoginFormComponent;