import React, {useState} from "react";
import {Button, Card, Col, Empty, Grid, Image, List, Row, Space, Tag, Tooltip, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {DeleteOutlined, DropboxOutlined} from "@ant-design/icons";
import {timestampToString} from "../../../Utils/UtilsDates";
import {categoryColors} from "../../../categories";
import {useMyProducts} from "../../../Utils/hooks/useMyProducts";
import MyProductsStatsComponent from "./MyProductsStatsComponent";
import ProductSearchBarComponent from "../ProductSearchBarComponent";
import ProductsTableComponent from "./ProductsTableComponent";

let ListMyProductsComponent = ({openCustomNotification}) => {

    let [selectedRowKeys, setSelectedRowKeys] = useState([]);
    let [pageSize, setPageSize] = useState(5);
    let [selectedCategories, setSelectedCategories] = useState([]);

    let navigate = useNavigate();
    let {useBreakpoint} = Grid;
    let screens = useBreakpoint();

    const baseImageStyle = {
        height: 200, objectFit: 'cover', width: '100%',
    };

    let disableImageStyle = {
        opacity: 0.25,
    }

    let {
        products, filteredProducts, stats, setProducts, setFilteredProducts, handleSearch, deleteMultipleProducts
    } = useMyProducts(openCustomNotification)

    let {Text, Title, Paragraph} = Typography
    return (<Space direction="vertical" style={{width: '100%'}}>
        <Row align="middle" justify="start">
            <Col>
                <Title><DropboxOutlined/> My products</Title>
            </Col>
        </Row>
        <Row align="middle" justify="center" style={{paddingTop: "10vh"}}>
            <Col md={20}>
                {products && products.length > 0 ? <div>
                    <MyProductsStatsComponent stats={stats}/>
                    <Row justify="space-between" align="middle" style={{margin: "2vh 0"}}>
                        <ProductSearchBarComponent screenProps={{xs: 24, lg: 22}} onChange={e => handleSearch(e)}/>
                        {screens.lg && <Col>
                            <Button
                                danger
                                disabled={selectedRowKeys.length === 0}
                                onClick={() => {
                                    deleteMultipleProducts(selectedRowKeys)
                                    setSelectedRowKeys([]);
                                }}
                                icon={<DeleteOutlined/>}
                                style={{minWidth: 48}}
                            />
                        </Col>}
                    </Row>
                    {filteredProducts && filteredProducts.length > 0 ? screens.lg ? <ProductsTableComponent
                        products={products}
                        setProducts={setProducts}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectedRowKeys}
                        filteredProducts={filteredProducts}
                        setFilteredProducts={setFilteredProducts}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        openCustomNotification={openCustomNotification}
                    /> : <List
                        dataSource={filteredProducts}
                        grid={{gutter: 24, xs: 1, sm: 2, md: 3}}
                        pagination={{
                            pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            onShowSizeChange: (current, size) => setPageSize(size)
                        }}
                        renderItem={product => (<List.Item>
                            <Card
                                hoverable={!product.buyerEmail}
                                cover={<Image src={product.image} preview={false} style={{
                                    ...baseImageStyle, ...(product.buyerEmail ? disableImageStyle : {})
                                }}/>}
                                title={<Tooltip title={product.title}>
                                    {product.title}
                                </Tooltip>}
                                onClick={() => {
                                    if (!product.buyerEmail) {
                                        navigate(`/products/edit/${product.id}`)
                                    }
                                }}
                                extra={product.buyerEmail ? <Text type="secondary">Sold</Text> :
                                    <DeleteOutlined onClick={(e) => {
                                        e.stopPropagation();
                                        deleteMultipleProducts([product.id])
                                    }} style={{color: 'red'}}/>

                                }
                            >
                                <Space direction="vertical">
                                    <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}
                                               onClick={(e) => e.stopPropagation()}>
                                        {product.description}
                                    </Paragraph>
                                    <Space direction="vertical">
                                        {product.buyerId ? <Link
                                            to={`/users/${product.buyerId}`}
                                            onClick={(e) => e.stopPropagation()}>
                                            {product.buyerEmail}
                                        </Link> : `${product.price} €`}
                                        {timestampToString(product.date)}
                                        <Tag color={categoryColors[product.category?.toLowerCase()] || "default"}
                                             key={product.category}>
                                            {product.category.toUpperCase()}
                                        </Tag>
                                    </Space>
                                </Space>
                            </Card>
                        </List.Item>)}
                    /> : <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        styles={{image: {height: 60}}}
                        description={<Text>No hay productos con estas características</Text>}/>}
                </div> : <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    styles={{image: {height: 60}}}
                    description={<Text>Aún no tienes productos a la venta</Text>}
                >
                    <Button type="primary" onClick={() => navigate("/products/create")}>Create Now</Button>
                </Empty>}
            </Col>
        </Row>
    </Space>)
}

export default ListMyProductsComponent;