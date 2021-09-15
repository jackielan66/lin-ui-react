import React = require('react');
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'rc-util/lib/omit';

const CloseOutlined = <span>、、、</span>;

interface CheckableTagProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    checked: boolean;
    onChange?: (checked: boolean) => void;
    onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

function CheckableTag({
    onChange, onClick, prefixCls: customizePrefixCls, className, checked,
    ...restProps
}: CheckableTagProps) {
    const prefixCls = customizePrefixCls || 'l-ui-tag';

    const cls = classNames(prefixCls, {
        [`${prefixCls}-checkable`]: true,
        [`${prefixCls}-checkable-checked`]: checked,
    });

    const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        onChange?.(!checked);
        onClick?.(e);
    };

    return (
        <span
            {...restProps}
            onClick={handleClick}
            className={cls}
        />

    );
}

CheckableTag.propTypes = {
    // type: PropTypes.string,
    // children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default CheckableTag;
