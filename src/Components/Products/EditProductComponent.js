import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ProductFormComponent from "./ProductFormComponent";
import {editProduct, getProductById} from "../../Utils/UtilsBackendCalls";
import {Empty, Space} from "antd";

let EditProductComponent = ({openCustomNotification}) => {
    let navigate = useNavigate();
    let {id} = useParams();
    let [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        let getProduct = async () => {
            let product = await getProductById(id);
            const fileList = [{
                uid: '-1',
                name: 'imagen.png',
                status: 'done',
                url: `${product?.image}?t=${Date.now()}`
            }];
            setInitialValues({...product, image: fileList});
        };

        getProduct();
    }, [id]);

    const handleEdit = async (formData, setErrors) => {
        let response = await editProduct(id, formData, false);
        if (response.ok) {
            openCustomNotification("top", "Product updated", "success");
            navigate("/products/own");
        } else {
            setErrors(response.errors);
        }
    };

    if (!initialValues?.title) {
        return (<Space direction="vertical" style={{width: '100%'}}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="This product does not exist"/>
        </Space>)
    }

    return initialValues ? (
        <ProductFormComponent
            initialValues={initialValues}
            title="Edit product"
            buttonText="Update Product"
            onSubmit={handleEdit}
            isImageRequired={false}
        />
    ) : null;
};

export default EditProductComponent;