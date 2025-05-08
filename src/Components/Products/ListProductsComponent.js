import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Card, Col, Image, Row} from 'antd';

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
            setProducts(jsonData)
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
            {products.map(p => <Col span={8}>
                <Link to={`/products/${p.id}`}>
                    <Card hoverable key={p.id} title={p.title} cover={<Image src="/item1.png" preview={false}/>}>
                        {p.price}
                    </Card>
                </Link>
            </Col>)}
        </Row>
    </div>)
}

export default ListProductsComponent;