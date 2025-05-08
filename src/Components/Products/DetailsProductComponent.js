import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Card, Col, Descriptions, Image, Row, Typography} from 'antd';
import {ShoppingOutlined} from '@ant-design/icons';

let DetailsProductComponent = () => {
    let [product, setProduct] = useState({})
    const {id} = useParams();

    useEffect(() => {
        let getProduct = async () => {
            let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                setProduct(jsonData)
            } else {
                let responseBody = await response.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg)
                })
            }
        }

        getProduct();
    }, [id]);

    let buyProduct = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/", {
            method: "POST", headers: {
                "Content-Type": "application/json ", "apikey": localStorage.getItem("apiKey")
            }, body: JSON.stringify({
                productId: id
            })
        });

        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.affectedRows === 1) {

            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    const {Text} = Typography;
    return (<Row align="middle" justify="center">
        <Col xs={24} sm={12} md={12}>
            <Card>
                <Image src="/item1.png" preview={false}/>
                <Descriptions title={product.title} column={1} layout="vertical">
                    <Descriptions.Item label="Id">
                        {product.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                        {product.description}
                    </Descriptions.Item>
                    <Descriptions.Item>
                        <Text strong underline style={{fontSize: 20}}>{product.price}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item>
                        <Button type="primary" onClick={buyProduct}
                                icon={<ShoppingOutlined/>} size="large">
                            Comprar
                        </Button>
                    </Descriptions.Item>

                </Descriptions>
            </Card>
        </Col>
    </Row>)
}

export default DetailsProductComponent;