import React from 'react'
import PropTypes from 'prop-types';
import './Icon.less'

// import './svg/arrow-down-bold.svg'
let context = require.context('./svg',false,/\.svg/,'sync');
context.keys().forEach(key=>{
    context(key);
})

const mapType2ClassName = {
    'primary': 'l-ui-btn-primary'
}

function Icon(props) {
    const Type = props.type;
    const Size = props.size || 16;
    let classList = ["l-ui-icon "]
    if (mapType2ClassName[Type]) {
        classList.push((mapType2ClassName[Type]))
    }
    return <span className={classList} style={{fontSize:Size}} ><svg><use xlinkHref={`#${Type}`} /> </svg></span>
}

Icon.propTypes = {
    type: PropTypes.string
}

export default Icon