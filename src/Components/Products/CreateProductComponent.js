import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Alert, Button, Card, Col, Form, Input, Row} from "antd";
import {useNavigate} from "react-router-dom";

let CreateProductComponent = ({openCustomNotification}) => {
    let [formData, setFormData] = useState({})
    let navigate = useNavigate();
    let [errors, setErrors] = useState(false);

    let clickCreateProduct = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
            method: "POST", headers: {
                "Content-Type": "application/json ", "apikey": localStorage.getItem("apiKey")
            }, body: JSON.stringify(formData)
        })

        if (response.ok) {
            openCustomNotification("top", "Producto creado", "success")
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
            setErrors(serverErrors);
        }
    }

    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
        <Col>
            <Card title="Create product" style={{width: "500px"}}>
                {errors && errors.map((e) => <Alert style={{marginBottom: "2vh"}} type="error"
                                                    message={e.msg}/>)}
                <Form.Item label="">
                    <Input
                        onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)}
                        size="large" type="text" placeholder="product title"></Input>
                </Form.Item>
                <Form.Item label="">
                    <Input
                        onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)}
                        size="large" type="text" placeholder="description"></Input>
                </Form.Item>
                <Form.Item label="">
                    <Input
                        onChange={(i) => modifyStateProperty(formData, setFormData, "price", i.currentTarget.value)}
                        size="large" type="number" placeholder="price"></Input>
                </Form.Item>
                <Button type="primary" block onClick={clickCreateProduct}>Sell Product</Button>
            </Card>
        </Col>
    </Row>)
}

export default CreateProductComponent;