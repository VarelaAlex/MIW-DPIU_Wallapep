import { categoryColors } from "../../categories";
import { Tag } from "antd";
import React from "react";

let CategoryTagComponent = ({ category, letterCase }) => {
    let rawCategory = category?.toLowerCase();

    switch (letterCase) {
        case "upper":
            category = category?.toUpperCase() || "UNCATEGORIZED";
            break;
        case "lower":
            category = category?.toLowerCase() || "uncategorized";
            break;
        default:
            category = category
                ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
                : "Uncategorized";
            break;
    }

    const color = categoryColors[rawCategory] || "default";

    return <Tag color={color}>{category}</Tag>;
};

export default CategoryTagComponent;