import React, {useEffect, useState} from "react";
import {Col, Empty, Grid, Row, Table, Tooltip, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {timestampToString} from "../../Utils/UtilsDates";
import './striped-table.css'
import CategoryTagComponent from "../Products/CategoryTagComponent";
import TransactionsListComponent from "./TransactionsListComponent";
import {getCreditCardNumber, getUser} from "../../Utils/UtilsBackendCalls";
import {getCardNumber} from "../../Utils/UtilsFormat";

let ListMyTransactionsComponent = () => {

    let [transactions, setTransactions] = useState([]);
    let navigate = useNavigate();
    let {useBreakpoint} = Grid;
    let screens = useBreakpoint();

    useEffect(() => {

        let getTransactions = async () => {

            let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/own`, {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                let jsonData = await response.json();

                let transactions = await Promise.all(
                    jsonData.map(async t => {
                        let [buyer, seller, cardNumber] = await Promise.all([
                            getUser(t.buyerId),
                            getUser(t.sellerId),
                            getCreditCardNumber(t.buyerPaymentId)
                        ]);

                        return {
                            ...t,
                            buyerEmail: buyer.email,
                            sellerEmail: seller.email,
                            card: getCardNumber(cardNumber),
                        };
                    })
                );

                setTransactions(transactions);

            } else {
                let responseBody = await response.json();
                responseBody.errors.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
        };

        getTransactions();
    }, []);

    let address = record => {
        let s = "";
        record.buyerAddress && (s += `${record.buyerAddress}, `);
        record.buyerPostCode && (s += `${record.buyerPostCode}, `);
        record.buyerCountry && (s += `${record.buyerCountry}`);
        return s;
    }

    let columns = [{
        title: "Product", key: "title", ellipsis: true,

        render: record => (<Typography.Link onClick={() => navigate(`/products/${record.id}`)}>
            <Tooltip placement="topLeft" title={record.title}>{record.title}</Tooltip>
        </Typography.Link>)
    }, {
        title: "Price",
        dataIndex: "productPrice",
        align: "right",
        key: "productPrice",
        render: price => `${price.toFixed(2)} €`,
    }, {
        title: "Shipping Address", key: "buyerAddress", ellipsis: true, render: record => <Tooltip placement="topLeft"
                                                                                                   title={address(record)}>{address(record)}</Tooltip>
    }, {
        title: "Purchase Date", dataIndex: "startDate", key: "startDate", render: date => timestampToString(date),
    }, {
        title: "Delivery Date", dataIndex: "endDate", key: "endDate", render: date => timestampToString(date),
    },];

    let nestedColumns = [{
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        render: (_, product) => <Tooltip placement="topLeft" title={product.description}>{product.description}</Tooltip>
    }, {
        title: 'Seller Email', key: 'sellerEmail', render: record => <Link to={`/users/${record.sellerId}`}>{record.sellerEmail}</Link>
    }, {
        title: 'Buyer Email', key: 'sellerEmail', render: record => <Link to={`/users/${record.buyerId}`}>{record.buyerEmail}</Link>
    }, {
        title: 'Payed With', key: 'buyerPaymentId', render: record => record.card
    }, {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (_, {category}) => (<CategoryTagComponent category={category} letterCase="upper"/>)
    },];

    let expandedRowRender = record => (<Table
        columns={nestedColumns}
        dataSource={[record]}
        pagination={false}
        rowKey="id"
    />);

    return (<Row align="middle" justify="center" style={{paddingTop: "10vh"}}>
        <Col md={20}>
            {transactions.length === 0 ? (<Empty description="You haven't made any purchases yet."/>) : screens.lg ? (
                <Table
                    rowClassName={(_, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    rowKey="id"
                    columns={columns}
                    dataSource={transactions}
                    pagination={{pageSize: 10}}
                    expandable={{expandedRowRender}}
                />) : <TransactionsListComponent transactions={transactions}/>}
        </Col>
    </Row>);
};

export default ListMyTransactionsComponent;