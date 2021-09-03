import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const TextArea = ({
    bordered = true,
    maxLength = 50,
    value,
    defaultValue,
    onChange,
    placeholder,

}) => {
    const prefixCls = 'l-ui-input';
    const [inputStr, setInputStr] = useState(() => defaultValue ?? value);

    const onInternalInput = (e) => {
        const tempInputStr = e.target.value;
        setInputStr(tempInputStr);
        // console.log(inputStr, 'inputStr');
        onChange?.(tempInputStr);
    };

    useEffect(() => {
        // console.log('component did update ', value);
        setInputStr(value);
    }, [value]);

    return (
        <div className={classnames({ [`${prefixCls}-wrapper`]: true })}>
            <textarea placeholder={placeholder} onChange={onInternalInput} value={inputStr} maxLength={maxLength} className={classnames({ [`${prefixCls}`]: true })} />
        </div>
    );
};
export default TextArea;
