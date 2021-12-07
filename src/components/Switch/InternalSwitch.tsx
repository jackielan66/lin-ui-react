import * as React from 'react';
import classNames from 'classnames';
import './Switch.less';
import lContextCfg from '../config-l';

interface InternalSwitchProps {
    prefixCls: string;
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean, event: React.SyntheticEvent) => void;
    className?: string;
    disabled?: boolean
}

const InternalSwitch: React.FC<InternalSwitchProps> = (props) => {
    const {
        prefixCls = 'l-ui-internal-switch',
        defaultChecked,
        checked,
        onChange,
        className,
        disabled = false,
    } = props;

    const { size } = React.useContext(lContextCfg);

    // console.log(size, 'size');

    const [internalChecked, setInternalChecked] = React.useState(() => checked ?? defaultChecked ?? false);

    const onInternalChange = (event) => {
        if (disabled) return;
        // setInternalChecked(!internalChecked);
        onChange?.(!internalChecked, event);
    };

    React.useMemo(() => {
        if (checked !== undefined && checked !== internalChecked) {
            setInternalChecked(checked);
        }
    }, [checked]);

    return (
        <button
            type="button"
            role="switch"
            aria-checked={internalChecked}
            className={classNames(`${prefixCls}-wrap`, {
                [`${prefixCls}-wrap-checked`]: internalChecked,
            }, className, `${prefixCls}-wrap-size-${size}`)}
            onClick={(event: React.SyntheticEvent) => {
                onInternalChange(event);
            }}
            disabled={disabled}
        >
            <span className={classNames(`${prefixCls}-bar`, {

            })}
            />
        </button>
    );
};

export default InternalSwitch;
