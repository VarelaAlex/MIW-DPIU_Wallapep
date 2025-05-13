import {categoryColors} from "../../categories";
import {Tag} from "antd";
import React from "react";

let CategoryTagComponent = ({category, letterCase}) => {

    switch (letterCase) {
        case "upper":
            category = category?.toUpperCase();
            break;
        case "lower":
            category = category?.toLowerCase();
            break;
        default:
            break;
    }

    return <Tag color={categoryColors[category?.toLowerCase()] || 'default'}>{category}</Tag>
}

export default CategoryTagComponent;