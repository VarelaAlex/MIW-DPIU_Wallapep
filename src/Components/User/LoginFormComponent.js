import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {useNavigate} from "react-router-dom";
import {Button, Card, Col, Form, Image, Input, Row, Typography} from "antd";
import {
    allowSubmitForm,
    joinAllServerErrorMessages,
    setServerErrors,
    validateFormDataInputEmail,
    validateFormDataInputRequired
} from "../../Utils/UtilsValidations";

let LoginFormComponent = ({setLogin, openCustomNotification}) => {

    let navigate = useNavigate();

    let [formData, setFormData] = useState({})
    let [formErrors, setFormErrors] = useState({})
    let requiredInForm = ["email", "password"]

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
            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openCustomNotification("top", notificationMsg, "error")
        }
    }

    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
        <Col xs={0} sm={0} md={12} lg={8} xl={6}>
            <Image src="/iniciar-sesion.png" width="100%" preview={false}/>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={10}>
            <Card title="Login" style={{width: "100%", margin: "15px"}}>
                <Form>
                    <Form.Item label=""
                               validateStatus={validateFormDataInputEmail(formData, "email", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input placeholder="your email"
                               onChange={(i) => {
                                   modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)
                               }}/>
                        {formErrors?.email?.msg &&
                            <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                    </Form.Item>
                    <Form.Item label=""
                               validateStatus={validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}
                    >
                        <Input.Password
                            placeholder="your password"
                            onChange={(i) => {
                                modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)
                            }}/>
                        {formErrors?.password?.msg &&
                            <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>
                    <Form.Item>
                        {allowSubmitForm(formData, formErrors, requiredInForm) ?
                            <Button type="primary" onClick={clickLogin} block>Login</Button> :
                            <Button type="primary" block disabled>Login</Button>}
                    </Form.Item>
                </Form>
            </Card>
        </Col>
    </Row>)
}

export default LoginFormComponent;