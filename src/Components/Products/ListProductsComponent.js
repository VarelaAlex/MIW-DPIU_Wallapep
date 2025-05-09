import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Card, Col, Image, Row} from 'antd';
import {checkURL} from "../../Utils/UtilsChecks";

let ListProductsComponent = () => {
    let [products, setProducts] = useState([])

    useEffect(() => {
        getProducts();
    }, [])

    let getProducts = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products`, {
            method: "GET", headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            let promisesForImages = jsonData.map(async p => {
                let urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${p.id}.png`
                let existsImage = await checkURL(urlImage);
                existsImage ? p.image = urlImage : p.image = "/imageMockup.png"
                return p
            })

            let productsWithImage = await Promise.all(promisesForImages)
            setProducts(productsWithImage)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }


    return (<div>
        <h2>Products</h2>
        <Row gutter={[16, 16]}>
            {products.map(p => <Col xs={12} sm={8} md={8} lg={6} xl={4}>
                <Link to={`/products/${p.id}`}>
                    <Card hoverable key={p.id} title={p.title}
                          cover={<Image src={p.image} preview={false} />}>
                        {p.price}
                    </Card>
                </Link>
            </Col>)}
        </Row>
    </div>)
}

export default ListProductsComponent;