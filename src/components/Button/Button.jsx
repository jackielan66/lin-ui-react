import React from 'react';
import PropTypes from 'prop-types';

import './Button.less';

const mapType2ClassName = {
    primary: 'l-ui-btn-primary',
};
function Button({ type, children, onClick }) {
    const Type = type;

    const classList = ['l-ui-btn '];
    if (mapType2ClassName[Type]) {
        classList.push((mapType2ClassName[Type]));
    }

    return (
        <button
            type="button"
            onClick={(e) => {
                onClick?.(e);
            }}
            className={classList.join(' ')}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    type: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Button;
