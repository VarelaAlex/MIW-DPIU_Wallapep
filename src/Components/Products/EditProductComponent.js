import {useEffect, useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Alert, Card, Col, Form, Input, InputNumber, Row, Select, Upload} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import DisabledButtonComponent from "../Buttons/DisabledButtonComponent";
import {categories} from "../../categories";
import {InboxOutlined} from "@ant-design/icons";
import {editProduct, getProductById} from "../../Utils/UtilsBackendCalls";

let EditProductComponent = ({openCustomNotification}) => {
    let [formData, setFormData] = useState({})
    let navigate = useNavigate();
    let [errors, setErrors] = useState(false);
    let [form] = Form.useForm();
    let {id} = useParams();

    useEffect(() => {
        let getProduct = async () => {
            let product = await getProductById(id);
            const fileList = [{
                uid: '-1',
                name: 'imagen.png',
                status: 'done',
                url: product.image
            }];

            form.setFieldsValue({ ...product, image: fileList });
            setFormData({ ...product, image: fileList[0] });
        }

        getProduct();
    }, [id, form]);

    let clickEditProduct = async () => {
        let response = await editProduct(id, formData);

        if (response.ok) {
            openCustomNotification("top", "Producto actualizado", "success");
            navigate("/products/own");
        } else {
            let serverErrors = response.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
            setErrors(serverErrors);
        }
    }

    const normImage = (e) => Array.isArray(e) ? e : e && e.fileList;

    let {Option} = Select;
    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
        <Col sm={12}>
            <Card title="Edit product">
                {errors && errors.map((e) => <Alert style={{marginBottom: "2vh"}} type="error" message={e.msg}/>)}
                <Form form={form} layout="vertical">
                    <Form.Item name="title" rules={[{required: true, message: "El título es obligatorio"}]}>
                        <Input
                            onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)}
                            size="large" type="text" placeholder="Product title"/>
                    </Form.Item>
                    <Form.Item name="description" rules={[{required: true, message: "La descripción es obligatoria"}]}>
                        <Input
                            onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)}
                            size="large" type="text" placeholder="Description"/>
                    </Form.Item>
                    <Form.Item name="price" rules={[{required: true, message: "El precio es obligatorio"}]}>
                        <InputNumber
                            decimalSeparator="."
                            step="0.1"
                            precision={2}
                            min={0}
                            keyboard
                            onChange={(i) => modifyStateProperty(formData, setFormData, "price", i)}
                            placeholder="Price"
                            style={{width: "100%"}}
                            size="large"
                            suffix="€"
                        />
                    </Form.Item>
                    <Form.Item name="category" rules={[{required: true, message: "La categoría es obligatoria"}]}>
                        <Select placeholder="Select category" size="large"
                                onChange={(e) => modifyStateProperty(formData, setFormData, "category", e)}>
                            {categories.map((cat) => (<Option key={cat} value={cat}>{cat}</Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="image" valuePropName="fileList" getValueFromEvent={normImage}
                               rules={[{required: false}]}>
                        <Upload.Dragger beforeUpload={(file) => {
                            modifyStateProperty(formData, setFormData, "image", file);
                            return false;
                        }} listType="picture"
                                        onRemove={() => modifyStateProperty(formData, setFormData, "image", undefined)}
                                        maxCount={1}>
                            <p className="ant-upload-drag-icon"><InboxOutlined/></p>
                            <p className="ant-upload-text">Click or drag an image to this area to upload</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item>
                        <DisabledButtonComponent form={form} onClick={clickEditProduct}>Update Product</DisabledButtonComponent>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
    </Row>)
}

export default EditProductComponent;