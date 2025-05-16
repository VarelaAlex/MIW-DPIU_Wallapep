import {ShoppingOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React, {useEffect, useState} from "react";

let BuyButtonComponent = ({disabled, productId, openCustomNotification, style, onClick}) => {

    let [disable, setDisable] = useState(false);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        setDisable(disabled);
    }, [disabled]);

    let getUserCreditCard = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/creditCards/", {
            method: "GET", headers: {
                "Content-Type": "application/json ", "apikey": localStorage.getItem("apiKey")
            }
        });

        if (response.ok) {
            let jsonData = await response.json();
            return jsonData[0];
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    let buyProduct = async () => {

        setLoading(true);
        let creditCard = await getUserCreditCard();

        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/", {
            method: "POST", headers: {
                "Content-Type": "application/json ", "apikey": localStorage.getItem("apiKey")
            }, body: JSON.stringify({
                productId: productId,
                buyerPaymentId: creditCard?.id
            })
        });

        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.affectedRows === 1) {
                openCustomNotification("top", "Product bought", "success")
                setLoading(false);
                setDisable(true);
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
            openCustomNotification("top", "An error occurred", "error")
            setLoading(false);
        }
    }

    return <Button
        type="primary"
        onClick={(e)=> {
            e.stopPropagation();
            buyProduct();
        }}
        loading={loading}
        icon={<ShoppingOutlined/>}
        size="large"
        block
        disabled={disable}
        style={style}
    >
        Buy
    </Button>;
}

export default BuyButtonComponent;