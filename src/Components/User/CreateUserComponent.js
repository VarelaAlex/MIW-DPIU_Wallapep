import { Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { useState }                                        from "react";
import { modifyStateProperty }                             from "../../Utils/UtilsState";
import {
	allowSubmitForm,
	joinAllServerErrorMessages,
	setServerErrors,
	validateFormDataInputEmail,
	validateFormDataInputRequired
}                                                          from "../../Utils/UtilsValidations";

let CreateUserComponent = ({ openNotification }) => {

	let [formData, setFormData] = useState({});
	let requiredInForm = ["email", "password"];
	let [formErrors, setFormErrors] = useState({});

	let clickCreate = async () => {
		let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/users", {
			method: "POST", headers: { "Content-Type": "application/json " }, body: JSON.stringify(formData)
		});

		if ( response.ok ) {
			let responseBody = await response.json();
			console.log("ok " + responseBody);
		} else {
			let responseBody = await response.json();
			let serverErrors = responseBody.errors;
			setServerErrors(serverErrors, setFormErrors);
			let notificationMsg = joinAllServerErrorMessages(serverErrors);
			openNotification("top", notificationMsg, "error");
		}
	};

	return (
		<Row align="middle" justify="center" style={ { minHeight: "70vh" } }>
			<Col xs={ 24 } sm={ 24 } md={ 12 } lg={ 12 } xl={ 10 }>
				<Card title="Create user" style={ { width: "100%", margin: "15px" } }>
					<Form.Item label=""
					           validateStatus={ validateFormDataInputEmail(formData, "email", formErrors, setFormErrors)
					                            ? "success"
					                            : "error" }
					>
						<Input placeholder="your email"
						       onChange={ (i) => {
							       modifyStateProperty(formData, setFormData, "email", i.currentTarget.value);
						       } }/>
						{ formErrors?.email?.msg && <Typography.Text
							type="danger"> { formErrors?.email?.msg } </Typography.Text> }
					</Form.Item>

					<Form.Item label=""
					           validateStatus={ validateFormDataInputRequired(formData,
					                                                          "password",
					                                                          formErrors,
					                                                          setFormErrors
					           ) ? "success" : "error" }
					>
						<Input.Password
							placeholder="your password"
							onChange={ (i) => {
								modifyStateProperty(formData, setFormData, "password", i.currentTarget.value);
							} }/>
						{ formErrors?.password?.msg && <Typography.Text
							type="danger"> { formErrors?.password?.msg } </Typography.Text> }
					</Form.Item>

					{ allowSubmitForm(formData, formErrors, requiredInForm) ? <Button type="primary"
					                                                                  onClick={ clickCreate }
					                                                                  block>Login</Button> : <Button
						  type="primary" block disabled>Login</Button> }
				</Card>
			</Col>
		</Row>
	);
};

export default CreateUserComponent;