import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Button, Card, Col, Form, Input, Row} from "antd";
import {useNavigate} from "react-router-dom";

let CreateProductComponent = () => {
    let [formData, setFormData] = useState({})
    let navigate = useNavigate();

    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            })

        if (response.ok){
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
        <Col>
            <Card title="Create product" style={{width: "500px"}}>
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