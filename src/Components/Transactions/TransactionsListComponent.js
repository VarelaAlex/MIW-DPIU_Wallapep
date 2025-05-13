import {Card, List, Space, Tooltip, Typography} from "antd";
import {Link} from "react-router-dom";
import CategoryTagComponent from "../Products/CategoryTagComponent";

let TransactionsListComponent = ({transactions, toggleSellerBuyer = false, showAsBuyer}) => {


    let {Text, Paragraph} = Typography;
    return <List
        dataSource={transactions}
        grid={{gutter: 24, column: 1}}
        locale={{emptyText: 'No transactions found.'}}
        renderItem={transaction => (<List.Item>
            <Card
                hoverable
                title={<Tooltip title={transaction.title}>{transaction.title}</Tooltip>}
                extra={<CategoryTagComponent category={transaction.category} letterCase={"upper"} />}
            >
                <Space direction="vertical">
                    <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                        {transaction.description}
                    </Paragraph>
                    {toggleSellerBuyer ? <Typography>
                        <Text strong>{showAsBuyer ? 'Seller' : 'Buyer'}: </Text>
                        <Link to={`/users/${showAsBuyer ? transaction.sellerId : transaction.buyerId}`}>
                            {showAsBuyer ? transaction.sellerEmail : transaction.buyerEmail}
                        </Link>
                    </Typography> : <Typography>
                        <Paragraph>
                            <Text strong>Seller: </Text>
                            <Link to={`/users/${transaction.sellerId}`}>
                                {transaction.sellerEmail}
                            </Link>
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Buyer: </Text>
                            <Link to={`/users/${transaction.buyerId}`}>
                                {transaction.buyerEmail}
                            </Link>
                        </Paragraph>
                        {transaction.card && <Paragraph>
                            <Text strong>Card: </Text>
                            {transaction.card}
                        </Paragraph>}
                    </Typography>}
                </Space>
            </Card>
        </List.Item>)}
    />
}

export default TransactionsListComponent;