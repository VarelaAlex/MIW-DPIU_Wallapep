import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {
    Button,
    Card, Col,
    Descriptions,
    Divider,
    Empty,
    Image,
    List,
    Row,
    Space,
    Switch,
    Tag,
    Tooltip,
    Typography
} from 'antd';
import {getTransactions, getUser} from "../../Utils/UtilsBackendCalls";
import {checkURL} from "../../Utils/UtilsChecks";
import {categoryColors} from "../../categories";

const {Paragraph, Text, Title} = Typography;

const UserProfileComponent = () => {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [showAsBuyer, setShowAsBuyer] = useState(false);
    const [visibleProductsCount, setVisibleProductsCount] = useState(5);

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
                <Descriptions.Item label="Email"><Link to={`/users/${user.id}`}>{user.email}</Link></Descriptions.Item>
                <Descriptions.Item label="País">{user.country}</Descriptions.Item>
                <Descriptions.Item label="Dirección">
                    <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                        {user.address && user.address + ","} {user.postalCode && user.postalCode}
                    </Paragraph>
                </Descriptions.Item>
            </Descriptions>
        </Card>

        <Divider orientation="left">
            Transacciones como
            <Switch
                checked={showAsBuyer}
                onChange={() => setShowAsBuyer(!showAsBuyer)}
                style={{marginLeft: '1rem'}}
                checkedChildren="Comprador"
                unCheckedChildren="Vendedor"
            />
        </Divider>

        <List
            dataSource={transactions}
            grid={{gutter: 24, column: 1}}
            locale={{emptyText: 'No hay transacciones disponibles'}}
            renderItem={transaction => (<List.Item>
                <Card
                    hoverable
                    title={<Tooltip title={transaction.title}>{transaction.title}</Tooltip>}
                >
                    <Space direction="vertical">
                        <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                            {transaction.description}
                        </Paragraph>
                        <div>
                            <Text strong>{showAsBuyer ? 'Vendedor' : 'Comprador'}: </Text>
                            <Link to={`/users/${showAsBuyer ? transaction.sellerId : transaction.buyerId}`}>
                                {showAsBuyer ? transaction.sellerEmail : transaction.buyerEmail}
                            </Link>
                        </div>
                        <Tag color={categoryColors[transaction.category?.toLowerCase()] || 'default'}>
                            {transaction.category?.toUpperCase()}
                        </Tag>
                    </Space>
                </Card>
            </List.Item>)}
        />

        <Divider orientation="left">Productos en venta</Divider>
        {visibleProducts.length === 0 ? (<Empty description="No products found" style={{width: '100%'}}/>) : (
            <Row gutter={[16, 16]}>
                {visibleProducts.map(p => (<Col xs={12} sm={8} lg={6} key={p.id}>
                    <Link to={`/products/${p.id}`}>
                        <Card
                            hoverable
                            title={<Tooltip title={p.title}>{p.title}</Tooltip>}
                            cover={<Image alt={p.title} src={p.image} preview={false} />}
                        >
                            <Space direction="vertical">
                                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                                    {p.description}
                                </Paragraph>
                                <Tag color={categoryColors[p.category?.toLowerCase()] || 'default'}>
                                    {p.category?.toUpperCase()}
                                </Tag>
                            </Space>
                        </Card>
                    </Link>
                </Col>))}
            </Row>)}

        {visibleProductsCount < products.length && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button onClick={handleLoadMore}>Load more products</Button>
            </div>
        )}
    </Space>);
};

export default UserProfileComponent;