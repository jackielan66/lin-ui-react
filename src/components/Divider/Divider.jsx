import React from 'react';
import PropTypes from 'prop-types';
import './Divider.less'

const mapType2ClassName = {
    'primary': 'l-ui-btn-primary'
}
function Divider(props) {
    const Type = props.type;


    let classList = ["l-ui-divider "]
    if (mapType2ClassName[Type]) {
        classList.push((mapType2ClassName[Type]));

    }

    return <div className={classList.join(" ")} style={props.style} >
        {props.children}
    </div>
}

Divider.propTypes = {
    type: PropTypes.string,


}

export default Divider