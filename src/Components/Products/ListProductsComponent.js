import React, {useEffect, useState} from "react";
import {Checkbox, Col, Empty, Grid, Radio, Row, Space, Switch, Typography} from 'antd';
import {categories} from "../../categories";
import {getProductsWithImage} from "../../Utils/UtilsBackendCalls";
import ProductSearchBarComponent from "./ProductSearchBarComponent";
import CategorySelectComponent from "./CategorySelectComponent";
import {FilterOutlined, ProductOutlined} from "@ant-design/icons";
import ProductCardComponent from "./ProductCardComponent";
import BuyButtonComponent from "../Buttons/BuyButtonComponent";

let ListProductsComponent = ({openCustomNotification}) => {
    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [searchTerm, setSearchTerm] = useState("");
    let [selectedCategories, setSelectedCategories] = useState([]);
    let [sortOrder, setSortOrder] = useState(null);
    let [showSold, setShowSold] = useState(false);
    let {useBreakpoint} = Grid;
    let screens = useBreakpoint();

    let categoryCounts = filteredProducts.reduce((acc, product) => {
        if (!showSold && product.buyerEmail) {
            return acc;
        }
        let category = product.category?.toLowerCase() || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    let categoryOptions = categories.map(cat => ({
        label: `${cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()} (${categoryCounts[cat?.toLowerCase()] || 0})`, value: cat
    }));

    useEffect(() => {
        let getProducts = async () => {
            let products = await getProductsWithImage();
            products?.sort((a, b) => {
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

    let numProducts = () => {
        if (showSold) return filteredProducts.length;
        return filteredProducts.filter(p => !p.buyerEmail).length;
    }

    let {Title, Text} = Typography;
    return (<Space direction="vertical" style={{width: "100%"}}>
        <Title><ProductOutlined/> Products</Title>
        <Title level={2}>{numProducts()} results</Title>

        <Row gutter={8} justify="end">
            <ProductSearchBarComponent onChange={e => setSearchTerm(e.target.value.toLowerCase())}
                                       screenProps={{xs: 24, md: 20}} cell={!screens.md &&
                <CategorySelectComponent onChange={(values) => setSelectedCategories(values)}
                                         placeholder={<FilterOutlined/>} mode="multiple" showSearch={false}
                                         popupMatchSelectWidth={false} minWidth={65}/>}/>
        </Row>

        <Row gutter={10} justify="end" align="middle">
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
                        Cheapest
                    </Radio.Button>
                    <Radio.Button
                        value="desc"
                        onClick={() => {
                            if (sortOrder === "desc") {
                                setSortOrder(null);
                            }
                        }}
                    >
                        Highest price
                    </Radio.Button>
                </Radio.Group>
            </Col>
            <Col>
                <Space>
                    <Text>Show sold</Text>
                    <Switch onChange={() => setShowSold(!showSold)}/>
                </Space>
            </Col>
        </Row>

        <Row gutter={[16, 16]}>
            <Col md={4}> {screens.md && <Space direction="vertical" style={{width: "100%"}}>
                <Row justify="space-between" align="middle">
                    <Col><Text strong>Categories</Text></Col>
                    {selectedCategories.length > 0 && <Col>
                        <Typography.Link onClick={() => setSelectedCategories([])}>Limpiar filtros</Typography.Link>
                    </Col>}
                </Row>
                <Checkbox.Group
                    options={categoryOptions}
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    style={{display: "flex", flexDirection: "column", marginTop: 8}}
                />
            </Space>}</Col>
            <Col xs={24} md={20}>
                {filteredProducts.length === 0 ? (<Empty description="No products found" style={{width: '100%'}}/>) : (
                    <Row gutter={[16, 16]}>
                        {filteredProducts.map(p => ((showSold || !p.buyerEmail) && <Col xs={24} sm={8} lg={6} key={p.id}>
                            <ProductCardComponent product={p} showSold={showSold}
                                                  actions={[<BuyButtonComponent disabled={p.buyerEmail} productId={p.id}
                                                                                openCustomNotification={openCustomNotification}
                                                                                />]}/>
                        </Col>))}
                    </Row>)}
            </Col>
        </Row>
    </Space>);
}

export default ListProductsComponent;
