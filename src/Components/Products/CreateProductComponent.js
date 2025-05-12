import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Alert, Card, Col, Form, Input, InputNumber, Row, Select, Upload} from "antd";
import {useNavigate} from "react-router-dom";
import DisabledButtonComponent from "../Buttons/DisabledButtonComponent";
import {categories} from "../../categories";
import {InboxOutlined} from "@ant-design/icons";

let CreateProductComponent = ({openCustomNotification}) => {
    let [formData, setFormData] = useState({})
    let navigate = useNavigate();
    let [errors, setErrors] = useState(false);
    let [form] = Form.useForm();

    let clickCreateProduct = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
            method: "POST", headers: {
                "Content-Type": "application/json ", "apikey": localStorage.getItem("apiKey")
            }, body: JSON.stringify(formData)
        })

        if (response.ok) {
            let data = await response.json()
            await uploadImage(data.productId)
            openCustomNotification("top", "Producto creado", "success")
            navigate("/products/own")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
            setErrors(serverErrors);
        }
    }

    let uploadImage = async (productId) => {
        let formDataImage = new FormData();
        formDataImage.append('image', formData.image);

        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + productId + "/image", {
            method: "POST", headers: {
                "apikey": localStorage.getItem("apiKey")
            }, body: formDataImage
        })
        if (response.ok) {

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    const normImage = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };


    let {Option} = Select;
    return (<Row align="middle" justify="center" style={{minHeight: "70vh"}}>
        <Col sm={12}>
            <Card title="Create product">
                {errors && errors.map((e) => <Alert style={{marginBottom: "2vh"}} type="error"
                                                    message={e.msg}/>)}
                <Form form={form} layout="vertical">
                    <Form.Item name="title" rules={[{required: true, message: "El título es obligatorio"}]}>
                        <Input
                            onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)}
                            size="large" type="text" placeholder="Product title"></Input>
                    </Form.Item>
                    <Form.Item name="description" rules={[{required: true, message: "La descripción es obligatoria"}]}>
                        <Input
                            onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)}
                            size="large" type="text" placeholder="Description"></Input>
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
                    <Form.Item
                        name="category"
                        rules={[{required: true, message: "La categoría es obligatoria"}]}
                    >
                        <Select placeholder="Select category" size="large"
                                onChange={(e) => modifyStateProperty(formData, setFormData, "category", e)}>
                            {categories.map((cat) => (<Option key={cat} value={cat}>{cat}</Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="image" rules={[{required: true, message: "La imagen es obligatoria"}]}
                               valuePropName="fileList" getValueFromEvent={normImage}>
                        <Upload.Dragger beforeUpload={(file) => {
                            modifyStateProperty(formData, setFormData, "image", file)
                            return false;
                        }}
                                        listType="picture"
                                        onRemove={() => {
                                            modifyStateProperty(formData, setFormData, "image", undefined)
                                        }} maxCount={1}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag an image to this area to upload</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item>
                        <DisabledButtonComponent form={form} onClick={clickCreateProduct}>Sell
                            Product</DisabledButtonComponent>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
    </Row>)
}

export default CreateProductComponent;