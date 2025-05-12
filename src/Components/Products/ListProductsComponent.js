import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Card, Checkbox, Col, Empty, Grid, Image, Input, Radio, Row, Select, Space, Tag, Typography} from 'antd';
import {categories, categoryColors} from "../../categories";
import {FilterOutlined} from "@ant-design/icons";
import {getProductsWithImage} from "../../Utils/UtilsBackendCalls";

let ListProductsComponent = () => {
    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [searchTerm, setSearchTerm] = useState("");
    let [selectedCategories, setSelectedCategories] = useState([]);
    let [sortOrder, setSortOrder] = useState(null);
    let {useBreakpoint} = Grid;
    let screens = useBreakpoint();

    useEffect(() => {
        let getProducts = async () => {
            let products = await getProductsWithImage();
            setProducts(products);
        }

        getProducts();
    }, []);

    useEffect(() => {
        let applyFilters = () => {
            let filtered = products.filter(p => {
                let matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase());
                let matchesCategory = selectedCategories.length > 0 ? selectedCategories.map(c => c?.toLowerCase()).includes(p.category?.toLowerCase()) : true;
                return matchesSearch && matchesCategory;
            });

            if (sortOrder === "asc") {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortOrder === "desc") {
                filtered.sort((a, b) => b.price - a.price);
            }

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [products, searchTerm, selectedCategories, sortOrder]);

    let {Text, Title} = Typography;
    let {Search} = Input;
    return (<Space direction="vertical" style={{width: "100%"}} >
        <Title>Products</Title>

        <Row gutter={8} justify="end" >
            <Col xs={24} md={20}>
                <Search
                    placeholder="Buscar por título o descripción"
                    allowClear
                    onChange={e => setSearchTerm(e.target.value)}
                    enterButton
                />
            </Col>
        </Row>

        <Row justify="space-between">
            <Col>{!screens.md &&
                <Select
                    options={categories.map(cat => ({
                        value: cat, label: <Tag color={categoryColors[cat?.toLowerCase()] || 'default'}>{cat}</Tag>
                    }))}
                    mode="multiple"
                    showSearch={false}
                    popupMatchSelectWidth={false}
                    placeholder={<FilterOutlined/>}
                    value={selectedCategories}
                    onChange={(values) => setSelectedCategories(values)}
                    style={{minWidth: 65}}
                    allowClear
                />
           } </Col>
            <Col>
                <Radio.Group value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <Radio.Button
                        value="asc"
                    >
                        Baratos
                    </Radio.Button>
                    <Radio.Button
                        value="desc"
                    >
                        Precio más alto
                    </Radio.Button>
                </Radio.Group>
            </Col>
        </Row>

        <Row gutter={[16, 16]}>
            <Col md={4}> {screens.md &&
                <Space direction="vertical" style={{width: "100%"}}>
                    <strong>Categorías</strong>
                    <Checkbox.Group
                        options={categories}
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                        style={{display: "flex", flexDirection: "column", marginTop: 8}}
                    />
                </Space>
            }</Col>
            <Col md={20}>
                {filteredProducts.length === 0 ? (<Empty description="No products found" style={{width: '100%'}}/>) : (
                    <Row gutter={[16, 16]}>
                        {filteredProducts.map(p => (<Col xs={12} sm={8} lg={6} key={p.id}>
                            <Link to={`/products/${p.id}`}>
                                <Card hoverable title={p.title}
                                      cover={<Image src={p.image} preview={false}/>}>
                                    <Text strong style={{fontSize: 15}}>
                                        {p.price?.toLocaleString("es-ES", {
                                            style: "currency", currency: "EUR"
                                        })}
                                    </Text>
                                </Card>
                            </Link>
                        </Col>))}
                    </Row>)}
            </Col>
        </Row>
    </Space>);
}

export default ListProductsComponent;
