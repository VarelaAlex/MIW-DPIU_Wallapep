import React, {useEffect, useState} from "react";
import {Alert, Button, Card, Col, Flex, Form, Input, Row} from "antd";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {useNavigate, useParams} from "react-router-dom";

let EditProductComponent = ({openCustomNotification}) => {

    let {id} = useParams();
    let [formData, setFormData] = useState({})
    let [errors, setErrors] = useState(false);
    let navigate = useNavigate();

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
            openCustomNotification("top", "Se ha editado el producto", "success");
            navigate("/products/own");
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
            <Card title="Edit product" style={{width: "500px"}}>
                {errors && errors.map((e, idx) => (
                    <Alert key={idx} style={{marginBottom: "2vh"}} type="error" message={e.msg}/>))}
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
                <Flex gap={8}>
                    <Button onClick={() => navigate("/products/own")} block>Cancel</Button>
                    <Button type="primary" onClick={clickEditProduct} block>Edit Product</Button>
                </Flex>
            </Card>
        </Col>
    </Row>)
}

export default EditProductComponent;