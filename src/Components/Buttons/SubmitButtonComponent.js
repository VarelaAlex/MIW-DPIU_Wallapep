import {Button, Form} from "antd";
import {useEffect, useState} from "react";

let SubmitButtonComponent = ({form, submit, onClick, children}) => {
    let [submittable, setSubmittable] = useState(false);
    let values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({validateOnly: true})
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);
    return (
        <Button type="primary" htmlType={submit ? "submit" : undefined} disabled={!submittable} onClick={onClick} block>
            {children}
        </Button>);
};

export default SubmitButtonComponent;