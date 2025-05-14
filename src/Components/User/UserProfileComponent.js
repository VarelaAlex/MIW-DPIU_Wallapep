import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Button, Card, Col, Descriptions, Divider, Empty, Row, Space, Switch, Typography} from 'antd';
import {getCreditCardNumber, getTransactions, getUser} from "../../Utils/UtilsBackendCalls";
import {checkURL} from "../../Utils/UtilsChecks";
import TransactionsListComponent from "../Transactions/TransactionsListComponent";
import {getCardNumber} from "../../Utils/UtilsFormat";
import ProductCardComponent from "../Products/ProductCardComponent";

const {Paragraph, Title} = Typography;

const UserProfileComponent = () => {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProductsCount, setVisibleProductsCount] = useState(5);
    const [showAsBuyer, setShowAsBuyer] = useState(false);

    const handleLoadMore = () => {
        setVisibleProductsCount(prev => prev + 5);
    };

    const visibleProducts = products.slice(0, visibleProductsCount);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const userData = await getUser(id);
                setUser(userData);

                let transactions = await getTransactions(false, id);
                for (const t of transactions) {
                    t.buyerEmail = (await getUser(t.buyerId)).email
                    t.sellerEmail = (await getUser(t.sellerId)).email
                }
                setTransactions(transactions);

                const productsRes = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products?sellerId=${id}`, {
                    method: 'GET', headers: {
                        apikey: localStorage.getItem("apiKey")
                    }
                });
                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    const productsWithImages = await Promise.all(productsData.map(async (p) => {
                        const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${p.id}.png`;
                        const existsImage = await checkURL(urlImage);
                        p.image = existsImage ? urlImage : "/imageMockup.png";
                        return p;
                    }));

                    setProducts(productsWithImages);
                }

            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchTransactions = async () => {
            let transactions = await getTransactions(showAsBuyer, id);
            for (const t of transactions) {
                t.buyerEmail = (await getUser(t.buyerId)).email
                t.sellerEmail = (await getUser(t.sellerId)).email
                t.card = getCardNumber(await getCreditCardNumber(t.buyerPaymentId));
            }
            setTransactions(transactions);
        };

        fetchTransactions();
    }, [id, showAsBuyer]);

    if (!user) return <div>User not found</div>;

    return (<Space direction="vertical" style={{width: '100%'}}>
        <Card title={<Title level={3}>Perfil de {user.username}</Title>}
              style={{borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Full name">{`${user.name} ${user.surname}`}</Descriptions.Item>
                <Descriptions.Item label="Email"><Link to={`/users/${user.id}`}>{user.email}</Link></Descriptions.Item>
                <Descriptions.Item label="Country">{user.country}</Descriptions.Item>
                <Descriptions.Item label="Address">
                    <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                        {user.address && user.address + ","} {user.postalCode && user.postalCode}
                    </Paragraph>
                </Descriptions.Item>
            </Descriptions>
        </Card>

        <Divider orientation="left">
            Transactions as
            <Switch
                checked={showAsBuyer}
                onChange={() => setShowAsBuyer(!showAsBuyer)}
                style={{marginLeft: '1rem'}}
                checkedChildren="Buyer"
                unCheckedChildren="Seller"
            />
        </Divider>

        <TransactionsListComponent transactions={transactions} showAsBuyer={showAsBuyer} toggleSellerBuyer/>

        <Divider orientation="left">Products for sale</Divider>
        {visibleProducts.length === 0 ? (<Empty description="No products found" style={{width: '100%'}}/>) : (
            <Row gutter={[16, 16]}>
                {visibleProducts.map(p => (<Col xs={12} sm={8} lg={6} key={p.id}>
                    <Link to={`/products/${p.id}`}>
                        <ProductCardComponent product={p}/>
                    </Link>
                </Col>))}
            </Row>)}

        {visibleProductsCount < products.length && (<div style={{textAlign: 'center', marginTop: 16}}>
            <Button onClick={handleLoadMore}>Load more products</Button>
        </div>)}
    </Space>);
};

export default UserProfileComponent;