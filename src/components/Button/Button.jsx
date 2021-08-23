import React from 'react'
import PropTypes from 'prop-types';

const mapType2ClassName = {
    'primary': 'l-ui-btn-primary'
}
function Button(props) {
    const Type = props.type;

    let classList = ["l-ui-btn "]
    if (mapType2ClassName[Type]) {
        classList.push((mapType2ClassName[Type]))
    }
    return <button className={classList.join(" ")} >
        {props.children}
    </button>
}

Button.propTypes = {
    type: PropTypes.string
}

export default Button