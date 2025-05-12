import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Card,
    Col,
    Empty,
    Grid,
    Input,
    List,
    notification,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Typography
} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {timestampToString} from "../../Utils/UtilsDates";
import {categories, categoryColors} from "../../categories";
import {editProduct} from "../../Utils/UtilsBackendCalls";

let ListMyProductsComponent = ({openCustomNotification}) => {

    let [products, setProducts] = useState([])
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [searchText, setSearchText] = useState("");
    let [stats, setStats] = useState({soldCount: 0, totalIncome: 0});
    let deletionTimeoutRef = useRef(null);
    let deletionCancelledRef = useRef(false);
    let navigate = useNavigate();
    let [selectedRowKeys, setSelectedRowKeys] = useState([]);
    let {useBreakpoint} = Grid;
    let screens = useBreakpoint();
    let [pageSize, setPageSize] = useState(5);
    let [selectedCategories, setSelectedCategories] = useState([]);

    let rowSelection = {
        selectedRowKeys, onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        }, getCheckboxProps: (record) => ({
            disabled: record.buyerId, name: record.title,
        }),
    };

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

    let updateStatistics = (productsList) => {
        let soldProducts = productsList.filter(product => product.buyerId != null);
        let soldCount = soldProducts.length;
        let totalIncome = soldProducts.reduce((sum, product) => sum + (product.price || 0), 0);
        setStats({soldCount, totalIncome});
    };

    let handleSearch = (e) => {
        let text = e.target.value.toLowerCase();
        setSearchText(text);
        setFilteredProducts(products.filter((product) => product.title.toLowerCase().includes(text) || product.description?.toLowerCase().includes(text)));
    };

    let undoDelete = (key) => {
        deletionCancelledRef.current = true;
        clearTimeout(deletionTimeoutRef.current);
        notification.destroy(key);
        deletionTimeoutRef.current = null;
        openCustomNotification("top", "Se ha cancelado la eliminación del producto", "info")
    };

    let [editingProduct, setEditingProduct] = useState("");
    let isEditing = (product) => product.key === editingProduct;

    let edit = (product) => {
        setEditingProduct(product.key);
        setEditableFields({
            title: product.title, description: product.description, price: product.price,
        });
    };

    let [editableFields, setEditableFields] = useState({title: "", description: "", price: ""});

    let save = async (key) => {
        let newData = [...products];
        let index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
            let item = newData[index];
            let updatedItem = {...item, ...editableFields};

            let response = await editProduct(key, updatedItem);

            if (response.ok) {
                newData.splice(index, 1, updatedItem);
                setProducts(newData);
                setFilteredProducts(newData);
                setEditingProduct("");
                openCustomNotification("top", "Producto actualizado", "success")
            } else {
                let serverErrors = response.errors;
                serverErrors.forEach(e => {
                    console.log("Error: " + e.msg)
                })
                openCustomNotification("top", serverErrors.map((e) => <Text>{e.msg}</Text>), "error")
            }
        }
    };

    let deleteMultipleProducts = (ids) => {
        let deletableIds = ids.filter(id => {
            let product = products.find(p => p.id === id);
            return product && !product.buyerId;
        });

        if (deletableIds.length === 0) {
            openCustomNotification("top", "Ninguno de los productos seleccionados puede eliminarse", "warning");
            return;
        }

        let key = `bulkDelete${Date.now()}`;
        deletionCancelledRef.current = false;

        notification.open({
            message: "Productos eliminados",
            description: `Los productos serán eliminados en 3 segundos. Haz clic en "Deshacer" para cancelar.`,
            duration: 3,
            placement: "top",
            actions: <Button type="primary" onClick={() => undoDelete(key)}>Deshacer</Button>,
            key,
            onClose: () => {
                if (!deletionCancelledRef.current) {
                    confirmDeleteMultiple(deletableIds);
                }
            },
            showProgress: true,
            pauseOnHover: false,
        });

        deletionTimeoutRef.current = setTimeout(() => {
            confirmDeleteMultiple(deletableIds);
            notification.destroy(key);
        }, 3000);
    };

    let {Option} = Select;
    const categoryFilterDropdown = () => (<div style={{padding: 8}}>
        <Select
            mode="multiple"
            placeholder="Filtrar por categoría"
            value={selectedCategories}
            onChange={(values) => setSelectedCategories(values)}
            style={{minWidth: 200}}
            allowClear
        >
            {categories.map(cat => (<Option key={cat} value={cat}>
                <Tag color={categoryColors[cat?.toLowerCase()] || 'default'}>{cat}</Tag>
            </Option>))}
        </Select>
    </div>);

    let confirmDeleteMultiple = async (ids) => {
        let deletePromises = ids.map(async (id) => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products/${id}`, {
                method: "DELETE", headers: {
                    "apikey": localStorage.getItem("apiKey"),
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                if (jsonData.deleted) {
                    return id;
                }
            } else {
                let responseBody = await response.json();
                responseBody.errors?.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
            return null;
        });

        let results = await Promise.all(deletePromises);
        let successfullyDeletedIds = results.filter(id => id !== null);

        if (successfullyDeletedIds.length > 0) {
            setProducts((prev) => {
                return prev.filter(p => !successfullyDeletedIds.includes(p.id));
            });

            setFilteredProducts((prev) => prev.filter(p => !successfullyDeletedIds.includes(p.id)));

            openCustomNotification("top", "Se han eliminado los productos seleccionados", "success");
        }

        setSelectedRowKeys([]);
    };

    let columns = [{
        title: "Title", dataIndex: "title", key: "title", ellipsis: true, render: (_, product) => {
            let editable = isEditing(product);
            return editable ? (<Input
                value={editableFields.title}
                onChange={(e) => setEditableFields({...editableFields, title: e.target.value})}
                onClick={(e) => e.stopPropagation()}/>) : (
                <Tooltip placement="topLeft" title={product.title}>{product.title}</Tooltip>);
        }, fixed: 'left', rowScope: 'row'
    }, {
        title: "Description", dataIndex: "description", key: "description", ellipsis: true, render: (_, product) => {
            let editable = isEditing(product);
            return editable ? (<Input
                value={editableFields.description}
                onChange={(e) => setEditableFields({...editableFields, description: e.target.value})}
                onClick={(e) => e.stopPropagation()}/>) : (
                <Tooltip placement="topLeft" title={product.description}>{product.description}</Tooltip>);
        }
    }, {
        title: "Price", key: "price", align: "right", render: (_, product) => {
            let editable = isEditing(product);
            return editable ? (<Input
                value={editableFields.price}
                onChange={(e) => setEditableFields({...editableFields, price: e.target.value})}
                onClick={(e) => e.stopPropagation()}/>) : (<Text>{product.price} €</Text>);
        }, sorter: (a, b) => a.price - b.price,
    }, {
        title: 'Category',
        key: 'category',
        dataIndex: 'category',
        render: (_, {category}) => (<Tag color={categoryColors[category?.toLowerCase()] || "default"} key={category}>
            {category.toUpperCase()}
        </Tag>),
        filterDropdown: categoryFilterDropdown,
        filteredValue: selectedCategories,
        onFilter: (value, record) => selectedCategories.length === 0 || selectedCategories.includes(record.category)
    }, {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (date) => timestampToString(date),
        sorter: (a, b) => a.date - b.date,
    }, {
        title: "Buyer", key: "buyerId", render: (product) => <Link
            to={`/users/${product.buyerId}`}
            onClick={(e) => e.stopPropagation()}>
            {product.buyerEmail}
        </Link>,

    }, {
        title: "Actions", key: "actions", render: (_, product) => {
            let editable = isEditing(product);
            return editable ? (<Space.Compact direction="vertical">
                <Link to="#" onClick={(e) => {
                    e.stopPropagation();
                    save(product.key);
                }}>Save</Link>
                <Link to="#" onClick={(e) => {
                    e.stopPropagation();
                    setEditingProduct("");
                }}>Cancel</Link>
            </Space.Compact>) : (<Space.Compact direction="vertical">
                <Link to="#" onClick={(e) => {
                    e.stopPropagation();
                    edit(product);
                }}>Edit</Link>
            </Space.Compact>);
        }
    }];

    let {Text, Paragraph} = Typography
    return (<Row align="middle" justify="center" style={{paddingTop: "10vh"}}>
        <Col md={20}>
            {products && products.length > 0 ? <div>
                <Card>
                    <Row align="middle" justify="space-around">
                        <Col xs={12} sm={6}>
                            <Statistic title="Productos vendidos" value={stats.soldCount}/>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Statistic title="Ingresos totales" value={stats.totalIncome} precision={2} suffix="€"/>
                        </Col>
                    </Row>
                </Card>
                <Row justify="space-between" align="middle" style={{margin: "2vh 0"}}>
                    <Col xs={24} lg={22}>
                        <Input
                            placeholder="Busca por título o descripción"
                            prefix={<SearchOutlined/>}
                            value={searchText}
                            onChange={handleSearch}
                            allowClear
                            style={{width: "100%"}}
                        />
                    </Col>
                    {screens.lg && <Col>
                        <Button
                            danger
                            disabled={selectedRowKeys.length === 0}
                            onClick={() => deleteMultipleProducts(selectedRowKeys)}
                            icon={<DeleteOutlined/>}
                            style={{minWidth: 48}}
                        />
                    </Col>}
                </Row>
                {filteredProducts && filteredProducts.length > 0 ? screens.lg ? <Table onRow={(record) => {
                    return {
                        onClick: () => navigate(`/products/edit/${record.id}`), onMouseEnter: (e) => {
                            e.currentTarget.style.cursor = "pointer";
                        }, onMouseLeave: (e) => {
                            e.currentTarget.style.cursor = "default";
                        },
                    };
                }} rowSelection={rowSelection} columns={columns} dataSource={filteredProducts}
                                                                                       pagination={{
                                                                                           pageSize,
                                                                                           showSizeChanger: true,
                                                                                           pageSizeOptions: ['5', '10', '20', '50'],
                                                                                           onShowSizeChange: (current, size) => setPageSize(size)
                                                                                       }}/> : <List
                    dataSource={filteredProducts}
                    grid={{gutter: 24, column: 1}}
                    pagination={{pageSize}}
                    renderItem={product => (<List.Item>
                        <Card
                            hoverable
                            title={<Tooltip title={product.title}>
                                {product.title}
                            </Tooltip>}
                            onClick={() => navigate(`/products/edit/${product.id}`)}
                            extra={product.buyerEmail ? <Text type="secondary">Vendido</Text> :
                                <DeleteOutlined onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMultipleProducts([product.id])
                                }} style={{color: 'red'}}/>

                            }
                        >
                            <Space direction="vertical">
                                <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                                    {product.description}
                                </Paragraph>
                                <Space direction="horizontal" wrap>
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
    </Row>)
}

export default ListMyProductsComponent;