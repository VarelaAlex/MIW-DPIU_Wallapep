import {Card, Image, Typography} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";

let ProductCardComponent = ({product}) => {

    let navigate = useNavigate();

    let disableImageStyle = {
        opacity: 0.25,
    }

    let {Text} = Typography;
    return <Card hoverable={!product.buyerEmail} title={product.title}
                 cover={<Image src={product.image} preview={false}
                               style={product.buyerEmail ? disableImageStyle : undefined}/>}
                 onClick={() => {
                     if (!product.buyerEmail) {
                         navigate(`/products/${product.id}`)
                     }
                 }}
                 extra={product.buyerEmail && <Text type="secondary">Vendido</Text>}>
        <Text strong style={{fontSize: 15}}>
            {product.price?.toLocaleString("es-ES", {
                style: "currency", currency: "EUR"
            })}
        </Text>
    </Card>
}

export default ProductCardComponent