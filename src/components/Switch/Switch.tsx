import { type } from 'os';
import * as React from 'react';
import classNames from 'classnames';

import Wave from '../_util/wave';

import lContextCfg from '../config-l';

import SizeContext from '../config-l/SizeContext';

// import RcSwitch from 'rc-switch';
// import classNames from 'classnames';
// import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
export type SwitchSize = 'small' | 'default';
export type SwitchChangeEventHandler = (checked: boolean, event: MouseEvent) => void
export type SwitchClickEventHandler = SwitchChangeEventHandler

export interface SwitchProps {
    prefixCls?: string;
    size?: SwitchSize;
    className?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: SwitchChangeEventHandler;
    onClick?: SwitchClickEventHandler;
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    autoFocus?: boolean;
    style?: React.CSSProperties;
    title?: string;
    tabIndex?: number;
}

interface CompoundedComponent
    extends React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLElement>> {
    __ANT_SWITCH: boolean;
}

const Switch = React.forwardRef<unknown, SwitchProps>(
    ({
        prefixCls: customizePrefixCls,
        size: customizeSize,
        loading,
        className = '',
        disabled,
        ...props
    }, ref) => {
        const { getPrefixCls, direction } = React.useContext(lContextCfg);
        const size = React.useContext(SizeContext);
        const prefixCls = getPrefixCls('switch', customizePrefixCls);
        const loadingIcon = (
            <div className={`${prefixCls}-handle`}>
                {loading && <div className={`${prefixCls}-loading-icon`} />}
            </div>
        );
        const classes = classNames(
            {
                [`${prefixCls}-small`]: (customizeSize || size) === 'small',
                [`${prefixCls}-loading`]: loading,
                [`${prefixCls}-rtl`]: direction === 'rtl',
            },
            className,
        );

        return (
            <Wave insertExtraNode>
                <span>2121312</span>
            </Wave>
        );
    },
) as CompoundedComponent;

Switch.__ANT_SWITCH = true;
Switch.displayName = 'Switch';

export default Switch;
