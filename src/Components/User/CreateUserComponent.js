import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Alert, Button, Card, Col, DatePicker, Flex, Form, Input, InputNumber, Radio, Row, Select, Steps, Typography
} from "antd";
import SubmitButtonComponent from "../Buttons/SubmitButtonComponent";
import dayjs from "dayjs";
import {countries} from "../../countries";

const {Step} = Steps;
const {Option} = Select;

const CreateUserComponent = ({openCustomNotification}) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState([]);

    const steps = [{title: "Account"}, {title: "Personal Data"}, {title: "Document"}, {title: "Address"}];

    const onFinish = async () => {
        const values = form.getFieldsValue(true);
        const body = {
            ...values, birthday: values.birthday?.valueOf() || null
        };

        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)
        });

        if (response.ok) {
            const responseBody = await response.json();
            console.log("Usuario creado: ", responseBody);
            openCustomNotification("top", "Usuario creado", "success");
            navigate("/login");
        } else {
            const responseBody = await response.json();
            const serverErrors = responseBody.errors || [];
            serverErrors.forEach(e => console.log("Error: " + e.msg));
            setErrors(serverErrors);
            setCurrentStep(0);
        }
    };

    const next = async () => {
        try {
            await form.validateFields();
            setCurrentStep(currentStep + 1);
        } catch (err) {
            console.log("Errores de validación:", err);
        }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    const documentIdentity = Form.useWatch("documentIdentity", form);

    const handleRadioClick = (value) => {
        const currentValue = form.getFieldValue("documentIdentity");
        if (currentValue === value) {
            form.setFieldValue("documentIdentity", undefined);
        } else {
            form.setFieldValue("documentIdentity", value);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (<>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{required: true, message: "Please enter your email"}, {
                                type: "email",
                                message: "Please enter a valid email address."
                            }]}
                        >
                            <Input allowClear placeholder="Your email"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{required: true, message: "Please enter a password."}]}
                        >
                            <Input.Password allowClear placeholder="Your password"/>
                        </Form.Item>
                    </>);
            case 1:
                return (<>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{required: true, message: "Please enter your name"}]}
                        >
                            <Input allowClear placeholder="Your name"/>
                        </Form.Item>
                        <Form.Item
                            name="surname"
                            label="Surname"
                            rules={[{required: true, message: "Please enter your surname"}]}
                        >
                            <Input allowClear placeholder="Your surname"/>
                        </Form.Item>
                        <Form.Item name="birthday" label="Birthday">
                            <DatePicker
                                style={{width: "100%"}}
                                placeholder="Your birthday"
                                disabledDate={current => current && current >= dayjs().endOf("day")}
                            />
                        </Form.Item>
                    </>);
            case 2:
                return (
                    <>
                        <Form.Item name="documentIdentity" label="Document Identity">
                            <Radio.Group value={documentIdentity}>
                                <Radio.Button value="DNI" onClick={() => handleRadioClick("DNI")}>
                                    DNI
                                </Radio.Button>
                                <Radio.Button value="Passport" onClick={() => handleRadioClick("Passport")}>
                                    Passport
                                </Radio.Button>
                                <Radio.Button value="NIE" onClick={() => handleRadioClick("NIE")}>
                                    NIE
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="documentNumber" label="Document Number">
                            <Input allowClear placeholder="Your document number" />
                        </Form.Item>
                    </>
                );

            case 3:
                return (<>
                        <Form.Item name="country" label="Country">
                            <Select showSearch placeholder="Your country" allowClear>
                                {countries.map((country) => <Option value={country}>{country}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="address" label="Address">
                            <Input allowClear placeholder="Your address"/>
                        </Form.Item>
                        <Form.Item name="postalCode" label="Postal Code">
                            <InputNumber
                                min={0}
                                style={{width: "100%"}}
                                placeholder="Your postal code"
                            />
                        </Form.Item>
                    </>);
            default:
                return null;
        }
    };

    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col xs={24} sm={24} md={16}>
                <Card>
                    <Steps current={currentStep} size="small" labelPlacement="vertical" style={{marginBottom: "2vh"}}>
                        {steps.map(item => <Step key={item.title} title={item.title}/>)}
                    </Steps>

                    {errors.map((e, idx) => (
                        <Alert key={idx} style={{marginBottom: "2vh"}} type="error" message={e.msg}/>))}

                    <Form
                        form={form}
                        name="createUser"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        {renderStepContent()}

                        <Form.Item>
                            <Flex gap={8}>
                                {currentStep > 0 && (<Button onClick={prev} block>
                                        Previous
                                    </Button>)}
                                {currentStep < steps.length - 1 && (
                                    <SubmitButtonComponent form={form} onClick={next} block>
                                        Next
                                    </SubmitButtonComponent>)}
                                {currentStep === steps.length - 1 && (<SubmitButtonComponent form={form} submit>
                                        Create user
                                    </SubmitButtonComponent>)}
                            </Flex>
                        </Form.Item>

                        <Card.Meta
                            description={<Typography.Text>
                                Already have an account? <Link to="/login">Log in</Link>
                            </Typography.Text>}
                        />
                    </Form>
                </Card>
            </Col>
        </Row>);
};

export default CreateUserComponent;
