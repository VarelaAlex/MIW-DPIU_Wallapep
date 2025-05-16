import {Card, Image, Typography} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";

let ProductCardComponent = ({product, showSold = false, actions}) => {

    let navigate = useNavigate();

    const baseImageStyle = {
        height: 200,
        objectFit: 'cover',
        width: '100%',
    };

    let disableImageStyle = {
        opacity: 0.25,
    }

    if (!showSold && product.buyerEmail) return;

    let {Text, Paragraph} = Typography;
    return <Card hoverable={!product.buyerEmail} title={product.title}
                 cover={<Image src={product.image} preview={false}
                               style={{
                                   ...baseImageStyle,
                                   ...(product.buyerEmail ? disableImageStyle : {})
                               }}/>}
                 onClick={() => {
                     if (!product.buyerEmail && !product.buyerId) {
                         navigate(`/products/${product.id}`)
                     }
                 }}
                 extra={product.buyerEmail && <Text type="secondary">Sold</Text>}
                 actions={actions}>
        <Paragraph ellipsis={{rows: 1, expandable: true, symbol: 'more'}} onClick={(e)=>e.stopPropagation()}>
            {product.description}
        </Paragraph>
        <Text strong style={{fontSize: 15}}>
            {product.price?.toLocaleString("es-ES", {
                style: "currency", currency: "EUR"
            })}
        </Text>
    </Card>
}

export default ProductCardComponent