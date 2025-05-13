import {Card, Col, Row, Statistic} from "antd";
import React from "react";

let MyProductsStatsComponent = ({ stats }) => {
    return (
        <Card>
            <Row align="middle" justify="space-around">
                <Col xs={12} sm={6}>
                    <Statistic title="Sold products" value={stats.soldCount}/>
                </Col>
                <Col xs={12} sm={4}>
                    <Statistic title="Total income" value={stats.totalIncome} precision={2} suffix="€"/>
                </Col>
            </Row>
        </Card>
    );
}

export default MyProductsStatsComponent;