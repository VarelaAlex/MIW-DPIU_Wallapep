import {Col, Collapse, Row, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {categories} from "../categories";
import {getProductsWithImage} from "../Utils/UtilsBackendCalls";
import ProductCardComponent from "./Products/ProductCardComponent";

let HomeComponent = () => {
    let [products, setProducts] = useState([]);

    useEffect(() => {

        let getProducts = async () => {
            let products = await getProductsWithImage();
            products = products?.filter(product => !product.buyerEmail)
            setProducts(products);
        }

        getProducts();
    }, []);

    let {Title, Paragraph} = Typography;


    return (<Row align="middle" justify="center" style={{paddingTop: "5vh"}}>
        <Col span={20}>
            <Row align="middle" justify="center">
                <Col>
                    <Title>Welcome to Wallapep</Title>
                </Col>
            </Row>
            <Row align="middle" justify="center">
                <Col>
                    <Paragraph style={{fontSize: "1.2rem", color: "#555", textAlign: "center"}}>
                        Wallapep is your trusted platform to easily and securely buy and sell products. Discover great deals, keep track of your transactions, and explore other users' profiles to see what they’re offering.                    </Paragraph>
                </Col>
            </Row>

            {categories.map(cat => {
                let limitedProducts = products?.filter((product) => product?.category?.toLowerCase() === cat?.toLowerCase()).slice(0, 5);

                if (!products || products.length === 0 || limitedProducts?.length === 0) {
                    return null;
                }
                return <Collapse
                    style={{marginTop: "2vh"}}
                    items={[{
                        key: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(), children: <Row gutter={[16, 16]}>
                            {limitedProducts?.map((product) => (<Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <ProductCardComponent product={product} />
                            </Col>))}
                        </Row>,
                    },]}/>
            })} </Col>
    </Row>);
}

export default HomeComponent;