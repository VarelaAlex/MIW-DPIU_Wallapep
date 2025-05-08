import {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, Row} from "antd";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {useParams} from "react-router-dom";

let EditProductComponent = () => {

    let {id} = useParams();
    let [formData, setFormData] = useState({})

    useEffect(() => {
        let getProduct = async () => {
            let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                setFormData(jsonData)
            } else {
                let responseBody = await response.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg)
                })
            }
        }

        getProduct();
    }, [id])

    let clickEditProduct = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
            method: "PUT", headers: {
                "Content-Type": "application/json ", "apikey": localStorage.getItem("apiKey")
            }, body: JSON.stringify(formData)
        });

        if (response.ok) {
            await response.json();

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
            <Card title="Edit product" style={{width: "500px"}}>
                <Form.Item label="">
                    <Input
                        onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)}
                        size="large" type="text" placeholder="product title"
                        value={formData?.title}>
                    </Input>
                </Form.Item>
                <Form.Item label="">
                    <Input
                        onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)}
                        size="large" type="text" placeholder="description"
                        value={formData?.description}>
                    </Input>
                </Form.Item>
                <Form.Item label="">
                    <Input
                        onChange={(i) => modifyStateProperty(formData, setFormData, "price", i.currentTarget.value)}
                        size="large" type="number" placeholder="price"
                        value={formData?.price}>
                    </Input>
                </Form.Item>
                <Button type="primary" onClick={clickEditProduct} block>Edit Product</Button>
            </Card>
        </Col>
    </Row>)
}

export default EditProductComponent;