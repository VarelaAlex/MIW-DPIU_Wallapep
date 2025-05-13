import {Col, Input, Space} from "antd";
import React from "react";

let ProductSearchBarComponent = ({screenProps, onChange, cell}) => {

    let {Search} = Input;
    return (<Col {...screenProps}>
        {cell ?<Space.Compact >
            {cell}
            <Search
            placeholder="Buscar por título o descripción"
            allowClear
            onChange={onChange}
        enterButton
    />
</Space.Compact>:<Search
            placeholder="Buscar por título o descripción"
            allowClear
            onChange={onChange}
            enterButton
        />
}
    </Col>)
}

export default ProductSearchBarComponent;