import {Card, List, Space, Tooltip, Typography} from "antd";
import {Link} from "react-router-dom";
import CategoryTagComponent from "../Products/CategoryTagComponent";
import {useState} from "react";

let TransactionsListComponent = ({transactions, toggleSellerBuyer = false, showAsBuyer}) => {

    let [pageSize, setPageSize] = useState(5);
    let {Text, Paragraph} = Typography;
    return <List
        dataSource={transactions}
        pagination={{
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            onShowSizeChange: (current, size) => setPageSize(size)
        }}
        grid={{gutter: 24, column: 1}}
        locale={{emptyText: 'No transactions found.'}}
        renderItem={transaction => (<List.Item>
            <Card
                title={<Tooltip title={transaction.title}>{transaction.title}</Tooltip>}
                extra={<CategoryTagComponent category={transaction.category}/>}
            >
                <Space direction="vertical">
                    <Paragraph ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                        {transaction.description}
                    </Paragraph>
                    {toggleSellerBuyer ? <Typography>
                        <Text strong>{showAsBuyer ? 'Seller' : 'Buyer'}: </Text>
                        <Link to={`/users/${showAsBuyer ? transaction.sellerId : transaction.buyerId}`} onClick={(e) => e.stopPropagation()}>
                            {showAsBuyer ? transaction.sellerEmail : transaction.buyerEmail}
                        </Link>
                    </Typography> : <Typography>
                        <Paragraph>
                            <Text strong>Seller: </Text>
                            <Link to={`/users/${transaction.sellerId}`} onClick={(e) => e.stopPropagation()}>
                                {transaction.sellerEmail}
                            </Link>
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Buyer: </Text>
                            <Link to={`/users/${transaction.buyerId}`} onClick={(e) => e.stopPropagation()}>
                                {transaction.buyerEmail}
                            </Link>
                        </Paragraph>
                        {transaction.card && <Paragraph>
                            <Text strong>Card: </Text>
                            {transaction.card}
                        </Paragraph>}
                    </Typography>}
                    <Text strong style={{fontSize: "1.2rem"}}>
                        {transaction.price} €
                    </Text>
                </Space>
            </Card>
        </List.Item>)}
    />
}

export default TransactionsListComponent;