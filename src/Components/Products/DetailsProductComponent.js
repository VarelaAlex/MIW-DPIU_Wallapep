import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Card, Col, Descriptions, Empty, Image, Rate, Row, Space, Tooltip, Typography} from 'antd';
import {getProductById, getTransactions} from "../../Utils/UtilsBackendCalls";
import CategoryTagComponent from "./CategoryTagComponent";
import BuyButtonComponent from "../Buttons/BuyButtonComponent";
import {UserOutlined} from "@ant-design/icons";

let DetailsProductComponent = ({openCustomNotification}) => {

    let [product, setProduct] = useState({})
    let [rate, setRate] = useState(0);
    let [transactionCount, setTransactionCount] = useState(0);
    const {id} = useParams();

    useEffect(() => {

        let getProduct = async () => {
            let product = await getProductById(id);
            setProduct(product)

            let transactionsSeller = await getTransactions(false, product.sellerId);

            const maxStars = 5;
            const maxTransactions = 10;
            setTransactionCount(transactionsSeller.length)
            const value = Math.min((transactionsSeller.length / maxTransactions) * maxStars, maxStars);
            setRate(value);
        }

        getProduct();
    }, [id]);

    if (!product) {
        return (<Space direction="vertical" style={{width: '100%'}}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="This product does not exist"/>
        </Space>)
    }


    const {Text, Title, Paragraph} = Typography;
    return (<Space direction="vertical" style={{width: '100%'}}>
        <Row align="middle" justify="center">
            <Col>
                <Title>{product.title}</Title>
            </Col>
        </Row>
        <Row align="middle" justify="center">
            <Col xs={24} sm={16} md={12}>
                <Card cover={<Image
                    src={product.image}
                    alt={product.title}
                    preview={false}
                    style={{objectFit: "contain", height: 300}}
                />}>
                    <Descriptions column={1} layout="vertical"
                                  extra={<CategoryTagComponent category={product.category}/>}>
                        <Descriptions.Item>
                            <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                                {product.description}
                            </Paragraph>
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <Space>
                                <UserOutlined /><Link to={`/users/${product.sellerId}`}>{product.sellerEmail}</Link>
                                <Tooltip title={`${transactionCount} transaction(s)`}>
                                    <Rate allowHalf disabled value={rate}/>
                                </Tooltip>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <Text strong style={{fontSize: 20}}>
                                {product.price?.toLocaleString("es-ES", {
                                    style: "currency", currency: "EUR"
                                })}
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <BuyButtonComponent disabled={product.buyerEmail} productId={product.id}
                                                openCustomNotification={openCustomNotification}/>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    </Space>)
}

export default DetailsProductComponent;