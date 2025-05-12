import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Button, Card, Col, Descriptions, Image, Row, Typography} from 'antd';
import {ShoppingOutlined} from '@ant-design/icons';
import {getUser} from "../../Utils/UtilsBackendCalls";

let DetailsProductComponent = ({openCustomNotification}) => {
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
                jsonData.sellerEmail = (await getUser(jsonData.sellerId)).email;
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
                openCustomNotification("top", "Producto comprado", "success")
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    const {Text, Paragraph} = Typography;
    return (<Row align="middle" justify="center">
        <Col xs={24} sm={16} md={12}>
            <Card cover={<Image
                src={`${process.env.REACT_APP_BACKEND_BASE_URL}/images/${product.id}.png`}
                alt={product.title}
                preview={false}
                style={{objectFit: "contain", height: 300}}
            />}>
                <Descriptions title={product.title} column={1} layout="vertical">
                    <Descriptions.Item>
                        <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                            {product.description}
                        </Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item>
                        <Link to={`/users/${product.sellerId}`}>{product.sellerEmail}</Link>
                    </Descriptions.Item>
                    <Descriptions.Item>
                        <Text strong style={{fontSize: 20}}>
                            {product.price?.toLocaleString("es-ES", {
                                style: "currency", currency: "EUR"
                            })}
                        </Text>
                    </Descriptions.Item>
                    <Descriptions.Item>
                        <Button
                            type="primary"
                            onClick={buyProduct}
                            icon={<ShoppingOutlined/>}
                            size="large"
                            block
                            disabled={!product}
                        >
                            Buy
                        </Button>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Col>
    </Row>)
}

export default DetailsProductComponent;