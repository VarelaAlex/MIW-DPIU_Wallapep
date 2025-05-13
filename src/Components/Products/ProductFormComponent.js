import {Alert, Card, Col, Form, Input, InputNumber, Row, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import {modifyStateProperty} from "../../Utils/UtilsState";
import DisabledButtonComponent from "../Buttons/DisabledButtonComponent";
import {useState} from "react";
import CategorySelectComponent from "./CategorySelectComponent";

let ProductFormComponent = ({initialValues = {}, onSubmit, title, buttonText, isImageRequired}) => {
    let [formData, setFormData] = useState(initialValues);
    let [form] = Form.useForm();
    let [errors, setErrors] = useState(false);

    const normImage = (e) => Array.isArray(e) ? e : e && e.fileList;

    let {TextArea} = Input;
    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col sm={12}>
                <Card title={title}>
                    {errors && errors.map((e) => (
                        <Alert key={e.msg} style={{marginBottom: "2vh"}} type="error" message={e.msg}/>
                    ))}
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={initialValues}
                    >
                        <Form.Item name="title" rules={[{required: true, message: "The title is required"}]}>
                            <Input
                                onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)}
                                size="large" placeholder="Product title"/>
                        </Form.Item>
                        <Form.Item name="description" rules={[{required: true, message: "The description is required"}]}>
                            <TextArea
                                onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)}
                                placeholder="Description"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                        <Form.Item name="price" rules={[{required: true, message: "The price is required"}]}>
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
                        <Form.Item name="category" rules={[{required: true, message: "The category is required"}]}>
                            <CategorySelectComponent onChange={(e) => modifyStateProperty(formData, setFormData, "category", e)} placeholder="Select category" size="large"/>
                        </Form.Item>
                        <Form.Item
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={normImage}
                            rules={[{required: isImageRequired, message: "The image is required"}]}
                        >
                            <Upload.Dragger
                                beforeUpload={(file) => {
                                    modifyStateProperty(formData, setFormData, "image", file);
                                    return false;
                                }}
                                listType="picture"
                                onRemove={() => modifyStateProperty(formData, setFormData, "image", undefined)}
                                maxCount={1}
                            >
                                <p className="ant-upload-drag-icon"><InboxOutlined/></p>
                                <p className="ant-upload-text">Click or drag an image to this area to upload</p>
                            </Upload.Dragger>
                        </Form.Item>
                        <Form.Item>
                            <DisabledButtonComponent form={form} onClick={() => onSubmit(formData, setErrors, form)}>
                                {buttonText}
                            </DisabledButtonComponent>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default ProductFormComponent;