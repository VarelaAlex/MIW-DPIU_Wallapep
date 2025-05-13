import {Input} from "antd";
import React from "react";

let EditableCellComponent = ({editable, value, onChange, cell}) => {
    return editable ? (<Input
        value={value}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}/>) : cell;
}

export default EditableCellComponent;