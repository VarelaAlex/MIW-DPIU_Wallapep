import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Link, useNavigate} from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Steps,
    Typography
} from "antd";
import DisabledButtonComponent from "../Buttons/DisabledButtonComponent";

const {Step} = Steps;
const {Option} = Select;

const CreateUserComponent = ({openCustomNotification}) => {
    const navigate = useNavigate();
    let [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        email: null,
        password: null,
        name: null,
        surname: null,
        documentIdentity: null,
        documentNumber: null,
        country: null,
        address: null,
        postalCode: null,
        birthday: null
    });
    const [errors, setErrors] = useState([]);

    const steps = [{title: "Account"}, {title: "Personal Data"}, {title: "Document"}, {title: "Address"}];

    const onFinish = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                surname: formData.surname,
                documentIdentity: formData.documentIdentity && null,
                documentNumber: formData.documentNumber && null,
                country: formData.country && null,
                address: formData.address && null,
                postalCode: formData.postalCode && null,
                birthday: formData.birthday?.valueOf() && null
            })
        });

        if (response.ok) {
            const responseBody = await response.json();
            console.log("Usuario creado: ", responseBody);
            openCustomNotification("top", "Usuario creado", "success");
            navigate("/login");
        } else {
            const responseBody = await response.json();
            const serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
            setErrors(serverErrors);
            setCurrentStep(0);
        }
    };

    const next = () => setCurrentStep(currentStep + 1);
    const prev = () => setCurrentStep(currentStep - 1);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (<>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required: true, message: "Please enter your email"}, {
                            type: "email", message: "Please enter a valid email address."
                        }]}
                    >
                        <Input
                            placeholder="Your email"
                            value={formData.email}
                            status={errors?.filter(e=>e.msg.includes("email")).length>0?"error":undefined}
                            onChange={e => modifyStateProperty(formData, setFormData, "email", e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{required: true, message: "Please enter a valid password."}, {}]}
                    >
                        <Input.Password
                            placeholder="Your password"
                            value={formData.password}
                            onChange={e => modifyStateProperty(formData, setFormData, "password", e.target.value)}
                        />
                    </Form.Item>
                </>);
            case 1:
                return (<>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: "Please enter your name"}]}
                    >
                        <Input
                            placeholder="Your name"
                            value={formData.name}
                            onChange={e => modifyStateProperty(formData, setFormData, "name", e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="surname"
                        label="Surname"
                        rules={[{required: true, message: "Please enter your surname"}]}
                    >
                        <Input
                            placeholder="Your surname"
                            value={formData.surname}
                            onChange={e => modifyStateProperty(formData, setFormData, "surname", e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="birthday"
                        label="Birthday"
                    >
                        <DatePicker
                            style={{width: '100%'}}
                            placeholder="Your birthday"
                            value={formData.birthday}
                            onChange={date => modifyStateProperty(formData, setFormData, "birthday", date)}
                        />
                    </Form.Item>
                </>);
            case 2:
                return (<>
                    <Form.Item
                        name="documentIdentity"
                        label="Document Identity"
                    >
                        <Select
                            placeholder="Document identity"
                            value={formData.documentIdentity}
                            onChange={value => modifyStateProperty(formData, setFormData, "documentIdentity", value)}
                        >
                            <Option value="DNI">DNI</Option>
                            <Option value="Passport">Pasaporte</Option>
                            <Option value="NIE">NIE</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="documentNumber"
                        label="Document Number"
                    >
                        <Input
                            placeholder="Your document number"
                            value={formData.documentNumber}
                            onChange={e => modifyStateProperty(formData, setFormData, "documentNumber", e.target.value)}
                        />
                    </Form.Item>
                </>);
            case 3:
                return (<>
                    <Form.Item
                        name="country"
                        label="Country"
                    >
                        <Select
                            placeholder="Your country"
                            value={formData.country}
                            onChange={value => modifyStateProperty(formData, setFormData, "country", value)}
                        >
                            <Option value="Spain">España</Option>
                            <Option value="France">Francia</Option>
                            <Option value="Portugal">Portugal</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input
                            placeholder="Your address"
                            value={formData.address}
                            onChange={e => modifyStateProperty(formData, setFormData, "address", e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="postalCode"
                        label="Postal Code"
                    >
                        <InputNumber
                            style={{width: '100%'}}
                            placeholder="Your postal code"
                            value={formData.postalCode}
                            onChange={e => modifyStateProperty(formData, setFormData, "postalCode", e)}
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
                <Steps current={currentStep} onChange={(step) => setCurrentStep(step)} size="small"
                       labelPlacement="vertical" style={{marginBottom: "2vh"}}>
                    {steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                {errors && errors.map((e, idx) => (
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
                            {currentStep > 0 && (<Button style={{margin: '0 8px'}} onClick={prev} block>
                                Anterior
                            </Button>)}
                            {currentStep < steps.length - 1 && (<DisabledButtonComponent form={form} onClick={next} block>
                                Siguiente
                            </DisabledButtonComponent>)}
                            {currentStep === steps.length - 1 && (<DisabledButtonComponent form={form} submit>Create user</DisabledButtonComponent>)}
                        </Flex>
                    </Form.Item>

                    <Card.Meta
                        description={<Typography.Text>Already have an account? <Link to="/login">Log in</Link></Typography.Text>}/>
                </Form>

            </Card>
        </Col>
    </Row>);
};

export default CreateUserComponent;