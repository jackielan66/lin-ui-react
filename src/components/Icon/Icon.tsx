import * as React from 'react';
import classNames from 'classnames';
// import * as PropTypes from 'prop-types';
import './Icon.less';

const context = require.context('./svg', false, /\.svg/, 'sync');

context.keys().forEach((key) => {
    context(key);
});

interface IconProps {
    /** icon 图标类型     */
    type: string,
    prefixCls?: string,
    size?: number,
    className?: string,
}

const Icon = ({
    prefixCls = 'l-ui-icon', size = 16, type, className,
}: IconProps): React.ReactElement<IconProps> => (
    <span className={classNames(prefixCls, className)} style={{ fontSize: size }}>
        <svg>
            <use xlinkHref={`#${type}`} />
        </svg>
    </span>
);

// Icon.propTypes = {
//     type: PropTypes.string,
// };

export default Icon;
