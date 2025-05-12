import {Card, Col, Collapse, Image, Row, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {categories} from "../categories";
import {checkURL} from "../Utils/UtilsChecks";
import {useNavigate} from "react-router-dom";

let HomeComponent = () => {
    let [products, setProducts] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        let getProducts = async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products`, {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                let productsWithImage = await Promise.all(jsonData.map(async (p) => {
                    let urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${p.id}.png`;
                    let existsImage = await checkURL(urlImage);
                    p.image = existsImage ? urlImage : "/imageMockup.png";
                    return p;
                }));
                setProducts(productsWithImage);
            } else {
                let responseBody = await response.json();
                responseBody.errors.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
        };

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