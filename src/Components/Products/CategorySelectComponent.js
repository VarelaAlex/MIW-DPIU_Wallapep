import {Select} from "antd";
import {categories} from "../../categories";
import CategoryTagComponent from "./CategoryTagComponent";
import React from "react";

let CategorySelectComponent = (props) => {

    let {
        mode,
        placeholder,
        onChange,
        size = "middle",
        showSearch = true,
        popupMatchSelectWidth = true,
        minWidth = 200,
        value
    } = props;

    return (<Select
        value={value}
        mode={mode}
        placeholder={placeholder}
        showSearch={showSearch}
        popupMatchSelectWidth={popupMatchSelectWidth}
        onChange={onChange}
        style={{minWidth}}
        size={size}
        allowClear
        options={categories.map((cat) => ({
            label: <CategoryTagComponent category={cat}/>, value: cat
        }))}
    />);
};

export default CategorySelectComponent;