import React, {useEffect, useState} from "react";
import {Button, Card, Col, Empty, Input, Row, Space, Statistic, Table, Tooltip, Typography} from 'antd';
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

    let deleteProduct = async (id) => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id, {
            method: "DELETE", headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.deleted) {
                let productsAfterDelete = products.filter(p => p.id !== id)
                setProducts(productsAfterDelete)
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    const [editingKey, setEditingKey] = useState('');
    const isEditing = (product) => product.key === editingKey;

    const edit = (product) => {
        setEditingKey(product.key);
        setEditableFields({
            title: product.title, description: product.description, price: product.price,
        });
    };

    const [editableFields, setEditableFields] = useState({title: '', description: '', price: ''});

    const save = async (key) => {
        const newData = [...products];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
            const item = newData[index];
            const updatedItem = {...item, ...editableFields};

            // Optional: send update to backend
            await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + key, {
                method: "PUT", headers: {
                    "Content-Type": "application/json", "apikey": localStorage.getItem("apiKey")
                }, body: JSON.stringify(updatedItem),
            });

            newData.splice(index, 1, updatedItem);
            setProducts(newData);
            setFilteredProducts(newData);
            setEditingKey('');
        }
    };

    const cancel = () => {
        setEditingKey('');
    };

    const columns = [{
        title: "Id", dataIndex: [], key: "id", width: 50, render: (_, product) => {
            return <Link to={`/products/edit/${product.id}`}>{product.id}</Link>;
        }
    }, {
        title: "Title", dataIndex: "title", key: "title", ellipsis: true, render: (_, product) => {
            const editable = isEditing(product);
            return editable ? (<Input
                    value={editableFields.title}
                    onChange={(e) => setEditableFields({...editableFields, title: e.target.value})}
                />) : (<Tooltip placement="topLeft" title={product.title}>{product.title}</Tooltip>);
        }
    }, {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        width: 200,
        render: (_, product) => {
            const editable = isEditing(product);
            return editable ? (<Input
                    value={editableFields.description}
                    onChange={(e) => setEditableFields({...editableFields, description: e.target.value})}
                />) : (<Tooltip placement="topLeft" title={product.description}>{product.description}</Tooltip>);
        }
    }, {
        title: "Price", key: "price", render: (_, product) => {
            const editable = isEditing(product);
            return editable ? (<Input
                    value={editableFields.price}
                    onChange={(e) => setEditableFields({...editableFields, price: e.target.value})}
                />) : (<Text>{product.price} €</Text>);
        }, sorter: (a, b) => a.price - b.price, width: 100
    }, {
        title: "Date", dataIndex: "date", key: "date"
    }, {
        title: "Buyer",
        key: "buyerId",
        render: (product) => <Link to={"/user/" + product.buyerId}>{product.buyerEmail}</Link>,
        width: 250
    }, {
        title: "Actions", key: "actions", render: (_, product) => {
            const editable = isEditing(product);
            return editable ? (<Space.Compact direction="vertical">
                    <Link to="#" onClick={() => save(product.key)}>Save</Link>
                    <Link to="#" onClick={cancel}>Cancel</Link>
                </Space.Compact>) : (<Space.Compact direction="vertical">
                    <Link to="#" onClick={() => deleteProduct(product.id)}>Delete</Link>
                    <Link to="#" onClick={() => edit(product)}>Edit</Link>
                </Space.Compact>);
        }
    }];

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
            </div> : <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                styles={{image: {height: 60}}}
                description={<Text>Aún no tienes productos a la venta</Text>}
            >
                <Button type="primary" onClick={() => navigate("/products/create")}>Create Now</Button>
            </Empty>}
            {filteredProducts && filteredProducts.length > 0 ?
                <Table columns={columns} dataSource={filteredProducts} scroll={{x: "1000px"}}></Table> : <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    styles={{image: {height: 60}}}
                    description={<Text>No hay productos con estas características</Text>}/>}
        </Col>
    </Row>)
}

export default ListMyProductsComponent;