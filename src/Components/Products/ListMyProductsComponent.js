import React, {useEffect, useState} from "react";
import {Button, Card, Col, Empty, Input, Row, Statistic, Table, Tooltip, Typography} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import {SearchOutlined} from "@ant-design/icons";

let ListMyProductsComponent = () => {
    let [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [stats, setStats] = useState({soldCount: 0, totalIncome: 0});
    let navigate = useNavigate();

    useEffect(() => {
        let getMyProducts = async () => {
            let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/own/", {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                jsonData.map(product => {
                    product.key = product.id
                    return product
                })
                setProducts(jsonData)
                setFilteredProducts(jsonData);
                updateStatistics(jsonData);
            } else {
                let responseBody = await response.json();
                let serverErrors = responseBody.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg)
                })
            }
        }

        getMyProducts();
    }, [])

    const updateStatistics = (productsList) => {
        const soldProducts = productsList.filter(product => product.buyerId != null);
        const soldCount = soldProducts.length;
        const totalIncome = soldProducts.reduce((sum, product) => sum + (product.price || 0), 0);
        setStats({soldCount, totalIncome});
    };

    const handleSearch = (e) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);
        setFilteredProducts(products.filter((product) => product.title.toLowerCase().includes(text) || product.description?.toLowerCase().includes(text)));
    };

    let columns = [{
        title: "Id", dataIndex: "id", key: "id"
    }, {
        title: "Seller Id", dataIndex: "sellerId", key: "sellerId"
    }, {
        title: "Title",
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
        ellipsis: true,
        render: (title) => (<Tooltip placement="topLeft" title={title}>
            {title}
        </Tooltip>)
    }, {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        render: (description) => (<Tooltip placement="topLeft" title={description}>
            {description}
        </Tooltip>)
    }, {
        title: "Price (€)", dataIndex: "price", key: "price", sorter: (a, b) => a.price - b.price,
    }, {
        title: "Date", dataIndex: "date", key: "date",
    }, {
        title: "Buyer", dataIndex: "buyerId", key: "buyerId"
    }, {
        title: "Actions", dataIndex: "id", render: (id) => <Link to={"/products/edit/" + id}>Edit</Link>, key: "actions"
    }]

    let {Text} = Typography
    return (<Row align="middle" justify="center" style={{paddingTop: "10vh"}}>
        <Col>
            {products && products.length > 0 ? <div>
                <Card>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic title="Productos vendidos" value={stats.soldCount}/>
                        </Col>
                        <Col span={12}>
                            <Statistic title="Ingresos totales" value={stats.totalIncome} precision={2} suffix="€"/>
                        </Col>
                    </Row>
                </Card>
                <Input
                    placeholder="Busca por título o descripción"
                    prefix={<SearchOutlined/>}
                    value={searchText}
                    onChange={handleSearch}
                    allowClear
                    style={{margin: "2vh 0vh", width: "30vmax"}}
                />
            </div> :
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    styles={{image: {height: 60}}}
                    description={<Text>Aún no tienes productos a la venta</Text>}
                >
                    <Button type="primary" onClick={() => navigate("/products/create")}>Create Now</Button>
                </Empty>}
            {filteredProducts && filteredProducts.length > 0 ?
                <Table columns={columns} dataSource={filteredProducts} scroll={{x: "1000px"}}></Table> :
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    styles={{image: {height: 60}}}
                    description={<Text>No hay productos con estas características</Text>}/>}
        </Col>
    </Row>)
}

export default ListMyProductsComponent;