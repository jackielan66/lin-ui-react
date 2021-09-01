import React from 'react'
import PropTypes from 'prop-types';
import './Title.less'

const mapType2ClassName = {
    'primary': 'l-ui-btn-primary'
}
function Title(props) {
    const Type = props.type;

    let classList = ["l-ui-btn "]
    if (mapType2ClassName[Type]) {
        classList.push((mapType2ClassName[Type]))
    }
    return <h1 className="l-ui-typography" >
        {props.children}
    </h1>
}

Title.propTypes = {
    type: PropTypes.string
}

export default Title