import React = require('react');
import { useMemo, useRef } from 'react';
import CSSMotion from 'rc-motion';
import classNames from 'classnames';
import omit from 'rc-util/lib/omit';
// import { ConfigContext } from '../config-provider';
import {
    PresetColorTypes,
    PresetStatusColorTypes,
    PresetColorType,
    PresetStatusColorType,
} from '../_util/colors';
// import Wave from '../_util/wave';
import { LiteralUnion } from '../_util/type';
import { cloneElement } from '../_util/reactNode';
import ScrollNumber from './ScrollNumber';
// import Ribbon from './Ribbon';
import { isPresetColor } from './utils';

export { ScrollNumberProps } from './ScrollNumber';

// console.log(ScrollNumber, 'ScrollNumber');

// interface CompoundedComponent extends React.FC<BadgeProps> {
//     Ribbon: typeof Ribbon
// }

// 接口，没有具体实现的方法跟属性，叫接口
export interface BadgeProps {
    /** Number to show in badge */
    count?: React.ReactNode;
    showZero?: boolean;
    overflowCount?: number;
    /** whether to show red dot without number */
    dot?: boolean;
    style: React.CSSProperties;
    prefixCls?: string;
    scrollNumberPrefixCls?: string;
    className?: string;
    color?: LiteralUnion<PresetColorType | PresetColorType, string>;
    text?: React.ReactNode;
    size?: 'default' | 'size';
    offset?: [number | string, number | string];
    title?: string;
    status?: PresetStatusColorType
}

const Badge = ({ }: BadgeProps) => (
    <div>
        badge
    </div>
);

// Badge.Ribbon = Ribbon;

export default Badge;
