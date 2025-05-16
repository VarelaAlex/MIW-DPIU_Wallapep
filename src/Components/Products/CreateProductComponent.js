import {useNavigate} from "react-router-dom";
import ProductFormComponent from "./ProductFormComponent";
import {uploadImage} from "../../Utils/UtilsBackendCalls";
import {ShoppingOutlined} from "@ant-design/icons";
import React from "react";
import {Typography} from "antd";

let CreateProductComponent = ({openCustomNotification}) => {
    let navigate = useNavigate();

    const handleCreate = async (formData, setErrors) => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            let data = await response.json();
            await uploadImage(data.productId, formData.image);
            openCustomNotification("top", "Product created", "success");
            navigate("/products/own");
        } else {
            let responseBody = await response.json();
            setErrors(responseBody.errors);
        }
    };

    let {Title} = Typography;
    return <ProductFormComponent
        title={<Title level={4}><ShoppingOutlined/> Create product</Title>}
        buttonText="Sell Product"
        onSubmit={handleCreate}
        isImageRequired={true}
    />;
};

export default CreateProductComponent;