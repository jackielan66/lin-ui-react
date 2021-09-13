import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TagProps {
    type?: string
    prefixCls?: string
    children: object,
    onClick: Function
}

function Tag({ type = '', children, onClick, prefixCls = 'l-ui-tag' }: TagProps) {

    console.log(`prefixCls-${type}`, '33 === 323')

    return (
        <span
            onClick={(e) => {
                onClick?.(e);
            }}
            className={classNames(prefixCls, {
                [`${prefixCls}-${type}`]: true
            })}
        >
            {children}
        </span >
    );
}

Tag.propTypes = {
    // type: PropTypes.string,
    // children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Tag;
