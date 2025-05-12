import {Card, Col, Collapse, Image, Row, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {categories} from "../categories";
import {useNavigate} from "react-router-dom";
import {getProductsWithImage} from "../Utils/UtilsBackendCalls";

let HomeComponent = () => {
    let [products, setProducts] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {

        let getProducts = async () => {
            let products = await getProductsWithImage();
            setProducts(products);
        }

        getProducts();
    }, []);

    let {Title, Paragraph} = Typography;


    return (
        <Row align="middle" justify="center" style={{paddingTop: "5vh"}}>
            <Col span={20}>
                <Row align="middle" justify="center">
                    <Col>
                <Title>Bienvenido a Wallapep</Title>
                    </Col>
                </Row>
                <Row align="middle" justify="center">
                    <Col>
                <Paragraph style={{ fontSize: "1.2rem", color: "#555"}}>
                    Esta aplicación te permite gestionar tus productos, organizarlos por categorías y consultar
                    estadísticas de ventas de forma sencilla.
                </Paragraph>
                    </Col>
                </Row>

                {categories.map(cat => {
                    let limitedProducts = products.filter((product) => product.category === cat).slice(0, 5);

                    if (limitedProducts.length === 0) {
                        return null;
                    }
                    return <Collapse
                        style={{marginTop: "2vh"}}
                        items={[{
                            key: cat, label: cat, children: <Row gutter={[16, 16]}>
                                {limitedProducts.map((product) => (<Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <Card
                                        hoverable
                                        cover={<Image alt={product.name} src={product.image} preview={false}/>}
                                        title={product.title}
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    />
                                </Col>))}
                            </Row>,
                        },]}/>
                })} </Col>
        </Row>
      );
}

export default HomeComponent;