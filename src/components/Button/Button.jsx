import React from 'react'

function Button(props){

    return <button className="l-ui-btn " >
        {props.children}
    </button>
}

export default Button