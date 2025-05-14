import React, {useEffect, useState} from "react";
import {Checkbox, Col, Empty, Grid, Radio, Row, Space, Typography} from 'antd';
import {categories} from "../../categories";
import {getProductsWithImage} from "../../Utils/UtilsBackendCalls";
import ProductSearchBarComponent from "./ProductSearchBarComponent";
import CategorySelectComponent from "./CategorySelectComponent";
import {FilterOutlined} from "@ant-design/icons";
import ProductCardComponent from "./ProductCardComponent";

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
            products.sort((a, b) => {
                let aEmail = a.buyerEmail;
                let bEmail = b.buyerEmail;

                if (!aEmail && bEmail) return -1;
                if (aEmail && !bEmail) return 1;
                if (aEmail && bEmail) return aEmail.localeCompare(bEmail);
                return 0;
            })
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
            } else {
                filtered.sort((a, b) => a.title - b.title);
            }

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [products, searchTerm, selectedCategories, sortOrder]);

    let {Title} = Typography;
    return (<Space direction="vertical" style={{width: "100%"}}>
        <Title>Products</Title>

        <Row gutter={8} justify="end">
            <ProductSearchBarComponent onChange={e => setSearchTerm(e.target.value.toLowerCase())}
                                       screenProps={{xs: 24, md: 20}} cell={!screens.md &&
                <CategorySelectComponent onChange={(values) => setSelectedCategories(values)}
                                         placeholder={<FilterOutlined/>} mode="multiple" showSearch={false}
                                         popupMatchSelectWidth={false} minWidth={65}/>}/>
        </Row>

        <Row justify="end">
            <Col>
                <Radio.Group value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <Radio.Button
                        value="asc"
                        onClick={() => {
                            if (sortOrder === "asc") {
                                setSortOrder(null);
                            }
                        }}
                    >
                        Baratos
                    </Radio.Button>
                    <Radio.Button
                        value="desc"
                        onClick={() => {
                            if (sortOrder === "desc") {
                                setSortOrder(null);
                            }
                        }}
                    >
                        Precio más alto
                    </Radio.Button>
                </Radio.Group>
            </Col>
        </Row>

        <Row gutter={[16, 16]}>
            <Col md={4}> {screens.md && <Space direction="vertical" style={{width: "100%"}}>
                <strong>Categorías</strong>
                <Checkbox.Group
                    options={categories}
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    style={{display: "flex", flexDirection: "column", marginTop: 8}}
                />
            </Space>}</Col>
            <Col md={20}>
                {filteredProducts.length === 0 ? (<Empty description="No products found" style={{width: '100%'}}/>) : (
                    <Row gutter={[16, 16]}>
                        {filteredProducts.map(p => (<Col xs={12} sm={8} lg={6} key={p.id}>
                            <ProductCardComponent product={p}/>
                        </Col>))}
                    </Row>)}
            </Col>
        </Row>
    </Space>);
}

export default ListProductsComponent;
