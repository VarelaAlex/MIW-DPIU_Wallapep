import React, {useState} from "react";
import {Space, Table, Tag, Tooltip, Typography} from "antd";
import EditableCellComponent from "./EditableCellComponent";
import {categoryColors} from "../../../categories";
import {timestampToString} from "../../../Utils/UtilsDates";
import {Link, useNavigate} from "react-router-dom";
import {editProduct} from "../../../Utils/UtilsBackendCalls";
import CategorySelectComponent from "../CategorySelectComponent";

let ProductsTableComponent = (props) => {
    let {
        products,
        setProducts,
        selectedRowKeys,
        setSelectedRowKeys,
        filteredProducts,
        setFilteredProducts,
        pageSize,
        setPageSize,
        selectedCategories,
        setSelectedCategories,
        openCustomNotification
    } = props;
    let [editingProduct, setEditingProduct] = useState("");
    let [editableFields, setEditableFields] = useState({title: "", description: "", price: ""});

    let navigate = useNavigate();

    let {Text} = Typography;

    let rowSelection = {
        selectedRowKeys, onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        }, getCheckboxProps: (record) => ({
            disabled: record.buyerId, name: record.title,
        }),
    };

    let isEditing = (product) => product.key === editingProduct;

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

    let edit = (product) => {
        setEditingProduct(product.key);
        setEditableFields({
            title: product.title, description: product.description, price: product.price,
        });

    };

    let columns = [{
        title: "Title",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        render: (_, product) => <EditableCellComponent
            editable={isEditing(product)}
            onChange={(e) => setEditableFields({...editableFields, title: e.target.value})}
            value={editableFields.title}
            cell={<Tooltip placement="topLeft" title={product.title}>{product.title}</Tooltip>}/>,
        fixed: 'left',
        rowScope: 'row'
    }, {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        render: (_, product) => <EditableCellComponent
            editable={isEditing(product)}
            onChange={(e) => setEditableFields({
                ...editableFields, description: e.target.value
            })}
            value={editableFields.description}
            cell={<Tooltip placement="topLeft" title={product.description}>{product.description}</Tooltip>}/>
    }, {
        title: "Price", key: "price", align: "right", render: (_, product) => <EditableCellComponent
            editable={isEditing(product)}
            onChange={(e) => setEditableFields({...editableFields, price: e.target.value})}
            value={editableFields.price}
            cell={<Text>{product.price} €</Text>}/>, sorter: (a, b) => a.price - b.price,
    }, {
        title: 'Category',
        key: 'category',
        dataIndex: 'category',
        render: (_, {category}) => (<Tag color={categoryColors[category?.toLowerCase()] || "default"} key={category}>
            {category.toUpperCase()}
        </Tag>),
        filterDropdown: <CategorySelectComponent onChange={(values)=>setSelectedCategories(values)} placeholder="Filer by category" mode="multiple"/>,
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

    return <Table onRow={(record) => {
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
                  }}/>
}

export default ProductsTableComponent;