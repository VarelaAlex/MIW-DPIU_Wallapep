import React, {useEffect, useState} from "react";
import {Card, Col, Empty, Grid, List, Row, Space, Table, Tag, Tooltip, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {timestampToString} from "../../Utils/UtilsDates";
import {categoryColors} from "../../categories";
import './striped-table.css'
import {getUser} from "../../Utils/UtilsBackendCalls";

let ListMyTransactionsComponent = () => {

    let [transactions, setTransactions] = useState([]);
    let [sellerEmails, setSellerEmails] = useState(new Map());
    let [creditCards, setCreditCards] = useState(new Map());
    let navigate = useNavigate();
    let {useBreakpoint} = Grid;
    let screens = useBreakpoint();

    useEffect(() => {

        let getCreditCardNumber = async (creditCardId) => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/creditCards/${creditCardId}`, {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

            if (response.ok) {
                let jsonData = await response.json();
                return jsonData.number;
            } else {
                let responseBody = await response.json();
                responseBody.errors.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
        }

        let getTransactions = async () => {

            let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/own`, {
                method: "GET", headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

            if (response.ok) {
                let jsonData = await response.json();
                setTransactions(jsonData);

                let updatedSellerEmails = new Map();
                let updatedCreditCards = new Map();

                await Promise.all(jsonData.map(async (t) => {
                    let email = (await getUser(t.sellerId)).email;
                    updatedSellerEmails.set(t.tid, email);

                    let card = await getCreditCardNumber(t.buyerPaymentId);
                    updatedCreditCards.set(t.tid, card);
                }));

                setSellerEmails(updatedSellerEmails);
                setCreditCards(updatedCreditCards);
            } else {
                let responseBody = await response.json();
                responseBody.errors.forEach(e => {
                    console.log("Error: " + e.msg);
                });
            }
        };

        getTransactions();
    }, []);

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
                                                                                                   title={`${record.buyerAddress}, ${record.buyerPostCode}, ${record.buyerCountry}`}>{`${record.buyerAddress}, ${record.buyerPostCode}, ${record.buyerCountry}`}</Tooltip>
    }, {
        title: "Purchase Date", dataIndex: "startDate", key: "startDate", render: date => timestampToString(date),
    }, {
        title: "Delivery Date", dataIndex: "endDate", key: "endDate", render: date => timestampToString(date),
    },];

    let getCardNumber = (tid) => {
        let fullNumber = creditCards.get(tid);
        let last4Digits = fullNumber?.slice(-4);
        return last4Digits?.padStart(fullNumber?.length, "*");
    }

    let nestedColumns = [{
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        render: (_, product) => <Tooltip placement="topLeft" title={product.description}>{product.description}</Tooltip>
    }, {
        title: 'Seller Email', key: 'sellerEmail', render: record => <Link to={`/users/${record.sellerId}`}>{sellerEmails.get(record.tid)}</Link>
    }, {
        title: 'Payed With', key: 'buyerPaymentId', render: record => getCardNumber(record.tid)
    }, {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (_, {category}) => (<Tag color={categoryColors[category?.toLowerCase()] || "default"} key={category}>
            {category.toUpperCase()}
        </Tag>)
    },];

    let expandedRowRender = record => (<Table
        columns={nestedColumns}
        dataSource={[record]}
        pagination={false}
        rowKey="id"
    />);

    let {Text, Paragraph} = Typography;
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
                />) : <List
                dataSource={transactions}
                grid={{gutter: 24, column: 1}}
                pagination={{pageSize: 10}}
                renderItem={transaction => {
                    let cardNumber = getCardNumber(transaction.tid);
                    return (<List.Item>
                        <Card
                            hoverable
                            title={<Tooltip title={transaction.title}>
                                {transaction.title}
                            </Tooltip>}
                            style={{
                                height: "100%",
                                cursor: "pointer",
                                borderRadius: "12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                        >
                            <Space direction="vertical">
                                <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                                    {transaction.description}
                                </Paragraph>
                                {transaction.sellerId && <div>
                                    <Text strong>Vendedor: </Text>
                                    <Link to={`/users/${transaction.sellerId}`}>{sellerEmails.get(transaction.tid)}</Link>
                                </div>}
                                {cardNumber && <div>
                                    <Text strong>Payed with: </Text> {cardNumber}
                                </div>}
                                <Tag color={categoryColors[transaction.category?.toLowerCase()] || "default"}
                                     key={transaction.category}>
                                    {transaction.category.toUpperCase()}
                                </Tag>
                            </Space>
                        </Card>
                    </List.Item>)
                }}
            />}
        </Col>
    </Row>);
};

export default ListMyTransactionsComponent;